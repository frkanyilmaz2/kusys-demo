import React, { useState } from "react";

const CourseModal = ({
  mode,
  setShowPopup,
  getCourses,
  courseInfo,
  setMode,
  setCourseInfo,
}) => {
  //this checks if modal opened from an existing course or new course

  const editMode = mode === "edit";

  // if its an existing course then it will use the same info if not then it will empty the inputs
  const [course, setCourse] = useState({
    courseid: editMode ? courseInfo.id : "",
    course_name: editMode ? courseInfo.name : "",
  });

  const postCourse = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });
      if (response.status === 200) {
        getCourses();
        setShowPopup(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateCourse = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/courses/${courseInfo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseInfo),
        }
      );
      if (response.status === 200) {
        getCourses();
        setMode("create");
        setShowPopup(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //this is handles course id
  const handleId = (e) => {
    setCourse((prevState) => ({
      ...prevState,
      courseid: e.target.value,
    }));
  };

  //this handles course name. If modal is in edit mode then it will use the existing name otherwise it will be empty.

  const handleName = (e) => {
    if (!editMode)
      setCourse((prevState) => ({
        ...prevState,
        course_name: e.target.value,
      }));
    else
      setCourseInfo((prevState) => ({
        ...prevState,
        name: e.target.value,
      }));
  };

  return (
    <div className="overlay">
      <div className="popup">
        <div className="row">
          {" "}
          <div className="col-lg-10">
              <h2 className="popup-title">{editMode ? 'Edit Course':'Add New Course'}</h2>
          </div>
          <div className="col-lg-2">
            <button
              onClick={() => {
                setShowPopup(false);
                setMode("create");
              }}
              className="close-button"
            >
              <i className="fa-sharp fa-solid fa-circle-xmark"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <label for="course-id">Course ID</label>
          </div>
          <div className="col-lg-12">
            <input
              type="text"
              id="course-id"
              maxLength={5}
              onChange={handleId}
              required
              value={editMode ? courseInfo.id : course.courseid}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <label for="course-name">Course Name</label>
          </div>
          <div className="col-lg-12">
            <input
              type="text"
              id="course-name"
              maxLength={130}
              onChange={handleName}
              required
              value={editMode ? courseInfo.name : course.course_name}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4 d-flex justify-content-center">
            <button
              className="save-button"
              onClick={editMode ? updateCourse : postCourse} //in here if its in edit mode it will update the existing one if its not it will post a new one
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

export default CourseModal;
