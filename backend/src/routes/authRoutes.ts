// src/routes/authRoutes.ts
import express from 'express';
import { generateOTP, sendOTPEmail } from '../utils/otp';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// src/routes/authRoutes.ts (or wherever your signup route is)

// 1. Send OTP for sign-up
router.post('/signup', async (req, res) => {
  const { name, dob, email } = req.body;

  // Validate input
  if (!name || !dob || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    // Check if user exists
    let existingUser = await User.findOne({ email });
    // console.log("mongodb user:", existingUser);

    // If user exists and is already verified, prevent signup
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // If user exists but is not verified, we will re-use/update their record
    // If user does not exist, we will create a new record
    // In both cases below, we generate a new OTP

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (existingUser && !existingUser.isVerified) {
      // User exists but is not verified
      // Update the existing user's details and OTP
      existingUser.name = name;
      existingUser.dob = dob;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      // isVerified is already false, or will be set to false if somehow true
      existingUser.isVerified = false;
      // Update timestamps
      existingUser.updatedAt = new Date();

      await existingUser.save();
      console.log("Updated unverified user:", existingUser);
    } else if (!existingUser) {
      // User does not exist, create a new one
      const newUser = new User({
        name,
        dob,
        email,
        otp,
        otpExpires,
        isVerified: false,
      });

      await newUser.save();
      console.log("Created new user:", newUser);
      // Assign to existingUser variable so the email sending logic below works for both cases
      existingUser = newUser;
    }

    // Send OTP via email (this runs for both new and unverified existing users)
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Signup error:', error);
    // Provide a more specific error message if possible, or a generic one
    if (error.name === 'ValidationError') {
        // Handle Mongoose validation errors
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ message: 'Validation failed', details: messages.join(', ') });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email }, '+otp +otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP expired
    if (user.otpExpires && new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check OTP (always as string)
    if (String(user.otp) !== String(otp)) {
        console.log("mongodb otp:", { userOtp: user.otp, providedOtp: otp });
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Sign up successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// 3. Login with email + OTP
router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent for login' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 4. Google OAuth (placeholder)
router.post('/google', async (req, res) => {
  const { googleId, email, name } = req.body;

  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({
        googleId,
        email,
        name,
        isVerified: true,
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 5. Get current user
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;
