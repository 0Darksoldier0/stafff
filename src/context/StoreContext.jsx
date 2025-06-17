import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../../config/constants";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const location = useLocation();

    const [menu, setMenu] = useState(() => {
        const savedMenu = localStorage.getItem("currentMenu");
        return savedMenu ? savedMenu : "";
    });

    const [token, setToken] = useState("");
    const [orderId, setOrderId] = useState("");
    const [orderDetailData, setOrderDetailData] = useState([]);
    const [seatId, setSeatId] = useState();

    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [availTableList, setAvailTableList] = useState([]);


    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/product/listavailable`);
            if (response.status === 200) {
                setFoodList(response.data.products);
            }
        }
        catch (error) {
            if (error.response) {
                console.error("(FetchFoodList-StoreContext) " + error.response.data.message);
            }
            else {
                console.error("(FetchFoodList-StoreContext) Server error");
            }
        }

    }

    const addToCart = async (product_id) => {
        if (!cartItems[product_id]) {
            setCartItems((prev) => ({ ...prev, [product_id]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [product_id]: prev[product_id] + 1 }));
        }
    }

    const removeFromCart = async (product_id) => {
        setCartItems((prev) => ({ ...prev, [product_id]: prev[product_id] - 1 }))
    }

    const getCartTotalAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product.product_id === Number(item));

                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchAvailableTable = async (token) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/inhouseorder/getTable`, {}, { headers: { token } });

            if (response.status === 200) {
                setAvailTableList(response.data.tables);
            }
        }
        catch (error) {
            if (error.response) {
                console.error(error.response.data.message)
            }
            else {
                console.error("Server error")
            }
        }
    }

    const addItemsToOrder = async (token) => {
        try {
            if (getCartTotalAmount() > 0) {
                let orderItems = [];
                food_list.map((item) => {
                    if (cartItems[String(item.product_id)] > 0) {
                        let itemInfo = item;
                        itemInfo["quantity"] = cartItems[String(item.product_id)];
                        orderItems.push(itemInfo);
                    }
                })
                const response = await axios.post(`${BACKEND_URL}/api/inhouseorder/addItems`, { cartItems: orderItems, order_id: localStorage.getItem("orderId") }, { headers: { token } });
                setCartItems({});
                toast.success("Order sent")
            }
            else {
                toast.error('No Items In Cart');
            }
        }
        catch (error) {
            if (error.response) {
                console.error("(AddItemsToOrder) " + error.response.data.message)
            }
            else {
                console.error("(AddItemsToOrder) Server error")
            }
        }
    }

    const fetchOrderDetails = async (token) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/inhouseorder/getDetails`, { order_id: localStorage.getItem("orderId") }, { headers: { token } });
            if (response.status === 200) {
                setOrderDetailData(response.data.order_details);
            }
        }
        catch (error) {
            if (error.response) {
                console.error("(fetchOrderDetails) " + error.response.data.message)
            }
            else {
                console.error("(fetchOrderDetails) Server error")
            }
        }
    }

    const fetchOrderData = async (token) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/inhouseorder/getOrderData`, { order_id: localStorage.getItem("orderId") }, { headers: { token } });
            if (response.status === 200) {
                setSeatId(response.data.orderData[0].seat_id)
            }
        }
        catch (error) {
            if (error.response) {
                console.error("(FetchOrderData) " + error.response.data.message)
            }
            else {
                console.error("(FetchOrderData) Server error")
            }
        }
    }

    const getOrderTotalAmount = () => {
        let orderTotal = 0;
        for (let i = 0; i < orderDetailData.length; i++) {
            orderTotal += orderDetailData[i].price * orderDetailData[i].quantity;

        }
        return orderTotal
    }

    // const getTableAvailability = async (token) => {
    //     try {
    //         const response = await axios.post(`${BACKEND_URL}/api/inhouseorder/getSeatAvail`, {seat_id: localStorage.getItem("seatId")}, {headers: {token}})
    //         return response.data.avail
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    // }

    const clearState = () => {
        setOrderId("")
        setOrderDetailData([])
        setSeatId("")
        setCartItems({})
        localStorage.removeItem("orderId");
        localStorage.removeItem("seatId");
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                if (localStorage.getItem("orderId")) {
                    setOrderId(localStorage.getItem("orderId"));
                    fetchOrderDetails(localStorage.getItem("token"))
                    fetchOrderData(localStorage.getItem("token"))
                }
                if (localStorage.getItem("seatId")) {
                    setSeatId(localStorage.getItem("seatId"))
                }
                setToken(localStorage.getItem("token"));
                await fetchAvailableTable(localStorage.getItem("token"))
            }
        }
        loadData();

        const intervalId = setInterval(async () => {
            await fetchFoodList()
            if (localStorage.getItem("orderId")) {
                fetchOrderDetails(localStorage.getItem("token"))
            }
            else {
                if (localStorage.getItem("token")) {
                    await fetchAvailableTable(localStorage.getItem("token"));
                }
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [])


    useEffect(() => {
        localStorage.setItem("currentMenu", menu);
    }, [menu]);

    useEffect(() => {
        const path = location.pathname;
        let newMenu = "";

        if (path === '/menu') {
            newMenu = "Menu";
        }
        else {
            newMenu = "";
        }

        if (newMenu !== menu) {
            setMenu(newMenu);
        }
    }, [location.pathname]);


    const contextValue = {
        menu,
        token,
        setToken,

        fetchFoodList,
        food_list,

        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getCartTotalAmount,

        availTableList,
        fetchAvailableTable,

        fetchOrderData,

        setSeatId,

        orderId,
        setOrderId,
        addItemsToOrder,
        orderDetailData,
        fetchOrderDetails,
        getOrderTotalAmount,
        seatId,

        clearState
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider