import { Order } from "../modals/order.js";
import { Product } from "../modals/product.js";

export const addNewProduct = async (req, res, next) => {
  try {
    const { productName, price, category } = req.body;
    const image = req.file;

    if (!productName || !price || !category || !image) {
      return res
        .status(400)
        .json({ message: "All fields including image are required" });
    }

    if(category.toLowerCase() !== "fruit" && category.toLowerCase() !== "vegetable"){
      return res
      .status(400)
      .json({ message: "category should be either fruit or vegetable" });
    }

    const newProduct = new Product({
      productName,
      price,
      category : category.toLowerCase(),
      productUrl: image.path,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addNewOrder = async (req, res) => {
  const { status="Pending", productsList, buyerContact, deliveryAddress } = req.body;
  console.log(status, productsList, buyerContact, deliveryAddress);
  if (!status || !productsList || !buyerContact || !deliveryAddress)
    return res.status(400).json({ message: "All fields are required" });

  const buyerName = req.user.username;
  const buyerId = req.user.id;

  try {
    const newOrder = new Order({
      buyer_name: buyerName,
      buyerId,
      buyer_contact: buyerContact,
      delivery_address: deliveryAddress,
      status,
      productsList,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const { status } = req.body;
    if (!status) {
      return res.status(401).json({ message: "status needs to be provided" });
    }
    const order = await Order.findById(id);
    if (!order) {
      res.status(401).json("Invalid order Id");
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "status updated successfully" });
  } catch (error) {
    console.log("Error Occured while updating Status");
    res.status(500).json({ message: "Error while inserting the data" });
  }
};

export const removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deltedProduct = await Product.findByIdAndDelete(id);

    if (!deltedProduct) {
      return res.status(401).json({ message: "Invalid product Id" });
    }

    return res.status(200).json({
      message: "product deleted successully",
      deltedProduct,
    });
  } catch (err) {
    console.log("Error occured while deleting the prodct", err);
    return res
      .status(500)
      .json({ message: "Error while deleting the product" });
  }
};

export const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.find({buyerId : id});
    return res
      .status(200)
      .json({ message: "Order fetched successfully", order });
  } catch (err) {
    console.log("Error while fetching order data from db", err);
    res
      .status(500)
      .json({ message: "Error while fetching order data from db" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: "Data fetched successfully", orders });
  } catch (err) {
    console.log("Error while fetching order data from db", err);
    res.status(500).json({ message: "Error while fetching order data from db" });
  }
};

export const getAllOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({buyerId : req.user.id});
    res.status(200).json({ message: "Data fetched successfully", orders });
  } catch (err) {
    console.log("Error while fetching order data from db", err);
    es.status(500).json({ message: "Error while fetching order data from db" });
  }
};


export const getAllProducts = async (req, res) => {
  const { productName = "", fruit = "", vegetable = "" } = req.query;
  const query = {
    productName: { $regex: productName, $options: 'i' }
  };
  
  const orConditions = [];
  
  if (fruit.trim()) {
    orConditions.push({ category: { $regex: fruit, $options: 'i' } });
  }
  
  if (vegetable.trim()) {
    orConditions.push({ category: { $regex: vegetable, $options: 'i' } });
  }
  
  if (orConditions.length > 0) {
    query.$or = orConditions;
  }
  try {
    const products = await Product.find(query);
    return res
      .status(200)
      .json({ message: "products list fetched successfully", products });
  } catch (err) {
    console.log("Error occured while fetching the data", err);
    return res
      .status(400)
      .json({ message: "Error occured while fetching products list" });
  }
};

// we definetly need to send the all three items while editing the data productName,price,category
export const editExistingProduct = async (req, res) => {
  const { productName = "", price = 0, category = "fruit" } = req.body;

  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    product.productName = productName;
    product.price = price;
    product.category = category;

    await product.save();
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (err) {
    console.log("Error white updating the product details");
    res
      .status(401)
      .json({ message: "Error white updating the product details" });
  }
};

export const getProductDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    return res
      .status(200)
      .json({ message: "Product fetched successfully", product });
  } catch (err) {
    console.log("Error while fetching Product data from db", err);
    res
      .status(500)
      .json({ message: "Error while fetching Product data from db" });
  }
};
