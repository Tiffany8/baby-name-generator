from models import NamePreferencesSchema


def create_prompt(data: NamePreferencesSchema):
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
        f"You are an AI assistant with expertise in onomastics, linguistics, and etymology. We are parents-to-be and we're considering several factors for naming our baby. We rank these factors on a scale of 1 to 5 for importance. "
        f"Our names are {data.parent1_name} and {data.parent2_name}, and they're important to us ({data.parent1_name_importance}/5 and {data.parent2_name_importance}/5 respectively). "
        f"We identify with the following cultural backgrounds: {cultural_backgrounds_str} ({data.cultural_backgrounds_importance}/5). "
        f"We uphold these values: {values_str} ({data.values_importance}/5). We prefer "
        f"names that are {'popular' if popularity_bool else 'not popular'}. "
        f"Consider names that have a similar sound, are phonetically similar, and/or convey similar sentiments to our names. "
        f"Please suggest a wide variety of names that could be traditional, unique, modern, or vintage. "
        f"Also, provide an in-depth explanation for each name, touching upon its origin, cultural background, and how it matches our given factors."
        "When selecting names and describing the explanation, try to make sure that the reasonings are sound. For"
        "example, 'Amara is a beautiful name ...This name embodies passion'.  It's unclear how the name embodies passion. If this is true,"
        "explain how it emobodies passion. If it's not true, don't say it."
    )

    if role_models_str:
        content += f" Our role models are: {role_models_str} ({data.role_models_importance}/5). Consider names inspired by these role models."

    if family_names_str:
        content += f" We would like to consider these family names: {family_names_str} ({data.family_names_importance}/5)."

    content += (
        "Return the data as an object with two fields: 'preference summary' and 'names'. The 'preference_summary' should summarize the user's preferences. It should be written in a personable, conversational manner, "
        "addressing the parents by their first names.  It should not explicitly repeat the number rating, but generalize the rating. "
        "The 'names' field should be an array of objects. Each object should have two fields: 'name' and 'reasoning'. "
        "The field 'name' should contain the suggested name, and the field 'reasoning' should explain why the name was selected and its meaning in a conversational, casual, and informative tone."
    )
    return content
