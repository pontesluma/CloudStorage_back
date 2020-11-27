import multer from 'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename(req, file, callback) {
      const fileName = `${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};