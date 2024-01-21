const env = require('./environment/env')
const port = 3000
const express = require('express')
const adminRouter = require('./routes/adminRouter')
const app = express()
const adminController = require('./controller/adminController')
const bodyParser = require('body-parser')
const userController = require('./controller/userController')
const rankerModel = require('./models/rankerModel')
const student_testimonial_model = require('./models/student_testimonials')
const online_course_model = require('./models/online_courseModel')
const cookieParser = require('cookie-parser');
const {formValidation} = require('./validations/authValidation')
const cors = require('cors')
app.use(cors())
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({     
  extended: true
}));
app.use(express.json())
const {homeconstant,
aboutconstant,
contactconstant,
lil_genius,
iit_jee,
nda,
blog,
arambh,
neet,
download_app_constant,
download_constant,
detail_blog,
skill_course_constant,
online_course_constant} = require('./constants/pageconstant')
app.set('views','./views')
app.use("/public/images",express.static('./public/images'));
app.use("/public",express.static('./public'));
app.use('/assets',express.static('assets'));
const database = require('./database/connection')
const session = require('express-session');
const authmiddle = require('./middleware/authmiddle')
app.use(session(
    {
        secret:"Mysecret",
        resave:false,
        saveUninitialized:false
    }
))
app.post('/add_comment',adminController.add_comment)
app.use("/admin",adminRouter.adminRouter)
app.get("/get_blog/:title",adminController.get_blog)
app.get('/',adminController.get_home)
app.get('/iit_jee',(req,res)=>{
    res.render('iitjee',{content:iit_jee,username:req.cookies.user_name})
 })
 app.get('/neet',(req,res)=>{
    res.render('neet',{content:neet,username:req.cookies.user_name})
 })
 app.get('/arambh',(req,res)=>{
    res.render('arambh',{content:arambh,username:req.cookies.user_name})
 })

 app.get('/Lil_genius',(req,res)=>{
    res.render('lil_genius',{content:lil_genius,username:req.cookies.user_name})
 })
 app.get('/nda',(req,res)=>{
    res.render('nda',{content:nda,username:req.cookies.user_name})
 })
 app.get('/online_course', async (req,res)=>{
    try
    {
      const online_course = await online_course_model.find().lean()
      res.render('online_course',{content:online_course_constant,username:req.cookies.user_name,online_course})
    }
    catch(error)
    {
        console.log(error.message)
    }
    
 })
 app.get('/download_app',(req,res)=>{
    res.render('download_app',{content:download_app_constant,username:req.cookies.user_name})
 })
 app.get('/skill_development',(req,res)=>{
    res.render('skill_development',{content:skill_course_constant,username:req.cookies.user_name})
 })
 app.get('/about',(req,res)=>{
    res.render('about_us',{content:aboutconstant,username:req.cookies.user_name})
 })
 app.get('/answer_key',(req,res)=>{
   res.render('answer_key',{content:download_constant,username:req.cookies.user_name})
})
 app.get('/contact',(req,res)=>{
    res.render('contact',{content:contactconstant,username:req.cookies.user_name})
 })
 app.get('/blogs',adminController.get_all_blog) 
 app.get('/blogs/category',adminController.get_blog_category)

app.post("/add_student_testimonials",adminController.add_student_testimonials)
 app.get("/login",(req,res)=>
 {
   res.render('login',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/signup",(req,res)=>
 {
   res.render('signup',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/jee_main_exam",(req,res)=>
 {
   res.render('more_jee_main',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/jee_advance_exam",(req,res)=>
 {
   res.render('more_jee_advance',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/neet_exam",(req,res)=>
 {
  res.render('more_neet',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/ntse_exam",(req,res)=>
 {
  res.render('more_ntse',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/cuet_exam",(req,res)=>
 {
  res.render('more_cuet',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/mvpp_exam",(req,res)=>
 {
  res.render('more_mvpp',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get("/nda_exam",(req,res)=>
 {
  res.render('more_nda',{content:homeconstant,username:req.cookies.user_name})
 })
 app.get('/admission-for-class-9-to-12',(req,res)=>
 {
   res.render('admission_Form',{content:homeconstant,username:req.cookies.user_name})
 })
 
 app.get('/admission_jee_mains', async  (req,res)=>
 {
     try
     {
          const ranker = await rankerModel.find().lean()
          const student_testimonials = await student_testimonial_model.find().lean()
          res.render('admission_jee_mains',{content:homeconstant,username:req.cookies.user_name,data:ranker,student_testimonials:student_testimonials})
     }
      catch(error)
      {
          console.log(error.message)
      }
 })

 app.get('/admission_neet', async (req,res)=>
 {
      try
      {
            const ranker = await rankerModel.find().lean()
            const student_testimonials = await student_testimonial_model.find().lean()
            res.render('admission_neet',{content:homeconstant,username:req.cookies.user_name,data:ranker,student_testimonials:student_testimonials})
      }
        catch(error)
        {
            console.log(error.message)
        }
 })
 app.get("/disclaimer",(req,res)=>{res.render('disclaimer',{content:homeconstant,username:req.cookies.user_name})})
 app.get("/privacy_policy",(req,res)=>{res.render('privacy_policy',{content:homeconstant,username:req.cookies.user_name})})
 app.get("/faqs",(req,res)=>{res.render('faqs',{content:homeconstant,username:req.cookies.user_name})})
 app.get("/terms_and_conditions",(req,res)=>{res.render('tandc',{content:homeconstant,username:req.cookies.user_name})})
 app.get("/gs_noida",(req,res)=>{res.render('gs_noida',{content:homeconstant,username:req.cookies.user_name})})
//  app.get("*",(req,res)=>
//  {
//   res.render('404.ejs',{content:homeconstant,username:req.cookies.user_name})
//  })
 app.get('/verify',userController.verifymail)
app.post("/signup",userController.userRegister)
app.post("/login",userController.userLogin)
app.get("/morepage/:page_name",adminController.get_more_page)
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('user_name');
    res.redirect('/')
 })
app.listen(port,()=>{
    database.databaseConnection();
    console.log(`Server is running at ${port}`)
})


/////GOOGLE SIGN IN VALA KHEL



const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
   clientID: env.GOOGLE_CLIENT_ID,
   clientSecret: env.GOOGLE_CLIENT_SECRET,
   callbackURL: `http://${env.domain}/auth/google/callback`,
 }, (accessToken, refreshToken, profile, done) => {
   // You can save the user's profile in the database or handle the authentication as needed.
   return done(null, profile);
 }));
 
 passport.serializeUser((user, done) => {
   done(null, user);
 });
 
 passport.deserializeUser((user, done) => {
   done(null, user);
 });
 
 // Configure Express
 app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
 app.use(passport.initialize());
 app.use(passport.session());
 
 
 app.get('/auth/google',
   passport.authenticate('google', { scope: ['profile', 'email'] })
 );
 
 app.get('/auth/google/callback',
   passport.authenticate('google', { failureRedirect: '/' }),
   (req, res) => {
      res.cookie('user_name',req.user.displayName)
     // Successful authentication, redirect or send a response as needed.
     res.redirect('/');
   }
 );
 
 app.get('/profile', (req, res) => {
   // Access the authenticated user's profile here (req.user contains the profile data).
   res.send(`Hello, ${req.user.displayName}!`);
 });
 
 app.post('/submit_form',userController.submit_form)
 app.post('/subscribe',userController.subscribe)
 
 
 
 
 
 
const multer = require('multer')
const path = require('path')
const queryModel = require('./models/queryModel')
const storage = multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,path.join(__dirname,'/public/resumes'),function(error,success){
          if(error) throw error
      })
  },
  filename:function(req,file,cb){
      const name = Date.now()+'-'+file.originalname
      cb(null,name),function(error,success){
          if(error) throw error
      }
  }

})
const upload = multer({storage:storage})


app.post('/submit_contact_form' , upload.single('document_path'),async (req,res)=>
{
     try
     {
            const {error} = formValidation(req.body)
            if(error)
            {
                const successMessage = error.message
                return res.status(400).json(successMessage)
            }
            req.body.document_path = req.file.filename
            const query_data = await queryModel.create(req.body)
            res.status(200).json("Thank You for sharing the details. Our team will get back to you within 24 hrs.")
     }
     catch(error)
     {
       res.status(400).json(error.message)
     }
})

 