import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {

    const { food_list } = useContext(StoreContext);

    return (
        <div className='food-display' id='food-display'>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if ((category === "All" || category === item.category_name) && item.availability === 1) {
                        return <FoodItem key={index}
                            id={item.product_id}
                            name={item.product_name}
                            price={item.price}
                            description={item.description}
                            image={item.image} />
                    }
                })}
            </div>
        </div>
    )
}

export default FoodDisplay
