const express=require('express')
const router=express.Router()
const pool=require('../db')
const Cryptr=require('cryptr')
const cryptr = new Cryptr('myTotalySecretKey');
const fetchuser=require('../middleware/fetchuser')
const {body,validationResult}=require('express-validator');
const compareuser = require('../middleware/compareuser');
const uniqueTitle = require('../middleware/uniqueTitle');
const message = require('../middleware/messageText');
router.post("/api/createnote",fetchuser,[
    body('title',"Title Length Must be greater then 5 and less then 50").isLength({min:3,max:50}),
    body('description','Description Length Must be greater then 5').isLength({min:5})
],uniqueTitle,(req,res)=>{
    try{
    var error=validationResult(req);
    if(error.isEmpty()){
        
    pool.query(`insert into inotebook.note (${Object.keys(req.body)},userid) values(?,?,?,?)`,[req.body.title,cryptr.encrypt(req.body.description),req.body.tag,req.user.userid],async(error,result)=>{
        if(error){
            res.status(500).json({status:false,message:error.message})

        }
        else{
           fetchNote(result.insertId,res);
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
router.put("/api/update/:noteid",fetchuser,[
    body('title',"Title Length Must be greater then 5 and less then 50").isLength({min:3,max:50}),
    body('description','Description Length Must be greater then 5').isLength({min:5})
],compareuser,uniqueTitle,(req,res)=>{
    try{
        var error=validationResult(req);
    if(error.isEmpty()){
    pool.query(`update inotebook.note set title=?,description=?,tag=? where noteid=?`,[req.body.title,cryptr.encrypt(req.body.description),req.body.tag,req.params.noteid],(error,result)=>{
        if(error){
            res.status(500).json({status:false,message:error.message})
        }
        else{
            fetchNote(req.params.noteid,res);
        }
    })
}
else{
    res.status(400).json({status:false,message:message(error.array()),error:error.array()})
}
}
catch(error){
return res.status(500).json({status:false,message:"Internal server error"})
}
})
router.delete("/api/delete/:noteid",fetchuser,compareuser,(req,res)=>{
    pool.query('delete from inotebook.note where noteid=?',[req.params.noteid],(error,result)=>{
        if(error){
            res.status(500).json({status:false,message:error.message})
        }
        else{
            res.json({status:true,message:"Deleted successfuly"})
        }
    })
})
router.get("/api/getnote",fetchuser,(req,res)=>{
    pool.query('select noteid,description,tag,title,date from inotebook.note where userid=?',[req.user.userid],(error,result)=>{
        if(error){
            res.status(500).json({status:false,message:error.message})
        }
        else{
            for(let note of result){
                note.description=cryptr.decrypt(note.description)
            }
            res.json({status:true,body:result})
        }
    })
})
async function fetchNote(id,res){
    await pool.query('select noteid,description,tag,title,date from inotebook.note where noteid=?',[id],(error,result)=>{
        if(error){
            console.log(error)
            return res.status(500).json({status:false,body:[],message:error.message})
        }
        else{
            result[0].description=cryptr.decrypt(result[0].description)
            return res.status(200).json({status:true,body:result[0]})
        }
            })
}
module.exports=router;