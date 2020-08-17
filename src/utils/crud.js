export const createOne = (Model) => async (req, res) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({ doc });
  } catch (error) {
    console.log(error);
  }
};
