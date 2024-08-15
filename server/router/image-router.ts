import { Router } from 'express';
import {
  getImage,
  uploadImage,
  getImageList,
  deleteImage,
} from '../api/image-api.js';
import multer from 'multer';
import fs from 'fs';
import isAuth from '../midleware/is-auth.js';

export const imageRouter = Router();

// Configure multer for file handling
// create folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  },
});

const upload = multer({ storage: storage });

imageRouter.get('/image/:id/:key', getImage);

imageRouter.post('/upload-image', isAuth, upload.single('image'), uploadImage);

imageRouter.get('/image/:id', isAuth, getImageList);

imageRouter.delete('/image/:id/:key?', isAuth, deleteImage);
