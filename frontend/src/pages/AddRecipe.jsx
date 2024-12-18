import React, { useState } from "react";
import axios from "axios";
import "../styles/AddRecipe.css";

const AddRecipeForm = () => {
  const [recipeImage, setRecipeImage] = useState(null);
  const [ingredients, setIngredients] = useState([
    { name: "", unit: "", amount: "", image: null },
  ]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    descriptions: "",
    instructions: "",
    analyzedInstructions: "",
    vegetarian: false,
    cookingTime: "",
    servings: "",
    veryPopular: false, // Added veryPopular field
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRecipeImageChange = (e) => {
    setRecipeImage(e.target.files[0]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = field === "image" ? value : value;
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", unit: "", amount: "", image: null }]);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const submissionData = new FormData();

      // Append recipe image
      submissionData.append("recipeImage", recipeImage);

      // Append ingredient images
      ingredients.forEach((ingredient, index) => {
        if (ingredient.image) {
          submissionData.append("ingredientImages", ingredient.image);
        }
      });

      // Append ingredient data as a JSON string
      submissionData.append("ingredients", JSON.stringify(ingredients));

      // Append other fields
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });

      // Submit the form
      const response = await axios.post("http://localhost:5000/recipe/add-recipe", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Recipe added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe.");
    }
  };

  return (
    <div className="add-recipe-form-container">
      <h2 className="form-title">Add New Recipe</h2>
      <form className="add-recipe-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category (comma-separated)</label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descriptions">Descriptions</label>
          <textarea
            name="descriptions"
            id="descriptions"
            value={formData.descriptions}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            name="instructions"
            id="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="vegetarian">
            <input
              type="checkbox"
              name="vegetarian"
              id="vegetarian"
              checked={formData.vegetarian}
              onChange={handleInputChange}
            />
            Vegetarian
          </label>
        </div>

        {/* Checkbox for Very Popular */}
        <div className="form-group checkbox-group">
          <label htmlFor="veryPopular">
            <input
              type="checkbox"
              name="veryPopular"
              id="veryPopular"
              checked={formData.veryPopular}
              onChange={handleInputChange}
            />
            Very Popular
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="cookingTime">Cooking Time (in minutes)</label>
          <input
            type="number"
            name="cookingTime"
            id="cookingTime"
            value={formData.cookingTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings</label>
          <input
            type="number"
            name="servings"
            id="servings"
            value={formData.servings}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipeImage">Recipe Image</label>
          <input
            type="file"
            name="recipeImage"
            id="recipeImage"
            onChange={handleRecipeImageChange}
            accept="image/*"
            required
          />
        </div>

        <div className="ingredient-section">
          <h3>Ingredients</h3>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-form-group">
              <div className="form-group">
                <label htmlFor={`ingredient-name-${index}`}>Ingredient Name</label>
                <input
                  type="text"
                  id={`ingredient-name-${index}`}
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor={`ingredient-unit-${index}`}>Unit</label>
                <input
                  type="text"
                  id={`ingredient-unit-${index}`}
                  value={ingredient.unit}
                  onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor={`ingredient-amount-${index}`}>Amount</label>
                <input
                  type="number"
                  id={`ingredient-amount-${index}`}
                  value={ingredient.amount}
                  onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor={`ingredient-image-${index}`}>Ingredient Image</label>
                <input
                  type="file"
                  id={`ingredient-image-${index}`}
                  onChange={(e) => handleIngredientChange(index, "image", e.target.files[0])}
                  accept="image/*"
                />
              </div>
              <button
                type="button"
                className="remove-ingredient-btn"
                onClick={() => handleRemoveIngredient(index)}
              >
                Remove Ingredient
              </button>
            </div>
          ))}
          <button type="button" className="add-ingredient-btn" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>

        <button type="submit" className="submit-btn">
          Add Recipe
        </button>
      </form>
    </div>
  );
};

export default AddRecipeForm;
