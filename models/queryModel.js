const mongoose = require('mongoose')
const Schema = mongoose.Schema


const querySchema = new Schema({

   name:
   {
    type:String
   },
   email:
   {
    type:String
   },
   mobile:
   {
    type:String
   },
   message:
   {
      type:String
   },
   page_id:
   {
    type:String
   },
   page_name:
   {
    type:String
   },
   is_reply:
   {
    type:Boolean,
    default:false
   },
   document_path:{
       type:String
   }
   
}
,
  {
    timestamps: true,
  }
)


const queryModel = mongoose.model("queryModel", querySchema);

module.exports = queryModel;