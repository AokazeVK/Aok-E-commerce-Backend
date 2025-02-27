const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos', // Carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const uploadMultiple = multer({ storage }).array('imagenes', 5); // Hasta 5 imágenes

module.exports = {uploadMultiple};
