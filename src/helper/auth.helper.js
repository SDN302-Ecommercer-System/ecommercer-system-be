import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();


const JwtUtils = {
    hashPassword: async (password) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    },
  
    comparePassword: async (password, hashedPassword) => {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    },
  
    signJwt: (payload) => {
      return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    },
  
    verifyJwt: (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, data: decoded };
      } catch (error) {
          return { valid: false, message: error };
      }
    },
  };

export default JwtUtils;