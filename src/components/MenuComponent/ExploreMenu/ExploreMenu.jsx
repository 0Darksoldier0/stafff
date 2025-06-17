import React, { useState } from 'react'
import './ExploreMenu.css'

const ExploreMenu = ({category, setCategory}) => {
    
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Our Menu</h1>
            <p className='text'>We consider all the drivers of change gives you the components you need to change to create a truly happens</p>
            <div className="explore-menu-list">
                <button onClick={() => setCategory("All")} className={category==="All" ? "active" : "inactive"}>All</button>
                <button onClick={() => setCategory("appetizers")} className={category==="appetizers" ? "active" : "inactive"}>Appetizers</button>
                <button onClick={() => setCategory("main dishes")} className={category==="main dishes" ? "active" : "inactive"}>Main Dishes</button>
                <button onClick={() => setCategory("drinks")} className={category==="drinks" ? "active" : "inactive"}>Drinks</button>
                <button onClick={() => setCategory("desserts")} className={category==="desserts" ? "active" : "inactive"}>Desserts</button>

            </div>
        </div>
    )
}

export default ExploreMenu
