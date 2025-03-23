import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, thunkAPI) => {
      try {
         const response = await api.get('/user/current-user');
        console.log("FetchCurrentUser response => ", response);
        return response.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || 'Kullanıcı bilgisi alınamadı.');
      }
    }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/profile', updatedData, { params: { userId } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data || 'Error updating profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.userInfo = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload.data;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Kullanıcı bulunamadı';
    });
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
