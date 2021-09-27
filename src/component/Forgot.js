import React,{useContext,useState} from "react";
import NoteContext from "../context/NoteContext";
import { useHistory } from "react-router-dom";
export default function Forgot() {
    const history=useHistory()
    const context=useContext(NoteContext)
    const [getAuth,setAuth]=useState({emailid:context.user.emailid,password:"",cpassword:""})
  const changePassword=async(e)=>{
      e.preventDefault()
        if(getAuth.cpassword===getAuth.password){
            await context.updatePassword(getAuth.emailid,getAuth.password);
            if(context.user.emailid!=="" && context.user.emailid!==undefined){
            setTimeout(() => {
              context.logout();
              context.callAlert("You Are Logout due to security reson please login again","success")
            }, 3000);}
            else{
                setTimeout(() => {
                    history.push('/')
                }, 3000);
            }
        }
        else{
            context.callAlert("Password And Confirm Password Not Match","warning")
        }
  }
  const onchange1=(e)=>{
        let a=e.target.name
        if(a==="emailid"){
            setAuth({...getAuth,emailid:e.target.value})
        }
        else if(a==="password"){
            setAuth({...getAuth,password:e.target.value})
        }
        else{
            setAuth({...getAuth,cpassword:e.target.value})
        }
  }  
  return (
    <div className="container my-3 w-50" style={{border:"1px solid black"}}>
        <h3>Change Password</h3>
      <form onSubmit={changePassword}>

      <div className="mb-3 row my-4 mx-3">
        <label htmlFor="staticEmail" className="col-sm-2 col-form-label">
          Email
        </label>
        <div className="col-sm-10 ">
       { context.user.emailid!=="" && context.user.emailid!==undefined? <input
            type="text"
            readOnly
            style={{cursor:"default"}}
            className="form-control-plaintext"
            id="staticEmail"
            value={context.user.emailid}
            />:<input
            type="email"
            name="emailid"
            required
            className="form-control"
            value={getAuth.emailid}
            onChange={onchange1}
            
            />}
        </div>
      </div>
      <div className="mb-3 row mx-3 my-5">
        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">
          Password
        </label>
        <div className="col-sm-10">
          <input required minLength={3} type="password" value={getAuth.password} name="password" onChange={onchange1} className="form-control" id="inputPassword" />
        </div>
      </div>
      <div className="mb-3 row mx-3 my-5">
        <label htmlFor="inputPassword"  className="col-sm-3 col-form-label">
         Confirm Password
        </label>
        <div className="col-sm-9">
          <input type="password" required minLength={3} name="cpassword" value={getAuth.cpassword} onChange={onchange1} className="form-control" id="inputPassword" />
        </div>
      </div>
      <div className="mb-3 row mx-3 my-5">
        <div className="col-sm-12">
          <button type="submit" className="btn btn-primary">Change Password</button>
        </div>
      </div>
    </form>

    </div>
  );
}
