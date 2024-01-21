const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
 name: {
      type: String,
   },
   email:
   {
     type:String
   },
   message:
   {
    type:String
   },
  date:
   {
      type: Date,
      default: Date.now
   },
   approved:
   {
    type:Boolean,
    default:false
   },
blog:
 {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blogModel'
   }
 })

const commentModel = mongoose.model('commentModel', commentSchema);

module.exports = commentModel;