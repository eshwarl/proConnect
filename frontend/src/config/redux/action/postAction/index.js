import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

// Fetch all posts
export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      // Return only the posts array from response.data
      return thunkAPI.fulfillWithValue(response.data.posts);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Create a new post
export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'));
      formData.append('body', body);
      if (file) formData.append('media', file);

      const response = await clientServer.post("/post", formData); // No manual content-type header needed for multipart

      return thunkAPI.fulfillWithValue(response.data); // Make sure response.data includes the post
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Add deletePost thunk here if needed

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ postId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      // Optionally: set token in headers if your backend expects that
      const response = await clientServer.post(
        "/delete_post",
        { token,postId },
        
      );

      return response.data;  // return response data directly
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const increamentPostLike = createAsyncThunk(
  "post/increamentLike",
  async (postId, thunkAPI) => {
    try {
      const response = await clientServer.post("/increament_post_like", {
        post_id: postId,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_comments", {
        params: {
          post_id: postData.post_id,
        },
      });

      const { comments } = response.data;

      return thunkAPI.fulfillWithValue({
        comments,
        post_id: postData.post_id,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);



export const postComment = createAsyncThunk(
  'post/postComment',
  async (commentData, thunkAPI) => {
    try {
      const response = await clientServer.post('/comment', {
        token: localStorage.getItem('token'),
        postId: commentData.post_id,  // changed to postId to match backend
        commentBody: commentData.body,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
        console.error("Thunk error", error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);





