const Quote = require("../models/Quote");

const createQuote = async (req, res) => {
  try {
    const { name, phone, service, message, contactMode } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const quote = await Quote.create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      service: String(service || "").trim(),
      message: String(message || "").trim(),
      contactMode: ["call", "whatsapp", "either"].includes(contactMode)
        ? contactMode
        : "either",
    });

    return res.status(201).json({
      message: "Quote request submitted successfully",
      quote,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to submit quote request" });
  }
};

const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }).limit(300);

    return res.status(200).json({
      total: quotes.length,
      quotes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch quote requests" });
  }
};

const markQuoteOpened = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({ message: "Quote request not found" });
    }

    if (!quote.isOpened) {
      quote.isOpened = true;
      quote.openedAt = new Date();
      await quote.save();
    }

    return res.status(200).json({
      message: "Quote marked as opened",
      quote,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update quote status" });
  }
};

const deleteQuote = async (req, res) => {
  try {
    const deleted = await Quote.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Quote request not found" });
    }

    return res.status(200).json({ message: "Quote request deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete quote request" });
  }
};

module.exports = {
  createQuote,
  deleteQuote,
  getQuotes,
  markQuoteOpened,
};
