const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rankSchema = new Schema(
  {
    name:
    {
        type:String
    },
    rank:
    {
      type:String
    },
    path:
    {
        type:String
    },
    standard:
    {
        type:String
    }
  },
  {
    timestamps: true,
  }
);

const rankModel = mongoose.model("rankModel", rankSchema);

module.exports = rankModel;