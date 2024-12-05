import express from 'express';
import { DecodedMessage, Message } from '../types';

const Vigenere = require('caesar-salad').Vigenere;

const router = express.Router();

router.post('/', (req, res) => {
  const message: Message = req.body;
  const decoded: DecodedMessage = {
    decoded: Vigenere.Decipher(message.password).crypt(message.message),
  };
  res.send(decoded);
});

export default router;
