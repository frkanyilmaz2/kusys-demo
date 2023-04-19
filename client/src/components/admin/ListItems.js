import React, { useEffect, useState } from "react";
import StudentModal from "../modals/StudentModal";

const ListItems = ({
  studentId,
  firstname,
  lastname,
  city,
  dob,
  phone,
  comeFromCourse,
  email,
  getStudents,
  deleteStudent,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [respectiveCourses, setRespectiveCourses] = useState(null);
  const [allCourses, setAllCourses] = useState(null);
  const [isCourseFetched, setIsCourseFetched] = useState(false);

  // this will get all courses for other section
  const getCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/courses`
      );
      const json = await response.json();
      setAllCourses(json);
    } catch (error) {
      console.log(error);
    }
  };

  //this will get courses by studentid. Means that every student will see his/her courses
  const getStudentCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/students/enrolled/${studentId}`
      );
      const json = await response.json();
      if (response.status === 200) {
        setRespectiveCourses(json);
        setIsCourseFetched(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStudentCourses();
    getCourses();
  }, [studentId]);

  const handleDeleteStudent = async (studentId) => {
    try {
      // Make API call to delete the student
      await deleteStudent(studentId);

      // Update the student courses in local state (after deleting the student)
      setRespectiveCourses(
        respectiveCourses.filter((item) => item.studentId !== studentId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="row d-flex justify-content-center align-items-center list-items-row">
      <div className="col-lg-2 col-md-2 col-xs-2 list-items-col ">
        {studentId}
      </div>
      <div className="col-lg-2 col-md-2 col-xs-2 list-items-col ">
        {firstname}
      </div>
      <div className="col-lg-2 col-md-2 col-xs-2 list-items-col ">
        {lastname}
      </div>
      {Array.isArray(respectiveCourses) && isCourseFetched ? (
        <div className="col-lg-4 col-md-4 col-xs-4 overflow-in-span">
          {respectiveCourses.map((item) => item.courseid + " ")}
        </div>
      ) : (
        "deneme"
      )}

      {comeFromCourse ? (
        ""
      ) : (
        <div className="col-lg-2 col-md-2 col-xs-2 list-items-col ">
          <button onClick={() => setShowPopup(true)} className="mr-1 edit">
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button onClick={() => handleDeleteStudent(studentId)} className="delete">
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      )}

      {showPopup && (
        <StudentModal
          studentId={studentId}
          firstname={firstname}
          lastname={lastname}
          city={city}
          dob={dob}
          phone={phone}
          email={email}
          respectiveCourses={respectiveCourses}
          setShowPopup={setShowPopup}
          isCourseFethced={isCourseFetched}
          allCourses={allCourses}
          getStudentCourses={getStudentCourses}
          getStudents={getStudents}
        />
      )}
    </div>
  );
};

export default ListItems;
