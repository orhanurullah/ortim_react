import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {clearUser} from "../user/userSlice";

const initialState = {
    isAuthenticated: !!localStorage.getItem("accessToken"),
    accessToken: localStorage.getItem("accessToken") || null,
    email: null,
    isRequiredEmailValidation: false,
    message: null,
    loading: false,
    error: null,
    isActive: false,
    reSendEmail: false,
    isEmailValidated: false,
    emailActivationStatus: null,
};

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (registerData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', registerData);
            console.log(response);
            if(!response.data.success){
                return rejectWithValue(response.data);
            }
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if(!response.data.success){
                return rejectWithValue(response.data);
            }
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const emailValidation = createAsyncThunk('auth/emailValidation', async ({ token }, thunkAPI) => {
    try {
        const response = await api.post(`/auth/email-activation?token=${token}`);
        if(!response.data.success){
            return thunkAPI.rejectWithValue(response.data);
        }
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const resendActivationEmail = createAsyncThunk('auth/resendActivationEmail', async ({ email }, thunkAPI) => {
    try {
        const response = await api.post('/auth/re-email-activation', { email });
        if(!response.data.success){
            return thunkAPI.rejectWithValue(response.data);
        }
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch, rejectWithValue }) => {
    try {
        const response = await api.post('/user/logout');
        localStorage.removeItem("accessToken");
        if(!response.data.success){
            return rejectWithValue(response.data);
        }
        dispatch(clearUser());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);

    }
});

export const updateTokensFromLocalStorage = () => (dispatch) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        dispatch(updateToken({ accessToken }));
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateToken: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetEmailActivationStatus: (state) => {
            state.emailActivationStatus = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Registration
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.email = action.payload.data?.email;
                state.isRequiredEmailValidation = action.payload.data?.isRequiredEmailValidation;
                state.message = action.payload.message;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                state.message = null;
                state.isAuthenticated = false; // Ensure isAuthenticated is false
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.accessToken = action.payload.data.accessToken;
                localStorage.setItem('accessToken', state.accessToken);
                state.isActive = action.payload.data.isActive;
                state.email = action.payload.data.email;
                state.message = action.payload.message;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.message = null;
                state.error = action.payload?.message;
                state.isActive = action.payload?.data?.isActive;
                state.email = action.payload?.data?.email;
                state.isAuthenticated = false; // Ensure isAuthenticated is false
            })
            .addCase(emailValidation.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.emailActivationStatus = null;
            })
            .addCase(emailValidation.fulfilled, (state, action) => {
                state.loading = false;
                state.isEmailValidated = true;
                state.message = action.payload?.message;
                state.emailActivationStatus = action.payload?.message;
            })
            .addCase(emailValidation.rejected, (state, action) => {
                state.loading = false;
                state.message = null;
                state.emailActivationStatus = action.payload?.message;
                state.error = action.payload?.message;
                state.isAuthenticated = false; // Ensure isAuthenticated is false
            })
            .addCase(resendActivationEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.emailActivationStatus = null;
            })
            .addCase(resendActivationEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                state.emailActivationStatus = action.payload.message;
                state.reSendEmail = true;
            })
            .addCase(resendActivationEmail.rejected, (state, action) => {
                state.loading = false;
                state.emailActivationStatus = action.payload.message;
                state.error = action.payload.message;
                state.message = null;
                state.isAuthenticated = false; // Ensure isAuthenticated is false
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.message = action.payload?.message;
                state.error = null;
                state.email = null;
                state.isActive = false;
                state.reSendEmail = false;
                state.isEmailValidated = false;
                state.emailActivationStatus = null;
                state.isRequiredEmailValidation = false;
                localStorage.removeItem('accessToken');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                state.message = null;
                localStorage.removeItem('accessToken');
            });
    },
});

export const { updateToken, clearError, resetEmailActivationStatus } = authSlice.actions;
export default authSlice.reducer;
