const mongoose = require('mongoose')
const student_testimonial_schema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    youtube_link:{
         type:String,
         required:true
    }

},

  {timestamps:true}
)

const student_testimonial_model = mongoose.model('student_testimonial_model',student_testimonial_schema)
module.exports = student_testimonial_model