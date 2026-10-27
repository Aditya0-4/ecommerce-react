
def normalize(value):
    """Make text comparisons case-insensitive."""
    return str(value).strip().lower()


def to_list(value):
    """Convert a string or list into a list of strings."""
    if not value:
        return []

    if isinstance(value, list):
        return [
            str(item).strip()
            for item in value
            if item and str(item).strip()
        ]

    return [str(value).strip()]


def find_matches(preferences, product_values):
    """Match ingredients and benefits despite common suffixes."""
    matches = []

    def canonical(value):
        text = normalize(value)

        # Treat common naming variations as equivalent.
        for suffix in (" extract",):
            if text.endswith(suffix):
                text = text[:-len(suffix)].strip()

        return text

    normalized_values = {
        canonical(value) for value in product_values
    }

    for preference in preferences:
        if canonical(preference) in normalized_values:
            matches.append(preference)

    return matches

def recommend_products(products, preferences, limit=3):
    recommendations = []

    selected_skin_type = preferences.get("skinType", "").strip()
    selected_ingredients = preferences.get("ingredients", [])
    selected_benefits = preferences.get("benefits", [])

    # Give skin type, ingredients, and benefits explicit weights.
    skin_weight = 5
    ingredient_weight = 3
    benefit_weight = 2

    total_possible_score = (
        (skin_weight if selected_skin_type else 0)
        + ingredient_weight * len(selected_ingredients)
        + benefit_weight * len(selected_benefits)
    )

    if total_possible_score == 0:
        return []

    for product in products:
        score = 0
        reasons = []

        product_skin_types = to_list(product.get("skinType"))
        product_ingredients = to_list(product.get("ingredients"))
        product_benefits = to_list(product.get("keyBenefits"))

        # 1. Check skin type.
        if selected_skin_type:
            skin_matches = find_matches(
                [selected_skin_type],
                product_skin_types
            )

            if skin_matches:
                score += skin_weight
                reasons.append(
                    f"Matches your {selected_skin_type} skin preference"
                )

        # 2. Check ingredients.
        ingredient_matches = find_matches(
            selected_ingredients,
            product_ingredients
        )

        score += ingredient_weight * len(ingredient_matches)

        for ingredient in ingredient_matches:
            reasons.append(f"Contains {ingredient}")

        # 3. Check benefits.
        benefit_matches = find_matches(
            selected_benefits,
            product_benefits
        )

        score += benefit_weight * len(benefit_matches)

        for benefit in benefit_matches:
            reasons.append(f"Offers {benefit}")

        # Don't recommend products with no matching preferences.
        if score == 0:
            continue

        match_percentage = round(
            (score / total_possible_score) * 100
        )

        recommendations.append({
            **product,
            "matchScore": match_percentage,
            "matchReasons": reasons,
            "matchedPreferences": len(reasons)
        })

    # Highest score first; use name for consistent tie-breaking.
    recommendations.sort(
        key=lambda product: (
            -product["matchScore"],
            product.get("name", "").lower()
        )
    )

    return recommendations[:limit]
