import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '@/layout/userLayout';
import DashboardLayout from '@/layout/DashboardLayout';
import { getAllUsers } from '@/config/redux/action/authAction';
import { BASE_URL } from '@/config';
import styles from "./index.module.css";
import { useRouter } from 'next/router';

function Discoverpage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.all_profiles_fetched && authState.token) {
      dispatch(getAllUsers({ token: authState.token }));
    }
  }, [authState.all_profiles_fetched, authState.token, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <p>Discovering</p>
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.allUsers.map((user) => (
                <div
                  onClick={() => {
                    router.push(`/view_profile/${user.username}`);
                  }}
                  key={user._id}
                  className={styles.userCard}
                >
                  <img
                    className={styles.userCard__image}
                    src={
                      user.profilePicture
                        ? `${BASE_URL}/uploads/${user.profilePicture}`
                        : '/default.jpg'
                    }
                    alt={user.name}
                  />
                  <div>
                    <h2>{user.name}</h2>
                    <h3>@{user.username}</h3>
                    <p>{user.bio}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default Discoverpage;
