import React, { useEffect, useState } from "react";
import Spinner from "../global/Spinner";

const AddNewCourseToStudent = ({ studentId, setShowCourse, getStudentCourses }) => {
  const [allCourses,setAllCourses] = useState(null);
  const [isDataFetched,setIsDataFetched] = useState(false);
  const [data, setData] = useState({
    studentid: studentId,
    courseid: "",
  });

  const getAllCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/courses`
      );
      const json = await response.json();

      if (response.status === 200) {
        setAllCourses(json);
        setIsDataFetched(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const id = e.target.value
    setData((prevState) => ({
      ...prevState,
      courseid: id.toLocaleUpperCase(),
    }));
  };


  const addCourse = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/course/to/students/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        setShowCourse(false);
        getStudentCourses();
      }
    } catch (error) {
        console.log(error);
    }
  };

  const saveByClick=async (id)=>{
      addCourse(id);
    setShowCourse(false);
  }
  

  useEffect(() => {
    getAllCourses()
  }, [])
  

  return (
    <div className="overlay">
      <div className="popup w-50">
        <div className="row">
          <div className="col-lg-10 col-md-10 col-xs-10">
            <h2 className="popup-title">Course Card</h2>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-2">
            <button
              className="close-button"
              onClick={() => setShowCourse(false)}
            >
              <i className="fa-sharp fa-solid fa-circle-xmark"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-4 col-xs-4">
            <label for="courseid">Course ID</label>
            <input
              type="text"
              placeholder="Enter Course ID..."
              maxLength={5}
              required
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-8 col-md-8 col-xs-8" id="all-courses-list">
            <label for="all-courses-list">Available Courses</label>
            <div className="overflow">
              {isDataFetched ? allCourses.map((item, index) => (
                <div key={index} className="row add-new-course" onClick={()=>saveByClick(item.courseid)} >
                  <div className="col-lg-4" >{item.courseid}</div>
                  <div className="col-lg-8">{item.course_name}</div>
                </div>
              )) : <Spinner />}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4 d-flex justify-content-center">
            <button
              className="save-button text-dark"
              onClick={addCourse}
            >
              Save
            </button>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCourseToStudent;
