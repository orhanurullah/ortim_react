import React from 'react';
import {useSelector} from "react-redux";

const Profile = () => {

    const { userInfo } = useSelector((state) => state.user);



    return (
        <div>
            <h2>Profile</h2>
            <p>{userInfo?.email} profile sayfası</p>
            <p>{userInfo?.username}</p>
        </div>
    );
};

export default Profile;
