import React, { useContext, useState } from 'react'
import './SignIn.css'
import { useNavigate} from 'react-router-dom';
import { BACKEND_URL } from '../../../config/constants'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const SignIn = () => {

    const { token, setToken, fetchAvailableTable } = useContext(StoreContext);

    const navigate = useNavigate();

    const [data, setData] = useState({
        username: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        if (name === "username" || name == "password") {
            const cleanedValue = value.replace(/\s/g, '');
            setData(prevData => ({ ...prevData, [name]: cleanedValue }));
        }
        else {
            setData(data => ({ ...data, [name]: value }));
        }

    }

    const onSignIn = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/api/user/adminSignIn`, data);

            if (response.status === 200) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                // localStorage.setItem("username", response.data.username);
                setData({
                    username: "",
                    password: ""
                });
                fetchAvailableTable(response.data.token);
                navigate('/');
            }
        }
        catch (error) {
            if (error.response) {
                if (error.response.data.message === "Invalid Username or Password") {
                    toast.error("Invalid Username or Password");
                }
            }
            else {
                toast.error("Server error, please try again later");
            }
        }

    }

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);

    return (

        <form className='signin-container' onSubmit={onSignIn}>
            <div className='signin'>
                <h1>Sign In</h1>
                <input name='username' onChange={onChangeHandler} value={data.username} type="text" placeholder='Username' />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' />
                <button type='submit'>Sign In</button>
            </div>

        </form>
    )
}

export default SignIn