import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/userLayout';
import Styles from './index.module.css';
import { BASE_URL, clientServer } from '@/config';

export default function Profilepage() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { posts, isLoading: postsLoading } = useSelector((state) => state.postReducer);

  const [userProfile, setUserProfile] = useState({
    name: '',
    bio: '',
    currentPost: '',
    pastWork: [],
    education: []
  });

  const [userPosts, setUserPosts] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name || '',
        bio: user.bio || '',
        currentPost: user.currentPost || '',
        pastWork: user.pastWork || [],
        education: user.education || [],
      });

      const filteredPosts = posts.filter(post => post.userId?.username === user.username);
      setUserPosts(filteredPosts);
    }
  }, [user, posts]);

  if (isLoading || !user) {
    return <p>Loading profile...</p>;
  }

  const updateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("token", localStorage.getItem("token"));

      await clientServer.post("/update_profile_picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    } catch (error) {
      console.error("Profile picture update failed:", error);
    }
  };

  const updateProfileData = async () => {
    try {
      console.log("Updating profile data...", userProfile);
      await clientServer.post("/update_profile_data", {
        token: localStorage.getItem("token"),
        ...userProfile,
      });

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      console.log("Profile data updated.");
    } catch (error) {
      console.error("Profile data update failed:", error);
    }
  };

  // Helper handlers to update nested arrays

  const handlePastWorkChange = (index, field, value) => {
    const newPastWork = [...userProfile.pastWork];
    newPastWork[index] = { ...newPastWork[index], [field]: value };
    setUserProfile({ ...userProfile, pastWork: newPastWork });
  };

  const addPastWork = () => {
    setUserProfile({
      ...userProfile,
      pastWork: [...userProfile.pastWork, { company: '', position: '', years: '' }]
    });
  };

  const removePastWork = (index) => {
    const newPastWork = userProfile.pastWork.filter((_, i) => i !== index);
    setUserProfile({ ...userProfile, pastWork: newPastWork });
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...userProfile.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setUserProfile({ ...userProfile, education: newEducation });
  };

  const addEducation = () => {
    setUserProfile({
      ...userProfile,
      education: [...userProfile.education, { institution: '', degree: '', years: '' }]
    });
  };

  const removeEducation = (index) => {
    const newEducation = userProfile.education.filter((_, i) => i !== index);
    setUserProfile({ ...userProfile, education: newEducation });
  };

  const hasChanges =
    userProfile.name !== (user.name || "") ||
    userProfile.bio !== (user.bio || "") ||
    userProfile.currentPost !== (user.currentPost || "") ||
    JSON.stringify(userProfile.pastWork) !== JSON.stringify(user.pastWork || []) ||
    JSON.stringify(userProfile.education) !== JSON.stringify(user.education || []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={Styles.container}>
          <div className={Styles.backdropContainer}>
            <label htmlFor="profilePictureUpload" className={Styles.backDrop__overlay}>
              <p>Edit</p>
            </label>
            <input
              type="file"
              id="profilePictureUpload"
              hidden
              ref={fileInputRef}
              onChange={(e) => updateProfilePicture(e.target.files[0])}
            />
            <img
              src={`${BASE_URL}/uploads/${user.profilePicture}`}
              alt="Profile"
            />
          </div>

          <div className={Styles.profileContainer__details}>
            <div className={Styles.topSection}>
              <div className={Styles.leftColumn}>
                <input
                  className={Styles.nameEdit}
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  placeholder="Name"
                />
                <p className={Styles.username}>@{user.username}</p>
                <textarea
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                  rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                  style={{ width: "100%" }}
                  placeholder="Bio"
                />

                {/* Past Work Section */}
                <div className={Styles.workHistory}>
                  <h4>Work History</h4>
                  {userProfile.pastWork.map((work, index) => (
                    <div key={index} className={Styles.workHistoryCard}>
                      <input
                        type="text"
                        placeholder="Company"
                        value={work.company}
                        onChange={(e) => handlePastWorkChange(index, 'company', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={work.position}
                        onChange={(e) => handlePastWorkChange(index, 'position', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Years"
                        value={work.years}
                        onChange={(e) => handlePastWorkChange(index, 'years', e.target.value)}
                      />
                      <button onClick={() => removePastWork(index)}>Remove</button>
                    </div>
                  ))}
                  <button onClick={addPastWork}>Add Work</button>
                </div>

                {/* Education Section */}
                <div className={Styles.workHistory}>
                  <h4>Education</h4>
                  {userProfile.education.map((edu, index) => (
                    <div key={index} className={Styles.workHistoryCard}>
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Years"
                        value={edu.years}
                        onChange={(e) => handleEducationChange(index, 'years', e.target.value)}
                      />
                      <button onClick={() => removeEducation(index)}>Remove</button>
                    </div>
                  ))}
                  <button onClick={addEducation}>Add Education</button>
                </div>

                {hasChanges && (
                  <div onClick={updateProfileData} className={Styles.connectionButton}>
                    Update Profile
                  </div>
                )}
              </div>

              <div className={Styles.rightColumn}>
                <h3>Recent Activity</h3>
                {postsLoading ? (
                  <p>Loading posts...</p>
                ) : userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <div key={post._id} className={Styles.postCard}>
                      <div className={Styles.card}>
                        <div className={Styles.card__profileContainer}>
                          {post.media ? (
                            <img
                              src={`${BASE_URL}/uploads/${post.media}`}
                              alt="Post Media"
                            />
                          ) : (
                            <div className={Styles.noMediaBox}>No media</div>
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
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
