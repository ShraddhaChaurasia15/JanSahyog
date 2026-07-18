from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os

from typing import List, Optional
import pytesseract
from PIL import Image, ImageEnhance
import io
import re

from statistical_engine import StatisticalEngine
from recommendation_engine import RecommendationEngine
from scheme_profiles import SchemeProfiles

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

app = FastAPI(
    title="Welfare Scheme AI Service",
    version="1.0.0"
)

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class EligibilityRequest(BaseModel):
    age: int
    income: float
    category: str
    state: str
    gender: Optional[str] = None
    uploaded_documents: Optional[List[str]] = None
class ChatRequest(BaseModel):
    message: str
class SchemeMatch(BaseModel):
    name: str
    description: str
    category: str
    benefits: str
    match_score: int
    eligibility_reason: str
SAMPLE_SCHEMES = [
    {
        "name": "PM Kisan Samman Nidhi",
        "description": "Financial assistance to small and marginal farmers",
        "category": "Agriculture",
        "benefits": "₹6,000 per year in three installments",
        "duration": "Ongoing",
        "official_website": "https://pmkisan.gov.in/",
        "criteria": {
            "min_age": 18,
            "max_age": 100,
            "max_income": 200000,
            "categories": ["All"],
            "states": ["All"]
        },
        "requirements": [
            "Land ownership documents",
            "Aadhaar card",
            "Bank account details"
        ]
    },
    {
        "name": "Ayushman Bharat",
        "description": "Health insurance scheme for economically vulnerable families",
        "category": "Healthcare",
        "benefits": "₹5 Lakh per family per year",
        "duration": "Ongoing",
        "official_website": "https://pmjay.gov.in/",
        "criteria": {
            "min_age": 0,
            "max_age": 120,
            "max_income": 100000,
            "categories": ["All"],
            "states": ["All"]
        },
        "requirements": [
            "Ration card",
            "Income certificate",
            "Aadhaar card"
        ]
    },
    {
        "name": "Pradhan Mantri Awas Yojana",
        "description": "Affordable housing for economically weaker sections",
        "category": "Housing",
        "benefits": "Subsidy up to ₹2.5 Lakh",
        "duration": "Till 2026",
        "official_website": "https://pmaymis.gov.in/",
        "criteria": {
            "min_age": 18,
            "max_age": 70,
            "max_income": 300000,
            "categories": ["All"],
            "states": ["All"]
        },
        "requirements": [
            "Income certificate",
            "Aadhaar card",
            "Property documents"
        ]
    },
    {
        "name": "National Scholarship Portal",
        "description": "Scholarships for students from minority communities and economically weaker sections",
        "category": "Education",
        "benefits": "₹10,000 to ₹50,000 per year",
        "duration": "Academic year",
        "official_website": "https://scholarships.gov.in/",
        "criteria": {
            "min_age": 5,
            "max_age": 30,
            "max_income": 250000,
            "categories": ["SC", "ST", "OBC", "EWS"],
            "states": ["All"]
        },
        "requirements": [
            "School/College ID",
            "Income certificate",
            "Caste certificate (if applicable)"
        ]
    },
    {
        "name": "Pradhan Mantri Mudra Yojana",
        "description": "Loans for small businesses and entrepreneurs",
        "category": "Finance",
        "benefits": "Loans up to ₹10 Lakh",
        "duration": "Ongoing",
        "official_website": "https://www.mudra.org.in/",
        "criteria": {
            "min_age": 18,
            "max_age": 65,
            "max_income": 500000,
            "categories": ["All"],
            "states": ["All"]
        },
        "requirements": [
            "Business plan",
            "Aadhaar card",
            "Bank statements"
        ]
    },
    {
        "name": "Beti Bachao Beti Padhao",
        "description": "Scheme to save and educate girl children",
        "category": "Social Welfare",
        "benefits": "Education support and savings scheme",
        "duration": "Ongoing",
        "official_website": "https://wcd.nic.in/schemes/beti-bachao-beti-padhao",
        "criteria": {
            "min_age": 0,
            "max_age": 21,
            "max_income": 500000,
            "categories": ["All"],
            "states": ["All"],
            "gender": "Female"
        },
        "requirements": [
            "Birth certificate",
            "Aadhaar card",
            "Bank account"
        ]
    }
]

@app.get("/")
async def root():
    return {
        "message": "Welfare Scheme AI Service",
        "version": "1.0.0",
        "endpoints": [
            "/api/ocr - Extract text from documents",
            "/api/check-eligibility - Check scheme eligibility"
        ]
    }

@app.post("/api/ocr")
async def extract_text_from_image(file: UploadFile = File(...)):
    """
    Extract text from uploaded document using OCR
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))

        image = image.convert("L")

        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(2)

        # OCR
        image = image.convert("L")

        custom_config = r'--oem 3 --psm 6'

        text = pytesseract.image_to_string(
            image,
            config=custom_config
        )
        print("OCR TEXT:")
        print(text)
        # Extract Name
        name_match = re.search(
            r'([A-Z][a-z]+\s[A-Z][a-z]+)',
            text
        )

        ocr_text = text.upper().replace("\n", " ")

        gender = None

        if re.search(r'FE\s*MALE', ocr_text):
          gender = "Female"
        elif re.search(r'FEMALE', ocr_text):
          gender = "Female"
        elif re.search(r'\bMALE\b', ocr_text):
           gender = "Male"

        # Extract DOB
        dob_match = re.search(
            r'(\d{2}/\d{2}/\d{4})',
            text
        )
        aadhaar_match = re.findall(
            r'(\d{4}\D*\d{4}\D*\d{4})',
            text

        )
        cleaned_aadhaar = []

        for item in aadhaar_match:
            digits = re.sub(r'\D', '', item)

            if len(digits) == 12:
               cleaned_aadhaar.append(digits)
        extracted_data = {
            "raw_text": text,
            
            "name": name_match.group(0)
            if name_match else "",

            "dob": dob_match.group(0)
            if dob_match else "",

            "gender": gender,

            "email": re.findall(
                r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
                text
            ),

            "phone": re.findall(
                r'\b\d{10}\b',
                text
            ),
            
               
            "aadhaar": cleaned_aadhaar,
            "pan": re.findall(
                r'\b[A-Z]{5}\d{4}[A-Z]\b',
                text
            )

        }

        return {
            "success": True,
            "data": extracted_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(e)}"
        )
    
def fetch_official_requirements_via_gemini(scheme_name: str, fallback_requirements: List[str]) -> List[str]:
    try:
        # Prompt Gemini to search/verify official requirements for the scheme
        prompt = f"List exactly the required documents to apply for '{scheme_name}' in India. Return ONLY a valid JSON list of strings (e.g., ['Aadhaar Card', 'Income Certificate', 'Land Records']). Do not write markdown, codeblocks, backticks, or any other explanations."
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        text = response.text.strip()
        # Clean markdown code block wraps if present
        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\n|```$", "", text, flags=re.MULTILINE).strip()
        import json
        docs = json.loads(text)
        if isinstance(docs, list) and all(isinstance(x, str) for x in docs):
            return docs
    except Exception as e:
        print(f"Failed to fetch requirements from Gemini for {scheme_name}: {e}")
    return fallback_requirements

@app.post("/api/check-eligibility")
async def check_eligibility(request: EligibilityRequest):
    """
    Check eligibility for welfare schemes based on user criteria.
    Uses advanced probability and statistical analysis.
    """
    try:
      
        user_data = {
            'age': request.age,
            'income': request.income,
            'category': request.category,
            'state': request.state,
            'gender': request.gender
        }
   
        vulnerability_index = StatisticalEngine.calculate_vulnerability_index(user_data)
        eligible_schemes = []
        
        for scheme in SAMPLE_SCHEMES:
            criteria = scheme["criteria"]
        
            if request.age < criteria["min_age"] or request.age > criteria["max_age"]:
                continue

            if request.income > criteria["max_income"]:
                continue
            
 
            if "All" not in criteria["categories"] and request.category not in criteria["categories"]:
                continue
            
  
            if "gender" in criteria and request.gender:
                if criteria["gender"] != request.gender:
                    continue
            

            if "All" not in criteria["states"] and request.state not in criteria["states"]:
                continue
            

            probability = StatisticalEngine.calculate_overall_probability(
                user_data, 
                criteria, 
                scheme["category"]
            )
            

            if probability < 0.3:
                continue
            

            confidence_interval = StatisticalEngine.calculate_confidence_interval(probability)
            

            match_score = calculate_match_score(request, criteria)
            

            statistical_analysis = StatisticalEngine.get_statistical_breakdown(
                user_data,
                criteria,
                scheme["category"],
                probability
            )
            

            impact_score = SchemeProfiles.get_impact_score(scheme["name"])
            

            expected_benefit = SchemeProfiles.format_expected_benefit(scheme["name"])
            statistical_analysis["expectedBenefit"] = expected_benefit
            

            reason = generate_eligibility_reason(request, criteria, scheme["category"])
            
            # Fetch official requirements via Gemini (with local fallback)
            required_docs = fetch_official_requirements_via_gemini(scheme["name"], scheme.get("requirements", []))
            
            # Smart Document Matching Logic
            uploaded = request.uploaded_documents or []
            uploaded_normalized = [doc.lower().strip() for doc in uploaded]
            
            uploaded_requirements = []
            missing_requirements = []
            
            for req in required_docs:
                req_lower = req.lower().strip()
                is_matched = False
                for u_doc in uploaded_normalized:
                    if u_doc in req_lower or req_lower in u_doc or ("aadhaar" in req_lower and "aadhaar" in u_doc):
                        is_matched = True
                        break
                
                if is_matched:
                    uploaded_requirements.append(req)
                else:
                    missing_requirements.append(req)

            eligible_schemes.append({
                "name": scheme["name"],
                "description": scheme["description"],
                "category": scheme["category"],
                "benefits": scheme["benefits"],
                "duration": scheme.get("duration", "Ongoing"),
                "matchScore": match_score,
                "probabilityScore": round(probability, 3),
                "confidenceInterval": confidence_interval,
                "eligibilityReason": reason,
                "requirements": required_docs,
                "uploadedRequirements": uploaded_requirements,
                "missingRequirements": missing_requirements,
                "statisticalAnalysis": statistical_analysis,
                "impactScore": impact_score,
                "officialWebsite": scheme.get("official_website", "")
            })

        ranked_schemes = RecommendationEngine.rank_schemes(
            eligible_schemes, 
            vulnerability_index
        )
        

        for scheme in ranked_schemes:
            scheme["personalizedExplanation"] = RecommendationEngine.get_personalized_explanation(
                scheme,
                user_data,
                vulnerability_index
            )
        

        user_profile = RecommendationEngine.generate_user_profile_summary(
            user_data,
            vulnerability_index,
            ranked_schemes
        )
        
  
        top_recommendations = RecommendationEngine.filter_top_recommendations(ranked_schemes)
        
        return {
            "success": True,
            "count": len(top_recommendations),
            "totalEligible": len(ranked_schemes),
            "schemes": top_recommendations,
            "userProfile": user_profile
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eligibility check failed: {str(e)}")

def calculate_match_score(request: EligibilityRequest, criteria: dict) -> int:
    """
    Calculate how well the user matches the scheme criteria
    """
    score = 85  # Base score
    
    
    age_range = criteria["max_age"] - criteria["min_age"]
    age_position = (request.age - criteria["min_age"]) / age_range if age_range > 0 else 0.5
    if 0.3 <= age_position <= 0.7:  # Sweet spot
        score += 5
    
    # Income matching.....
    income_ratio = request.income / criteria["max_income"] if criteria["max_income"] > 0 else 0
    if income_ratio < 0.5:
        score += 10
    elif income_ratio < 0.75:
        score += 5
    
    return min(score, 100)

def generate_eligibility_reason(request: EligibilityRequest, criteria: dict, category: str) -> str:
    
    reasons = []
    
    if request.age >= criteria["min_age"] and request.age <= criteria["max_age"]:
        reasons.append(f"Your age ({request.age}) falls within the eligible range")
    
    if request.income <= criteria["max_income"]:
        reasons.append(f"Your income (₹{request.income:,.0f}) meets the criteria")
    
    if request.category in criteria["categories"] or "All" in criteria["categories"]:
        if request.category != "General":
            reasons.append(f"Priority given to {request.category} category")
        else:
            reasons.append("Available for all categories")
    
    if not reasons:
        reasons.append(f"You meet the basic requirements for {category} schemes")
    
    return ". ".join(reasons)

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "AI Service",
        "ocr_available": True
    }
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        prompt = f"""
        You are JanSahyog AI Assistant.

        Help users with:
        - Government schemes
        - Eligibility
        - Required documents
        - Application process
        - Scholarships
        - Agriculture schemes
        - Healthcare schemes
        - Women welfare schemes

        User Question:
        {request.message}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        print(response)
        return {
            "success": True,
            "reply": response.text
        }

    except Exception as e:
        print(f"Gemini API error inside chat endpoint: {str(e)}. Falling back to rule-based assistant.")
        # Rule-based fallback
        msg = request.message.lower()
        if "kisan" in msg or "farmer" in msg or "agriculture" in msg or "कृषि" in msg or "किसान" in msg:
            reply = (
                "🌾 **PM Kisan Samman Nidhi**:\n"
                "- **Benefits**: ₹6,000 per year in three installments for small and marginal farmers.\n"
                "- **Eligibility**: Farmers owning cultivable land.\n"
                "- **Documents Required**: Land ownership documents, Aadhaar card, Bank account details.\n"
                "- **How to Apply**: Click 'Apply Now' on your dashboard profile page when matched, or visit pmkisan.gov.in."
            )
        elif "health" in msg or "ayushman" in msg or "medical" in msg or "hospital" in msg or "स्वास्थ्य" in msg:
            reply = (
                "🏥 **Ayushman Bharat (PM-JAY)**:\n"
                "- **Benefits**: Free health insurance coverage up to ₹5 Lakh per family per year.\n"
                "- **Eligibility**: Economically vulnerable families listed in SECC database.\n"
                "- **Documents Required**: Ration card, Income certificate, Aadhaar card.\n"
                "- **How to Apply**: Visit pmjay.gov.in or any empaneled hospital."
            )
        elif "awas" in msg or "housing" in msg or "home" in msg or "house" in msg or "आवास" in msg or "घर" in msg:
            reply = (
                "🏠 **Pradhan Mantri Awas Yojana (PMAY)**:\n"
                "- **Benefits**: Interest subsidy up to ₹2.5 Lakh for building or buying affordable houses.\n"
                "- **Eligibility**: Families with no pucca house, falling under EWS or LIG income limits.\n"
                "- **Documents Required**: Aadhaar card, Income certificate, Bank passbook, Land records.\n"
                "- **How to Apply**: Visit pmaymis.gov.in."
            )
        elif "document" in msg or "upload" in msg or "aadhaar" in msg or "pan" in msg or "दस्तावेज" in msg or "आधार" in msg:
            reply = (
                "📂 **Document & Scanning Instructions**:\n"
                "- Go to the **Check Eligibility** page.\n"
                "- Drag and drop your **Aadhaar Card** or ID into the scanner zone to auto-fill details using our AI OCR reader.\n"
                "- Verify the auto-filled information (Age, Gender, State, Income, Category) and submit to view eligible schemes.\n"
                "- Once eligible, you will see a checkmark (✓) for uploaded documents and warning (⚠) for missing ones on the results checklist."
            )
        elif "eligibility" in msg or "qualify" in msg or "match" in msg or "पात्रता" in msg:
            reply = (
                "✅ **Eligibility Criteria Check**:\n"
                "- We check age limits, gender priorities, category reservations (OBC, SC, ST, EWS), family annual income brackets, and state of origin restrictions.\n"
                "- Click **Check Eligibility** in the navigation bar to update your details and match immediately."
            )
        elif "hello" in msg or "hi" in msg or "hey" in msg or "नमस्ते" in msg or "हलो" in msg:
            reply = (
                "👋 Namaste! Welcome to JanSahyog AI Assistant.\n"
                "I can help you explore government schemes, eligibility details, and application processes.\n"
                "Ask me about: \n"
                "1. 🌾 PM Kisan Samman Nidhi\n"
                "2. 🏥 Ayushman Bharat Health Insurance\n"
                "3. 🏠 PM Awas Yojana Housing\n"
                "4. 🪪 Uploading Documents & scanning Aadhaar"
            )
        else:
            reply = (
                "🤖 **JanSahyog Helper**:\n"
                "I am currently in smart backup mode. Tell me what government scheme or service you need help with!\n"
                "You can ask: \n"
                "- 'Tell me about PM Kisan Yojana'\n"
                "- 'How to check Ayushman Bharat eligibility?'\n"
                "- 'Which documents are required for housing scheme?'"
            )
        return {
            "success": True,
            "reply": reply
        }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)