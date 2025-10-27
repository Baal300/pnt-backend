import dotenv from 'dotenv';
import { Storage } from '@google-cloud/storage';
const bucketName = 'pokecries';

export const getPokeCry = async (pokemonId: string) => {
  try {
    const readStream = await createFileReadStream(`${pokemonId}.ogg`);
    return readStream;
  } catch (error) {
    console.error('Error getting poke cry:', error);
    return null;
  }
};

async function createFileReadStream(fileName: string) {
  const storage = new Storage();

  // Downloads the file
  try {
    const fileReadStream = await storage
      .bucket(bucketName)
      .file(fileName)
      .createReadStream();

    // Handle stream errors
    fileReadStream.on('error', (error) => {
      console.error('Stream error:', error);
    });

    console.log(`gs://${bucketName}/${fileName} requested.`);
    return fileReadStream;
  } catch (error) {
    console.error('Error downloading file:', error);
  }

  return null;
}
