import React, { useContext } from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const Navbar = () => {

    const navigate = useNavigate();

    const { getCartTotalAmount, token, setToken, menu, orderId } = useContext(StoreContext);

    const onSignOutClickHandler = () => {
        setToken("");
        localStorage.removeItem("token");
        navigate('/signIn');
        window.location.reload();
    }

    return (
        <div className='navbar'>
            <Link to={!token ? '/signIn' : '/'}><div className='logo'>
                <img src={assets.restaurant_logo} alt="logo" />
                <p>A Hundred Tastes</p>
            </div></Link>
            {
                token && orderId
                    ? <>
                        <ul className='navbar-menu'>
                            <Link to='/menu' className={menu === "Menu" ? "active" : "inactive"}>Menu</Link>
                        </ul>
                        {/* <div className="navbar-right">
                            <button onClick={onSignOutClickHandler}>Sign Out</button>
                        </div> */}
                    </>
                    : <></>
            }
            <div className="navbar-right">
                <div className="navbar-basket-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getCartTotalAmount() ? "dot" : ""}></div>
                </div>
                {!orderId && token
                    ?<button onClick={() => onSignOutClickHandler()}>Sign Out</button>
                    :<></>
                }
            </div>

        </div>
    )
}


export default Navbar