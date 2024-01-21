
const {userRegisterValidation,userLoginValidation}= require('../validations/authValidation')
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel')
const blogModel = require('../models/blogModel')
const commentModel = require('../models/commentModel')
const {homeconstant, blog_constant} = require('../constants/pageconstant')
const morepageModel = require('../models/morepageModel')
const totalnumberModel = require('../models/totalnumberModel')
var url = require("url");
var path = require("path");
const saltRounds = 10;
const aws = require('aws-sdk')
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const multer = require('multer');
const multerS3 = require('multer-s3');
const env = require('../environment/env');
const queryModel = require('../models/queryModel');
const rankerModel = require('../models/rankerModel')
const student_testimonial_model = require('../models/student_testimonials')
const online_course_model = require('../models/online_courseModel')
const MyBucket = env.S3_BUCKET
const s3 = new aws.S3({
    accessKeyId:env.S3_ACCESS_KEY,
    secretAccessKey:env.S3_SECRET_KEY,
    region:env.S3_REGION
});

const upload =()=>  multer(
  {
      storage:multerS3({
          s3,
          bucket:MyBucket,
          metadata:function(req,file,cb){
              cb(null,{fieldName:file.originalname})
          },
          key:function(req,file,cb)
          {
              cb(null,Date.now()+file.originalname)
          }
      })
  })

  exports.adminhome = async(req,res)=>
  {
      try
      {
           res.render('adminhome')
      }
      catch(error)
      {
          console.log(error.message)
      }
  }
  
  exports.adminLogin = async (req,res)=>
  {
      const { error } = userLoginValidation(req.body);
      if (error) {
        return res.render('adminlogin',{message:error.message,status:400})
      }
  
      try
      {
              const {email} = req.body
              const user = await userModel.findOne({ email }).lean();
              if (!user) {
                return res.render('adminlogin',{message:"User not Found",status:400})
              }
          const password = req.body.password;
          if(!bcrypt.compareSync(password, user.password))
          {
              return res.render('adminlogin',{message:"Incorrect Password",status:400})
          
          }
          if(user.is_admin==false)
          {
              return res.render('adminlogin',{message:"Invalid User",status:400})
          }
           req.session.admin_id = user._id
  
           return res.redirect('/admin/adminhome')
      }
      catch(error)
      {
         return res.render('adminlogin',{message:error.message,status:400})
      }
  }
exports.get_add_blog = async (req,res)=>
{
    try
    {
        const all_blogs = await blogModel.find().lean()
        res.render('add_blog',{content:blog_constant,blogs:all_blogs,username:req.cookies.user_name})
    }
    catch(error)
    {
        res.send(error.message)
    }
}

exports.get_edit_blog = async (req,res)=>
{
    try
    {
        const blog_id = req.query.id
        const blog = await blogModel.findById({_id:blog_id}).populate('comments')
        
        res.render('edit_blog',{content:homeconstant,blog_detail:blog})

    }
    catch(error)
    {
        res.send(error.message)
    }
}
exports.add_comment = async (req,res)=>
{
    try
    {
        const blog_id=req.body.blog_id
        const comment_body= new commentModel({
            name:req.body.name,
            message:req.body.message,
            email:req.body.email,
            blog:blog_id
        })

        const comment = await comment_body.save()
        const blogRelated = await blogModel.findByIdAndUpdate({_id:blog_id},{$push:{comments:{_id:comment._id}}})
        const successMessage = "Comment Submitted the comment will be shown here when admin approved it."
         return res.status(200).json(successMessage);
    }
    catch(error)
    {
        return res.status(200).json(error.message);
    }
}

exports.get_blog = async (req,res)=>
{
    try
    {
          const blog_id = req.params.title
          const blog = await blogModel.findOne({title:blog_id}).populate('comments')
          
          res.render('detail_blog',{content:blog_constant,blog_detail:blog,username:req.cookies.user_name})
    }
    catch(error)
    {
        res.send(error.message)
    }
}
exports.get_all_blog = async (req,res)=>
{
    try
    {
        const all_blogs = await blogModel.find().lean()
        res.render('blogs',{content:blog_constant,blogs:all_blogs,username:req.cookies.user_name})
    }
    catch(error)
    {
        res.send(error.message)
    }
}
exports.get_blog_category = async (req,res)=>
{
    try
    {
        const category = req.query.category
        const all_blogs = await blogModel.find({category:category}).lean()
        res.render('blogs',{content:blog_constant,blogs:all_blogs,username:req.cookies.user_name})
    }
    catch(error)
    {
        console.log(error.message)
    }
}
exports.delete_blog = async (req,res)=>
{
    try
    {
         const blog_id=req.query.id
         const blog = await blogModel.findByIdAndDelete({_id:blog_id})
         const objecturl = blog.path
         const filename = url.parse(objecturl)
         const filekey = (path.basename(filename.pathname));

         var params = {  Bucket: MyBucket, Key: filekey }

         s3.deleteObject(params, function(err, data){
            if (err) 
            {
                return res.status(400).json({
                    success:false,
                    message:err.message
                })
            }                 
            })            
         res.redirect('/admin/get_add_blog')
    }
    catch(error)
    {
        res.send(error.message)
    }
}

exports.delete_comment = async (req,res)=>
{
    try
    {
          const comment_id = req.query.comment_id

          const blog_id = req.query.blog_id
          const comment = await  commentModel.findByIdAndDelete({_id:comment_id})
          res.redirect(`/admin/get_edit_blog?id=${blog_id}`)
    }
    catch(error)
    {
        res.send(error.message)
    }
}


exports.update_comment = async (req,res)=>
{
    try
    {
        const blog_id = req.query.blog_id
          const comment_id=req.query.comment_id 
          const comment = await commentModel.findByIdAndUpdate({_id:comment_id},{approved:true})
          res.redirect(`/admin/get_edit_blog?id=${blog_id}`)
    }
    catch(error)
    {
        res.send(error.message)
    }
}

exports.get_query = async  (req,res)=>
{
    try
    {
         const page_name = req.query.page_id
        const queries = await queryModel.find({page_id:page_name})
        res.render('querypage',{queries:queries})
    }
    catch(error)
    {
        res.send(error.message)
    }
}

exports.get_add_ranker = async (req,res)=>
{
    try
    {
        const rankers = await rankerModel.find()
        res.render('add_ranker',{rankers})
    }
    catch(error)
    {
        res.send(error.message)
    }
}


exports.delete_ranker = async (req,res)=>
{
    try
    {
         const blog_id=req.query.id
         const blog = await rankerModel.findByIdAndDelete({_id:blog_id})
         const objecturl = blog.path
         const filename = url.parse(objecturl)
         const filekey = (path.basename(filename.pathname));

         var params = {  Bucket: MyBucket, Key: filekey }

         s3.deleteObject(params, function(err, data){
            if (err) 
            {
                return res.status(400).json({
                    success:false,
                    message:err.message
                })
            }                 
            })            
         res.redirect('/admin/get_add_ranker')
    }
    catch(error)
    {
        res.send(error.message)
    }
}

exports.get_home = async (req,res)=>
{
    try
    {
       const  user_name = req.cookies.user_name
      const number_data = await totalnumberModel.find()
      const rankers = await rankerModel.find()
      res.render('home',{content:homeconstant,data:rankers,username:user_name,number_data:number_data})
    }
    catch(error)
    {
        res.render('home')
    }
}

exports.get_add_more_pages= (req,res)=>
{
    res.render('add_more_page')
}

exports.post_add_more_pages= async (req,res)=>
{
      try
      {
         const pagename = req.body.page_name;
         const page = await morepageModel.findOne({page_name:pagename})
         if(page)
         {
             return res.send("Page name already exist")
         }
         const newpage = await morepageModel.create(req.body)
          return res.send("Page Created");
      }
      catch(error)
      {
        return res.send(error.message)
      }
}

exports.get_more_page = async (req,res)=>
{
    try
    {
        const page_name = req.params.page_name
        const thepage = await morepageModel.findOne({page_name:page_name})
        if(thepage)
        {
            
            return res.render('more_page',{ data:thepage})
        }
        return res.send("Page not found")
      
    }
    catch(error)
    {
        return res.send(error.message)
    }
}

exports.add_total_numbers = async (req,res)=>
{
    try
    {
            
            const numbercard = await totalnumberModel.create(req.body)
            return res.redirect('/admin/edit_homepage')
    }
    catch(error)
    {
        console.log(error.message)
    }
}
exports.delete_number = async (req,res)=>
{
    try
    {
        const number_id = req.query.id
        const numbedata = await totalnumberModel.findByIdAndDelete({_id:number_id})
        res.redirect('/admin/edit_homepage')
    }
    catch(error)
    {
          console.log(error.message)
    }
}
exports.edit_home_page = async (req,res)=>
{
    try
    {
        const numberdata = await totalnumberModel.find()
        res.render('edit_home',{numberdata:numberdata})
    }
    catch(error)
    {
        console.log(error.message)
    }
   
}

/// Student Testimonials 

exports.add_student_testimonials = async (req,res)=>
{
    try
    {
            const student_testimonials = await student_testimonial_model.create(req.body)
            res.redirect('/admin/get_student_testimonial')
    }
    catch(error)
    { 
                  console.log(error.message)
    }
}


exports.get_student_testimonials = async (req,res)=>
{
    try
    {
        const student_testimonials = await student_testimonial_model.find()
        res.render('student_testimonials',{content:homeconstant,username:req.cookies.user_name,student_testimonials})
    }
    catch(error)
    {
        console.log(error.message)
    }
}

exports.delete_student_testimonials = async (req,res)=>
{
    try
    {
          const student_testimonials = await student_testimonial_model.findByIdAndDelete({_id:req.query.id})
          res.redirect('/admin/get_student_testimonial')
    }
    catch(error)
    { 
       console.log(error.message)
    }
}

exports.add_online_course_section = async (req,res)=>
{
    try
    {
        const online_course = await online_course_model.create(req.body)
        return res.redirect('/admin/get_add_online_course')
    }
    catch(error)
    {
        console.log(error.message)
    }
}


exports.get_admin__online_course = async (req,res)=>
{
    try
    {
        const online_course = await online_course_model.find()
        res.render('admin_online_course',{content:homeconstant,username:req.cookies.user_name,online_course})
        //console.log(online_course)
    }
    catch(error)
    {
        console.log(error.message)
    }
}

exports.add_online_tutorial = async (req,res)=>
{
    try
    {
            const online_tutorial =  await online_course_model.findOneAndUpdate(
                { _id: req.body.id },
                { $push: { course_data: { youtube_url: req.body.youtube_url} } },
                { new: true }
            );
            return res.redirect('/admin/get_add_online_course')
    }
    catch(error)
    {
        console.log(error.message)
    }
}

exports.delete_online_course_section = async (req,res)=>
{
    try
    {
        const online_course = await online_course_model.findByIdAndDelete({_id:req.query.id})
        res.redirect('/admin/get_add_online_course')
    }
    catch(error)
    {
        console.log(error.message)
    }
}

exports.delete_online_course_tutorial = async (req,res)=>
{
    try
    {
        const online_course = await online_course_model.findOneAndUpdate(
            { _id: req.query.section_id },
            { $pull: { course_data: {_id:req.query.tutorial_id} } },
            { new: true }
        );
        res.redirect('/admin/get_add_online_course')
    }
    catch(error)
    {
        console.log(error.message)
    }
}







