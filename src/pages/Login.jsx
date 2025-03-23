import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {clearError, loginUser} from '../features/auth/authSlice';
import FormInput from "../components/FormInput";
import { toast } from "react-toastify";
import {Link, useNavigate} from "react-router-dom";

function Login () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, email, isRequiredEmailValidation, message } = useSelector((state) => state.auth);
    const [form, setForm] = useState({ email: '', password: '' });

    useEffect(() => {
        if (error) {
            const sanitizedError = typeof error === 'object' ? 'An error occurred. Please try again.' : error;
            toast.error(sanitizedError);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());
        if (!form.email || !form.password) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            const result = await dispatch(loginUser(form));
            if (loginUser.fulfilled.match(result)) {
                toast.success(message || "Login işlemi başarıyla gerçekleştir");
                navigate("/dashboard");
            } else if (loginUser.rejected.match(result)) {
                if(email && isRequiredEmailValidation){
                    toast.error("Email doğrulaması yapmadığınız için giriş yapamazsınız. Lütfen emailinizi kontrol edin.");
                    navigate('/email-activation-message');
                }else{
                    toast.error(error);
                }
            }
        } catch (err) {
            toast.error('Giriş işleminde bilinmeyen bir hata oluştu. Daha sonra tekrar deneyin!');        }
    };

    return (
        <div className="card shadow">
            <div className="card-body">
                <h2 className="card-title">Login</h2>
            <form onSubmit={handleSubmit}>
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                {error && (
                    <div className="alert alert-danger">
                        {typeof error === 'object' ? error.message : error}
                    </div>
                )}
                <button disabled={loading}>
                    {loading ? <div className="spinner-border" /> : 'Giriş Yap'}
                </button>
                <hr />
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
        </div>
    );
};

export default Login;
