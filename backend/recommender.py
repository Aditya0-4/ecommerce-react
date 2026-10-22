
def normalize(value):
    """Convert a value into lowercase text for comparison."""
    return str(value).strip().lower()


def to_list(value):
    """Support fields stored as lists or individual strings."""
    if not value:
        return []

    if isinstance(value, list):
        return [str(item) for item in value if item]

    return [str(value)]


def find_matches(preferences, product_values):
    """Find customer preferences that match product attributes."""
    matches = []

    for preference in preferences:
        preference_text = normalize(preference)

        for product_value in product_values:
            product_text = normalize(product_value)

            if (
                preference_text in product_text
                or product_text in preference_text
            ):
                matches.append(preference)
                break

    return matches


def recommend_products(products, preferences, limit=3):
    recommendations = []

    selected_skin_type = preferences.get("skinType", "")
    selected_ingredients = preferences.get("ingredients", [])
    selected_benefits = preferences.get("benefits", [])

    # Maximum possible score for the selected preferences
    max_score = (
        (5 if selected_skin_type else 0)
        + 3 * len(selected_ingredients)
        + 2 * len(selected_benefits)
    )

    for product in products:
        score = 0
        reasons = []

        product_skin_types = to_list(product.get("skinType"))
        product_ingredients = to_list(product.get("ingredients"))
        product_benefits = to_list(product.get("keyBenefits"))

        # Match skin type
        if selected_skin_type:
            skin_matches = find_matches(
                [selected_skin_type],
                product_skin_types
            )

            if skin_matches:
                score += 5
                reasons.append(
                    f"Matches your {selected_skin_type} skin preference"
                )

        # Match ingredients
        ingredient_matches = find_matches(
            selected_ingredients,
            product_ingredients
        )

        score += 3 * len(ingredient_matches)

        for ingredient in ingredient_matches:
            reasons.append(f"Contains {ingredient}")

        # Match benefits
        benefit_matches = find_matches(
            selected_benefits,
            product_benefits
        )

        score += 2 * len(benefit_matches)

        for benefit in benefit_matches:
            reasons.append(f"Offers {benefit}")

        # Express the score as a percentage of possible points
        match_percentage = (
            round(score / max_score * 100)
            if max_score > 0
            else 0
        )

        recommendations.append({
            **product,
            "matchScore": match_percentage,
            "matchReasons": reasons
        })

    # Highest-scoring products appear first
    recommendations.sort(
        key=lambda product: (
            product["matchScore"],
            product.get("name", "").lower()
        ),
        reverse=True
    )

    return recommendations[:limit]
