
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recommendations.css";

const API_URL = "http://localhost:5000";

const ingredientOptions = [
  "Neem",
  "Honey",
  "Turmeric",
  "Lavender",
  "Coconut Oil",
  "Vitamin E",
];

const benefitOptions = [
  "Deep Cleansing",
  "Moisturizing",
  "Soothing",
  "Natural Ingredients",
];

function Recommendations() {
  const navigate = useNavigate();

  const [skinType, setSkinType] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [benefits, setBenefits] = useState([]);

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  function toggleOption(value, selected, setSelected) {
    setSelected((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!skinType && ingredients.length === 0 && benefits.length === 0) {
      setError("Please select at least one preference.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(false);
    setRecommendations([]);

    try {
      const response = await fetch(`${API_URL}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skinType,
          ingredients,
          benefits,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to get recommendations.");
      }

      setRecommendations(data.recommendations || []);
      setSearched(true);
    } catch (err) {
      console.error("Recommendation error:", err);
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check that Flask is running."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetPreferences() {
    setSkinType("");
    setIngredients([]);
    setBenefits([]);
    setRecommendations([]);
    setError("");
    setSearched(false);
  }

  return (
    <main className="recommendation-page">
      <section className="recommendation-hero">
        <p className="recommendation-eyebrow">
          PERSONALIZED SKINCARE • COSMO ROOTS
        </p>

        <h1>Find Your Perfect Soap</h1>

        <p>
          Tell us what you prefer, and discover products that match
          your skincare preferences.
        </p>
      </section>

      <form className="preference-form" onSubmit={handleSubmit}>
        <div className="form-heading">
          <h2>Your Preferences</h2>
          <p>Select one or more options to personalize your results.</p>
        </div>

        <div className="preference-group">
          <label htmlFor="skinType">1. Select your skin type</label>

          <select
            id="skinType"
            value={skinType}
            onChange={(event) => setSkinType(event.target.value)}
          >
            <option value="">Choose skin type</option>
            <option value="Normal">Normal</option>
            <option value="Oily">Oily</option>
            <option value="Dry">Dry</option>
            <option value="Combination">Combination</option>
          </select>
        </div>

        <div className="preference-group">
          <p className="group-label">
            2. Ingredients you prefer
          </p>

          <div className="preference-options">
            {ingredientOptions.map((ingredient) => (
              <label className="preference-option" key={ingredient}>
                <input
                  type="checkbox"
                  checked={ingredients.includes(ingredient)}
                  onChange={() =>
                    toggleOption(
                      ingredient,
                      ingredients,
                      setIngredients
                    )
                  }
                />
                <span>{ingredient}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="preference-group">
          <p className="group-label">
            3. What matters most to you?
          </p>

          <div className="preference-options">
            {benefitOptions.map((benefit) => (
              <label className="preference-option" key={benefit}>
                <input
                  type="checkbox"
                  checked={benefits.includes(benefit)}
                  onChange={() =>
                    toggleOption(benefit, benefits, setBenefits)
                  }
                />
                <span>{benefit}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="recommendation-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="find-soap-button"
            disabled={loading}
          >
            {loading ? "Finding your matches..." : "Find My Soap"}
          </button>

          <button
            type="button"
            className="reset-button"
            onClick={resetPreferences}
          >
            Reset
          </button>
        </div>
      </form>

      {loading && (
        <p className="recommendation-status" role="status">
          Comparing your preferences with our products...
        </p>
      )}

      {searched && (
        <section className="recommendation-results">
          <h2>Your Recommended Soaps</h2>

          <p className="results-description">
            These products match your selected preferences.
          </p>

          {recommendations.length === 0 ? (
            <p>
              No products are available to recommend yet.
            </p>
          ) : (
            <div className="recommendation-grid">
              {recommendations.map((product) => (
                <article
                  className="recommendation-card"
                  key={product.id}
                >
                  <div className="recommendation-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="recommendation-image"
                    />

                    <span className="match-badge">
                      {product.matchScore}% match
                    </span>
                  </div>

                  <div className="recommendation-card-content">
                    <h3>{product.name}</h3>

                    <p className="recommended-price">
                      ₹{product.price}
                      {product.originalPrice && (
                        <del> ₹{product.originalPrice}</del>
                      )}
                    </p>

                    <p className="recommended-description">
                      {product.shortDescription}
                    </p>

                    <h4>Why this matches</h4>

                    {product.matchReasons?.length > 0 ? (
                      <ul className="match-reasons">
                        {product.matchReasons.map((reason, index) => (
                          <li key={`${product.id}-${index}`}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No matching attributes were found.</p>
                    )}

                    <button
                      type="button"
                      className="view-product-button"
                      onClick={() =>
                        navigate(`/product/${product.id}`)
                      }
                    >
                      View Product
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default Recommendations;
