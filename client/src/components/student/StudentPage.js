import React, { useEffect, useState, useCallback } from "react";
import Spinner from "../global/Spinner";
import Signout from "../global/Signout";
import AddNewCourseToStudent from "../course/AddNewCourseToStudent";

export const StudentPage = ({
  studentid,
  setUserMode,
  setAuthToken,
  setStudentId,
}) => {
  const [data, setData] = useState({});
  const [update, setUpdate] = useState({});
  const [course, setCourse] = useState(null);
  const [allCourses,setAllCourses] = useState(null);
  const [password,setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCourseFetched, setIsCourseFetched] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showCourse,setShowCourse] = useState(false);

  const getStudent = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/students/${studentid}`
      );
      const json = await response.json();
      if (response.status === 200) {
        setData(json);
        setUpdate(json);
        setIsDataFetched(true);
      }
    } catch (error) {
      console.log(error.detail);
    }
  };

 

  const getStudentCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/students/enrolled/${studentid}`
      );
      const json = await response.json();
      if (response.status === 200) {
        setCourse(json);
        setIsCourseFetched(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCourse = async (courseid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/students/${data.studentid}/courses/${courseid}`,
        {
          method: "DELETE",
        }
      );
      console.log(response);

      if (response.status === 200) {
        console.log("deleted the course");
        getStudentCourses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    getStudent();
    getStudentCourses();
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setUpdate((data) => ({
        ...data,
        [name]: value,
      }));
    },

    [setUpdate]
  );

  const updateStudent = async() => {
    console.log(update);
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/students/${studentid}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(update)
      })
      if(response.status===200){
        alert("Changes updated successfull...");
      }
    } catch (error) {
      console.log(error.detail);
    }
  };

  const changePassword= async ()=>{
    if (password !== confirmPassword) alert("Make sure passwords match!");
    else {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/students/password/${studentid}`,{
          method:"PUT",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({password})
        })
        
        if(response.status===200){
          setConfirmPassword("");
          setPassword("");
          alert("Password changed successfully...")
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const newCourse = () =>{
    setShowCourse(true);
  }

  return (
    <>
      {isDataFetched ? (
        <div className="container w-50 bg-light student-page-container">
          <div className="row ">
            <div className="col-lg-6 col-md-6 col-xs-6 d-flex justify-content-center align-content-center">
              {" "}
              <p className="pt-2 student-page-welcome">
                Welcome {data.firstname + " " + data.lastname}
              </p>
            </div>
            <div className="col-lg-2"></div>
            <div className="col-lg-4  d-flex justify-content-center">
              <Signout
                setUserMode={setUserMode}
                setAuthToken={setAuthToken}
                setStudentId={setStudentId}
              />
            </div>
          </div>
          <div className="row w-100">
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
              <label>First Name</label>
              <input
                type="text"
                required
                name="firstname"
                defaultValue={data.firstname}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
              <label>Last Name</label>
              <input
                type="text"
                required
                name="lastname"
                defaultValue={data.lastname}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column ">
              <label>City</label>
              <input
                type="text"
                defaultValue={data.city}
                required
                name="city"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="row w-100">
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
              <label>Birthdate</label>
              <input
                type="text"
                defaultValue={data.dateofbirth}
                required
                name="dateofbirth"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
              <label>Phone</label>
              <input
                type="text"
                defaultValue={data.phone}
                maxLength={10}
                name="phone"
                required
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
              <label>Email</label>
              <input
                type="text"
                required
                name="email"
                defaultValue={data.email}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="col-lg-3 col-md-3 col-xs-3 d-flex  align-self-center ">
              <button className="change-password" onClick={changePassword}>Change Password</button>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 align-self-center font-weight-bold">
              Course ID
            </div>
            <div className="col-lg-6 align-self-center font-weight-bold">
              Course Name
            </div>
            <div className="col-lg-3 align-self-center ">
              <button className="new-course-button-in-studentpage font-weight-bold" onClick={()=>setShowCourse(true)}>
                <i className="fa-solid fa-plus"></i> New Course
              </button>
            </div>
          </div>
          <div className="overflow-in-student-page">
            {Array.isArray(course) && isCourseFetched ? (
              course.map((item) => (
                <div className="row">
                  <div className="col-lg-3">{item.courseid}</div>
                  <div className="col-lg-6">{item.course_name}</div>
                  <div className="col-lg-3">
                    <button onClick={() => deleteCourse(item.courseid)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <Spinner />
            )}
            <div className="row">
              <div className="col-lg-3"></div>
              <div className="col-lg-6 d-flex justify-content-center align-content-center">
                <button className="save-button" onClick={updateStudent}>
                  Save
                </button>{" "}
              </div>
              <div className="col-lg-3"></div>
            </div>
            {showCourse && <AddNewCourseToStudent studentId={studentid} setShowCourse={setShowCourse} getStudentCourses={getStudentCourses} />}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};
