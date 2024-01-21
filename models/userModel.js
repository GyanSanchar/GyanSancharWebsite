const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name:
    {
        type:String
    },
    mobile:
    {
      type:String
    },
    email:
    {
        type:String
    },
    password:
    {
        type:String
    },
    is_verified:
    {
      type:Boolean,
      default:0
    },
    is_admin:
    {
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;