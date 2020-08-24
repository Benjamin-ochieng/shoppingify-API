/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
export const createOne = (Model) => async (req, res, next) => {
  let doc;
  const input = req.body;
  try {
    doc = await Model.create(input);
  } catch (err) {
    return next(err);
  }
  res.status(201).json(doc);
};
