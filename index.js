import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./utils/features.js";
import {
  adminAuth,
  adminLogin,
  auth,
  login,
  register,
} from "./auth/features.js";
import { fileURLToPath } from "url";

import path from "path";
import {
  addNewOrder,
  addNewProduct,
  editExistingProduct,
  getAllOrders,
  getAllOrdersForUser,
  getAllProducts,
  getOrderDetails,
  getProductDetails,
  removeProduct,
  updateOrderStatus,
} from "./features/features.js";
import { upload } from "./middlewares/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "./.env"),
});

const app = express();
const PORT = process.env.PORT || 5000;
const mongooseUri = process.env.MONGO_URI || "";

connectDb(mongooseUri);

app.use(cors());
app.use(express.json());

// authenticating the user
app.post("/api/register", register);

app.post("/api/login", login);

// user routes
app.get("/api/products",auth,getAllProducts);

app.post("/api/orders", upload.none(), auth, addNewOrder);

app.get("/api/user/orders/", auth, getAllOrdersForUser);

app.get("/api/products/:id",auth,getProductDetails);

// authenticating the admin
app.post("/api/admin/login", adminLogin);

// admin routes

app.get("/api/orders",adminAuth,getAllOrders)

app.get("/api/admin/products",adminAuth,getAllProducts);

app.put("/api/orders/:id", adminAuth, updateOrderStatus);

app.post("/api/products", adminAuth, upload.single("image"), addNewProduct);

app.put("/api/products/:id",adminAuth,editExistingProduct);

app.delete("/api/products/:id", adminAuth, removeProduct);


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
