// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// 1. Define the structure of the JWT payload
interface TokenPayload {
  userId: string;
  email: string;
}

// 2. Define the structure of the user object we'll attach to the request
interface UserData {
  id: string;
  email: string;
}

// 3. Augment the Express Request interface locally within this module
// This tells TypeScript that our Request object *can* have a `user` property
declare global {
  namespace Express {
    interface Request {
      user?: UserData; // Make it optional
    }
  }
}

// 4. Define the verifyToken middleware function
export const verifyToken = (
  req: Request, // This Request now includes the optional `user` property
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // 5. Check for the presence of the Authorization header and Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return; // Stop execution if no token
  }

  // 6. Extract the token from the header
  const token = authHeader.split(' ')[1];

  try {
    // 7. Verify the token using the secret key
    // Cast the decoded payload to our defined TokenPayload interface
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // 8. Attach the user information to the request object
    // TypeScript now knows `req.user` exists (as optional) due to the local augmentation above
    req.user = { id: decoded.userId, email: decoded.email };

    // 9. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // 10. Handle token verification errors (invalid, expired, etc.)
    console.error("JWT Verification Error:", error);
    // Send a 400 Bad Request response for token issues
    res.status(400).json({ message: 'Invalid or expired token' });
    return; // Stop execution on error
  }
};