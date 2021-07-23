import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'client',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    order: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('order', orderSchema);
