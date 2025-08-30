// src/types/express.d.ts
import 'express'; // Import express types first

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

// export {}; // Make this file a module to avoid global scope issues in some setups