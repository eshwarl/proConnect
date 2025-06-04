import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, createPost, deletePost} from "@/config/redux/action/postAction";
import { increamentPostLike,getAllComments,postComment } from "@/config/redux/action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "fetching all Posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.message = "fetched all posts successfully";
        state.posts = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to fetch posts";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.post);
        state.message = "Post created";
      })
      // deletePost cases:
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.message = "Deleting post...";
        state.isError = false;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message || "Post deleted successfully";
        // Remove deleted post from posts array by filtering
        // Assuming your backend response doesn't return deleted postId,
        // you may want to get it from action.meta.arg (the thunk argument)
        const deletedPostId = action.meta.arg.postId;
        state.posts = state.posts.filter(post => post._id !== deletedPostId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to delete post";
      })
       .addCase(increamentPostLike.pending, (state) => {
      state.message = "Liking post...";
    })
    .addCase(increamentPostLike.fulfilled, (state, action) => {
      state.message = "Post liked successfully";
      const updatedPost = action.payload.post; // Make sure your backend returns the updated post
      const index = state.posts.findIndex(p => p._id === updatedPost._id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    })
    .addCase(increamentPostLike.rejected, (state, action) => {
      state.isError = true;
      state.message = action.payload?.message || "Failed to like post";
    })
    .addCase(getAllComments.pending, (state) => {
    state.message = "Fetching comments...";
  })
  .addCase(getAllComments.fulfilled, (state, action) => {
    state.comments = action.payload.comments;
    state.postId = action.payload.post_id;
    state.message = "Comments fetched successfully";
    console.log(state.comments);
  })
  .addCase(getAllComments.rejected, (state, action) => {
    state.isError = true;
    state.message = action.payload?.message || "Failed to fetch comments";
  })
  .addCase(postComment.pending, (state) => {
  state.isLoading = true;
  state.message = "Posting comment...";
})
.addCase(postComment.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isError = false;
  state.message = "Comment posted successfully";
  // You can optionally push the new comment to state.comments here
  // e.g., state.comments.push(action.payload.comment);
})
.addCase(postComment.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload || "Failed to post comment";
});

  },
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;
