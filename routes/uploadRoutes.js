// const express = require("express");
// const router = express.Router();
// const cloudinary = require("../utils/cloudinary");
// const upload = require("../middleware/multer");

// // Single image upload
// router.post("/single", upload.single("image"), async (req, res) => {
//   try {
//     const result = await cloudinary.uploader.upload_stream(
//       { folder: "pandafood" },
//       (error, result) => {
//         if (error) return res.status(500).json({ message: error.message });
//         res.status(200).json({ url: result.secure_url });
//       }
//     );

//     result.end(req.file.buffer);
//   } catch (err) {
//     res.status(500).json({ message: "Upload failed" });
//   }
// });

// // Multiple image upload
// router.post("/multiple", upload.array("images", 5), async (req, res) => {
//   try {
//     const urls = [];

//     const uploadPromises = req.files.map((file) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "pandafood" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result.secure_url);
//           }
//         );

//         stream.end(file.buffer);
//       });
//     });

//     const results = await Promise.all(uploadPromises);
//     res.status(200).json({ urls: results });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const {
  upolads,
  imagesList,
  deleteImageFolder,
} = require("../controllers/uploadsController");
const uploadmiddleWares = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/images", protect, uploadmiddleWares, upolads);
router.post("/deliveryManRegisterimages", uploadmiddleWares, upolads);
router.post("/imagesdelete", protect, deleteImageFolder);
router.post("/getimageslist", imagesList);

module.exports = router;
