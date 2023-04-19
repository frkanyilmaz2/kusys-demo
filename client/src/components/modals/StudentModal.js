import React, { useCallback, useState } from "react";
import Spinner from "../global/Spinner";
import AddNewCourseToStudent from "../course/AddNewCourseToStudent";

const StudentModal = ({
  studentId,
  firstname,
  lastname,
  city,
  dob,
  phone,
  email,
  respectiveCourses,
  setShowPopup,
  allCourses,
  getStudentCourses,
  getStudents
}) => {
  const [showCourse, setShowCourse] = useState(false);
  const [update, setUpdate] = useState({
    firstname:firstname,
    lastname:lastname,
    city:city,
    dob:dob,
    phone:phone,
    email:email,
  });

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setUpdate((prevUpdate) => ({
        ...prevUpdate,
        [name]: value,
      }));
    },

    [setUpdate]
    
  );

  const banishCourse = async (courseid) => {
    console.log("I banish you!");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/students/${studentId}/courses/${courseid}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        getStudentCourses();
      }
    } catch (error) {
      console.log(error.detail);
    }
  };

  const updateStudent = async() => {
   try {
    const response = await fetch(`${process.env.REACT_APP_SERVERURL}/students/${studentId}`,{
      method: 'PUT',
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(update)
    })
    if(response.status === 200){
      getStudents();
      setShowPopup(false);
    }
   } catch (error) {
    console.log(error.message)  
   }
  };

  return (
    <div className="overlay">
      <div className=" popup">
        <div className="row">
          <div className="col-lg-10 col-md-10 col-xs-10">
            <h2 className="popup-title">Student Card</h2>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-2">
            <button
              className="close-button"
              onClick={() => setShowPopup(false)}
            >
              <i className="fa-sharp fa-solid fa-circle-xmark"></i>
            </button>
          </div>
        </div>
        <div className="row w-100">
          <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
            <label>First Name</label>
            <input
              type="text"
              placeholder="First name..."
              required
              maxLength={30}
              name="firstname"
              defaultValue={firstname}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last Name..."
              required
              maxLength={30}
              name="lastname"
              defaultValue={lastname}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column ">
            <label>City</label>
            <input
              type="text"
              placeholder="City..."
              required
              maxLength={30}
              name="city"
              defaultValue={city}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row w-100">
          <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
            <label>Birthdate</label>
            <input
              type="text"
              placeholder="Date of Birth..."
              required
              maxLength={30}
              name="dob"
              defaultValue={dob}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
            <label>Phone</label>
            <input
              type="text"
              placeholder="Phone Number..."
              required
              maxLength={10}
              name="phone"
              defaultValue={phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-4 col-md-4 col-xs-4 d-flex justfify-content-center flex-column">
            <label>Email</label>
            <input
              type="email"
              placeholder="Phone Number..."
              required
              maxLength={10}
              name="email"
              defaultValue={email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xs-12 d-flex justify-content-between ">
            <p className="pt-2">Enrolled courses </p>{" "}
            <button className="new-course" onClick={() => setShowCourse(true)}>
              <i className="fa-solid fa-plus"></i> New Course
            </button>
          </div>
        </div>
        <div className="overflow">
          {Array.isArray(respectiveCourses) ? (
            respectiveCourses.map((item, index) => (
              <div className="row" key={index}>
                <div className="col-lg-4 col-lg-4 col-md-4 col-xs-4course">
                  {item.courseid}
                </div>
                <div className="col-lg-4 col-lg-4 col-md-4 col-xs-4">
                  {item.course_name}
                </div>
                <div className="col-lg-4 col-lg-4 col-md-4 col-xs-4">
                  <button
                    className=""
                    onClick={() => banishCourse(item.courseid)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <Spinner />
          )}
        </div>
        <div className="row">
          <div className="col-lg-3"></div>
          <div className="col-lg-6 d-flex justify-content-center">
            <button
              className="new-course pr-4 pl-4 pt-2 pb-2"
              onClick={updateStudent}
            >
              Save
            </button>
          </div>
          <div className="col-lg-3"></div>
        </div>

        {showCourse && (
          <AddNewCourseToStudent
            allCourses={allCourses}
            getStudentCourses={getStudentCourses}
            studentId={studentId}
            setShowCourse={setShowCourse}
          />
        )}
      </div>
    </div>
  );
};

export default StudentModal;
