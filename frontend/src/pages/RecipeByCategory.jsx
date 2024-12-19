import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import '../styles/style.css'
import '../styles/Recipe.css'
// import { Input, Button, InputLeftElement, Icon } from '@chakra-ui/react';
// import { SearchIcon } from '@chakra-ui/icons';
import { IoSearch } from "react-icons/io5";
import EditorsChoiceCard from '../components/EditorsChoiceCard/EditorsChoiceCard';
import RecipeCard from '../components/RecipeCard/RecipeCard';
import { Button } from '@chakra-ui/react';
import Footer from '../components/Foooter/Footer';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const RecipeByCategory = () => {
  const location = useLocation();
  const [category, setCategory] = useState(location.state.name);
  const [image, setImage] = useState(location.state.image);
  const [recipes, setRecipes] = useState([]);
  const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    try {
      const fetchRecipeByCategory = async () => {
        const response = await axios.get(`${baseUrl}/recipe-by-category`,
        {params:{category}});
          setRecipes(response.data.recipeDetails);
      }
      fetchRecipeByCategory();
    } catch (err) {
      console.log(err);
    }
  }, [])
  return (
    <>
      <div className="category-page">
        <div className='nav-heading-container'>
          <NavBar />

          <div className='category-name'>
            <h1>
              <span className="first-word">{category.split(' ')[0]}</span>
              {` ${category.split(' ').slice(1).join(' ')}`}
            </h1>
          </div>
        </div>
        <div className="category-container">
          <img className='img-center' src={image} alt="1.jpg" />
        </div>

      </div>

      <div className="recipies">
        {recipes.map((recipe, index) => {
          return <RecipeCard key={index} title={recipe.title} readyInMinutes={recipe.readyInMinutes} vegetarian={recipe.vegetarian} image={recipe.image} />
        }, [])}


      </div>
      <Footer />
    </>
  )
}

export default RecipeByCategory;