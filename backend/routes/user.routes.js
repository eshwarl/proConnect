import { Router } from "express";
import {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  getMyConnectionRequests,
  sendConnectionsRequest,
  whatAreMyConnections,
  acceptConnectionRequest,
  getUSerProfileAndBAsedOnUsername,
} from "../controllers/user.controller.js";

import multer from "multer";


const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/update_profile_picture", upload.single("profile_picture"), uploadProfilePicture);
router.post("/register", register);
router.post("/login", login);
router.post("/user_update", updateUserProfile);
router.get("/get_user_and_profile", getUserAndProfile);
router.post("/update_profile_data", updateProfileData);
router.get("/user/get_all_users", getAllUserProfile);
router.get("/user/download_resume", downloadProfile);
router.post("/user/send_connection_request", sendConnectionsRequest);
router.get("/user/getConnectionsRequests", getMyConnectionRequests);
router.get("/user/user_connection_request", whatAreMyConnections);  
router.post("/user/accept_connection_request", acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getUSerProfileAndBAsedOnUsername)
export default router;
