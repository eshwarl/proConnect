import { createPost,getAllPosts,deletePost } from "../controllers/posts.controller.js"; 
import { commentPost, get_comments_by_post, increament_likes } from "../controllers/user.controller.js";       
import { Router } from "express";
import { activeCheck } from "../controllers/posts.controller.js";
import multer from "multer";







const router=Router();
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})

router.route("/").get(activeCheck);
router.route("/post").post(upload.single("media"),createPost);
router.route("/Posts").get(getAllPosts);
router.route("/delete_post").post(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").post(deletePost);
router.route("/increament_post_like").post(increament_likes);

export default router;