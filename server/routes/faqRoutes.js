const express = require("express");
const { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = require("../controllers/faqController");

const router = express.Router();

router.get("/", getAllFAQs);    // GET all FAQs
router.post("/", createFAQ);    // POST new FAQ
router.put("/:id", updateFAQ);  // PUT update FAQ
router.delete("/:id", deleteFAQ); // DELETE FAQ

module.exports = router;
