import React, { useState } from "react";

const Auth = ({ setUserMode, setAuthToken, setStudentId }) => {
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [data, setData] = useState({});
  const [password, setPassword] = useState(null);
  const [email, SetEmail] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setIsLoggedIn(status);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLoggedIn && data.password !== data.confirmPassword) {
      setError("Make sure passwords match!");
      return;
    }
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/${endpoint}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(endpoint === 'login' ? {email,password} : data),
          }
        );
          if(response.status === 401) alert("Invalid Password! Please check again!");
          if(response.status === 404) alert("Invalid Email! Please check again!")
        const result = await response.json();
        if (result) {
          await setUserMode(result.role);
          await setStudentId(result.studentid);
          setAuthToken(true);
        }
      } catch (error) {
        console.log(error.detail);
      }
  };

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form>
          <h2>{isLoggedIn ? "Please log in" : "Please sign up!"}</h2>
          <input
            type="email"
            placeholder="email"
            name="email"
            onChange={isLoggedIn ? ((e)=>SetEmail(e.target.value)):handleChange}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={isLoggedIn ? ((e)=>setPassword(e.target.value)):handleChange}
          />
          {!isLoggedIn && (
            <>
              <input
                type="password"
                required
                name="confirmPassword"
                placeholder="confirm password"
                onChange={handleChange}
              />
              <div className="auth-container-bottom">
                {" "}
                <input
                  type="text"
                  placeholder="firstname"
                  required
                  name="firstname"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="lastname"
                  required
                  name="lastname"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="city"
                  required
                  name="city"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="date of birth"
                  required
                  name="dateofbirth"
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <input
            type="submit"
            className="create-user"
            onClick={(e) => handleSubmit(e, isLoggedIn ? "login" : "signup")}
          />
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLoggedIn ? "#f2f2f2" : "rgb(188,188,188)",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLoggedIn ? "#f2f2f2" : "rgb(188,188,188)",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
