import dotenv from 'dotenv';
import { storage } from '../index';
import { Response } from 'express';
const bucketName = 'pokecries';

export const streamCryAudio = async (res: Response, fileName: string) => {
  const time = Date.now();

  // Downloads the file
  try {
    return storage
      .bucket(bucketName)
      .file(fileName)
      .createReadStream()
      .pipe(res);
  } catch (error) {
    console.error('Error downloading file:', error);
  }

  return null;
};
