const mongoose = require("mongoose");
const ProblemModel = require("./ProblemModel");

const allCategoriesSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }, // default value for count
    category: { type: String, required: true, unique: true },
    problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }], // Array of ObjectId references
});

module.exports = mongoose.model("Category", allCategoriesSchema);
