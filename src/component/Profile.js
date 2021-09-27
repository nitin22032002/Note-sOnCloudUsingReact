import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import NoteContext from "../context/NoteContext";
export default function Profile(props) {
  const context = useContext(NoteContext);
  const [getSignup, setSignup] = useState({ emailid: "", name: "" });
  const onchange2 = (e) => {
    if (e.target.name === "emailid") {
      setSignup({ ...getSignup, emailid: e.target.value });
    } else {
      setSignup({ ...getSignup, name: e.target.value });
    }
  };
  const handleEdit = async () => {
    document.getElementById("editmodal").click();
    await context.updateUser(getSignup.emailid, getSignup.name);
    setSignup({ name: "", emailid: "" });
  };
  return (
    <>
      <div className="container my-3">
        <div className={`card container w-${props.value!==1?'100':'150'}`}>
          <div className="card-body  ">
            <div className="card-text ">
              <form className="row g-3">
                <div className="col-12">
                  <label htmlFor="inputAddress" className="form-label">
                    Name
                  </label>
                  <input
                    readOnly
                    type="text"
                    value={context.user.name}
                    className="form-control"
                    style={{ cursor: "default" }}
                    id="inputAddress"
                    placeholder="Name"
                    name="name"
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    style={{ cursor: "default" }}
                    name="emailid"
                    key={"signupemail"}
                    readOnly
                    value={context.user.emailid}
                    className="form-control"
                    id="inputEmail4"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="inputAddress" className="form-label">
                    Date of Registration
                  </label>
                  <input
                    readOnly
                    type="datetime"
                    value={new Date(context.user.date).toUTCString()}
                    className="form-control"
                    style={{ cursor: "default" }}
                    id="inputAddress"
                    placeholder="Date of Registration"
                    name="date"
                  />
                </div>
                {props.value !== 1 ? <>
                  <div className="col-md-6">
                    <Link
                      to="/forgot"
                      htmlFor="inputPassword4"
                      className="form-label my-2"
                    >
                      Change Password ?
                    </Link>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary my-4 w-100"
                    onClick={() => {
                      // props.handleClose()
                      setSignup({
                        emailid: context.user.emailid,
                        name: context.user.name,
                      });
                      document.getElementById('profilemodal').click()
                    }}
                  >
                    Edit
                  </button>
                </> : <><Link onClick={props.handleClose} className="btn btn-primary my-2 w-100" to="/editprofile">Edit Profile</Link></>}
              </form>
            </div>
          </div>
        </div>
      </div>
         <button
        id="profilemodal"
                type="button"
                className="btn btn-primary my-2 w-100 d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal1"
                
              >
                Edit
              </button>
      { props.value!==1 &&   <div className="modal fade"
          id="exampleModal1"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Edit Profile
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
                    Name
                  </label>
                  <input
                    type="text"
                    value={getSignup.name}
                    className="form-control"
                    id="inputAddress"
                    onChange={onchange2}
                    placeholder="Name"
                    name="name"
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="inputEmail4" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="emailid"
                    onChange={onchange2}
                    key={"signupemail"}
                    value={getSignup.emailid}
                    className="form-control"
                    id="inputEmail4"
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="editmodal"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEdit}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
      </div>
}</>
  );
}
