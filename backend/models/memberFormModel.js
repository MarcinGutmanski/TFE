import mongoose from 'mongoose';

const memberFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const MemberForm = mongoose.model('MemberForm', memberFormSchema);

export default MemberForm;
