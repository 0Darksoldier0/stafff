import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';
import { BACKEND_URL } from '../../../../config/constants'; // Removed: No longer needed for image URLs
import { toast } from 'react-toastify';

const FoodItem = ({ id, name, price, description, image }) => {


    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const token = localStorage.getItem('token');

    return (
        <div className='food-item'>
            <div className="food-item-image-container">
                {/* Directly use the 'image' prop as it's now the full GCS URL */}
                <img className='food-item-image' src={image} alt="" />
                {
                    !cartItems[id]
                        ? <img className='add' onClick={() => token ? addToCart(id) : toast.error("Please sign in")} name="add" src={assets.add_icon_white} alt="" />
                        : <div className='food-item-counter'>
                            <img onClick={() => token ? removeFromCart(id) : toast.error("Please sign in")} name="increase" src={assets.remove_icon_red} alt="" />
                            <p>{cartItems[id]}</p>
                            <img onClick={() => token ? addToCart(id) : toast.error("Please sign in")} name="decrease" src={assets.add_icon_green} alt="" />
                        </div>
                }
            </div>

            <div className='food-item-info'>
                <p className='food-item-name'>{name}</p>
                <p className="food-item-description">{description}</p>
                <p className='food-item-price'>{price} vnd</p>
            </div>

        </div>
    )
}


export default FoodItem