const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var speciesSchema = new Schema({
  speciesName: String,
  category: { type: mongoose.Types.ObjectId, ref: "Category" },
});

module.exports = mongoose.model('Species', speciesSchema)