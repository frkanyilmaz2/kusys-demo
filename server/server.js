const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");
const app = express();

app.use(cors());

//app.use(bodyParser.json());
app.use(express.json());

const port = process.env.PORT || 5000;

// This will compare the submitted password with the one in database.

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// *** GET OPERATIONS ***

//Get single student by studentid,it could be done by email too
app.get("/students/:studentid", async (req, res) => {
  const { studentid } = req.params;
  try {
    const student = await pool.query(
      `SELECT * FROM students WHERE studentid=$1`,
      [studentid]
    );
    res.json(student.rows[0]);
  } catch (error) {
    console.log(error.detail);
  }
});

//Get all the students

app.get("/students", async (req, res) => {
  try {
    const students = await pool.query(
      "SELECT * FROM students WHERE role='student' ORDER BY studentid ASC"
    );
    res.json(students.rows);
  } catch (error) {
    console.log(error.detail);
  }
});

//Get the student's enrolled course details by studentid

app.get("/students/enrolled/:studentid", async (req, res) => {
  const { studentid } = req.params;
  try {
    const students = await pool.query(
      `SELECT c.courseid,c.course_name FROM student_courses sc JOIN courses c ON sc.courseid = c.courseid WHERE sc.studentid=$1 ORDER BY courseid ASC`,
      [studentid]
    );
    res.json(students.rows);
  } catch (err) {
    console.log(err);
  }
});

//Get all the courses

app.get("/courses", async (req, res) => {
  try {
    const courses = await pool.query(
      "SELECT * FROM courses ORDER BY courseid ASC"
    );
    res.json(courses.rows);
  } catch (error) {
    console.log(error);
  }
});

//Get all the students who enrolled in selected course
app.get("/courses/students/:courseid", async (req, res) => {
  const { courseid } = req.params;
  try {
    const courses = await pool.query(
      `SELECT students.studentid, firstname, lastname FROM students INNER JOIN student_courses sc ON sc.studentid = students.studentid INNER JOIN courses c ON sc.courseid = c.courseid WHERE sc.courseid = '${courseid.toLocaleUpperCase()}' ORDER BY students.studentid ASC;
        `
    );
    res.json(courses.rows);
  } catch (error) {
    console.log(error.detail);
  }
});

// *** GET OPERATIONS ends here ***

// *** POST OPERATIONS ***

//Create a new course
app.post("/courses", async (req, res) => {
  const { courseid, course_name } = req.body;
  const courseId = courseid.toLocaleUpperCase();
  try {
    const newCourse = await pool.query(
      `INSERT INTO courses(courseid,course_name) VALUES ($1,$2)`,
      [courseId, course_name]
    );
    res.json(newCourse);
  } catch (error) {
    console.log(error.detail);
  }
});

//Add a new student

app.post("/students", async (req, res) => {
  const {
    studentid,
    firstname,
    lastname,
    city,
    dob,
    phone,
    email,
    password,
    role,
  } = req.body;

  const salt = await bcrypt.genSalt(10);
  console.log(password)
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword)

  try {
    const newStudent = await pool.query(
      `INSERT INTO students(studentid, firstname, lastname, city, dateofbirth, phone,email,password,role) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        studentid,
        firstname,
        lastname,
        city,
        dob,
        phone,
        email,
        hashedPassword,
        role,
      ]
    );
    res.json(newStudent);
  } catch (error) {
    console.log(error.detail);
  }
});

//Add new course to an existing student

app.post("/course/to/students/:courseid", async (req, res) => {
  const { courseid } = req.params
  const { studentid} = req.body;
  try {
    const addedCourse = await pool.query(
      `INSERT INTO student_courses(studentid,courseid) VALUES($1,$2)`,
      [studentid, courseid]
    );
    res.json(addedCourse);
  } catch (error) {
    console.log(error.detail);
  }
});

// *** POST OPERATIONS ends here ***

// *** PUT OPERATIONS  ***

// Change course name by getting its id
app.put("/courses/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCourse = await pool.query(
      `UPDATE courses SET course_name=$1 WHERE courseid = '${id.toLocaleUpperCase()}'`,
      [name]
    );
    res.json(updatedCourse);
  } catch (error) {
    console.log(error);
  }
});

//Update student details
app.put("/students/:studentid", async (req, res) => {
  const { studentid } = req.params;
  const { firstname, lastname, city, dateofbirth, phone, email } = req.body;
  try {
    const updatedStudent = await pool.query(
      `UPDATE students SET firstname=$1, lastname=$2, city=$3, dateofbirth=$4, phone=$5, email=$6 WHERE studentid=$7 `,
      [firstname, lastname, city, dateofbirth, phone, email, studentid]
    );

    res.json(updatedStudent);
  } catch (error) {
    console.log(error.detail);
  }
});

//Update student password
app.put("/students/password/:studentid", async (req, res) => {
  const { studentid } = req.params;
  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const updatePassword = await pool.query(
      `UPDATE students SET password=$1 WHERE studentid=$2`,
      [hashedPassword, studentid]
    );
    res.json(updatePassword);
  } catch (error) {
    console.log(error.detail);
  }
});

// *** PUT OPERATIONS  ends here***

// *** DELETE OPERATIONS ***

//Delete course from general course list
app.delete("/courses/:courseid", async (req, res) => {
  const { courseid } = req.params;
  try {
    const deleteCourse = await pool.query(
      `DELETE FROM courses WHERE courseid = $1`,
      [courseid]
    );
    res.json(deleteCourse);
  } catch (err) {
    console.log(err);
  }
});

//Delete course from a student
app.delete("/students/:studentid/courses/:courseid", async (req, res) => {
  const { studentid, courseid } = req.params;
  try {
    const deleteCourse = await pool.query(
      `DELETE FROM student_courses WHERE studentid=${studentid} AND courseid='${courseid.toLocaleUpperCase()}'`
    );
    res.json(deleteCourse);
  } catch (error) {
    console.log(error);
  }
});

//Delete a student
app.delete("/students/:studentid", async (req, res) => {
  const { studentid } = req.params;
  try {
    const deleteStudent = await pool.query(
      `DELETE FROM students WHERE studentid=${studentid}`
    );
    res.json(deleteStudent);
  } catch (error) {
    console.log(error.detail);
  }
});

// *** DELETE OPERATIONS ends here ***

// *** AUTH OPERATIONS ***

// Signup
app.post("/signup", async (req, res) => {
  const { email, password, firstname, lastname, city, dateofbirth } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const id = Math.floor(Math.random() * 9000) + 1000;
  try {
    const signUp = await pool.query(
      `INSERT INTO students(studentid,email,password,firstname,lastname,city,dateofbirth,role) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        id,
        email,
        hashedPassword,
        firstname,
        lastname,
        city,
        dateofbirth,
        "student",
      ]
    );

    const getData = await pool.query(
      `SELECT studentid,role FROM students WHERE email=$1`,
      [email]
    );

    res.json(getData.rows[0]);
  } catch (error) {
    console.log(error.detail);
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const response = await pool.query(`SELECT * FROM students WHERE email=$1`, [
      email,
    ]);
    const student = response.rows;
    if (!response.rows[0]) return res.status(404).json();
    else {
      const passwordMatch = await comparePassword(
        password,
        student[0].password
      );
      if (passwordMatch) {
        const { studentid, role } = student[0];
        return res.json({ studentid, role });
      } else {
      return res.status(401).json();
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// *** AUTH OPERATIONS ends here***

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);
