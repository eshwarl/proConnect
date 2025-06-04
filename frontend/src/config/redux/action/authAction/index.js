import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser=createAsyncThunk(
    "user/login",
    async(user,thunkAPI)=>{
        try{
          const response=await clientServer.post("/login",{
             email: user.email,
             password: user.password
          });
          if(response.data.token){
            localStorage.setItem("token",response.data.token) 
           
          }else{
            return thunkAPI.rejectWithValue({
                message:"token not provided"
          })
          }
          return thunkAPI.fulfillWithValue(response.data.token)
         
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data)

        }

    }
)







// export const registerUser=createAsyncThunk(
//   "user/register",
//   async(user,thunkAPI)=>{
//         try{
//             const response=await clientServer.post("/register",{
//               username: user.username,
//              email: user.email,
//              password: user.password,
//               name: user.name
             
//             });
//             if(response.data.token){
//             localStorage.setItem("token",response.data.token) 
             
//             }else{
//             return thunkAPI.rejectWithValue({
//                 message:"token not provided"
//             })
//             }
//             return thunkAPI.fulfillWithValue(response.data.token)
         
//         }catch(error){
//             return thunkAPI.rejectWithValue(error.response.data)
    
//         }

//   }  
// )
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        email: user.email,
        password: user.password,
        name: user.name
      });

      if (!response.data.token) {
        return thunkAPI.rejectWithValue({
          message: response.data.message || "Token not provided"
        });
      }

      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// getAboutUser Thunk (authAction.js)
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async ({ token }, thunkAPI) => {
    try {
      // Send the token in the Authorization header
      const response = await clientServer.get("get_user_and_profile", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      return response.data;  // Return the entire response data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Reject with error response
    }
  }
);

// getAllUsers Thunk (authAction.js)

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async ({ token }, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/get_all_users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching users");
    }
  }
);


// Send connection request
// export const sendConnectionRequest = createAsyncThunk(
//   "user/sendConnectionRequest",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.post("/user/send_connection_request", {
//         token:user.token,
//         connectionId:user.user_id
//       });
//       thunkAPI.dispatch(getConnectionsRequest({ token: user.token })); // Refresh connection requests after sending

//       return thunkAPI.fulfillWithValue(response.data);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//        error.response.data.message
//       );
//     }
//   }
// );

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,        // send token in body
          connectionId: user.user_id,
        }
      );

      thunkAPI.dispatch(getConnectionsRequest({ token: user.token })); // Refresh connections
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send connection request"
      );
    }
  }
);




export  const getConnectionsRequest= createAsyncThunk(
  "user/getConnectionsRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/getConnectionsRequests", {
        params: {
         token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching connection requests" }
      );
    }
  }
);


export const getMyConnectionRequests= createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/user_connection_request", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error fetching my connection requests" }
      );
    }
  }
);

export const AcceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async ( user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/accept_connection_request", {
        token: user.token,
        requestId: user.connectionId,
        action_type:user.action
      });
       thunkAPI.dispatch(getConnectionsRequest({token:token}))
       thunkAPI.dispatch(getMyConnectionRequests({token:user.token}))
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Error accepting connection request" }
      );
    }
  }
);

