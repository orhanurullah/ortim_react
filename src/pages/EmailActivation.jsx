import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate, useLocation, Link} from 'react-router-dom';
import { emailValidation, clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const EmailActivation = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isEmailValidated, emailActivationStatus } = useSelector(state => state.auth);

    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        const validateEmail = async() => {
            dispatch(clearError());
            if(!token){
                toast.error("Token bilgisi bulunamadı.");
                navigate("/email-activation-message");
                return;
            }
            try{
                const resultAction = await dispatch(emailValidation({ token }));
                if(emailValidation.fulfilled.match(resultAction)){
                    toast.success("Email başarıyla doğrulandı");
                    navigate("/login");
                }else if(emailValidation.rejected.match(resultAction)){
                    toast.error(resultAction.payload?.message || "Doğrulama başarısız");
                    navigate("/email-activation-message");
                }
            }catch (err){
                toast.error(err?.message || "Doğrulama işleminde bir hata oluştu");
                navigate("/email-activation-message");
            }
        }
        validateEmail();
    }, [dispatch, token, navigate]);

    if (loading) return <div className="container mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <h2><u>Email Aktivasyon Bilgilendirme</u></h2>
            {isEmailValidated ? (
                <div>
                    <div>{emailActivationStatus}</div>
                    <p>Kayıt olduğunuz için teşekkür ederiz. Aktivasyon işlemi tamamlandı.</p>
                    <hr />
                    <p>Uygulamaya giriş yapın</p>
                    <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>Giriş Yap</button>
                </div>
            ) : (
                <div>
                    <div>{emailActivationStatus}</div>
                    <p>Aktivasyon işlemi gerçekleşemedi.</p>
                    <p>Aktivasyon için belirlenen süreyi geçirdiyseniz mail içindeki tekrar mail gönder butonuna tıklayarak yeniden aktivasyon maili isteyin.</p>
                    <p>Mailinizi bulamazsanız veya mail silinmişse aşağıdaki butona tıklayarak yeniden aktivasyon maili alabileceğiniz sayfaya yönlendirilirsiniz.</p>
                    <Link to="/email-activation-message" className="btn btn-primary">Email Aktivasyon Sayfası</Link>
                </div>
            )}
            <hr />
            <div>
                <h2>Email Validation Page</h2>
                {error && (
                    <div className="alert alert-danger">
                        {typeof error === 'object' ? error.message : error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailActivation;
