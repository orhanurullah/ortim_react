import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {resendActivationEmail} from "../features/auth/authSlice";

const EmailActivationMessage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {emailActivationStatus, isEmailValidated, isRequiredEmailValidation, reSendEmail, email} = useSelector(state => state.auth);

    if(!isRequiredEmailValidation) return <Navigate to={"/login"} replace />

    const handleResendEmail = async () => {
        if (!email) {
            toast.error('Email bilgisi bulunamadı.');
            navigate("/login");
            return;
        }
        try {
            const result = await dispatch(resendActivationEmail({ email }));
            if (resendActivationEmail.fulfilled.match(result)) {
                toast.success(`${email} adresine Aktivasyon maili yeniden gönderildi. Mail adresinizi kontrol edin`);
            } else if (resendActivationEmail.rejected.match(result)) {
                toast.error(result.payload?.message || "Aktivasyon mail gönderilirken bir hata oluştu");
            }
        } catch (e) {
            toast.error('Aktivasyon maili gönderilirken bilinmeyen bir hata oluştu.');
        }
    };

    return (
        <div className="container mt-5">
            <h2><u>Email Aktivasyon Bilgilendirme</u></h2>
            { isEmailValidated ?
                <div>
                    <div>{emailActivationStatus}</div>
                    <p>Kayıt olduğunuz için teşekkür ederiz.
                    Aktivasyon işlemi başarılı. </p>
                </div>

                :
                <div>
                    <div>{emailActivationStatus}</div>
                    <p>Aktivasyon için mail adresinizi kontrol edin.</p>
                    <p>Aktivasyon için belirlenen süreyi geçirdiyseniz mail içindeki tekrar mail gönder butonuna tıklayarak yeniden aktivasyon maili isteyin.</p>
                     <p>Mailinizi bulamazsanız veya mail silinmişse aşağıdaki butondan yeniden aktivasyon maili alabilirsiniz.</p>
                </div>
            }
            <hr />
            <button id="re-email" type="button" className="btn btn-primary" onClick={handleResendEmail}>
                {reSendEmail ? "Yeni Email Gönderildi" : "Yeniden Aktivasyon Maili Al"}
            </button>
            <p>Mail sınırlamanız olduğunu hatırlatmak isteriz.</p>
            <hr />
            <p>Aktivasyon işleminiz tamamlandıysa login işlemine geçmelisiniz.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>Giriş Yap</button>
        </div>
    );
};

export default EmailActivationMessage;
