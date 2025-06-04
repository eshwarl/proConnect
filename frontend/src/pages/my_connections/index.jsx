import { User } from 'lucide-react'
import UserLayout from '@/layout/userLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react'
import React from 'react'
import { getMyConnectionRequests, AcceptConnection } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from './index.module.css'
import { useRouter } from 'next/router';



function myConnections() {


const dispatch=useDispatch(); 
const authState=useSelector((state)=>state.auth);

useEffect(()=>{
  dispatch(getMyConnectionRequests({token:localStorage.getItem('token')}));

},[]);
const router=useRouter();

useEffect(()=>{
if(authState.connectionRequest !=0){
    console.log(authState.connectionRequest);
  }
},[authState.connectionRequest])









  return (
    <UserLayout>
        <DashboardLayout>   
<div>
        <h1>My Connections</h1>



{authState.connectionRequests.length !=0 && authState.connectionRequests.filter((connection)=>connection.status_accepted=== null).map((user, index)=>{
  return(
    
    
    <div onClick={()=>{
  router.push(`/view_profile/${user.userId.username}`)
    }} className={styles.userCard} key={user._id || index}>
      <div styles={{display:"flex",alignItems:'center',gap:"1.2rem"}}>
        <div className={styles.profilePicture}>
<img
  src={
    user.userId?.profilePicture
      ? `${BASE_URL}/uploads/${user.userId.profilePicture}`
      : '/default.jpg' // fallback if missing
  }style={{ width: '61px', height: '60px', borderRadius: '50%' }}
  alt="User Profile"

/>
</div>

        <div className={styles.userInfo}>
          <h3>{user.userId.name}</h3>
          <p>{user.userId.username}</p>
        </div>
        <button onClick={(e)=>{
          e.stopPropagation();
          dispatch(AcceptConnection({
            connectionId:user._id,
            token:localStorage.getItem("token"),
            action:"accept"
          }))
        }} className={styles.connectButton}>Accept</button>
       
      </div>
    </div>
      

      

   
  )
})}


<h4>My Network</h4>

{authState.connectionRequests.length !== 0 &&
  authState.connectionRequests
    .filter((connection) => connection.status_accepted !== null)
    .map((user, index) => {
     
      return(
        <div
        onClick={() => {
          router.push(`/view_profile/${user.userId.username}`);
        }}
        className={styles.userCard}
        key={user._id || index}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
          <div className={styles.profilePicture}>
            <img
              src={
                user.userId?.profilePicture
                  ? `${BASE_URL}/uploads/${user.userId.profilePicture}`
                  : "/default.jpg"
              }
              alt="User Profile"
              style={{ width: "61px", height: "60px", borderRadius: "50%" }}
            />
          </div>

          <div className={styles.userInfo}>
            <h3>{user.userId.name}</h3>
            <p>{user.userId.username}</p>
          </div>

          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                acceptConnectionRequest({
                  conectionId: user._id,
                  token: localStorage.getItem("token"),
                  action: "accept",
                })
              );
            }}
            className={styles.connectButton}
          >
            Accept
          </button> */}
        </div>
        
      </div>
      )
      
})}


</div>
</DashboardLayout>


    </UserLayout>
  )
}

export default myConnections

