const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title:
    {
        type:String
    },
    description:
    {
      type:String
    },
    path:
    {
        type:String
    },
    category:
    {
        type:String
    },
    date:
    {
      type:String
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'commentModel'
    }]
  },
  {
    timestamps: true,
  }
);

const blogModel = mongoose.model("blogModel", blogSchema);

module.exports = blogModel;