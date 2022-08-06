const mongoose = require("mongoose");

const IssuesSchema = mongoose.Schema(
  {
    createBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    solvedBy: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Ncc"},
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    Status: {type: String, required: true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issues", IssuesSchema);
