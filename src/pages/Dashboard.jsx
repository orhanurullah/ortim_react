import {useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCurrentUser} from "../features/user/userSlice";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {logout} from "../features/auth/authSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { userInfo, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo && !loading) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch, userInfo, loading]);

    const handleLogout = async() => {
        try {
            const resultAction = await dispatch(logout());
            if (logout.fulfilled.match(resultAction)) {
                toast.success("Çıkış yapıldı!");
                navigate('/login');
            } else {
                toast.error(resultAction.payload?.message || "Çıkış yapılırken bir hata oluştu");
            }
        } catch (err) {
            toast.error("Logout işleminde bir hata oluştu");
        }
    };

    const handleFetchCurrentUser = () => {
        console.log("Kullanıcı bilgileri => ", userInfo);
    }
    if (loading) return <div className="container mt-5">Loading...</div>;

    return (
        <div className="container mt-5">
            <h2>Dashboard</h2>
            <h4>{userInfo?.name } {userInfo?.lastName}</h4>
            <h6>{userInfo?.email}</h6>
            <hr />
            <p>{userInfo?.username}</p>
            <h3>Roller</h3>
            <p>{userInfo?.roles?.join(",")}</p>
            <button onClick={handleFetchCurrentUser}>Kullanıcıyı Konsolda gör</button>
            <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
    );
}

export default Dashboard;
