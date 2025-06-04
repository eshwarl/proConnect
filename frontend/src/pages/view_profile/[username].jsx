import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clientServer, BASE_URL } from '@/config';
import UserLayout from '@/layout/userLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import Styles from './index.module.css';
import {
  sendConnectionRequest,
  getConnectionsRequest,
  getMyConnectionRequests

  
} from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';

export default function ViewProfilePage({ userProfile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // IMPORTANT: adjust selector key if your slice is registered as 'auth'
  const authState = useSelector((state) => state.auth); 
  const postReducer = useSelector((state) => state.postReducer);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  // Fetch posts and connections on mount
  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
  };

  useEffect(() => {
    getUsersPost();
  }, []);

  useEffect(() => {
    let post=postReducer.posts.filter((post)=>{
      return post.username === router.username

    })
    setUserPosts(post);
  }, [postReducer.posts]);

 useEffect(() => {
  if (!userProfile?.userId || !authState) return;

  // Check if user is connected (accepted)
  const connection = authState.connections.find(
    (conn) => conn.connectionId._id === userProfile.userId._id
  );

  if (connection) {
    setIsCurrentUserInConnection(true);
    setIsConnectionNull(!connection.status_accepted); // pending if not accepted
    return;
  }

  // Check if there's a pending connection request to this user
  const request = authState.connectionRequests.find(
    (req) => req.userId._id === userProfile.userId._id
  );

  if (request) {
    setIsCurrentUserInConnection(true);
    setIsConnectionNull(!request.status_accepted); // pending if not accepted
    return;
  }

  // No connection or requests found
  setIsCurrentUserInConnection(false);
  setIsConnectionNull(true);
}, [authState.connections, authState.connectionRequests, userProfile]);


 // safer dependency array

//  useEffect(() => {
//   if (!userProfile?.userId || !authState?.connections) return;

//   const connection = authState.connections.find(
//     (user) => user.connectionId._id === userProfile.userId._id
//   );

//   if (connection) {
//     setIsCurrentUserInConnection(true);
//     setIsConnectionNull(!connection.status_accepted); // true if pending
//   } else {
//     setIsCurrentUserInConnection(false);
//     setIsConnectionNull(true); // assume no connection means pending
//   }
// }, [authState.connections, userProfile]);




  return (
    <UserLayout>
      <DashboardLayout>
        <div className={Styles.container}>
          <div className={Styles.backdropContainer}></div>

          <img
            className={Styles.profilePicture}
            src={`${BASE_URL}/uploads/${userProfile?.userId?.profilePicture}`}
            alt="Profile"
          />

          <div className={Styles.profileContainer__details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  <h2>{userProfile?.userId?.name}</h2>
                  <p style={{ color: "grey" }}>@{userProfile?.userId?.username}</p>
                </div>
<div className={{display:"flex", alignItems:"center",gap:"0.5rem"}}>
                {isCurrentUserInConnection ? (
                  <button className={Styles.connectedButton}>
                    {isConnectionNull ? "Pending" : "Connected"}
                  </button>
                ) : (
                  <button
                    className={Styles.connectButton}
                    onClick={()=>{
                      console.log("Sending connection request with:", {
  token: localStorage.getItem("token"),
  user_id: userProfile.userId._id,
});
                      dispatch(sendConnectionRequest({token:localStorage.getItem("token"), user_id: userProfile.userId._id}))
                    }}
                  >
                    Connect
                  </button>
                )}

                <div onClick={async()=>{
const response = await clientServer.get(`/user/download_resume?user_id=${userProfile.userId._id}`);

               window.open(`${BASE_URL}/uploads/${response.data.message}`, "_blank");
                }} style={{cursor:"pointer"}}>
                  <svg style={{width:"25px"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg>

                </div>

                

                </div>

                <div>
                  <p>{userProfile?.bio}</p>
                </div>
              </div>

              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post._id} className={Styles.postCard}>
                      <div className={Styles.card}>
                        <div className={Styles.card__profileContainer}>
                          {post.media && (
                            <img
                              src={`${BASE_URL}/uploads/${post.media}`}
                              alt="Post Media"
                            />
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No recent activity..!</p>
                )}
              </div>
            </div>
          </div>

          <div className="workHistory">
            <h4>Work History</h4>
            <div className={Styles.workHistoryContainer}>
              {
                userProfile.pastWork.map((work,index)=>{
                  return(
                    <div key={index} className={Styles.workHistoryCard}>
                      <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rrem"}}>{work.company}-{work.position}</p>
                      <p>{work.years}</p>

                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const username = context.query.username;
  try {
    const request = await clientServer.get("/user/get_profile_based_on_username", {
      params: { username },
    });

    return {
      props: {
        userProfile: request.data.profile,
      },
    };
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return {
      props: {
        userProfile: null,
      },
    };
  }
}
