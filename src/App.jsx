import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ScrollToTop from './context/ScrollToTop'
import 'react-toastify/ReactToastify.css'
import DefaultRoute from './components/DefaultRoute/DefaultRoute'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Navbar from './components/Navbar/Navbar.jsx'
import SignIn from './pages/SignIn/SignIn'
import Menu from './pages/Menu/Menu'
import NewOrder from './pages/NewOrder/NewOrder'
import Cart from './pages/Cart/Cart'

const App = () => {
    return (
        <div className='app'>
            <ToastContainer />
            <ScrollToTop />
            <Navbar />
            <Routes>
                <Route path='/' element={<ProtectedRoute><NewOrder /></ProtectedRoute>} />
                <Route path='/signIn' element={<SignIn />} />
                <Route path='/menu' element={<ProtectedRoute><Menu /></ProtectedRoute>} />
                <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="*" element={<DefaultRoute></DefaultRoute>} />
            </Routes>

        </div>
    )
}

export default App
