import express from 'express';
import Feedback from '../models/feedbackModel.js';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const feedbackRouter = express.Router();
feedbackRouter.get('/admin', isAuth, async (req, res) => {
  const feedbacks = await Feedback.find();
  if (feedbacks) {
    res.send(feedbacks);
  } else {
    res.status(404).send({ message: 'No forms found.' });
  }
});

feedbackRouter.get('/:id', isAuth, async (req, res) => {
  const feedback = await Feedback.findOne({ _id: req.params.id });
  if (feedback) {
    res.send(feedback);
  } else {
    res.status(404).send({ message: 'No forms found.' });
  }
});

export default feedbackRouter;
