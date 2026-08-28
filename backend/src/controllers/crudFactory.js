export const createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const getAll = (Model) => async (req, res, next) => {
  try {
    const docs = await Model.find();
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (error) {
    next(error);
  }
};

export const getOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      const err = new Error('Not found');
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      const err = new Error('Not found');
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      const err = new Error('Not found');
      err.statusCode = 404;
      throw err;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Bonus: reorder for drag-and-drop (expects array of { id, position })
export const reorder = (Model) => async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, position }, ...]
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { position: item.position },
      },
    }));
    await Model.bulkWrite(bulkOps);
    const updated = await Model.find().sort({ position: 1 });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};