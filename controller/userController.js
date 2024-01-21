
const userModel = require('../models/userModel')
const queryModel = require('../models/queryModel')
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const {userRegisterValidation,userLoginValidation,formValidation}= require('../validations/authValidation')
const {homeconstant} = require('../constants/pageconstant')
const nodemailer = require('nodemailer');
const env = require('../environment/env')
const smail="gyan.oper@gmail.com";
const spass=env.email_pass;
const subscriberModel = require('../models/subscriberModel')





const sendmail2 = async (receiver,user_id)=>
{
    
  
var subjectto = "Verificaton  Email"
var message = "Verify Your Email With GyanSanchar "
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: smail, // generated ethereal user
        pass: spass // generated ethereal password
    }
}); 
//Sending mail to provided emailid
let info = transporter.sendMail({
        from: smail, // sender address
        to: receiver, // list of receivers
        subject: subjectto, // Subject line
        html: message +'<a href="http://'+env.domain+'/verify?id='+user_id+'">Click Here To Verify</a>'
       
    },
    function(error) {
        
        console.log(error.message)
    })

}
///////////////////////////////
exports.verifymail = async(req,res)=>
{
    
    try{
        const vuser = await userModel.updateOne({_id:req.query.id},{$set:{is_verified:1}});
        res.redirect('/')
    }
    catch(error)
    {
         console.log(error.message);
    }
}
exports.userRegister = async (req, res) => {
    const { error } = userRegisterValidation(req.body);
    if (error) {
      return res.status(400).json(error.message);
    }
    if(req.body.password!==req.body.confirm_password)
    {
      console.log(req.body.password,req.body.confirm_password)
      return res.status(400).json("Password and Confirm Password do not match");
    }
  const salt= await bcrypt.genSalt(10);
  const securepassword = await bcrypt.hash(req.body.password,salt)
  req.body.password=securepassword
  const {email} =  req.body
  try{
    const user = await userModel.findOne({ email }).lean();
    if (user) 
    {
      return res.status(200).json("User Already Exist");
    }
    
    const ouruser = await userModel.create(req.body);
    sendmail2(ouruser.email,ouruser._id)
    return res.status(200).json("Verification Mail has been sent to your Email Id");
  }
  catch(error)
  {
    return res.status(400).json(error.message);
  }
}


exports.userLogin = async (req,res)=>
{
    const { error } = userLoginValidation(req.body);
    if (error) {
      return res.status(200).json(error.message);
    }

    try
    {
          const {email} = req.body
            const user = await userModel.findOne({ email }).lean();
            if (!user) {
              return  res.status(200).json("User Not Exist");
            }
            if(user.is_verified!==true)
            {
              return res.status(200).json("Please Verify your Email Id")
            }
        const password = req.body.password;
        if(!bcrypt.compareSync(password, user.password))
        {
            return res.status(200).json("Incorrect Password")
        
        }
         req.session.user_id = user._id
         res.cookie('user_name',user.name)
         return res.status(200).json("Logged In")
    }
    catch(error)
    {
       return res.status(200).json(error.message)
    }
}


exports.submit_form = async (req,res)=>
{
  
  const { error } = formValidation(req.body);
    if (error) {
      const successMessage =  error.message ;
      return res.status(400).json(successMessage);
    }
  try
  {
    const queries = await queryModel.create(req.body)
    const successMessage = "Thank You for sharing the details. Our team will get back to you within 24 hrs."
    return res.status(200).json(successMessage);
  }
  catch(error)
  {
    return res.status(200).json(error.message);
  }
}

exports.subscribe = async (req,res)=>
{
  try
  {
          
          const exist_mail = await subscriberModel.findOne({email:req.body.email})
          if(exist_mail)
          {
            return res.status(200).json("Email Id Already Exist")
          }
          const subscribe = await subscriberModel.create(req.body)
          return res.status(200).json("Your are now Subscribed with us")
  }
  catch(error)
  {
        return res.status(400).json(error.message)
  }
}