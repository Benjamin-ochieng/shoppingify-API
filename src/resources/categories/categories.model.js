import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Category', categoriesSchema);
