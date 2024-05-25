import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";
import { BASEURL } from '../../../utils';



const HomeRecipe = () => {

    const [otherRecipe, setOtherRecipe] = useState([]);

    useEffect(() => {

        getOtherRecipies();

    },[])

    const getOtherRecipies = async() => {
        try{
            const response = await axios.get(`${BASEURL}/api/get-other-recipies`);
            if(response.data && response.data.otherRecipeData){
                setOtherRecipe(response.data.otherRecipeData)
            }else{
                console.error("unexpected response structure", response.data)
            }
            
        }catch(error){
            console.error("Error fetching other recipie:", error)
        }
    }

    

    return(
        <div>

            <div className="recipe-grid">
                {otherRecipe.map((data) => {
                    return (

                        <div key={data._id}>
                            <Link to={`/recipe/${data.slug}`}>
                                <div className="recipes-card">
                                    <img src={`${BASEURL}/uploads/${data.file}`} alt={data.name} loading='lazy' width={50}  height={190}/>
                                    <h3>{data.name}</h3>
                                </div>     
                                <div className="recipe-details-flexible">
                                    <div className="details">
                                        <span className="rating">&#9733;</span>
                                        <span className="xsmall-left">{data.ratings}</span>
                                        <span> ({data.comment_count} Comments)</span>
                                    </div>
        
                                    <div className="details">
                                        <h4>By {data.userId.name}</h4>
                                    </div>
        
                                </div>          
                            </Link>
                        </div>
                    )

                })}

            </div>
            
        </div>


    );

}

export default HomeRecipe;
