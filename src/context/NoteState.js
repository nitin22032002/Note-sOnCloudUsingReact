import { useState, useRef } from "react/cjs/react.development";
import { useHistory } from "react-router-dom";
import NoteContext from "./NoteContext";
const NoteState = (props) => {
  const history=useHistory()
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState({ name: "", emailid: "", date: "" });
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const profile = useRef();
  const message = "Internal server error";
  const [showAlert, setShowAlert] = useState({
    status: false,
    message: "",
    type: "",
  });
  const callAlert = (message, type) => {
    setShowAlert({ status: true, message, type });
    setTimeout(() => {
      setShowAlert({ status: false, message: "", type: "" });
    }, 3000);
  };
  // Function to fetch all notes
  const apiCall = async (url, params) => {
    let result = await fetch(`${serverUrl}${url}`, params);
    result = await result.json();
    return result;
  };
  const fetchAllNotes = async () => {
    try {
      const params = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      };
      await apiCall("/note/api/getnote", params).then((result) => {
        if (result.status) {
          setNotes(result.body);
        } else {
          callAlert(result.message, "danger");
        }
      });
    } catch (error) {
      callAlert(message, "danger");
    }
  };
  const addNote = async (title, description, tag) => {
    try {
      const params = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ title, description, tag }),
      };
      await apiCall("/note/api/createnote", params).then((result) => {
        if (result.status) {
          setNotes(notes.concat([result.body]));
          callAlert("Note Added SuccessFully", "success");
        } else {
          callAlert(result.message, "danger");
        }
      });
    } catch (error) {
      callAlert(message, "danger");
    }
  };
  const login = async (emailid, password) => {
    try {
      const params = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ emailid, password }),
      };
      await apiCall(`/auth/api/login`, params).then((result) => {
        if (result.status) {
          localStorage.setItem("auth-token", result.token);
          getUser()
          callAlert("You Are Loged In SuccessFully", "success");
        } else {
          callAlert(result.message, "danger");
        }
      });
    } catch (error) {
      callAlert(message, "danger");
    }
  };
  const signUp = async (emailid, password, name) => {
    try {
      const params = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, emailid, password }),
      };
      await apiCall(`/auth/api/createuser`, params).then((result) => {
        if (result.status) {
          localStorage.setItem("auth-token", result.token);
          callAlert("You Are Registered With Us SuccessFully", "success");
          getUser();
          return true;
        } else {
          callAlert(result.message, "danger");
          return false
        }
      });
    } catch (error) {
      callAlert(message, "danger");
      return false
    }
  };
  const updateUser = async (emailid, name) => {
    try {
      const params = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ emailid, name }),
      };
      await apiCall(`/auth/api/update`, params).then((result) => {
        if (result.status) {
          setUser({ ...user, emailid, name, date: user.date });
          callAlert("Your Record Update SuccessFully", "success");
          return true;
        } else {
          callAlert(result.message, "danger");
          return false
        }
      });
    } catch (error) {
      callAlert(message, "danger");
      return false
    }
  };
  const updatePassword = async (emailid, password) => {
    try {
      const params = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ emailid, password }),
      };
      await apiCall(`/auth/api/updatepassword`, params).then((result) => {
        if (result.status) {
          callAlert("Your Password Update SuccessFully", "success");
        } else {
          callAlert(result.message, "danger");
        }
      });
    } catch (error) {
      callAlert(message, "danger");
      return false
    }
  };
  const getUser = async () => {
    try {
      const params = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      };
      await apiCall(`/auth/fetchuser`, params).then((result) => {
        if (result.status) {
          const { date, emailid, name } = result.body;
          setUser({ ...user, name, emailid, date });
        } else {
          callAlert(result.message, "danger");
        }
      });
    } catch (error) {
      callAlert(message, "danger");
    }
  };
  const deleteNote = async (id) => {
    try {
      const params = {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      };
      await apiCall(`/note/api/delete/${id}`, params).then((result) => {
        if (result.status) {
          let Note = notes.filter((note) => {
            return note.noteid !== id;
          });
          setNotes(Note);
          callAlert("Your Note Delete SuccessFully", "success");
          return true
        } else {
          callAlert(result.message, "danger");
          return false
        }
      });
    } catch (error) {
      callAlert(message, "danger");
      return false
    }
  };
  const updateNote = async (id, title, description, tag) => {
    try {
      const params = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify({ title, description, tag }),
      };
      await apiCall(`/note/api/update/${id}`, params).then(async(result) => {
        if (result.status) {
          let Note = JSON.parse(JSON.stringify(notes));
          for (let i in Note) {
            if (Note[i].noteid === id) {
              Note[i].title = title;
              Note[i].description = description;
              Note[i].tag = tag;
            }
          }
          setNotes(Note);
          callAlert("Your Note Update SuccessFully", "success");
          return true
        } else {
          callAlert(result.message, "danger");
          return false
        }
      });
    } catch (error) {
      callAlert(message, "danger");
      return false
    }
  };
  const logout = () => {
    localStorage.removeItem("auth-token");
    setUser({ name: "", emailid: "", date: "" });
    setNotes([]);
    history.push("/");
    callAlert("You Are Logout SuccessFully","success");
  };
  
  return (
    <NoteContext.Provider
      value={{
        notes,
        showAlert,
        updatePassword,
        callAlert,
        profile,
        setUser,
        getUser,
        updateUser,
        signUp,
        login,
        user,
        setNotes,
        addNote,
        deleteNote,
        updateNote,
        fetchAllNotes,
        serverUrl,
        logout
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
