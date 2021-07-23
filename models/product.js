import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

productSchema.index({
  name: 'text',
});

export const Product = mongoose.model('product', productSchema);
