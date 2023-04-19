import React, { useEffect, useState } from "react";
import Spinner from "../global/Spinner";
import CourseModal from "../modals/CourseModal";
import CourseStudents from "../course/CourseStudents";

const ListCourses = ({ students, courses, getCourses }) => {
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showPopup, setShowPopup] = useState();
  const [courseInfo, setCourseInfo] = useState({ id: "", name: "" });
  const [mode, setMode] = useState("create");
  const [showAnotherPopup, setShowAnotherPopup] = useState(false); //My mind started to degrade
  const [id, setId] = useState(""); //this will send the course id to modal

  const deleteCourse = async (courseid) => {
    console.log(courseid);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/courses/${courseid}`,
        {
          method: "DELETE",
        }
      );
      console.log(response);

      if (response.status === 200) {
        console.log("deleted the course");
        getCourses();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = (mode, courseid, course_name) => {
    if (mode === "edit") {
      setCourseInfo({ id: courseid.toLocaleUpperCase(), name: course_name });
      setMode(mode);
    }

    setShowPopup(true);
  };

  const getCourseStudents = (courseid) => {
    setId(courseid);
    setShowAnotherPopup(true);
  };

  return (
    <div className="container container-of-courses">
      <div className="row course-title">
        <div className="col-lg-2 col-md-2 col-xs-2 title-col  ">
          <p>Course Id</p>
        </div>
        <div className="col-lg-3 col-md-3 col-xs-3 title-col ">
          <p>Course name</p>
        </div>
        <div className="col-lg-3 col-md-3 col-xs-3 title-col "></div>
        <div className="col-lg-4 col-md-4 col-xs-4 title-col justify-content-center d-flex">
          <button onClick={() => handleModal()}>
            <i className="fa-solid fa-plus"></i>New Course
          </button>
        </div>
      </div>
      <div className="overflow-in-course">
        {courses.map((item, index) => (
          <div className="row course-row" key={index}>
            <div className="col-lg-2 col-md-2 col-xs-2 course-id">
              {item.courseid}
            </div>
            <div className="col-lg-5 col-md-5 col-xs-5 ">
              {item.course_name}
            </div>
            <div className="col-lg-1 col-md-1 col-xs-1 ">
              <button
                className="details"
                onClick={() => getCourseStudents(item.courseid)}
              >
                <i className="fa-regular fa-circle-info"></i>
              </button>
            </div>
            <div className="col-lg-1">
              <button
                className="edit"
                onClick={() =>
                  handleModal("edit", item.courseid, item.course_name)
                }
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </button>
            </div>
            <div className="col-lg-1 mr-4">
              <button
                className="delete"
                onClick={() => deleteCourse(item.courseid)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPopup ? (
        <CourseModal
          mode={mode}
          courseInfo={courseInfo}
          setShowPopup={setShowPopup}
          getCourses={getCourses}
          setMode={setMode}
          setCourseInfo={setCourseInfo}
        />
      ) : (
        ""
      )}

      {showAnotherPopup ? (
        <CourseStudents
          courseid={id}
          students={students}
          setShowAnotherPopup={setShowAnotherPopup}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ListCourses;
