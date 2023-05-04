const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/beneficiarios')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
  }
});

const sesionesFiles = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/sesiones')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });
const sesionesUpload = multer({storage: sesionesFiles});

module.exports = {
   upload,
   sesionesUpload,
}
