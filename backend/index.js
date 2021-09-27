const express=require('express');
const app=express()
const pool=require('./db')
const cors=require('cors')
app.use(cors())
app.use(express.json())
const port=2000;
require("dotenv").config()
app.use("/auth",require("./routers/auth"))
app.use("/note",require("./routers/note"))
app.get('/user',(req,res)=>{
    pool.query('create schema inotebook',(error,result)=>{
        if(error){
            res.json({"Error":error.message})
        }
        else{
            res.json({"Message":"inotebook Database created"})
        }
    })    
})
app.get('/usertable',(req,res)=>{
    pool.query('create table inotebook.user(userid int(10) primary key auto_increment,name varchar(45) not null,emailid varchar(45) not null unique,password text not null,date datetime default CURRENT_TIMESTAMP )',(error,result)=>{
        if(error){
            res.json({"Error":error.message})
        }
        else{
            res.json({"Message":"user table created"})
        }
    })    
})
app.get('/notetable',(req,res)=>{
    pool.query('create table inotebook.note(noteid int(10) primary key auto_increment,userid int not null,tag varchar(45) not null,title varchar(45) not null unique,description text not null,date datetime default CURRENT_TIMESTAMP )',(error,result)=>{
        if(error){
            res.json({"Error":error.message})
        }
        else{
            res.json({"Message":"note table created"})
        }
    })    
})
app.listen(port);