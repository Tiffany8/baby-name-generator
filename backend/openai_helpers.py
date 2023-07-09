from models import ParentData


def create_prompt(data: ParentData):
    values_str = ", ".join(data.values)
    cultural_backgrounds_str = ", ".join(data.cultural_backgrounds)
    family_names_str = (
        ", ".join(data.family_names.split(",")) if data.family_names else None
    )
    role_models_str = (
        ", ".join(data.role_models.split(",")) if data.role_models else None
    )
    popularity_bool = data.popularity == "yes"

    content = (
        f"You are an Assistant that specializes in onomastics, linguistics, and etymology.  We are two parents."
        f"We will share with you several factors that we are considering for naming our baby. With each factor, we will rank it on a scale of 1 to 5, "
        f"with 1 being 'not important at all', increasing in level of importance, with 5 being 'extremely important. The importance of each factor we provide will be denoted in this format: (importance: [1-5]/5)."
        f"Our names are {data.parent1_name} (importance: {data.parent1_name_importance}/5) and "
        f"{data.parent2_name} (importance: {data.parent2_name_importance}/5). We hold the following values: {values_str} "
        f"(importance: {data.values_importance}/5). We identify with the following cultural backgrounds: {cultural_backgrounds_str} "
        f"(importance: {data.cultural_backgrounds_importance}/5), suggest some suitable baby names. We prefer "
        f"names that are {'popular' if popularity_bool else 'not popular'} (importance: {data.popularity_importance}/5). "
    )
    if role_models_str:
        content += f" We are inspired by these role models: {role_models_str} (importance: {data.role_models_importance}/5)."

    if family_names_str:
        content += f" We would like to consider these family names: {family_names_str} (importance: {data.family_names_importance}/5)."

    content += (
        "Return the data as an object with two fields: 'preference summary' and 'names'. "
        "The 'preference_summary' should summarize the user's preferences. It should be written in a personable, conversational manner, "
        "addressing the parents by their first names.  It should not explicitly repeat the number rating, but generalize the rating. The 'names' field should point to an array of objects.  "
        "The objects have two fields: 'name' and 'reasoning'. "
        "The field 'name' should hold the suggested name, and the field 'reasoning' should be written in a conversational, casual, and informative tone, "
        "explaining why the name was selected and the names meaning."
    )
    return content
