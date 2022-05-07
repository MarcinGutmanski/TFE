import mongoose from 'mongoose';

const formSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model('Form', formSchema);

export default Form;
