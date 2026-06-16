"""
API Integration Test
Tests the /api/check-eligibility endpoint with statistical features
"""

import requests
import json

API_URL = "http://localhost:8000/api/check-eligibility"

def test_api_integration():
    print("=" * 70)
    print("API Integration Test - Statistical Scheme Matching")
    print("=" * 70)
    
    #Low-income farmer
    print("\n🌾 Test Case 1: Low-income farmer")
    payload_1 = {
        "age": 45,
        "income": 50000,
        "category": "General",
        "state": "Bihar",
        "gender": "Male"
    }
    
    response_1 = requests.post(API_URL, json=payload_1)
    data_1 = response_1.json()
    
    print(f"  Status: {response_1.status_code}")
    print(f"  Total Eligible Schemes: {data_1.get('totalEligible', 0)}")
    print(f"  Top Recommendations: {data_1.get('count', 0)}")
    
    if 'userProfile' in data_1:
        profile = data_1['userProfile']
        print(f"\n  User Profile:")
        print(f"     Vulnerability Index: {profile.get('vulnerabilityIndex', 'N/A')}")
        print(f"     Income Category: {profile.get('incomeCategory', 'N/A')}")
        print(f"     Priority Categories: {', '.join(profile.get('priorityCategories', []))}")
        print(f"     Recommendation: {profile.get('recommendedFocus', 'N/A')}")
    
    if data_1.get('schemes'):
        print(f"\n  Top 3 Recommended Schemes:")
        for i, scheme in enumerate(data_1['schemes'][:3], 1):
            print(f"\n  {i}. {scheme['name']}")
            print(f"     Category: {scheme['category']}")
            print(f"     Probability Score: {scheme.get('probabilityScore', 'N/A')}")
            print(f"     Confidence Interval: {scheme.get('confidenceInterval', 'N/A')}")
            print(f"     Recommendation Score: {scheme.get('recommendationScore', 'N/A')}/100")
            if 'statisticalAnalysis' in scheme:
                stats = scheme['statisticalAnalysis']
                print(f"     Priority: {stats.get('priorityScore', 'N/A')}")
                print(f"     Expected Benefit: {stats.get('expectedBenefit', 'N/A')}")
            if 'personalizedExplanation' in scheme:
                print(f"     Why: {scheme['personalizedExplanation']}")
    
    #SC student
    print("\n\n📚 Test Case 2: SC category student")
    payload_2 = {
        "age": 18,
        "income": 120000,
        "category": "SC",
        "state": "Maharashtra",
        "gender": "Male"
    }
    
    response_2 = requests.post(API_URL, json=payload_2)
    data_2 = response_2.json()
    
    print(f"  Status: {response_2.status_code}")
    print(f"  Total Eligible Schemes: {data_2.get('totalEligible', 0)}")
    print(f"  Top Recommendations: {data_2.get('count', 0)}")
    
    if 'userProfile' in data_2:
        profile = data_2['userProfile']
        print(f"\n  👤 User Profile:")
        print(f"     Vulnerability Index: {profile.get('vulnerabilityIndex', 'N/A')}")
        print(f"     Income Category: {profile.get('incomeCategory', 'N/A')}")
        print(f"     High Priority Schemes Available: {profile.get('highPrioritySchemes', 0)}")
    
    if data_2.get('schemes'):
        print(f"\n  📋 Top 2 Recommended Schemes:")
        for i, scheme in enumerate(data_2['schemes'][:2], 1):
            print(f"\n  {i}. {scheme['name']}")
            print(f"     Probability: {scheme.get('probabilityScore', 'N/A')}")
            print(f"     Recommendation Score: {scheme.get('recommendationScore', 'N/A')}/100")
    
    #Female child
    print("\n\n👧 Test Case 3: Female child (for Beti Bachao Beti Padhao)")
    payload_3 = {
        "age": 5,
        "income": 80000,
        "category": "General",
        "state": "Delhi",
        "gender": "Female"
    }
    
    response_3 = requests.post(API_URL, json=payload_3)
    data_3 = response_3.json()
    
    print(f"  Status: {response_3.status_code}")
    print(f"  Total Eligible Schemes: {data_3.get('totalEligible', 0)}")
    
    if data_3.get('schemes'):
        # Find Beti Bachao Beti Padhao
        for scheme in data_3['schemes']:
            if 'Beti Bachao' in scheme['name']:
                print(f"\n  ✨ {scheme['name']} - Perfect Match!")
                print(f"     Probability: {scheme.get('probabilityScore', 'N/A')}")
                print(f"     Confidence: {scheme.get('confidenceInterval', 'N/A')}")
                print(f"     Recommendation Score: {scheme.get('recommendationScore', 'N/A')}/100")
                break
    
    print("\n" + "=" * 70)
    print("API Integration Tests Completed!")
    print("=" * 70)

if __name__ == "__main__":
    try:
        test_api_integration()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to API server at http://localhost:8000")
        print("   Make sure the AI service is running with: python app.py")
    except Exception as e:
        print(f"Error: {str(e)}")
