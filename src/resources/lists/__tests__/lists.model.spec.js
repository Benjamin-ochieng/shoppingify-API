import mongoose from 'mongoose';
import List from '../lists.model';

describe('List model', () => {
  it('has a name property ', () => {
    const { name } = List.schema.obj;
    expect(name).toEqual(String);
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
      dafault: 'active',
    });
  });
});
