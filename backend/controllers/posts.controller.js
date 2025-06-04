import Post from "../models/posts.model.js";
import User from "../models/user.model.js";

export const activeCheck = (req, res) => {
  return res.status(200).json({
    message: "Server is running",
  });
};

export const createPost = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      // fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
      fileType: req.file ? req.file.mimetype : "",

    });
    await post.save();
    return res.status(200).json({
      message: "Post created successfully",
      post: post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username email profilePicture")
      .sort({ createdAt: -1 });
    return res.json({ posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deletePost = async (req, res) => {
  const { token, postId } = req.body;

  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "User Unauthorized" });
    }

    // Delete the post by id
    await Post.findByIdAndDelete(postId);

    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



