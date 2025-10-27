import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
		type: Date,
		default: Date.now,
	},
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
	isVerified: {
		type: Boolean,
		default: false,
	},
    token: {
        type: String,
        default: null,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpiry: {
        type: Date,
        default: null,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
},{timestamps: true});

export default mongoose.model("User", UserSchema);