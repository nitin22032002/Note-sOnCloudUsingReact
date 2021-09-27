import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NoteContext from "../context/NoteContext";
import Profile from "./Profile";
export default function Navbar() {
  const [getLogin, setLogin] = useState({ password: "", emailid: "" });
  const [component, setComponent] = useState({ title: "", fun: null });
  const [getSignup, setSignup] = useState({
    password: "",
    emailid: "",
    name: "",
    cpassword: "",
  });

  const location = useLocation();
  const modal = useRef();
  const modalClose = useRef();
  const context = useContext(NoteContext);
  const login = () => {
    modal.current.click();
    setLogin({ password: "", emailid: "" });
    setComponent({ title: "Login" });
  };
  const signup = () => {
    modal.current.click();
    setSignup({ password: "", name: "", emailid: "", cpassword: "" });
    setComponent({ title: "SignUp" });
  };
  useEffect(() => {
    if (
      localStorage.getItem("auth-token") !== null &&
      context.user.name === ""
    ) {
      context.getUser();
    }
    // eslint-disable-next-line
  }, []);
  const handleLogin = async () => {
    let { emailid, password } = getLogin;
    modalClose.current.click();
    await context.login(emailid, password);
    setLogin({ password: "", emailid: "" });
  };
  const handleSignup = async () => {
    let { emailid, password, name, cpassword } = getSignup;
    if (cpassword === password) {
      modalClose.current.click();
      await context.signUp(emailid, password, name);
      setSignup({ password: "", name: "", emailid: "", cpassword: "" });
    } else {
      context.callAlert("Password and Confirm Password Not Match","warning");
    }
  };
  const logout = () => {
    context.logout()
  };
  const onchange1 = (e) => {
    if (e.target.name === "emailid") {
      setLogin({ ...getLogin, emailid: e.target.value });
    } else {
      setLogin({ ...getLogin, password: e.target.value });
    }
  };
  const onchange2 = (e) => {
    if (e.target.name === "emailid") {
      setSignup({ ...getSignup, emailid: e.target.value });
    } else if (e.target.name === "name") {
      setSignup({ ...getSignup, name: e.target.value });
    } else if (e.target.name === "cpassword") {
      setSignup({ ...getSignup, cpassword: e.target.value });
    } else {
      setSignup({ ...getSignup, password: e.target.value });
    }
  };
  const handleClose=()=>{
    document.getElementById("profileclose").click()
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <div className="navbar-brand" style={{cursor:"default"}}>
            iNotebook
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About
                </Link>
              </li>
              
              {localStorage.getItem("auth-token") !== null &&
                context.user.name !== "" && (
                  <li className="nav-item">
                  <Link
                  data-bs-toggle="offcanvas" to="#offcanvasRight" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"
                  className={`nav-link ${
                    location.pathname === "/editprofile" ? "active" : ""
                  }`}
                >
                  Profile
                </Link>
                </li>
                )}
            </ul>
            <div className="d-flex">
              {localStorage.getItem("auth-token") === null &&
              context.user.name === "" ? (
                <>
                  <button className="btn btn-primary mx-2" onClick={login}>
                    Login
                  </button>
                  <button className="btn btn-primary mx-2" onClick={signup}>
                    SignUp
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary mx-2"
                    type="button"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              )}
              <button
                type="button"
                className="btn btn-primary d-none"
                ref={modal}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              ></button>
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        {component.title}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      {component.title === "Login" ? (
                        <>
                          <form>
                            <div className="row mb-3">
                              <label
                                htmlFor="inputEmail3"
                                className="col-sm-2 col-form-label"
                              >
                                Email
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="email"
                                  className="form-control"
                                  value={getLogin.emailid}
                                  name="emailid"
                                  id="inputEmail3"
                                  key={"loginemail"}
                                  onChange={onchange1}
                                />
                              </div>
                            </div>
                            <div className="row mb-3">
                              <label
                                htmlFor="inputPassword3"
                                className="col-sm-2 col-form-label"
                              >
                                Password
                              </label>
                              <div className="col-sm-10">
                                <input
                                  type="password"
                                  key={"loginpassword"}
                                  value={getLogin.password}
                                  name="password"
                                  className="form-control"
                                  id="inputPassword3"
                                  onChange={onchange1}
                                />
                              </div>
                              <div className="col-sm-10 my-2">
                                <Link onClick={()=>{modalClose.current.click()}} to="/forgot" >Forgot password ?</Link>
                              </div>
                            </div>
                          </form>
                        </>
                      ) : (
                        <>
                          <form className="row g-3">
                            <div className="col-12">
                              <label
                                htmlFor="inputAddress"
                                className="form-label"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                value={getSignup.name}
                                className="form-control"
                                id="inputAddress"
                                placeholder="Name"
                                name="name"
                                onChange={onchange2}
                              />
                            </div>
                            <div className="col-md-12">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                name="emailid"
                                key={"signupemail"}
                                onChange={onchange2}
                                value={getSignup.emailid}
                                className="form-control"
                                id="inputEmail4"
                                placeholder="example@gmail.com"
                              />
                            </div>
                            <div className="col-md-6">
                              <label
                                htmlFor="inputPassword4"
                                className="form-label"
                              >
                                Password
                              </label>
                              <input
                                key={"signuppassword"}
                                value={getSignup.password}
                                name="password"
                                onChange={onchange2}
                                type="password"
                                className="form-control"
                                id="inputPassword4"
                              />
                            </div>
                            <div className="col-md-6">
                              <label
                                htmlFor="inputPassword4"
                                className="form-label"
                              >
                                Confirm Password
                              </label>
                              <input
                                name="cpassword"
                                value={getSignup.cpassword}
                                onChange={onchange2}
                                type="password"
                                className="form-control"
                                id="inputPassword4"
                              />
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        ref={modalClose}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          if (component.title === "Login") {
                            handleLogin();
                          } else {
                            handleSignup();
                          }
                        }}
                      >
                        {component.title}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
<div className="offcanvas offcanvas-end"  tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
  <div className="offcanvas-header">
    <h5 id="offcanvasRightLabel">Profile</h5>
    <button type="button" id="profileclose" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body" >
    <Profile value={1} key="profile" handleClose={handleClose}/>
  </div>
</div>
    </div>
  );
}
