const jwt=require('jsonwebtoken')
const fetchuser=(req,res,next)=>{
    try{
    let token=req.header('auth-token')
    if(token==="null" || !token || token===undefined || token===null || token===""){
        return res.status(401).json({status:false,message:" Invalid Authentication"})}
    const data=jwt.verify(token,process.env.SECRET_STRING);
    if(!data){return res.status(401).json({status:false,message:" Invalid Authentication"})}
    req.user=data.user;
    next();
}
catch(error){
    console.log(error)
    return res.status(500).json({status:false,message:"Internal server error"})
}
}
module.exports=fetchuser;