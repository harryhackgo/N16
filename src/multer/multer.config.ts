import * as multer from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExt = extname(file.originalname);
      cb(null, `${uniqueSuffix}${fileExt}`); 
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = extname(file.originalname);
    if (fileExtension !== '.jpg' && fileExtension !== '.jpeg' && fileExtension !== '.png') {
      return cb(new Error('Only .jpg, .jpeg, and .png files are allowed'), false);
    }
    cb(null, true); 
  },
};
