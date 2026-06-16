"""
Recommendation Engine for Welfare Schemes
Ranks and recommends schemes based on probability scores and user needs
"""

from typing import List, Dict, Tuple
from statistical_engine import StatisticalEngine
from scheme_profiles import SchemeProfiles


class RecommendationEngine:
    """
    Advanced recommendation system combining statistical analysis
    with scheme impact and user vulnerability assessment.
    """
    
    @staticmethod
    def calculate_recommendation_score(probability: float, 
                                       scheme_category: str,
                                       vulnerability_index: float,
                                       scheme_impact: float = 0.8) -> float:
        """
        Calculate final recommendation score combining multiple factors.
        
        Args:
            probability: Statistical probability of scheme success
            scheme_category: Category of the scheme
            vulnerability_index: User's vulnerability score
            scheme_impact: Impact factor of the scheme (0-1)
            
        Returns:
            Recommendation score between 0 and 100
        """
        # Get priority weight for category
        category_weight = StatisticalEngine.PRIORITY_WEIGHTS.get(scheme_category, 0.75)
        
        # Base score from probability (0-60 points)
        base_score = probability * 60
        
        # Vulnerability bonus (0-20 points)
        # Higher vulnerability = more urgent need
        vulnerability_bonus = vulnerability_index * 20
        
        # Category priority (0-10 points)
        category_bonus = category_weight * 10
        
        # Scheme impact (0-10 points)
        impact_bonus = scheme_impact * 10
        
        total_score = base_score + vulnerability_bonus + category_bonus + impact_bonus
        
        return round(min(total_score, 100), 2)
    
    @staticmethod
    def rank_schemes(schemes_with_scores: List[Dict], 
                    user_vulnerability: float) -> List[Dict]:
        """
        Rank schemes based on recommendation scores.
        
        Args:
            schemes_with_scores: List of schemes with probability scores
            user_vulnerability: User's vulnerability index
            
        Returns:
            Sorted list of schemes with recommendation scores
        """
        ranked_schemes = []
        
        for scheme in schemes_with_scores:
            # Calculate recommendation score
            rec_score = RecommendationEngine.calculate_recommendation_score(
                probability=scheme['probabilityScore'],
                scheme_category=scheme['category'],
                vulnerability_index=user_vulnerability,
                scheme_impact=scheme.get('impactScore', 0.8)
            )
            
            scheme['recommendationScore'] = rec_score
            ranked_schemes.append(scheme)
        
        # Sort by recommendation score(highest first)
        ranked_schemes.sort(key=lambda x: x['recommendationScore'], reverse=True)
        
        return ranked_schemes
    
    @staticmethod
    def generate_user_profile_summary(user_data: Dict, 
                                      vulnerability_index: float,
                                      eligible_schemes: List[Dict]) -> Dict:
        """
        Generate comprehensive user profile summary with recommendations.
        
        Args:
            user_data: User information
            vulnerability_index: Calculated vulnerability index
            eligible_schemes: List of eligible schemes
            
        Returns:
            User profile summary dictionary
        """
        # Analyze which categories are most relevant
        category_counts = {}
        for scheme in eligible_schemes[:5]:  # Top 5 schemes
            cat = scheme['category']
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        # Sort categories by frequency
        priority_categories = sorted(category_counts.items(), 
                                    key=lambda x: x[1], 
                                    reverse=True)
        priority_categories = [cat for cat, _ in priority_categories[:3]]
        
        # Generate recommendation focus
        if vulnerability_index >= 0.7:
            focus = "Immediate assistance recommended - High priority schemes available"
        elif vulnerability_index >= 0.5:
            focus = "Multiple welfare schemes match your profile"
        else:
            focus = "Explore growth and development schemes"
        
        # Income category
        if user_data['income'] < 100000:
            income_category = "Below Poverty Line"
        elif user_data['income'] < 250000:
            income_category = "Low Income"
        elif user_data['income'] < 500000:
            income_category = "Lower Middle Income"
        else:
            income_category = "Middle Income"
        
        return {
            "vulnerabilityIndex": vulnerability_index,
            "incomeCategory": income_category,
            "priorityCategories": priority_categories,
            "recommendedFocus": focus,
            "totalEligibleSchemes": len(eligible_schemes),
            "highPrioritySchemes": len([s for s in eligible_schemes 
                                       if s.get('recommendationScore', 0) >= 80])
        }
    
    @staticmethod
    def get_personalized_explanation(scheme: Dict, user_data: Dict, 
                                     vulnerability_index: float) -> str:
        """
        Generate personalized explanation for why scheme is recommended.
        
        Args:
            scheme: Scheme information with scores
            user_data: User information
            vulnerability_index: User's vulnerability index
            
        Returns:
            Personalized explanation string
        """
        reasons = []
        
        # Probability-based reason
        prob = scheme.get('probabilityScore', 0)
        if prob >= 0.8:
            reasons.append("Excellent statistical match for your profile")
        elif prob >= 0.6:
            reasons.append("Strong match based on your demographics")
        else:
            reasons.append("Good potential match")
        
        # Income-based reason
        income_compat = scheme.get('statisticalAnalysis', {}).get('incomeCompatibility', 0)
        if income_compat >= 0.8:
            reasons.append("Your income level is highly suitable for this scheme")
        
        # Vulnerability-based reason
        if vulnerability_index >= 0.7 and scheme['category'] in ['Healthcare', 'Education', 'Social Welfare']:
            reasons.append("Priority scheme for your current situation")
        
        # Category-specific reasons
        if scheme['category'] == 'Education' and user_data['age'] <= 25:
            reasons.append("Age-appropriate educational opportunity")
        elif scheme['category'] == 'Healthcare':
            reasons.append("Essential healthcare coverage recommended")
        elif scheme['category'] == 'Agriculture' and user_data['income'] < 200000:
            reasons.append("Direct financial support for agricultural activities")
        
        return ". ".join(reasons[:3])  # Max 3 reasons
    
    @staticmethod
    def filter_top_recommendations(schemes: List[Dict], max_count: int = 10) -> List[Dict]:
        """
        Filter to return only top N recommendations with minimum threshold.
        
        Args:
            schemes: Ranked list of schemes
            max_count: Maximum number of recommendations to return
            
        Returns:
            Filtered list of top recommendations
        """
        # Filter schemes with recommendation score >= 50
        quality_schemes = [s for s in schemes if s.get('recommendationScore', 0) >= 50]
        
        # Return top N
        return quality_schemes[:max_count]
