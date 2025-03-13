import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Note from "../models/Note.js"; 
import jwt from "jsonwebtoken";
import { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, EMAIL_USER, JWT_SECRET, REDIRECT_URI } from "../config.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

export const signup = async (req, res) => {
  const { name, email, mobile, uname, password } = req.body;

  try {

    const existingUser = await User.findOne({ uname });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile,
      uname,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signin = async (req, res) => {
  const { uname, password } = req.body;

  try {
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Username Not Found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); 
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Wrong Password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(StatusCodes.OK).json({ token, name: user.name, username: user.uname, message: "Login Successfull!!"  }); 
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Error signing in' });
  }
};

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendResetEmail(email, resetCode) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token, 
      },
    });

    await transporter.sendMail({
      from: `"NoteNexus" <${EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${resetCode}`,
    });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
}

export const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);

    user.resetPasswordCode = hashedCode;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 
    await user.save();

    await sendResetEmail(email, resetCode);

    res.json({ message: "Verification code sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Verification code not sent" });
  }
};

export const verifyCode = async (req, res) => {
  const {reset_email, code } = req.body;
  console.log(reset_email);
  console.log(code);
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user || !user.resetPasswordCode) return res.status(400).json({ error: "Invalid request" });

    const isMatch = await bcrypt.compare(code, user.resetPasswordCode);
    if (!isMatch || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    res.json({ message: "Code verified, proceeding to update password" });
  } catch (error) {
    res.status(500).json({ error: "Error verifying code" });
  }

};

export const newPassword = async (req, res) => {
  const { reset_email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: reset_email });
    if (!user) return res.status(400).json({ error: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting password" });
  }

};

export const add_note = async (req, res) => {
  try {

    const { title, content, visibility } = req.body;
    
    const owner = req.body.owner ;
    const uname = req.body.uname ;

    if (!title || !content || !visibility) {
      return res.status(400).json({ message: "Missing required fields: title, content, visibility" });
    }

    if (!owner || !uname) {
      return res.status(400).json({ message: "Owner or Username is missing" });
    }

    const newNote = new Note({
      title,
      content,
      owner,
      owner_username: uname,
      visibility, 
      lastEditedBy: owner
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      message: 'Note added successfully',
      note: savedNote,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error adding note',
      error: error.message,
      stack: error.stack, 
    });
  }
};

export const view_notes = async (req, res) => {
  try {
    const uname = req.query.username; 
    
    const notes = await Note.find({
      $or: [
        { visibility: 'public' }, 
        { owner_username: uname },
      ]
    });

    res.status(200).json({ notes, message: "Fetched All Notes!" });
  } catch (error) {
    res.status(500).json({ error: "Error fetching notes" });
  }
};


export const view_note_by_id = async (req, res) => {
  const { noteid } = req.params;

  try {
    const note = await Note.findOne({ _id: noteid });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note, message: 'Note fetched successfully' });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const edit_note = async (req, res) => {
  const { id, title, content, lastEditedBy, visibility } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, lastEditedBy, visibility}, 
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    return res.status(200).json({ 
      message: 'Note updated successfully.', 
      note: updatedNote 
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: 'Error updating note.', error: error.message });
  }
};

export const delete_note = async (req, res) => {
  const { id } = req.params; 
  const { username } = req.query;

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: true,
        message: "Note not found",
      });
    }

    if (note.owner_username !== username) {
      return res.status(403).json({
        success: true,
        message: "You are not authorized to delete this note",
      });
    }

    await Note.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Note successfully deleted",
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error. Could not delete note",
    });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const { uname } = req.params; 

    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      uname: user.uname,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { uname } = req.params; 
  const { name, email, mobile, newUname } = req.body; 

   
  try {
    const user = await User.findOne({ uname });

    const oname = user.name;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (newUname) {
      const existingUser = await User.findOne({ uname: newUname });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (newUname) user.uname = newUname;

    const updatedUser = await user.save();

    const updatedName = name || user.name; 
    const updatedUsername = newUname || uname; 

    await Note.updateMany(
      { owner_username: uname }, 
      {
        $set: {
          owner: updatedName,
          owner_username: updatedUsername,
        },
      }
    );

    await Note.updateMany(
      {
        $or: [
          { lastEditedBy: oname }, 
          { lastEditedBy: null }, 
        ],
      },
      {
        $set: {
          lastEditedBy: updatedName, 
        },
      }
    );
   
    return res.status(200).json({
      message: 'Profile and related notes updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { uname } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ uname });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};

