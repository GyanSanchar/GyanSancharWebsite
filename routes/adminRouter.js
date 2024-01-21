const express =require('express')
const adminRouter = express()
adminRouter.set("view engine","ejs")
adminRouter.set("views","./views")
const bodyParser = require("body-parser");
adminRouter.use(bodyParser.urlencoded({ extended: true }));
const adminController = require('../controller/adminController')
const adminauth = require('../middleware/adminauth')
const blogModel = require('../models/blogModel')
const rankerModel = require('../models/rankerModel')
adminRouter.use(express.json())
const multer = require('multer');
const aws = require('aws-sdk');
const storage = multer.memoryStorage();
const env = require('../environment/env')
const upload = multer({ storage });
aws.config.update({
    accessKeyId:env.S3_ACCESS_KEY,
    secretAccessKey:env.S3_SECRET_KEY,
    region:env.S3_REGION,
  });

const s3 = new aws.S3();
adminRouter.get("/get_student_testimonial",adminauth.adminisLogin,adminController.get_student_testimonials)
adminRouter.get('/delete_testimonials',adminController.delete_student_testimonials)
adminRouter.get("/get_add_online_course",adminController.get_admin__online_course)
adminRouter.post("/add_online_course",adminController.add_online_course_section)
adminRouter.post('/add_online_tutorial',adminController.add_online_tutorial)
adminRouter.get('/delete_online_tutorial',adminController.delete_online_course_tutorial)
adminRouter.get("/delete_online_section",adminController.delete_online_course_section)
adminRouter.post("/add_blog",upload.single('document'), async (req,res)=>
{
    try
    {
        const { originalname, buffer } = req.file;
       // Upload the file to AWS S3
       const params = {
         Bucket:env.S3_BUCKET,
         Key: originalname,
         Body: buffer,
       };
   
       const s3Response = await s3.upload(params).promise();
       const filelocation = s3Response.Location
          const thedate = new Date()
          const date = thedate.getDate()
          const month = thedate.getMonth()
          const updatemonth = month+1
          const year = thedate.getFullYear()
          const mydate = (date+'-'+updatemonth+'-'+year)
        var  blog_details = 
        {
           title:req.body.title,
           description:req.body.description,
           category:req.body.category,
           path:filelocation,
           date:mydate
        }
        

        const customerdocument = await blogModel.create(blog_details)
        return res.redirect('/admin/get_add_blog')
    }
    catch(error)
    {
         res.send(error.message)
    }
})

adminRouter.post("/add_rankers",upload.single('document'), async (req,res)=>
{
    try
    {
        const { originalname, buffer } = req.file;
       // Upload the file to AWS S3
       const params = {
         Bucket: env.S3_BUCKET,
         Key: originalname,
         Body: buffer,
       };
   
       const s3Response = await s3.upload(params).promise();
       const filelocation = s3Response.Location


        var  ranker_details = 
        {
           name:req.body.title,
           standard:req.body.standard,
           rank:req.body.rank,
           path:filelocation
        }
        

        const customerdocument = await rankerModel.create(ranker_details)
        return res.redirect('/admin/get_add_ranker')
    }
    catch(error)
    {
         res.send(error.message)
    }
})




adminRouter.get("/adminlogin",(req,res)=>{
    res.render('adminlogin',{message:null,status:null})
})


adminRouter.post("/adminlogin",adminController.adminLogin)

adminRouter.get("/get_add_blog",adminauth.adminisLogin,adminController.get_add_blog)
adminRouter.get("/get_add_ranker",adminauth.adminisLogin,adminController.get_add_ranker)

adminRouter.get("/get_edit_blog",adminauth.adminisLogin,adminController.get_edit_blog)
adminRouter.get("/adminhome",adminauth.adminisLogin,adminController.adminhome)
adminRouter.get("/delete_blog",adminauth.adminisLogin,adminController.delete_blog)
adminRouter.get("/delete_comment",adminauth.adminisLogin,adminController.delete_comment)
adminRouter.get("/delete_ranker",adminauth.adminisLogin,adminController.delete_ranker)
adminRouter.get("/update_comment",adminauth.adminisLogin,adminController.update_comment)
adminRouter.get("/get_queries",adminauth.adminisLogin,adminController.get_query)
adminRouter.get("/get_add_more_page",adminController.get_add_more_pages)
adminRouter.post("/add_more_page",adminController.post_add_more_pages)
adminRouter.get("/morepage/:page_name",adminController.get_more_page)
adminRouter.post("/add_total_number",adminController.add_total_numbers)
adminRouter.get("/edit_homepage",adminController.edit_home_page)
adminRouter.get("/delete_number",adminController.delete_number)
const session= require("express-session");
adminRouter.use(session({
    secret: "My session Secret",
    resave: true,
    saveUninitialized: true
}));

module.exports=
{
    adminRouter
}