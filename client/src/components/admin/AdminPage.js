import React, { useEffect, useState } from "react";
import ListStudents from "./ListStudents";
import ListCourses from "./ListCourses";
import Spinner from "../global/Spinner";
import Signout from "../global/Signout";

const AdminPage = ({ setUserMode, setAuthToken, setStudentId }) => {
  const [showPage, setShowPage] = useState("students");
  const [isSectionSelected, setIsSectionSelected] = useState(true);
  const [students, setStudents] = useState(null);
  const [courses, setCourses] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const handleList = (e) => {
    setShowPage(e.target.innerText.toLowerCase());
    setIsSectionSelected(!isSectionSelected);
  };

  //This will get all the courses from database.

  const getCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/courses`
      );
      const json = await response.json();

      if (response.status === 200) {
        setCourses(json);
        setIsDataFetched(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //This will get all the students from database.

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/students`
      );
      const json = await response.json();
      if (response.status === 200) {
        setStudents(json);
        setIsDataFetched(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
    getCourses();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 w-25 d-flex align-content-center">
          <button
            onClick={(e) => handleList(e)}
            className={`section-buttons ${isSectionSelected ? "active" : ""}`}
          >
            Students
          </button>
          <button
            onClick={(e) => handleList(e)}
            className={`section-buttons ${!isSectionSelected ? "active" : ""}`}
          >
            Courses
          </button>
        </div>
        <div className="col-lg-3 d-flex justify-content-center align-self-center">
          <p className="welcome-admin">Welcome Admin!</p>
        </div>
        <div className="col-lg-3 d-flex justify-content-center align-self-center">
          <Signout
            setUserMode={setUserMode}
            setAuthToken={setAuthToken}
            setStudentId={setStudentId}
          />
        </div>
      </div>
      <div className="admin-page-list">
        {isDataFetched ? (
          showPage === "students" ? (
            <ListStudents
              students={students}
              setStudents={setStudents}
              getStudents={getData}
              courses={courses}
              getCourses={getCourses}
            />
          ) : (
            <ListCourses
              students={students}
              courses={courses}
              getCourses={getCourses}
            />
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
