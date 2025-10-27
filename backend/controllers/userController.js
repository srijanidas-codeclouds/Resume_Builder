import User from "../models/userModel.js";
import Session from "../models/sessionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { verifyEmail } from "../email/verifyEmail.js";
import 'dotenv/config';
// generate a jwt token
// const generateAToken = (userId) =>{
//     // jwt.sign(payload, secret, options)
//     return jwt.sign({id:userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
// }

export const registerUser = async (req, res) => {
    try {
        // get user data
        const { name, email, password } = req.body;
        // check if all fields are filled
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }
        
        // check password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // create user
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
		});

        // jwt
		// generateTokenAndSetCookie(res, newUser._id);
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });
        // verify email
        await verifyEmail(token, email);
        newUser.token = token;
        await newUser.save();
        res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...newUser._doc,
			},
		});
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error:error.message });
    }
};

export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            })
        }

        const token = authHeader.split(" ")[1]

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            })
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null
        user.isVerified = true
        await user.save()

        // await sendWelcomeEmail(user.email, user.name)

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({success: false, message: "Invalid email or password" });
        }

        // compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({success: false, message: "Invalid email or password" });
        }

        //check if user is verified 
        if (user.isVerified !== true) {
            return res.status(403).json({
                success: false,
                message: "Verify your account then login"
            })
        }
        // check for existing session and delete it
        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id })
        }

        //create a new session
        await Session.create({ userId: user._id })

        //Generate tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10d" })
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })

        user.isLoggedIn = true;
        await user.save()

        res.status(200).json({ 
            // _id: user._id,
            success: true,
            message: `Welcome back ${user.name}`,
            accessToken,
            refreshToken,
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error:error.message });
    }
};

// get user profile by id
export const getUserById = async (req, res) => {
    try {
        // check if user is authenticated
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error:error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

