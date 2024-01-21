const mongoose = require('mongoose')
const Schema = mongoose.Schema

const morepageSchema = new Schema({
    page_name:{
        type:String,
    },
    page_content:
    {
        type:String
    }
},
    {
        timestamps:true
    },
);

const morepageModel = mongoose.model("morepageModel", morepageSchema);

module.exports = morepageModel;