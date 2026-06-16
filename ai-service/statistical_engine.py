"""
Statistical Engine for Welfare Scheme Matching
Provides probability calculations and statistical analysis for scheme recommendations
"""

import numpy as np
from scipy import stats
from typing import Dict, List, Tuple, Optional
import math


class StatisticalEngine:
    """
    Core statistical analysis engine for scheme matching.
    Uses probability theory and statistical methods to determine scheme suitability.
    """

    WEIGHTS ={
        'age': 0.20,
        'income': 0.35,
        'category': 0.25,
        'location': 0.10,
        'gender': 0.10
    }
    CATEGORY_VULNERABILITY ={
        'ST': 0.95,
        'SC': 0.90,
        'OBC': 0.75,
        'EWS': 0.85,
        'General': 0.40,
        'All': 0.50
    }
    
    PRIORITY_WEIGHTS={
        'Healthcare': 1.0,
        'Education': 0.95,
        'Housing': 0.85,
        'Social Welfare': 0.90,
        'Agriculture': 0.80,
        'Finance': 0.70
    }
    
    @staticmethod
    def calculate_age_probability(user_age: int, min_age: int, max_age: int) -> float:
        """
        Calculate probability of scheme success based on age using normal distribution.
        
        Args:
            user_age: User's current age
            min_age: Minimum eligible age for scheme
            max_age: Maximum eligible age for scheme
            
        Returns:
            Probability score between 0 and 1
        """
        if user_age < min_age or user_age > max_age:
            return 0.0
        

        optimal_age = (min_age + max_age) / 2
        age_range = max_age - min_age
        
        if age_range == 0:
            return 1.0 if user_age == optimal_age else 0.0
        

        std_dev = age_range / 4
        
       
        prob = stats.norm.pdf(user_age, optimal_age, std_dev)
        max_prob = stats.norm.pdf(optimal_age, optimal_age, std_dev)
        
        
        return min(prob / max_prob, 1.0) if max_prob > 0 else 1.0
    
    @staticmethod
    def calculate_income_probability(user_income: float, max_income: float, 
                                    scheme_category: str) -> float:
        """
        Calculate probability based on income using exponential decay model.
        Lower income = higher probability for welfare schemes.
        
        Args:
            user_income: User's annual income
            max_income: Maximum eligible income for scheme
            scheme_category: Category of scheme (affects curve)
            
        Returns:
            Probability score between 0 and 1
        """
        if user_income > max_income:
            return 0.0
        
        if max_income == 0:
            return 1.0
        
        
        income_ratio = user_income / max_income
        

        if scheme_category in ['Healthcare', 'Education', 'Social Welfare']:
            # Steeper curve - heavily favors lower income
            decay_rate = 2.5
        else:
            # Gentler curve
            decay_rate = 1.5
        
        # Exponential decay: higher probability for lower income
        # Formula: e^(-λ * income_ratio)
        probability = math.exp(-decay_rate * income_ratio)
        
        return min(probability, 1.0)
    
    @staticmethod
    def calculate_category_match_probability(user_category: str, 
                                            eligible_categories: List[str]) -> float:
        """
        Calculate probability based on category match.
        
        Args:
            user_category: User's social category
            eligible_categories: List of eligible categories for scheme
            
        Returns:
            Probability score between 0 and 1
        """
        if 'All' in eligible_categories:
            # Universal schemes - give slight preference to vulnerable categories
            return 0.85 + (0.15 * StatisticalEngine.CATEGORY_VULNERABILITY.get(user_category, 0.5))
        
        if user_category in eligible_categories:
            # Exact match - high probability
            return 0.95
        
        # No match
        return 0.0
    
    @staticmethod
    def calculate_gender_probability(user_gender: Optional[str], 
                                     required_gender: Optional[str]) -> float:
        """
        Calculate probability based on gender requirement.
        
        Args:
            user_gender: User's gender
            required_gender: Required gender for scheme (if any)
            
        Returns:
            Probability score between 0 and 1
        """
        if required_gender is None:
            return 1.0  
        
        if user_gender is None:
            return 0.7 
        
        if user_gender.lower() == required_gender.lower():
            return 1.0 
        
        return 0.0 
    
    @staticmethod
    def calculate_overall_probability(user_data: Dict, scheme_criteria: Dict, 
                                      scheme_category: str) -> float:
        """
        Calculate overall probability combining all factors with weighted scoring.
        
        Args:
            user_data: Dictionary with user information
            scheme_criteria: Dictionary with scheme eligibility criteria
            scheme_category: Category of the scheme
            
        Returns:
            Overall probability score between 0 and 1
        """

        age_prob = StatisticalEngine.calculate_age_probability(
            user_data['age'],
            scheme_criteria.get('min_age', 0),
            scheme_criteria.get('max_age', 120)
        )
        
        income_prob = StatisticalEngine.calculate_income_probability(
            user_data['income'],
            scheme_criteria.get('max_income', float('inf')),
            scheme_category
        )
        
        category_prob = StatisticalEngine.calculate_category_match_probability(
            user_data['category'],
            scheme_criteria.get('categories', ['All'])
        )
        
        gender_prob = StatisticalEngine.calculate_gender_probability(
            user_data.get('gender'),
            scheme_criteria.get('gender')
        )
        
       
        if age_prob == 0 or income_prob == 0 or category_prob == 0 or gender_prob == 0:
            return 0.0
        
        
        overall_prob = (
            StatisticalEngine.WEIGHTS['age'] * age_prob +
            StatisticalEngine.WEIGHTS['income'] * income_prob +
            StatisticalEngine.WEIGHTS['category'] * category_prob +
            StatisticalEngine.WEIGHTS['gender'] * gender_prob +
            StatisticalEngine.WEIGHTS['location']*0.8
        )
        
        return min(overall_prob, 1.0)
    
    @staticmethod
    def calculate_confidence_interval(probability: float, sample_size: int = 100) -> Tuple[float, float]:
        """
        Calculate confidence interval for probability estimate.
        Uses Wilson score interval for binomial proportions.
        
        Args:
            probability: Point estimate of probability
            sample_size: Sample size (default 100, simulating historical data)
            
        Returns:
            Tuple of (lower_bound, upper_bound) for 95% confidence interval
        """
        if probability <= 0:
            return (0.0, 0.0)
        if probability >= 1:
            return (1.0, 1.0)
        
      
        z = 1.96
        
       
        denominator = 1 + z**2 / sample_size
        center = (probability + z**2 / (2 * sample_size)) / denominator
        margin = z * math.sqrt((probability * (1 - probability) / sample_size + 
                                z**2 / (4 * sample_size**2))) / denominator
        
        lower = max(0.0, center - margin)
        upper = min(1.0, center + margin)
        
        return (round(lower, 3), round(upper, 3))
    
    @staticmethod
    def calculate_vulnerability_index(user_data: Dict) -> float:
        """
        Calculate user's vulnerability index based on multiple factors.
        Higher score = more vulnerable = higher priority for schemes.
        
        Args:
            user_data: Dictionary with user information
            
        Returns:
            Vulnerability score between 0 and 1
        """
        vulnerability = 0.0
        

        poverty_line = 100000
        if user_data['income'] <= poverty_line:
            income_vuln = 1.0 - (user_data['income'] / poverty_line)
        else:
            # Above poverty line, decreasing vulnerability
            income_vuln = max(0, 1.0 - (user_data['income'] / 500000))
        
        # Category vulnerability
        category_vuln = StatisticalEngine.CATEGORY_VULNERABILITY.get(
            user_data['category'], 0.5
        )
        

        age = user_data['age']
        if age < 18:
            age_vuln = 0.8
        elif age > 60:
            age_vuln = 0.7
        else:
            age_vuln = 0.3
        

        vulnerability = (
            0.50 * income_vuln +
            0.30 * category_vuln +
            0.20 * age_vuln
        )
        
        return round(min(vulnerability, 1.0), 3)
    
    @staticmethod
    def get_statistical_breakdown(user_data: Dict, scheme_criteria: Dict, 
                                  scheme_category: str, probability: float) -> Dict:
        """
        Generate detailed statistical breakdown of the match.
        
        Args:
            user_data: User information
            scheme_criteria: Scheme criteria
            scheme_category: Scheme category
            probability: Overall probability score
            
        Returns:
            Dictionary with detailed statistical analysis
        """
        age_prob = StatisticalEngine.calculate_age_probability(
            user_data['age'],
            scheme_criteria.get('min_age', 0),
            scheme_criteria.get('max_age', 120)
        )
        
        income_prob = StatisticalEngine.calculate_income_probability(
            user_data['income'],
            scheme_criteria.get('max_income', float('inf')),
            scheme_category
        )
        

        if probability >= 0.8:
            priority = "VERY HIGH"
        elif probability >= 0.6:
            priority = "HIGH"
        elif probability >= 0.4:
            priority = "MEDIUM"
        else:
            priority = "LOW"
        
        return {
            "demographicMatch": round(age_prob, 3),
            "incomeCompatibility": round(income_prob, 3),
            "categoryMatch": round(StatisticalEngine.calculate_category_match_probability(
                user_data['category'],
                scheme_criteria.get('categories', ['All'])
            ), 3),
            "priorityScore": priority,
            "overallProbability": round(probability, 3)
        }
