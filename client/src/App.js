import { useState } from "react";
import AdminPage from "./components/admin/AdminPage";
import { StudentPage } from "./components/student/StudentPage";
import Auth from "./components/global/Auth";

function App() {
  const [userMode, setUserMode] = useState("");
  const [studentId,setStudentId] = useState("");
  const [authToken, setAuthToken] = useState(false);

  return (
    <div className="main-container">
      {!authToken ? (
        <Auth setUserMode={setUserMode} setAuthToken={setAuthToken} setStudentId={setStudentId}/>
      ) : userMode !== "admin" ? (
        <StudentPage studentid={studentId} setUserMode={setUserMode} setAuthToken={setAuthToken} setStudentId={setStudentId}/>
      ) : (
        <AdminPage  setUserMode={setUserMode} setAuthToken={setAuthToken} setStudentId={setStudentId}/>
      )}
    </div>
  );
}

export default App;
