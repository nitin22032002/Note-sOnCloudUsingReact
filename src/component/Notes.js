import React, { useContext, useEffect,useState } from "react";
import NoteContext from "../context/NoteContext";
import NoteItem from "./NoteItem";
export default function Notes() {
  const [component,setComponent]=useState("") 
  const [getNote, setNote] = useState({title:"",description:"",tag:"",noteid:""})
  const context = useContext(NoteContext);
  const clickEdit=(item)=>{
    setComponent("Edit")
    setTimeout(() => {
      document.getElementById('modalbtn').click()
    }, 100);
    context.callAlert("You Update Note With Title "+item.title,"warning");
      setNote({...getNote,title:item.title,description:item.description,tag:item.tag,noteid:item.noteid})
  }
  const handleEdit=async()=>{
    // let {noteid,description,title,tag}=getEditNote;
    document.getElementById('addmodal').click()
       await context.updateNote (getNote.noteid,getNote.title,getNote.description,getNote.tag)
      setNote({title:"",description:"",tag:"",noteid:""})
    }        
  useEffect(function () {
    if (
      localStorage.getItem("auth-token") !== null &&
      context.notes.length === 0 &&
      context.user.name !== undefined
    ) {
      context.fetchAllNotes();
      // setLoader(false)
    }
   
    // eslint-disable-next-line
  }, []);
  const onchange2=(e)=>{
    let a=e.target.name
    if(a==="title"){
        setNote({...getNote,title:e.target.value})
    }
    else if(a==="tag"){
        setNote({...getNote,tag:e.target.value})
    }
    else{
        setNote({...getNote,description:e.target.value})
    }
  }
  const handleAdd=async()=>{
    document.getElementById('addmodal').click()
    let {description,title,tag}=getNote;
    let res= await context.addNote(title,description,tag);
    if(res){
        setNote({title:"",description:"",tag:""})}
  }
  const add=()=>{
    setNote({title:"",description:"",tag:""})
    setComponent("Add")
    setTimeout(() => {
      document.getElementById('modalbtn').click()
    }, 100);
  }
  return (
    <div className="container">
      <div className="row justify-content-between my-3">
        <div className="col-4">
          <h2>Your Notes</h2>
        </div>
        <div className="col-4">
        <button
            type="button"
            className="btn btn-primary position-relative"
            onClick={add}
          >Add Note
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {context.notes.length}
  </span>
          </button>
        <button
            type="button"
            id="modalbtn"
            className="btn btn-primary d-none"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal1"
          ></button>
        </div>
      </div>
      {context.notes.length===0 && <h2>No Note Added Yet</h2>}
      <div className="row">
        {context.notes.map((item, index) => {
          return <NoteItem handleEdit={clickEdit} item={item} key={item.noteid} />;
        })}
      </div>
      <div
          className="modal fade"
          id="exampleModal1"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {component} Note
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="col-12">
                  <label htmlFor="inputAddress" className="form-label">
                  Title
                  </label>
                  <input
                    type="text"
                    value={getNote.title}
                    className="form-control"
                    id="inputAddress"
                    onChange={onchange2}
                    placeholder="Title"
                    name="title"
                  />
                </div>
                <div className="col-12 my-2">
                <label htmlFor="inputAddress" className="form-label">
                  Description
                  </label>
                    <textarea onChange={onchange2} name="description" value={getNote.description} placeholder="Description" className="form-control" style={{height:200}} ></textarea>
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputEmail4" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    name="tag"
                    onChange={onchange2}
                    key={"signupemail"}
                    value={getNote.tag}
                    className="form-control"
                    id="inputEmail4"
                    placeholder="Tag"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="addmodal"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary"
                 onClick={
                   ()=>{
                     if(component==="Add"){
                     handleAdd()}
                    else{
                      handleEdit()
                    }
                    }}
                 >
                  {component==="Add"?'Add Note':"Save Changes"}
                </button>
              </div>
              </div>
              </div>
              </div>
    </div>
  );
}
