import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
    },
    orderDetails: [
      {
        food: { type: mongoose.Types.ObjectId, ref="Foods" },
        quality: { type: Number, required: true }, //quality must be whole numb.If it is string or decimal server will crashed becz it can't handle or convert it.
        paymode: { type: String, required: true },
        status: { type: String, required: "Placed" },
        paymentDetails: {
          itemTotal: { type: Number, required: true },
          promo: { type: Number, required: true },
          tax: { type: Number, required: true },
        },
      },        
    ],
    orderRating: { type: Number, required: true },
  },
  {
    timestamps: true, 
  },
);

export const OrderModel = mongoose.model( "Orders", OrderSchema)