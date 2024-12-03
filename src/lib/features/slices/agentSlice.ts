import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import axiosClient from '@/lib/axios';

// 定义问答接口返回类型
interface ChatResponse {
  id?: string | null;
  code?: number | null;
  msg?: string | null;
  done?: boolean;
  append?: any;
  sessionId?: string | null;
  intent?: string;
  success: boolean;
  data?: any;
}

// 定义错误类型
interface FetchError {
  message: string;
}

// 问答接口
export const getChatResponse = createAsyncThunk<ChatResponse, { inputContent: string, sessionId?: string | null }, { rejectValue: FetchError }>(
  'chat/getChatResponse',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/chatBot/qa', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      // 使用 rejectWithValue 来返回错误信息
      return rejectWithValue({ message: error.response.data });
    }
  }
);

// 上报接口
export const pushChat = createAsyncThunk<ChatResponse, { inputContent: string, sessionId?: string | null }, { rejectValue: FetchError }>(
  'chat/pushChat',
  // @ts-ignore
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/chatRecord/push', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
  } catch (error: any) {
      // 使用 rejectWithValue 来返回错误信息
      return rejectWithValue({ message: error.response.data });
    }
  }
)

const initialState = {
  chatResponse: {},
  status: '',
  error: null as FetchError | null,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ... 可以添加其他同步reducers
    setChatResponse: (state, action) => {
      return action.payload;
    },
  },
  // 定义异步的reducers
  extraReducers: (builder) => {
    builder
      .addCase(getChatResponse.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getChatResponse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatResponse = action.payload;
      })
      .addCase(getChatResponse.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload;
        }
      });
  },
});

// 导出reducer
export default chatSlice.reducer;

// 导出actions
export const { setChatResponse } = chatSlice.actions;
