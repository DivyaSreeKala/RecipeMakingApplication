import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecipeTable.css";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  // Fetch recipes from the server
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recipe/dbRecipies");
        if (response.data.success) {
          setRecipes(response.data.data);
        } else {
          console.error("Error fetching recipes:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="recipe-list-container">
      <h2>Recipe List</h2>
      <div className="recipe-list">
        {recipes.length === 0 ? (
          <p>No recipes found.</p>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <img
                src={recipe.image} // Use the image URL
                alt={recipe.title}
                className="recipe-image"
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
              <h3>{recipe.title}</h3>
              <p><strong>Ready in:</strong> {recipe.readyInMinutes} minutes</p>

              {/* Ingredients */}
              <h4>Ingredients</h4>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name} - {ingredient.amount} {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeList;
