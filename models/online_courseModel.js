const mongoose = require('mongoose')
const Schema = mongoose.Schema

const online_courseSchema = new Schema({
    section_title:{
        type: String
    },
    course_data:[
        {
            youtube_url: String,
        }
    ]
},
{
    timestamps: true
})


const Online_course = mongoose.model('Online_course', online_courseSchema)
module.exports = Online_course