const FAQ = require("../models/FAQ");

exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQs", error: error.message });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    console.log("Thiis is working !!!!");
    
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(400).json({ message: "Error adding FAQ", error: error.message });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, { question, answer }, { new: true });
    res.json(updatedFAQ);
  } catch (error) {
    res.status(400).json({ message: "Error updating FAQ", error: error.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error: error.message });
  }
};
