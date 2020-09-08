/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import User from './user.model';

export const findAccount = async (req, res, next) => {
  let doc;
  try {
    doc = await User.findOne({ _id: req.user._id })
      .select('-password')
      .lean()
      .exec();
  } catch (error) {
    return next(error);
  }
  res.status(200).json(doc);
};
