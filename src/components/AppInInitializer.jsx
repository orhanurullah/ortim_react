import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeApi } from '../utils/api';
import { updateTokensFromLocalStorage } from '../features/auth/authSlice';

const AppInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        initializeApi(dispatch);

        dispatch(updateTokensFromLocalStorage());
    }, [dispatch]);

    return null;
};

export default AppInitializer;
