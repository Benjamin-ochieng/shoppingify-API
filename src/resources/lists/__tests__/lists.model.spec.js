import mongoose from 'mongoose';
import List from '../lists.model';

describe('List model', () => {
  it('has a name property ', () => {
    const { name } = List.schema.obj;
    expect(name).toEqual({
      type: String,
      required: true,
    });
  });

  it('has has a lists property', () => {
    const { items } = List.schema.obj;
    expect(items).toEqual([
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Item',
      },
    ]);
  });

  it('has a status property', () => {
    const { status } = List.schema.obj;
    expect(status).toEqual({
      type: String,
      required: true,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    });
  });

  it('has has a createdBy property', () => {
    const { createdBy } = List.schema.obj;
    expect(createdBy).toEqual({
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    });
  });
});
