import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';
 // Capitalized to follow convention
 import Comment from '../models/comments.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import fs from 'fs';
import Post from '../models/posts.model.js';
// Assuming this is the correct path for your connection model
import ConnectionRequest from '../models/connections.model.js'; // Adjust the path as necessary
import PDFDocument from 'pdfkit';
import path from 'path'; // Import path for safer file handling


const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString('hex') + ".pdf";
    const fullPath = path.join("uploads", outputPath); // safer with path.join

    const stream = fs.createWriteStream(fullPath); // ✅ Correct path usage
    doc.pipe(stream);

    // Handle missing profile picture gracefully
    if (userData.userId.ProfilePicture) {
        try {
            doc.image(`uploads/${userData.userId.ProfilePicture}`, { align: 'center', width: 200 });
        } catch (err) {
            console.error("Image not found:", err.message);
        }
    }

    doc.fontSize(25).text(`Name: ${userData.userId.name}`);
    doc.fontSize(25).text(`Email: ${userData.userId.email}`);
    doc.fontSize(25).text(`Username: ${userData.userId.username}`);
    doc.fontSize(25).text(`Bio: ${userData.bio}`);
    doc.fontSize(25).text(`Current Position: ${userData.currentPost}`);

    doc.fontSize(25).text("Past Work:");
    userData.pastwork?.forEach((work, index) => {
        doc.fontSize(20).text(`Company: ${work.company}`);
        doc.fontSize(20).text(`Position: ${work.position}`);
        doc.fontSize(20).text(`Duration: ${work.years}`);
        doc.fontSize(20).text(`Description: ${work.description}`);
    });

    doc.end();

    return outputPath; // ✅ returned correctly
};


// const convertUserDataToPDF = async (userData) => {
//     const doc= new PDFDocument();
//     const outputPath=crypto.randomBytes(32).toString('hex')+".pdf";
//     const stream=fs.createWriteStream("uploads/$outputPath");
//     doc.pipe(stream);
//     doc.image(`uploads/${userData.userId.ProfilePicture}`, { align: 'center', width: 200 });
//     doc.fontSize(25).text(`Name: ${userData.userId.name}`);
//     doc.fontSize(25).text(`Email: ${userData.userId.email}`);
//     doc.fontSize(25).text(`Username: ${userData.userId.username}`);
//     doc.fontSize(25).text(`Bio: ${userData.bio}`);
//     doc.fontSize(25).text(`current Position:${userData.currentPost}`);

//     doc.fontSize(25).text("pastwork") 
//     userData.pastwork.forEach((work,index)=>{
//         doc.fontSize(25).text(`Company: ${work.company}`);
//         doc.fontSize(25).text(`Position: ${work.position}`);
//         doc.fontSize(25).text(`Duration: ${work.years}`);
//         doc.fontSize(25).text(`Description: ${work.description}`);
//     })
//     doc.end();
//     return outputPath
// }

export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const existingUser = await User.findOne({ email }); // Changed variable name

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const newProfile = new Profile({ userId: newUser._id }); // Renamed to avoid confusion
        await newProfile.save();

        return res.status(201).json({
            message: "User created successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        const token= crypto.randomBytes(32).toString('hex'); // Generate a random token
      await User.updateOne({ _id: user._id },  { token  }); // Store the token in the database
     
       return res.json({token:token}); // Send the token back to the client

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    // ✅ Step 1: Check if file was uploaded
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded. Please attach an image file."
        });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.profilePicture = req.file.filename;
        await user.save();

        return res.status(200).json({
            message: "Profile picture updated successfully"
        });

    } catch (error) {
        console.error("Error updating profile picture:", error); // ✅ Add this for debugging
        return res.status(500).json({
            message: "Server error: " + error.message
        });
    }
};


export const updateUserProfile= async (req, res) => {
    try{
   const {token,...newUserData} = req.body;
   const user = await User.findOne({ token:token });
    if (!user) {
         return res.status(404).json({
              message: "User not found"
         });    
        }
        const {username,email} = newUserData;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if(existingUser || String(existingUser._id) !== String(user._id)){
            return res.status(400).json({
                message: "Username or email already exists"
            });
        }
        Object.assign(user, newUserData); // Update user data
        await user.save(); // Save the updated user
        return res.status(200).json({
            message: "User updated successfully"
        });

    
    }
}catch(error){

        return res.status(500).json({
            message: error.message
        });

    }
    }
   export const getUserAndProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // Log the authorization header to check its content
        console.log("Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        console.log("Token Extracted:", token);

        const user = await User.findOne({ token: token });
        console.log("User Found:", user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name email username profilePicture");

        // Log the populated userProfile to verify data
        console.log("User Profile Found:", userProfile);

        return res.json(userProfile);
    } catch (error) {
        console.error("Error Fetching User and Profile:", error.message); // Log the error
        return res.status(500).json({ message: error.message });
    }
};

    
   export const updateProfileData = async (req, res) => {
    console.log("Update profile hit with body:", req.body)
  try {
    const { token, name, ...profileData } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update User model (name)
    if (name) user.name = name;
    await user.save();

    // ✅ Update Profile model
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    Object.assign(profile, profileData); // bio, currentPost, pastWork, education
    await profile.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


    export const getAllUserProfile= async (req, res) => {
        try{
            const profiles= await Profile.find().populate("userId", "name email username ProfilePicture");
            return res.json({profiles})

        }catch(error){
              return res.status(500).json({
                message: error.message  
        });
    }
}

export const downloadProfile=async(req,res)=>{
    const user_id=req.query.user_id;
    try{
      const userProfile= await Profile.findOne({userId:user_id})
      .populate("userId","name email username ProfilePicture");
      let outputPath= await convertUserDataToPDF(userProfile);
      return res.json({"message":outputPath});


    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}




export const commentPost = async (req, res) => {
  const { token, postId, commentBody } = req.body;  // changed post_id to postId
  try {
    const user = await User.findOne({ token }).select('_id');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });
    await comment.save();

    return res.status(200).json({
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "username name") // optional: populate user info
      .sort({ createdAt: -1 }); // optional: sort by latest first

    return res.status(200).json({ comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export  const delete_comment_of_user=async(req,res)=>{

    const{token,comment_id}=req.body;
    try{
        const user= await User
        .findOne({token})
        .select("_id");
        if(!user){
            return res.status(404).json({
                message: "User not found"
            });

        }
        const comment= await Comment.findOne({_id:comment_id});
        if(!comment){
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        await comment.deleteOne({"_id":comment_id});
        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    }catch(err){
        return res.status(500).json({
            message: error.message
        });

    }
}

export const increament_likes = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { post_id } = req.body;
    if (!post_id) {
      return res.status(400).json({ message: "post_id is required" });
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error in increament_likes:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUSerProfileAndBAsedOnUsername=async(req,res)=>{
    const {username} = req.query;
    try{
        const user  = await User.findOne({  username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        const userProfile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name email username profilePicture");
            return res.json({"profile":userProfile});
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        });
    }

}

export const sendConnectionsRequest= async (req, res) => {

  console.log("sendConnectionsRequest hit", req.body);
  const{token,connectionId}= req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }
    const existingRequest= await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id
    })
    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already sent" });
    }
    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id
    });
    await request.save();
    return res.status(200).json({ message: "Connection request sent successfully" });

  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getMyConnectionRequests = async (req, res) => {
  const{token}=req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }     
    const connections = await ConnectionRequest.find({ userId: user._id })
      .populate("connectionId", "name email username ProfilePicture");
      return res.json({connections})
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await ConnectionRequest.find({ connectionId: user._id })
      .populate("userId", "name email username ProfilePicture");
    return res.json( connections );
  }
  catch (error) {
    return res.status(500).json({ message: error.message });
  } 
}

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const request = await ConnectionRequest.findOne({ _id: requestId });
    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (action_type === "accept") {
      request.status_accepted = true;
    } else {
      request.status_accepted = false;
    }

    await request.save();
    return res.json({ message: "Connection request updated successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



