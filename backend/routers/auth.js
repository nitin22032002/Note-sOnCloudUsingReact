const express=require('express')
const router=express.Router()
const pool=require('../db')
const message=require('../middleware/messageText')
const {body,validationResult}=require('express-validator')
const bcryter=require('bcryptjs')
const jwt=require('jsonwebtoken')
require("dotenv").config()
const fetchuser=require('../middleware/fetchuser');
router.post("/api/createuser",[
    body('emailid',"Invalid Email Id").isEmail(),
    body('password',"Password Length Must Lie Between 5 and 24").isLength({min:5,max:24}),
    body('name',"Name Not Valid").isLength({min:2,max:25}),
],async(req,res)=>{
    try{
    var error=validationResult(req);
    if(error.isEmpty()){
    const salt=await bcryter.genSalt(10);
    req.body.password=await bcryter.hash(req.body.password,salt)
    pool.query(`insert into inotebook.user (${Object.keys(req.body)}) values(?,?,?)`,[req.body.name,req.body.emailid,req.body.password],(error,result)=>{
        if(error){
            if(String(error.message).includes("Duplicate entry"))
            res.status(400).json({status:false,message:"This Email Id Already Registered With Us",errorCode:400})
            else
            res.status(500).json({status:false,message:"Internal Server Error"})

        }
        else{
            const data={
                user:{
                    userid:result.insertId
                }
            }
            const token=jwt.sign(data,process.env.SECRET_STRING)
            res.json({status:true,token:token,result})
        }
    })}
    else{
        res.status(400).json({status:false,message:message(error.array()),error:error.array()})
    }
}
catch(error){
    return res.status(500).json({status:false,message:"Internal server error"})
}
})
router.post("/api/login",[
    body('emailid',"Invalid Email Id").isEmail(),
    body('password',"Password Not Be Blank").exists(),
],async(req,res)=>{
   try{
    var error=validationResult(req);
    if(error.isEmpty()){
    pool.query('select userid,password from inotebook.user where emailid=?',[req.body.emailid],async(error,result)=>{
        if(error){
            res.status(500).json({status:false,message:"Internal Server Error"})
        }
        else if(result.length!==0){
            const compare=await bcryter.compare(req.body.password,result[0].password);
            if(compare){
                let data={
                    user:{
                        userid:result[0].userid
                    }
                }
                const token=jwt.sign(data,process.env.SECRET_STRING)
                res.status(200).json({status:true,token:token})}
            else{
                res.status(401).json({status:false,message:"Invalid Login Credential"})
            }
        }
        else{
            res.status(401).json({status:false,message:"Invalid Login Credential "})
        }
    })}
    else{
        res.status(400).json({status:false,message:message(error.array()),error:error.array()})
    }
}
catch(error){
    return res.status(500).json({status:false,message:"Internal server error"})
}
})
router.put("/api/update",fetchuser,[
    body('emailid',"Invalid Email Id").isEmail(),
    body('name',"Name Not Valid").isLength({min:2,max:25}),
],async(req,res)=>{
    try{
    var error=validationResult(req);
    if(error.isEmpty()){
    pool.query(`update inotebook.user set name=?,emailid=? where userid=?`,[req.body.name,req.body.emailid,req.user.userid],(error,result)=>{
        if(error){
            if(String(error.message).includes("Duplicate entry"))
            res.status(400).json({status:false,message:"This Email Id Already Registered With Us",errorCode:400})
            else
            res.status(500).json({status:false,message:"Internal Server Error"})
        }
        else{
            res.json({status:true,body:result})
        }
    })}
    else{
        res.status(400).json({status:false,message:message(error.array()),error:error.array()})
    }
}
catch(error){
    console.log(error)
    return res.status(500).json({status:false,message:"Internal server error"})
}
})
router.put("/api/updatepassword",fetchuser,[
    body('emailid',"Invalid Email Id").isEmail(),
    body('password',"Password Not Valid").isLength({min:2,max:25}),
],async(req,res)=>{
    try{
    var error=validationResult(req);
    if(error.isEmpty()){
        const salt=await bcryter.genSalt(10);
    req.body.password=await bcryter.hash(req.body.password,salt)
    pool.query(`update inotebook.user set password=? where emailid=? and userid=?`,[req.body.password,req.body.emailid,req.user.userid],(error,result)=>{
        if(error){
            console.log(error)
            res.status(500).json({status:false,message:"Internal Server Error"})
        }
        else{
            res.json({status:true,body:result})
        }
    })}
    else{
        res.status(400).json({status:false,message:message(error.array()),error:error.array()})
    }
}
catch(error){
    console.log(error)
    return res.status(500).json({status:false,message:"Internal server error"})
}
})
router.get('/fetchuser',fetchuser,(req,res)=>{
    try{
        pool.query('select name,emailid,date from inotebook.user where userid=?',[req.user.userid],function(error,result){
            if(error){
                console.log(error)
                return res.status(500).json({status:false,message:"Internal server error"})   
            }
            else if(result.length===0){
                return res.status(401).json({status:false,message:"Authentication invalid"})
            }
            else{
                return res.status(200).json({status:true,body:result[0]})
            }
        })
    }
    catch(error){
        return res.status(500).json({status:false,message:"Internal server error"})
    }
})
module.exports=router;