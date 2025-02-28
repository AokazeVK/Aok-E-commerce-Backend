const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'pad', background: 'white', quality: 'auto' }
    ]
  },
});
const uploadMiddleware = multer({ storage }).array('imagenes', 5); // Hasta 5 imágenes

module.exports = uploadMiddleware;
