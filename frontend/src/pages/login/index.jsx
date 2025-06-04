// import UserLayout from '@/layout/userLayout';
// import React, { useEffect ,useState} from 'react'
// import { useSelector,useDispatch } from 'react-redux';
// import { useRouter } from 'next/router';
// import  styles from "./styles.module.css"
// import { loginUser,registerUser} from '@/config/redux/action/authAction';


// function LoginComponent() {

// const authState=useSelector((state)=>state.auth)
// const router=useRouter();
// const dispatch=useDispatch();

// const [isLoginMethod, setIsLoginMethod] = useState(false);
// const [userLoginMethod, setUserLoginMethod] = useState(false);
// const [email, setEmailAddress] = useState("");
// const [password, setPassword] = useState("");
// const [name, setName] = useState("");
// const [username, setUsername] = useState("");


// useEffect(()=>{
// if(authState.loggedIn){
//   router.push("/dashboard")
// }

// },[authState.loggedIn])

// const handleRegister = () => {
//   console.log("registering");
//   dispatch(registerUser({ username, email, password, name })).then((response) => {
//     if (registerUser.fulfilled.match(response)) {
//       router.push("/dashboard");
//     } else if (registerUser.rejected.match(response)) {
//       console.log("Registration error:", response.payload?.message);
//     }
//   });
// };


//   return (
//    <UserLayout>
   
//     <div className={styles.container}>
//     <div className={styles.cardContainer }>
//       <div className={styles.cardContainer_left}>
//         <p className={styles.cardleft_heading}> {userLoginMethod ? "Sign In": "Sign Up"}  
//         </p>
//         <p style={{color:authState.isError?"red":"green"}}>{authState.message}</p>
//         <div className={styles.inputContainers}>
//           <div className={styles.inputRow}>
//           <input onChange={(e)=>setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username" />
//           <input onChange={(e)=>setName(e.target.value)} className={styles.inputField} type="text" placeholder="Name" />
//           </div>
//           <input onChange={(e)=>setEmailAddress(e.target.value)} className={styles.inputField} type="text" placeholder="email" />
//           <input  onChange={(e)=>setPassword(e.target.value)} className={styles.inputField} type="password" placeholder="password" />
//              <div onClick={()=>{
//                if(userLoginMethod){

//                }else{
//                 handleRegister();
//                }
//              }} className={styles.buttonWithOutline}>
//               <p>{ isLoginMethod? "Sign In ":"Sign Up"}</p>
//              </div>

//         </div>
        
//       </div>
//       <div className={styles.cardContainer_right}> </div>
//     </div>
//     </div>
//    </UserLayout>
//   )
// }

// export default LoginComponent;

import UserLayout from '@/layout/userLayout';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styles from "./styles.module.css";
import { loginUser, registerUser } from '@/config/redux/action/authAction';

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoginMethod, setIsLoginMethod] = useState(true); // true = login, false = signup
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  const handleRegister = () => {
    dispatch(registerUser({ username, email, password, name })).then((response) => {
      if (registerUser.fulfilled.match(response)) {
        router.push("/dashboard");
      } else if (registerUser.rejected.match(response)) {
        console.log("Registration error:", response.payload?.message);
      }
    });
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password })).then((response) => {
      if (loginUser.fulfilled.match(response)) {
        router.push("/dashboard");
      } else if (loginUser.rejected.match(response)) {
        console.log("Login error:", response.payload?.message);
      }
    });
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>
              {isLoginMethod ? "Sign In" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>
            <div className={styles.inputContainers}>
              {!isLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}
              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="text"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
              />
              <div
                onClick={() => {
                  isLoginMethod ? handleLogin() : handleRegister();
                }}
                className={styles.buttonWithOutline}
              >
                <p>{isLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
              <p
                style={{ marginTop: "1rem", cursor: "pointer", color: "#555" }}
                onClick={() => setIsLoginMethod(!isLoginMethod)}
              >
                {isLoginMethod
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </p>
            </div>
          </div>
          <div className={styles.cardContainer_right}></div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
