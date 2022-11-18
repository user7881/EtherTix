import { NextFunction } from 'express';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
require('dotenv').config();

interface IUserAttributes {
    forename: string;
    surname: string;
    username: string;
    email: string; // The user's e-mail address
    password: string;
    passwordConfirm: string;
    role: string;
    accountActive: boolean;
    accountVerified: boolean;
    accountLocked: boolean;
    isNewUser: boolean;

    photo: string;
    createdAt: Date;
    address: string;
    pastEventsHeld: number;
    upcomingEvents: number;
    isActive: boolean;
    isLocked: boolean;
    isVerified: boolean;
    isValid: boolean;

    virtualCredits: number;
    reputationPoints: number;

    premiumAccount: boolean;

    comparePasswords: (enteredPassword: string) => Promise<boolean>;
    getAuthenticationToken: () => Promise<void>;
}

interface UserDocument extends mongoose.Model<IUserAttributes> { // User Document holding all of the information regarding a user
    forename: string;
    surname: string; // Users surname
    username: string; // Username of the user
    email: string; // The user's e-mail address
    password: string;
    passwordConfirm: string; // Password Confirmation
    role: string; // Role of the user
    accountActive: boolean; // Account active or not
    accountVerified: boolean; // Accoutn verified or not
    accountLocked: boolean; // True or false if the account is locked or not
    address: string;
    photo: string; // User avatar
    isNewUser: boolean;
    createdAt: Date;

    pastEventsHeld: number;
    upcomingEvents: number;

    virtualCredits: number;
    reputationPoints: number;

    isActive: boolean;
    isLocked: boolean;
    isVerified: boolean;
    isValid: boolean;
    premiumAccount: boolean;

    comparePasswords: (enteredPassword: string) => Promise<boolean>;
    getAuthenticationToken: () => Promise<void>;

}

enum UserRoles {
    Admin, User, Moderator, Organiser
}

// Working on the auth feature branch
const UserSchema = new mongoose.Schema({

    forename: {
        type: String,
        required: [true, "Please provide your forename"]
    },

    surname: {
        type: String,
        required: [true, "Please provide your surname"]
    },
    
    // username of the user
    username: {
        type: String,
        required: true,
        minlength: [5, "Username must be at least 5 characters long"],
        maxlength: [20, "Username must be at least 20 characters long"],
        trim: true
    },

    address: { // IMPORTANT FIELD. THIS STORES THE METAMASK WALLET ACCOUNT ADDRESS FOR A SPECIFIC USER. NOT REQUIRED UPON REGISTRATION
        type: String
    },

    // User's e-mail address
    email: {
        type: String,
        required: [true, "Please specify a valid e-mail address for the user"],
        unique: true
    },

    photo: { // Photo for the user
        type: String,
        default: 'no-photo.jpg'
    },

    // The user's password
    password: {
        type: String,
        required: [true, "Please provide a valid password"]
    },

    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"]
    },

    role: {
        type: String,
        enum: [UserRoles.Admin, UserRoles.Moderator, UserRoles.Organiser, UserRoles.User],
        required: [true, "Please specify the role of the user"],
        default: UserRoles.User
    },

    ticketsOwned: {
        type: Number,
        default: 0
    },  

    pastEventsHeld: {
        type: Number,
        default: 0,
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isLocked: { 
        type: Boolean,
        default: false
    },

    isNewUser: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: false
    },

    isValid: {
        type: Boolean,
        default: false
    },

    premiumAccount: {
        type: Boolean,
        default: false
    },

    virtualCredits: { // Number of virtual credits the user has when entering the live auction against other individuals
        type: Number,
        default: 0,
        required: [true, "Please specify how many virtual credits to allocate to this user for bidding"]
    }

}, {timestamps: true, toJSON: {virtuals: true}});

// @description: Before saving a user to the database, hash their password
UserSchema.pre('save', async function(next: () => void) {

    let ROUNDS = 10;

   if(!this.isModified("password")) {
     return next();
   }

   this.password = await bcrypt.hash(this.password, ROUNDS);
   this.passwordConfirm = await bcrypt.hash(this.passwordConfirm, ROUNDS);

   return next();
})

UserSchema.methods.comparePasswords = async function(password: string): Promise<boolean> {
    const hashedPassword: string = (this as unknown as UserDocument).password!;
    return await bcrypt.compare(password, hashedPassword);
}

 // Sign JWT Token and retrieve it
UserSchema.methods.getAuthenticationToken = function() {
   return jwt.sign({id: this._id}, process.env.JWT_TOKEN!, {expiresIn: process.env.JWT_EXPIRES_IN!});
}

const User = mongoose.model<UserDocument>("User", UserSchema);
export {User}