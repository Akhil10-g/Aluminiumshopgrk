const express = require("express");
const {
	createQuote,
	deleteQuote,
	getQuotes,
	markQuoteOpened,
} = require("../controllers/quoteController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/", createQuote);
router.get("/", verifyToken, getQuotes);
router.patch("/:id/open", verifyToken, markQuoteOpened);
router.delete("/:id", verifyToken, deleteQuote);

module.exports = router;
