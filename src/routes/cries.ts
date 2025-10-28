import express from 'express';
import { streamCryAudio } from '../services/pokecryService';

const router = express.Router();

const validateId = (id: string): boolean => {
  const idNumber = parseInt(id);
  return !isNaN(idNumber) && idNumber > 0;
};

router.get('/:id', async (req, res) => {
  console.log('Received request for Pokémon cry');
  const cryId = req.params.id;

  if (!validateId(cryId)) {
    return res.status(400).json({ error: 'Invalid or missing "id" parameter' });
  }

  try {
    res.setHeader('Content-Type', 'audio/ogg');
    res.setHeader('Cache-Control', 'max-age=3600');
    streamCryAudio(res, `${cryId}.ogg`);
    return res.status(200);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch Pokémon cry' });
  }
});

export default router;
