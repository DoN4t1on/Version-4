const path = require('path');
const multer = require('multer');

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'images'));
    },
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname).toLowerCase();
      const basename = path.basename(file.originalname, extension)
        .replace(/[^a-z0-9_-]/gi, '-')
        .slice(0, 80);
      cb(null, `${Date.now()}-${basename}${extension}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
  fileFilter(req, file, cb) {
    cb(null, allowedMimeTypes.has(file.mimetype));
  },
});

module.exports = upload;
