import React,{useContext} from 'react'
import Notes from './Notes'
import NoteContext from '../context/NoteContext'
export default function Home() {
    const context=useContext(NoteContext)
    return (
        <div>
            {localStorage.getItem('auth-token')!==null && context.user.name!==""?<><Notes/></>: <div className="container my-3 center">
           <h1>Please Login/SignUp To Add or See Your Notes</h1>
        </div>}
        </div>
    )
}
