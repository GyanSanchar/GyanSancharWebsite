const mongoose = require('mongoose')
const Schema = mongoose.Schema

const totalnumberSchema = new Schema({
   cardtitle:
   {
    type:String
   },
   cardnumber:
   {
    type:Number
   },
   card_color:
   {
    type:String
   }
    
},
    {
        timestamps:true
    },
);

const totalnumberModel = mongoose.model("totalnumberModel", totalnumberSchema);

module.exports = totalnumberModel;