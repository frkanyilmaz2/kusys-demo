import React from 'react'

const Signout = ({setUserMode,setAuthToken, setStudentId, studentPage}) => {

    const signOut= () =>{
        console.log("signed out");
        setAuthToken(false);
        setUserMode("");
        setStudentId("");
    }
  return (
    <div className='signout'>
        <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

export default Signout