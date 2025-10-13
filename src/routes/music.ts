import express from 'express';

const router = express.Router();

const validateId = (id: string): boolean => {
  const idNumber = parseInt(id);
  return !isNaN(idNumber) && idNumber > 0;
};

router.get('/:id', async (req, res) => {
  console.log('Received request for music');
  const musicId = req.params.id;

  if (!validateId(musicId)) {
    return res.status(400).json({ error: 'Invalid or missing "id" parameter' });
  }

  if (musicId == '1') {
    return res.sendFile('music.mp3', { root: 'data' });
  } else {
    return res
      .status(404)
      .json({ error: `Music with id ${musicId} not found` });
  }
});

export default router;
