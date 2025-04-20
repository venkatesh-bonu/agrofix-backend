import mongoose, { Schema, model, Types } from "mongoose";

const schema = new Schema(
  {
    buyer_name: {
      type: String,
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer_contact: {
      type: String,
      required: true,
    },
    delivery_address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In progress", "Delivered"],
      default: "Pending",
    },
    productsList: [
      {
        _id : {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: String,
        price: Number,
        quantity: Number,
        productUrl : String
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || model("Order", schema);
