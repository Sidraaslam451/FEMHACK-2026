import express from 'express';
import Item from '../models/Item.js';
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  reorder,
} from '../controllers/crudFactory.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getAll(Item)).post(createOne(Item));
router.patch('/reorder', reorder(Item));
router.route('/:id').get(getOne(Item)).patch(updateOne(Item)).delete(deleteOne(Item));

export default router;