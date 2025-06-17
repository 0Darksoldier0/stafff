import React, { useState } from 'react'
import ExploreMenu from '../../components/MenuComponent/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/MenuComponent/FoodDisplay/FoodDisplay';

const Menu = () => {

    const [category, setCategory] = useState("All");

    return (
        <div>
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
        </div>
    )
}

export default Menu