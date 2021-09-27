import React,{useContext} from 'react'
import { useEffect } from 'react';
import {Route,Switch } from 'react-router-dom';
import About from './component/About';
import Alert from './component/Alert';
import Forgot from './component/Forgot';
import Home from './component/Home';
import Navbar from './component/Navbar'
import Profile from './component/Profile';
import NoteContext from './context/NoteContext';
function App() {
  const context=useContext(NoteContext)
  useEffect(()=>{
context.callAlert("Welcome In Note's On Cloud","success")
// eslint-disable-next-line 
  },[])
  return (
    <div >
      <Navbar/>
      <div style={{height:50}}>{context.showAlert.status && <Alert message={context.showAlert.message} type={context.showAlert.type}/>}</div>
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route exact path="/about">
        <About/>
      </Route>
      <Route exact path="/editprofile">
        <Profile value={2} key="editprofile"/>
      </Route>
      <Route exact path="/forgot">
        <Forgot/>
      </Route>
      </Switch>
    </div>
  );
}

export default App;
