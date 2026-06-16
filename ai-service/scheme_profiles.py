"""
Scheme Profiles Database
Contains statistical profiles and metadata for welfare schemes
"""

from typing import Dict


class SchemeProfiles:
    """
    Statistical profiles for each welfare scheme.
    Used for probability calculations and impact assessment.
    """
    
    
    IMPACT_SCORES = {
        "PM Kisan Samman Nidhi": 0.75,
        "Ayushman Bharat": 0.95,  
        "Pradhan Mantri Awas Yojana": 0.90, 
        "National Scholarship Portal": 0.85,  
        "Pradhan Mantri Mudra Yojana": 0.80, 
        "Beti Bachao Beti Padhao": 0.88, 
    }

    TARGET_DEMOGRAPHICS ={
        "PM Kisan Samman Nidhi": {
            "optimal_age_range": (25, 60),
            "optimal_income_range": (0, 150000),
            "preferred_categories": ["All"],
            "success_rate": 0.85
        },
        "Ayushman Bharat": {
            "optimal_age_range": (0, 120),
            "optimal_income_range": (0, 100000),
            "preferred_categories": ["SC", "ST", "OBC", "EWS"],
            "success_rate": 0.90
        },
        "Pradhan Mantri Awas Yojana": {
            "optimal_age_range": (25, 60),
            "optimal_income_range": (0, 250000),
            "preferred_categories": ["All"],
            "success_rate": 0.80
        },
        "National Scholarship Portal": {
            "optimal_age_range": (10, 25),
            "optimal_income_range": (0, 200000),
            "preferred_categories": ["SC", "ST", "OBC", "EWS"],
            "success_rate": 0.88
        },
        "Pradhan Mantri Mudra Yojana": {
            "optimal_age_range": (25, 55),
            "optimal_income_range": (100000, 400000),
            "preferred_categories": ["All"],
            "success_rate": 0.75
        },
        "Beti Bachao Beti Padhao": {
            "optimal_age_range": (0, 18),
            "optimal_income_range": (0, 300000),
            "preferred_categories": ["All"],
            "success_rate": 0.82
        }
    }
    
    
    EXPECTED_BENEFITS = {
        "PM Kisan Samman Nidhi":{
            "min": 6000,
            "max": 6000,
            "frequency": "Annual"
        },
        "Ayushman Bharat":{
            "min": 0,
            "max": 500000,
            "frequency": "Per incident (up to 5 lakh coverage)"
        },
        "Pradhan Mantri Awas Yojana":{
            "min": 150000,
            "max": 250000,
            "frequency": "One-time subsidy"
        },
        "National Scholarship Portal":{
            "min": 10000,
            "max": 50000,
            "frequency": "Annual"
        },
        "Pradhan Mantri Mudra Yojana":{
            "min": 50000,
            "max": 1000000,
            "frequency": "Loan amount"
        },
        "Beti Bachao Beti Padhao":{
            "min": 5000,
            "max": 100000,
            "frequency": "Progressive savings"
        }
    }
    
    @staticmethod
    def get_impact_score(scheme_name: str) -> float:
        """Get impact score for a scheme."""
        return SchemeProfiles.IMPACT_SCORES.get(scheme_name, 0.7)
    
    @staticmethod
    def get_target_demographic(scheme_name: str) -> Dict:
        """Get target demographic profile for a scheme."""
        return SchemeProfiles.TARGET_DEMOGRAPHICS.get(scheme_name, {
            "optimal_age_range": (18, 65),
            "optimal_income_range": (0, 300000),
            "preferred_categories": ["All"],
            "success_rate": 0.75
        })
    
    @staticmethod
    def get_expected_benefit(scheme_name: str) -> Dict:
        """Get expected benefit information for a scheme."""
        benefit = SchemeProfiles.EXPECTED_BENEFITS.get(scheme_name, {
            "min": 0,
            "max": 0,
            "frequency": "N/A"
        })
        return benefit
    
    @staticmethod
    def format_expected_benefit(scheme_name: str) -> str:
        """Format expected benefit as readable string."""
        benefit = SchemeProfiles.get_expected_benefit(scheme_name)
        
        if benefit["min"] == benefit["max"]:
            amount = f"₹{benefit['min']:,}"
        else:
            amount = f"₹{benefit['min']:,} - ₹{benefit['max']:,}"
        
        return f"{amount} ({benefit['frequency']})"
