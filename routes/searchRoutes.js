const express = require("express");
const {
  searchAll,
  addSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
} = require("../controllers/searchController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/searchresult/:searchTerm", searchAll);
router.put("/addsearchhistory", protect, addSearchHistory);
router.get("/getsearchhistory", protect, getSearchHistory);
router.put("/deletesearchhistory/:searchId", protect, deleteSearchHistory);

module.exports = router;
