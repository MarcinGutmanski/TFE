import express from 'express';
import Form from '../models/formModel.js';
import { isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';

const formRouter = express.Router();
formRouter.get('/admin', async (req, res) => {
  const forms = await Form.find();
  if (forms) {
    res.send(forms);
  } else {
    res.status(404).send({ message: 'No forms found.' });
  }
});

formRouter.post(
  '/submit',
  expressAsyncHandler(async (req, res) => {
    const newForm = new Form({
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      isAccepted: false,
    });
    const form = await newForm.save();
    res.send({
      _id: form._id,
      name: form.name,
      email: form.email,
      isAccepted: form.isAccepted,
    });
  })
);

export default formRouter;
