import mongoose from 'mongoose';

const productFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ProductForm = mongoose.model('ProductForm', productFormSchema);

export default ProductForm;
