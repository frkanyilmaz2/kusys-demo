import React, { useState } from "react";
import ListItems from "./ListItems";
import AddNewStudentModal from "../student/AddNewStudentModal";

const ListStudents = ({
  students,
  comeFromCourse,
  getStudents,
  setStudents,
  getCourses,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const deleteStudent = async (studentid) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/students/${studentid}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200)
        //Filter out the deleted courses
        setStudents(
          students.filter((student) => student.studentId !== studentid)
        );
      getStudents();
    } catch (error) {
      console.log(error.detail);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-12 d-flex w-100 justify-content-between enrolled-students">
          <p className="pt-2">Enrolled Students</p>
          {comeFromCourse ? "":<button onClick={() => setShowPopup(true)} className="btn">
            <i className="fa-solid fa-plus"></i> New Student
          </button>}
        </div>
      </div>
      {students.map((item, index) => (
        <ListItems
          key={index}
          studentId={item.studentid}
          firstname={item.firstname}
          lastname={item.lastname}
          city={item.city}
          dob={item.dateofbirth}
          phone={item.phone}
          email={item.email}
          comeFromCourse={comeFromCourse}
          getCourses={getCourses}
          deleteStudent={deleteStudent}
          getStudents={getStudents}
        />
      ))}
      {showPopup && (
        <AddNewStudentModal
          getStudents={getStudents}
          setShowPopup={setShowPopup}
        />
      )}
    </>
  );
};

export default ListStudents;
