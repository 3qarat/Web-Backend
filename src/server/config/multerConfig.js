import multer from 'multer';
import path from 'path';

// Configure multer storage and file restrictions
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB limit per file (adjust as necessary)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype); //format

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Error: Images Only!'));
    }
  }
});

export default upload;
