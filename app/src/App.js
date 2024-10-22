// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3000/api/courses"; // Update if necessary

function App() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(API_URL);
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Courses</h1>
      <input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      <div className="course-grid">
        {filteredCourses.map((course) => (
          <div key={course.id} className="course-card">
            {/* Use presigned thumbnail URL */}
            <img src={course.thumbnailUrl} alt={course.name} className="thumbnail" />
            <div className="course-details">
              <h2>{course.name}</h2>
              <p>{course.description}</p>
              <p><strong>Type:</strong> {course.type}</p>
              <p><strong>Proficiency:</strong> {course.proficiency}</p>
              <p><strong>Duration:</strong> {course.duration} mins</p>
              <a href={course.url} target="_blank" rel="noopener noreferrer" className="link">
                Go to course
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;