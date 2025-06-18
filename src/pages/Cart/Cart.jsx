import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../../config/constants'; // Removed: No longer needed for image URLs
import { useState } from 'react';
import ConfirmPopup from '../../components/ConfirmPopup/ConfirmPopup'
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {

    const navigate = useNavigate();

    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    const { token, food_list, cartItems, clearState,
        addToCart, removeFromCart, getCartTotalAmount,
        addItemsToOrder, orderDetailData, fetchOrderDetails,
        getOrderTotalAmount, seatId } = useContext(StoreContext);

    const sendOrderHandler = async () => {
        await addItemsToOrder(token);
        await fetchOrderDetails(token)
    }

    const onConfirmHandler = async () => {
        try {
            if (orderDetailData.length > 0) {
                clearState()
                navigate('/');
            }
            else {
                const response = await axios.post(`${BACKEND_URL}/api/inhouseorder/updateTableStatus`, { seat_id: seatId, availability: 1 }, { headers: { token } })
                if (response.status === 200) {
                    clearState()

                    navigate('/');
                    // window.location.reload();
                }
            }

        }
        catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error("Server error: ", error.message);
            }
        }

    }

    const closeConfirmPopupHandler = () => {
        setShowConfirmPopup(false);
    }

    return (
        <div className='cart'>
            <div className="cart-items">
                <h1 className='headings'>Items To Be Ordered</h1>
                <br /><br />
                <div className="cart-items-title">
                    <p></p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                </div>
                <br />
                <hr />
                {food_list.map((item, index) => {
                    if (cartItems[item.product_id] > 0) {
                        return (
                            <div key={index}>
                                <div className='cart-items-title cart-items-item'>
                                    {/* Directly use the 'image' prop as it's now the full GCS URL */}
                                    <img className='food' src={item.image} alt="" />
                                    <p>{item.product_name}</p>
                                    <p>{item.price}</p>
                                    <div id='food-item-counter' >
                                        <img onClick={() => removeFromCart(item.product_id)} src={assets.remove_icon_red} alt="" />
                                        <p>{cartItems[item.product_id]}</p>
                                        <img onClick={() => addToCart(item.product_id)} src={assets.add_icon_green} alt="" />
                                    </div>
                                    <p>{item.price * cartItems[item.product_id]} vnd</p>
                                </div>
                                <hr />
                            </div>
                        )
                    }
                })}
            </div>
            <div className="cart-bottom">
                <div className='cart-total'>
                    <div className="cart-total-detals">
                        <b>Total</b>
                        <b>{getCartTotalAmount()} vnd</b>
                    </div>
                    <button onClick={() => sendOrderHandler()}>Send Order</button>
                </div>
            </div>
            <br /><br /><br /><br /><br /><br /><hr /><br /><br /><br /><br /><br />
            <h1 className='headings'>Items Ordered</h1>
            <br /><br />
            <div className='order-detail'>
                {orderDetailData.map((item, index) => {
                    return (
                        <div key={index}>
                            <div className='cart-items-title cart-items-item'>
                                {/* Directly use the 'image' prop as it's now the full GCS URL */}
                                <img className='food' src={item.image} alt="" />
                                <p>{item.product_name}</p>
                                <p>{item.price}</p>
                                <p>{item.quantity}</p>
                                <p>{item.price * item.quantity} vnd</p>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
            <br /><br /><br /><br /><br />
            <div className="cart-bottom">
                <div className='cart-total'>
                    <div className="cart-total-detals">
                        <h2 className='headings'>Total Amount</h2>
                        <h2 className='headings'>{getOrderTotalAmount()} vnd</h2>
                    </div>
                    <button onClick={(() => setShowConfirmPopup(true))}>Confirm Payment</button>
                </div>
            </div>
            <br /><br /><br /><br /><br />
            {showConfirmPopup && (
                <ConfirmPopup
                    onConfirm={onConfirmHandler}
                    onClose={closeConfirmPopupHandler} />
            )}
        </div>
    )
}

export default Cart