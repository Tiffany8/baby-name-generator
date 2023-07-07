from pydantic import BaseModel, Field
from typing import List

class ParentData(BaseModel):
    parent1_name: str = Field(..., description="Name of parent 1")
    parent2_name: str = Field(..., description="Name of parent 2")
    values: List[str] = Field(..., description="List of values important to the parents")
    cultural_backgrounds: List[str] = Field(..., description="List of cultural backgrounds")
    popularity: bool = Field(..., description="Preference for popular names")
    role_models: List[str] = Field(..., description="List of role models for the parents")
    family_names: List[str] = Field(..., description="List of family names to consider")
    # Fields for importance
    parent1_name_importance: int = Field(..., description="Importance of parent 1's name", ge=1, le=5)
    parent2_name_importance: int = Field(..., description="Importance of parent 2's name", ge=1, le=5)
    values_importance: int = Field(..., description="Importance of values", ge=1, le=5)
    cultural_backgrounds_importance: int = Field(..., description="Importance of cultural backgrounds", ge=1, le=5)
    popularity_importance: int = Field(..., description="Importance of name popularity", ge=1, le=5)
    role_models_importance: int = Field(..., description="Importance of role models", ge=1, le=5)
    family_names_importance: int = Field(..., description="Importance of family names", ge=1, le=5)