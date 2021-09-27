import React,{useContext} from 'react'
import NoteContext from '../context/NoteContext'
export default function NoteItem(props) {
    const {item,handleEdit}=props
    const context=useContext(NoteContext)
    const handleDelete=async(noteid,title)=>{
        context.callAlert("You delete note with title "+title,"warning")
        setTimeout(async()=>{
          await context.deleteNote(noteid);
        },1500)
    }
    return (
        <div className={`col-md-${item.description.length>50?'12':'4'} my-3`}>
            <div className="card">
                  <span className="badge bg-success mx-1 my-1 w-25">{item.tag===""?"Default":item.tag}</span>
              <div className="card-body">
                  <div className="d-flex">
                <h5 className="card-title">{item.title}</h5>
               <p className=" mx-4"  style={{cursor:"pointer"}} onClick={()=>{handleDelete(item.noteid,item.title)}}> <i className="fas fa-trash-alt"></i></p>
               <p style={{cursor:"pointer"}} onClick={()=>{handleEdit(item)}}><i className="fas fa-edit"></i></p>
                  </div>
                <p className="card-text">
                 {item.description}
                </p>
                <p className="card-text"><small className="text-muted">Note Add On {new Date(item.date).toUTCString()}</small></p>
              </div>
            </div>
              </div>
    )
}
