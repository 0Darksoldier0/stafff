import React, { useContext, useEffect, useState } from 'react'
import ExploreMenu from '../../components/MenuComponent/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/MenuComponent/FoodDisplay/FoodDisplay';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Menu = () => {

    const [category, setCategory] = useState("All");
    const { orderId } = useContext(StoreContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (!orderId) {
            navigate('/')
        }
    }, [orderId])

    return (
        <div>
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
        </div>
    )
}

export default Menu