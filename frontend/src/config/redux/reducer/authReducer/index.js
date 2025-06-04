import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser,getAllUsers,getConnectionsRequest,getMyConnectionRequests } from "@/config/redux/action/authAction";

const initialState = {
  user: undefined, // changed from [] to null
  isError: false,
  isSuccess: false,
  isLoading: false, 
  isLoggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequests: [],
  all_Users: [], // to store all users fetched
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    setTokenIsThere:(state)=>{
      state.isTokenThere = true;
    },
  setTokenIsNotThere:(state)=>{
      state.isTokenThere = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.message = "login successful";
        state.user = action.payload; // assuming payload contains the user data
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      })

      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Registration successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed";
      })

      // Get About User (Fetch Profile)
   .addCase(getAboutUser.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isError = false;
  state.profileFetched = true;
  state.connections = action.payload.connections || [];
  state.connectionRequests = action.payload.connectionRequests || [];
  state.message = "Fetched user profile successfully";

  // Merge userId object with the other profile fields from root level
  state.user = {
    ...action.payload.userId,    // basic user info
    bio: action.payload.bio,     // bio at root level
    currentPost: action.payload.currentPost,
    pastWork: action.payload.pastWork || [],
    education: action.payload.education || [],
  };
})


   .addCase(getAllUsers.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isError = false;
  state.usersFetched = true;
  state.all_profiles_fetched = true;

  // Extract both user info and key profile fields
  state.allUsers = (action.payload.profiles || []).map(profile => ({
    ...profile.userId,            // flatten user data
    profileId: profile._id,       // keep profile _id if needed
    bio: profile.bio || '',       // optional profile fields
    skills: profile.skills || [],
    role: profile.userId.role || 'Member', // make sure role exists
  }));

  state.message = "Fetched all users successfully";
})

.addCase(getConnectionsRequest.fulfilled, (state, action) => {
  // Assuming payload shape: { connections: [...] }
  state.connections = action.payload.connections || [];
})

.addCase(getConnectionsRequest.rejected,(state,action)=>{
  state.message=action.payload
})
.addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
  state.connectionRequests=action.payload
  console.log(`FROM REDUCER STATE CONNECTIONS`,state.connectionRequest);
})
.addCase(getMyConnectionRequests.rejected,(state,action)=>{
  state.message=action.payload
})





  },
  
});

export const { reset, handleLoginUser,setTokenIsThere,setTokenIsNotThere } = authSlice.actions;
export default authSlice.reducer;
