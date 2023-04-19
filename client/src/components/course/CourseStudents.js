import React, { useEffect, useState } from 'react'
import ListStudents from '../admin/ListStudents'
import Spinner from '../global/Spinner';

const CourseStudents = ({setShowAnotherPopup,courseid}) => {

    const [students,setStudents] = useState(null);
    const [isDataFetched,setIsDataFetched] = useState(false);
    const comeFromCourse = true; //this will check if the ListStudents component opened from courses section or students section.

    const getCourseStudents = async ()=>{
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/courses/students/${courseid}`);
            const json = await response.json();
            
            if(response.status === 200){
                setStudents(json);
                setIsDataFetched(true);
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCourseStudents();
    }, [])
    

  return (
    <div className='overlay'>
        <div className="popup">
        <div className="row w-100">
          <div className="col-lg-10 col-md-2 col-xs-2">
            <h2 className="popup-title ">{courseid}</h2>
          </div>
          <div className="col-lg-2 col-md-2 col-xs-2 d-flex justify-content-center">
            <button
              className="close-button"
              onClick={() => setShowAnotherPopup(false)}
            >
              <i className="fa-sharp fa-solid fa-circle-xmark"></i>
            </button>
          </div>
          <div className='row row w-100 pl-5'>
            <div className="col-lg-12">
            { isDataFetched ? <ListStudents students={students} comeFromCourse={comeFromCourse} /> : <Spinner />}
            </div>
          </div>
        </div>
        </div>
    </div>
  )
}

export default CourseStudents