const multer = require('multer');

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  // Check if the file is an image (based on MIME type)
  if (file.mimetype.startsWith('image/')) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 2, files: 1 }, // 2 MB limit
  fileFilter: imageFileFilter,
});

module.exports = { upload };
