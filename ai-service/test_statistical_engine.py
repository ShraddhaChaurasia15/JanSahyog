"""
Test file for Statistical Engine
Tests probability calculations and statistical analysis
"""
import sys
sys.path.append('/Users/satyamkrkesarwani/Desktop/CODING/JanSahyog/ai-service')

from statistical_engine import StatisticalEngine
from recommendation_engine import RecommendationEngine
from scheme_profiles import SchemeProfiles

def test_probability_calculations():
    """Test probability calculations with sample data"""
    
    print("=" * 60)
    print("Testing Statistical Engine")
    print("=" * 60)

    print("\n📊 Test Case 1: Low-income farmer")
    user_data_1 = {
        'age': 45,
        'income': 50000,
        'category': 'General',
        'state': 'Bihar',
        'gender': 'Male'
    }
    
    scheme_criteria_1 = {
        'min_age': 18,
        'max_age': 100,
        'max_income': 200000,
        'categories': ['All'],
        'states': ['All']
    }
    
    prob_1 = StatisticalEngine.calculate_overall_probability(
        user_data_1, 
        scheme_criteria_1, 
        'Agriculture'
    )
    
    conf_interval_1 = StatisticalEngine.calculate_confidence_interval(prob_1)
    vuln_1 = StatisticalEngine.calculate_vulnerability_index(user_data_1)
    
    print(f"  User: Age {user_data_1['age']}, Income ₹{user_data_1['income']:,}, Category: {user_data_1['category']}")
    print(f"  Probability Score: {prob_1:.3f}")
    print(f"  Confidence Interval: [{conf_interval_1[0]:.3f}, {conf_interval_1[1]:.3f}]")
    print(f"  Vulnerability Index: {vuln_1:.3f}")
    

    print("\n📊 Test Case 2: Student from SC category")
    user_data_2 = {
        'age': 18,
        'income': 120000,
        'category': 'SC',
        'state': 'Maharashtra',
        'gender': 'Male'
    }
    
    scheme_criteria_2 = {
        'min_age': 5,
        'max_age': 30,
        'max_income': 250000,
        'categories': ['SC', 'ST', 'OBC', 'EWS'],
        'states': ['All']
    }
    
    prob_2 = StatisticalEngine.calculate_overall_probability(
        user_data_2,
        scheme_criteria_2,
        'Education'
    )

    conf_interval_2 = StatisticalEngine.calculate_confidence_interval(prob_2)
    vuln_2 = StatisticalEngine.calculate_vulnerability_index(user_data_2)
    
    print(f"  User: Age {user_data_2['age']}, Income ₹{user_data_2['income']:,}, Category: {user_data_2['category']}")
    print(f"  Probability Score: {prob_2:.3f}")
    print(f"  Confidence Interval: [{conf_interval_2[0]:.3f}, {conf_interval_2[1]:.3f}]")
    print(f"  Vulnerability Index: {vuln_2:.3f}")
    
    
    print("\n Test Case 3: Female child (for Beti Bachao Beti Padhao)")
    user_data_3 = {
        'age': 5,
        'income': 80000,
        'category': 'General',
        'state': 'Delhi',
        'gender': 'Female'
    }
    
    scheme_criteria_3 = {
        'min_age': 0,
        'max_age': 21,
        'max_income': 500000,
        'categories': ['All'],
        'states': ['All'],
        'gender': 'Female'
    }
    
    prob_3 = StatisticalEngine.calculate_overall_probability(
        user_data_3,
        scheme_criteria_3,
        'Social Welfare'
    )
    
    conf_interval_3 = StatisticalEngine.calculate_confidence_interval(prob_3)
    vuln_3 = StatisticalEngine.calculate_vulnerability_index(user_data_3)
    
    print(f"  User: Age {user_data_3['age']}, Income ₹{user_data_3['income']:,}, Category: {user_data_3['category']}, Gender: {user_data_3['gender']}")
    print(f"  Probability Score: {prob_3:.3f}")
    print(f"  Confidence Interval: [{conf_interval_3[0]:.3f}, {conf_interval_3[1]:.3f}]")
    print(f"  Vulnerability Index: {vuln_3:.3f}")
    
  
    print("\n Test Case 4: Senior citizen")
    user_data_4 = {
        'age': 68,
        'income': 150000,
        'category': 'General',
        'state': 'Kerala',
        'gender': 'Male'
    }
    
    scheme_criteria_4 = {
        'min_age': 0,
        'max_age': 120,
        'max_income': 100000,
        'categories': ['All'],
        'states': ['All']
    }

    if user_data_4['income'] > scheme_criteria_4['max_income']:
        print(f"  User: Age {user_data_4['age']}, Income ₹{user_data_4['income']:,}, Category: {user_data_4['category']}")
        print(f"  Not eligible (income exceeds limit)")
    else:
        prob_4 = StatisticalEngine.calculate_overall_probability(
            user_data_4,
            scheme_criteria_4,
            'Healthcare'
        )
        print(f"  Probability Score: {prob_4:.3f}")
    
    print("\n" + "=" * 60)
    print("Testing Recommendation Engine")
    print("=" * 60)

    sample_schemes=[
        {
            'name': 'PM Kisan',
            'category': 'Agriculture',
            'probabilityScore': 0.85,
            'impactScore': 0.75
        },
        {
            'name': 'Ayushman Bharat',
            'category': 'Healthcare',
            'probabilityScore': 0.75,
            'impactScore': 0.95
        }
    ]
    
    rec_score_1 = RecommendationEngine.calculate_recommendation_score(
        0.85, 'Agriculture', vuln_1, 0.75
    )
    
    rec_score_2 = RecommendationEngine.calculate_recommendation_score(
        0.75, 'Healthcare', vuln_1, 0.95
    )
    
    print(f"\n Recommendation Scores for Low-income Farmer:")
    print(f"  PM Kisan (Agriculture): {rec_score_1:.2f}/100")
    print(f"  Ayushman Bharat (Healthcare): {rec_score_2:.2f}/100")
    
    print("\n" + "=" * 60)
    print("Testing Scheme Profiles")
    print("=" * 60)
    
    print(f"\n💰 Expected Benefits:")
    print(f"  PM Kisan: {SchemeProfiles.format_expected_benefit('PM Kisan Samman Nidhi')}")
    print(f"  Ayushman Bharat: {SchemeProfiles.format_expected_benefit('Ayushman Bharat')}")
    print(f"  NSP: {SchemeProfiles.format_expected_benefit('National Scholarship Portal')}")
    
    print(f"\n🎯 Impact Scores:")
    print(f"  PM Kisan: {SchemeProfiles.get_impact_score('PM Kisan Samman Nidhi')}")
    print(f"  Ayushman Bharat: {SchemeProfiles.get_impact_score('Ayushman Bharat')}")
    print(f"  PMAY: {SchemeProfiles.get_impact_score('Pradhan Mantri Awas Yojana')}")
    
    print("\n"+"=" * 60)
    print("All tests completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    test_probability_calculations()
