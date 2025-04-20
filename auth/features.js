import { User } from "../modals/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || "JWT_ADMIN_SECRET";

const SECRET_ADMIN_CODE = process.env.SECRET_ADMIN_CODE || "SECRET_ADMIN_CODE";

export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedString = hashedPassword.toString();
    console.log(hashedPassword, hashedString);

    const newUser = await User.create({
      username,
      password: hashedString,
    });

    const token = jwt.sign({ id: newUser._id, username }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(200).json({ jwt_token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during signin" });
  }
};

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded contains payload { id, username }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export const adminLogin = (req, res) => {
  const { adminSecretKey } = req.body;

  if (adminSecretKey !== SECRET_ADMIN_CODE) {
    return res.status(401).json({ message: "Invalid secret code" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_ADMIN_SECRET, { expiresIn: "30d" });
  res.json({ token });
};

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
    if (decoded.role !== "admin") throw new Error("Unauthorized");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
