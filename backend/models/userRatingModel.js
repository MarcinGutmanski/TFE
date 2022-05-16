import mongoose from 'mongoose';

const userRatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const UserRating = mongoose.model('UserRating', userRatingSchema);

export default UserRating;
