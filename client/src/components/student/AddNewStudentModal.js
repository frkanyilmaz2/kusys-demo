import React, { useState } from "react";

const AddNewStudentModal = ({ setShowPopup, getStudents }) => {
  const [newStudent, setNewStudent] = useState({
    studentid: Math.floor(Math.random() * 9000) + 1000,
    firstname: "",
    lastname: "",
    city: "",
    dob: "",
    phone: null,
    email: "",
    password: undefined,
    role:"student",
  });

  //This will fix uncontrolled input warning.
  const phoneValue = newStudent.phone === null ? "" : newStudent.phone;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && !/^\d*$/.test(value)) {
      return; // Ignore input if it has non-numeric characters
    }

    setNewStudent((newStudent) => ({
      ...newStudent,
      [name]: value,
    }));
  };

  const handleData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/students`,{
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify(newStudent)
      });
      if(response.status === 200){
        setShowPopup(false);
        getStudents();
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="overlay">
      <div className="popup">
        <div className="row">
          <div className="col-lg-10">
            <h2 className="popup-title">New Student Card</h2>
          </div>
          <div className="col-lg-1">
            <button
              className="close-button"
              onClick={() => setShowPopup(false)}
            >
              <i className="fa-sharp fa-solid fa-circle-xmark"></i>
            </button>
          </div>
        </div>
        <div className="row">
          <form className="row-form">
            <div className="col-lg-4">
              <label>Student ID</label>
              <input
                type="text"
                placeholder={newStudent.studentid}
                required
                maxLength={4}
                name="studentid"
                disabled
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4">
              <label>First Name</label>
              <input
                type="text"
                placeholder="First name..."
                required
                maxLength={30}
                name="firstname"
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4">
              <label>Last Name</label>
              <input
                type="text"
                placeholder="Last Name..."
                required
                maxLength={30}
                name="lastname"
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        <div className="row">
          <form className="row-form">
            <div className="col-lg-4">
              <label>City</label>
              <input
                type="text"
                placeholder="City..."
                required
                maxLength={30}
                name="city"
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4">
              <label>Date of Birth</label>
              <input
                type="text"
                placeholder="Date of Birth..."
                required
                maxLength={30}
                name="dob"
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number..."
                required
                maxLength={10}
                name="phone"
                onChange={handleChange}
                value={phoneValue}
              />
            </div>
          </form>
        </div>
        <div className="row">
          <form className="row-form">
            <div className="col-lg-4">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email..."
                required
                maxLength={30}
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4">
              <label>Password</label>
              <input
                type="text"
                placeholder="Password..."
                required
                maxLength={30}
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4">
              <label>Role</label>
              <input
                type="text"
                placeholder="Role..."
                required
                maxLength={11}
                name="role"
                onChange={handleChange}
                value="student"
                disabled
              />
            </div>
          </form>
        </div>
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4 d-flex justify-content-center">
            <button className="save-button" onClick={handleData}>
              Save
            </button>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    </div>
  );
};

export default AddNewStudentModal;
