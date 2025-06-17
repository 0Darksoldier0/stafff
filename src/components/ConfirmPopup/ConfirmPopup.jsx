import React from 'react'
import './ConfirmPopup.css'
import { toast } from 'react-toastify'
import { useState } from 'react'

const ConfirmPopup = ({onConfirm, onClose}) => {

    const [data, setData] = useState({
        password: ""
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        if (name === "password" ) {
            const cleanedValue = value.replace(/\s/g, '');
            setData(prevData => ({ ...prevData, [name]: cleanedValue }));
        }
        else {
            setData(data => ({ ...data, [name]: value }));
        }
    }

    const onConfirmHandler = () => {
        if (data.password === "confirm") {
            onConfirm();
        }
        else {
            toast.error("Invalid password");
        }
    }

    return (
        <div className='confirm-popup-wrapper' onClick={onClose}>
            <div className='confirm-popup' onClick={e => e.stopPropagation()}>
                <h2>Confirm Payment From Customer? </h2>
                <input type="password" name="password" value={data.password} onChange={onChangeHandler} placeholder='password'/>
                <button className='confirm-btn' onClick={onConfirmHandler}>Confirm</button>
                <br /><br />
                <button className='cancel-btn' onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
} 


export default ConfirmPopup
