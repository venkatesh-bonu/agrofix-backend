import mongoose,{model} from "mongoose";

const schema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["fruit", "vegetable"],
      required: true,
    },
    productUrl: {
      type: String, // URL of the product image
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || model("Product", schema);
