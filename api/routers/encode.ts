import express from 'express';
import { EncodedMessage, Message } from '../types';

const Vigenere = require('caesar-salad').Vigenere;

const router = express.Router();

router.post('/', (req, res) => {
  const message: Message = req.body;
  const encoded: EncodedMessage = {
    encoded: Vigenere.Cipher(message.password).crypt(message.message),
  };
  res.send(encoded);
});

export default router;
