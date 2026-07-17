import multer from 'multer';
import path, { extname } from 'path'

// Storage config
const profilestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/profile_picture'); 
  },

  filename: (req, file, cb) => {
     const filename = path.basename(file.originalname)
    cb(null, Date.now() + filename);
  }
  
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/temp'); // folder where files go
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

export const uploadprofile = multer({ storage:profilestorage, fileFilter });
export const upload = multer({storage,fileFilter})
