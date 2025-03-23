import {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmailActivation from './pages/EmailActivation';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import EmailActivationMessage from "./pages/EmailActivationMessage";
import PrivateRoute from "./components/PrivateRoute";
import { updateTokensFromLocalStorage } from './features/auth/authSlice';
import {initializeApi} from "./utils/api";
import Profile from "./pages/Profile";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        initializeApi(dispatch);
        dispatch(updateTokensFromLocalStorage());
    }, [dispatch]);
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} zIndex={9999} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/email-activation" element={<EmailActivation />} />
                <Route path="/email-activation-message" element={<EmailActivationMessage />} />

                {/* Tüm private route'ları tek bir PrivateRoute altında topla */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* 404 sayfası ekle */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;