import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Shopping list',
    },
    items: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Item',
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  // eslint-disable-next-line prettier/prettier
  { timestamps: true },
);

export default mongoose.model('List', listSchema);
