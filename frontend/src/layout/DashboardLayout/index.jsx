import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { Home, Search, UserPlus, Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { getAllUsers } from '@/config/redux/action/authAction';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const { token, allUsers, all_profiles_fetched } = authState;

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (!tokenFromStorage) {
      router.push('/login');
    } else {
      dispatch(setTokenIsThere());

      // ✅ Fetch users if not already fetched
      if (!all_profiles_fetched) {
        dispatch(getAllUsers({ token: tokenFromStorage }));
      }
    }
  }, [dispatch, router, all_profiles_fetched]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const topProfiles = all_profiles_fetched ? allUsers.slice(0, 5) : [];

  return (
    <div className={styles.wrapper}>
      {/* Mobile Navbar */}
      <div className={styles.mobileNav}>
        <h2 onClick={() => router.push('/')} className={styles.logo}>proconnect</h2>
        <div onClick={toggleSidebar} className={styles.menuIcon}>
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarOption} onClick={() => router.push('/dashboard')}>
          <Home size={20} />
          <p>Scroll</p>
        </div>
        <div className={styles.sidebarOption} onClick={() => router.push('/discover')}>
          <Search size={20} />
          <p>Discover</p>
        </div>
        <div className={styles.sidebarOption} onClick={() => router.push('/my_connections')}>
          <UserPlus size={20} />
          <p>MyConnections</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        <div className={styles.feed}>{children}</div>

        {/* Extra Panel: Top Profiles */}
        <div className={styles.extraPanel}>
          <div className={styles.topProfiles}>
            <h3>Top Profiles</h3>
            {topProfiles.length > 0 ? (
              topProfiles.map((profile, index) => (
                <div key={index} className={styles.profileCard}>
                  <div className={styles.avatar}>
                    {profile.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className={styles.name}>{profile.name || 'Unknown'}</p>
                    <p className={styles.role}>{profile.role || 'Member'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No profiles found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
