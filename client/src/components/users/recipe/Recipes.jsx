import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import axios from "axios";
import { toast } from "react-toastify";
import { BASEURL } from "../../../utils";


const Recipes = () => {

    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [userRecipes, setUserRecipes] = useState([]);

    const [IsLoading, setIsLoading] = useState(false);

    let pageLimit = 8;

    useEffect(() => {
      displayUserRecipes()
    }, [page])
    
    const displayUserRecipes = async() => {
        setIsLoading(true);
        try{
            const response = await axios.get(`${BASEURL}/api/show-user-recipe?page=${page}&limit=${pageLimit}`);
            // console.log("API response",response);
            if (response.data && response.data.userData) {
                setUserRecipes(response.data.userData);
                setTotalRecords(response.data.totalRecords);
            } else {
                console.error('Unexpected response structure:', response.data);
            }
        }catch(error) {
            console.error('Error fetching users recipes:', error);
        }finally{
            setIsLoading(false);
        }
    }


    //Pagination

    //Next Page
    const nextPage = () => {
        setPage(page + 1);
    }

    //Previous Page
    const prevPage = () => {
        setPage(page - 1);
    }


    const deleteRecipe = (e, id) => {
        e.preventDefault();

        let answer = confirm("Confirm delete data..!!");
        if(answer){

            const thisClicked = e.currentTarget; // Getting the button element clicked

            thisClicked.innerHTML = "Deleting..." // Change button text to "Deleting...".
    
            axios.delete(`${BASEURL}/api/delete-user-recipe/${id}`).then(res => {
                if(res.data.status === 200){
                    toast.success(res.data.message, {
                        theme: 'colored'
                    });
                    thisClicked.closest(".recipe-list-cards").remove(); // Remove the parent div
                }else{
                    toast.error(res.data.message, {
                        theme: 'colored'
                    });
                    thisClicked.innerHTML = "Delete"; // Revert button text
                }
            }).catch(error => {
                console.log("Error deleting Recipe", error);
                thisClicked.innerHTML = "Delete"; // Revert button text
            })
        }
    }


   




    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / pageLimit);

    let Recipe_LIST_HTML = "";

    if(userRecipes.length === 0){
        Recipe_LIST_HTML = <div>
            <div className="recipe-list-cards">
                <h3>You have not yet created a recipe</h3>
            </div>
        </div>
    }else{

        Recipe_LIST_HTML = userRecipes.map((recipe) => {
            return(
                
                <div key={recipe._id} className="recipe-list-cards">
                    <Link to={`/user/edit-recipe/${recipe.slug}`}>
                        <img src={`${BASEURL}/uploads/${recipe.file}`} alt={recipe.name}  height={250}/>
                        <h3>{recipe.name}</h3>
                    </Link>
                    <button onClick={(e) => deleteRecipe(e, recipe._id)}>
                       <span><RiIcons.RiDeleteBinLine title='Delete' className='recipe-card-delete-icon'/></span> Delete
                    </button>
                </div>
                
            )
        });
    }


    if(IsLoading){
        return(
            <div className="spinner-container">
                <div className="spinner"></div>
                <h4>Loading...</h4>
            </div>
        )
    }
    

    return(
        <div>
            <div className="main-content">
                <h2>Recipes
                    <Link to="/user/add-recipes">
                        <span className="other-h2-span">Add Recipes</span>
                    </Link>
                </h2>

                <div className="other-large-display">

                    <div className="user-card">
                        <div className="other-header">
                            <h3>List of Recipes</h3>
                        </div>
                        <div className="other-body">

                            <div className="recipe-card">
                                {Recipe_LIST_HTML}
                            </div>
                            <div className="recipe-card-page-button">
                                {page > 1 && <button onClick={prevPage}>{"<"}-Previous</button>}
                                {page < totalPages && <button onClick={nextPage}>Next-{">"}</button>}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>


    );

}

export default Recipes;
