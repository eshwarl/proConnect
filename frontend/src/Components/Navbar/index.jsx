import React from 'react';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

function NavBarComponent() {
  const router = useRouter();
  const { profileFetched, user } = useSelector((state) => state.auth);

  const userInfo = user;

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <div className={styles.navBarInner}>
          <h1 style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
            proconnect
          </h1>

          <div className={`${styles.navBarOptionContainer} ${profileFetched && userInfo ? 'full-width' : ''}`}>
            {profileFetched && userInfo ? (
              <div className={styles.userProfileContainer}>
                <p className={styles.userName}>hey, {userInfo.name || 'User'}</p>
                <p
                  className={styles.profileLink}
                  onClick={() => router.push('/profile')}
                >
                  Profile
                </p>
                <button
                  onClick={handleLogout}
                  className={styles.logoutButton}
                  style={{
                    marginLeft: '1rem',
                    padding: '4px 12px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div
                className={styles.buttonJoin}
                onClick={() => router.push('/login')}
                
              >
                <p>be a Part</p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
