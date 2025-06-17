import React, { useContext, useEffect, useState } from 'react'
import './NewOrder.css'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { BACKEND_URL } from '../../../config/constants'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const NewOrder = () => {

    const { token, availTableList, orderId, setOrderId, fetchOrderData, setSeatId } = useContext(StoreContext);
    const [selectedTable, setSelectedTable] = useState("Select");
    const [customerName, setCustomerName] = useState("");
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        if (event.target.name === "table") {
            setSelectedTable(event.target.value);
        }
        else if (event.target.name === "customer_name") {
            setCustomerName(event.target.value);
        }

    }

    const onCreateOrderHandler = async (event) => {
        event.preventDefault();

        if (selectedTable === "Select") {
            toast.error("Please input valid data");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/inhouseorder/createOrder`, { seat_id: selectedTable, customer_name: customerName }, { headers: { token } });
            if (response.status === 200) {
                await axios.post(`${BACKEND_URL}/api/inhouseorder/updateTableStatus`, { seat_id: selectedTable, availability: 0 }, { headers: { token } });
                setOrderId(response.data.order_id)
                localStorage.setItem("orderId", response.data.order_id);   
                
                await fetchOrderData(token);
                setSeatId(selectedTable);
                localStorage.setItem("seatId", selectedTable);

                navigate('/menu');
            }
        }
        catch (error) {
            if (error.response) {
                toast.error(error.response.data.message)
            }
            else {
                toast.error("Server error");
            }
        }
    }

    useEffect(() => {
        if (orderId) {
            navigate('/menu');
        }
    }, [orderId])

    return (
        <div className='new-order-container'>
            <form className='new-order' onSubmit={onCreateOrderHandler}>
                <h1>Create New Order</h1>
                <div>
                    <h3>Select Table</h3>
                    <select name="table" id="" onChange={onChangeHandler}>
                        <option value={"Select"}>Select</option>
                        {availTableList.map((item, index) => {
                            return (
                                <option value={item.seat_id} key={index}>Table {item.seat_id}</option>
                            )
                        })}
                    </select>
                </div>
                <div>
                    <h3>Customer Name</h3>
                    <input name="customer_name" value={customerName} onChange={onChangeHandler} type="text" placeholder='e.g. manh nghia' required/>
                </div>
                <button type='submit'>Create Order</button>
            </form>

        </div>
    )
}

export default NewOrder
