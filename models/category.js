const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var categorySchema = new Schema({
  categoryName: String,
});

module.exports = mongoose.model('Category', categorySchema)