import React, {useEffect, useState} from "react";
import Course1 from "../ui/course-1.png";
import Course2 from "../ui/course-2.jpg";
import axios from "axios";

import {
    NavLink,    
} from "react-router-dom";

function HomePage(){

    useEffect(()=>{
        document.title = "Home";
    })

    const handleDivClick = (id, event) => {
        // Chặn hành động mặc định của sự kiện (ví dụ: chuyển hướng đến đường link)
        event.preventDefault();
        window.location.href="http://localhost:3000/#/course/" + id;
      };

    const [exam, setExam] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            // Make a GET request to the Flask route
            const response = await axios.get("http://127.0.0.1:5000/router2/getexampopular");

            const decodedArray = JSON.parse(response.data);
            
            // Cập nhật state exam bằng cách kết hợp mảng cũ với decodedArray
            setExam((prevExam) => [...prevExam, ...decodedArray]);
        } catch (error) {
            // Handle errors
            console.error('Error fetching data from Flask:', error);
        }
        };

        fetchData();
    }, []);

    const createExams = () => {
        const rows = [];
        for(let j=0; j<(exam.length)/3; j++){
            var courseList = [];
            for(let i = j*3; i<Math.min(exam.length, j*3+3); i++){
                courseList.push(
                    <div className="course rel" onClick={(e) => handleDivClick(exam[i].ID, e)}>
                        <div className="block rel" style={{
                            background: "#e2e2e2 url no-repeat center"
                        }}>
                            

                            <div className="course-title abs">
                                <h2 className="s15 name fontb cfff">{exam[i].Name}</h2>
                            </div>

                        </div>
                    </div>
                );
            }
            rows.push(
                <div className="courses rel flex">
                    {courseList}
                </div>
            );
        }
        
            return rows;
        };


    const [popularCourse, setPopularCourse] = useState([
        {
            ID: 1,
            title: "Learning How to Create Beautiful Scenes in Illustrator in 60 minutes",
            tutor: {
                ID: 1,
                name: "Lana Marandina",
                username: "lanamara",
                dp: "http://placeimg.com/100/100/people?tutor-" + 1,
            },
            duration: "82 min",            
            poster: Course1
        },
        {
            ID: 2,
            title: "Creating a beautiful Portrait Illustration. Learning new Technics and Tricks.",
            tutor: {
                ID: 2,
                name: "Uran Design",
                username: "urancd",
                dp: "http://placeimg.com/100/100/people?tutor-" + 2,
            },
            duration: "1 hr 13 min",            
            poster: Course2
        }
    ]);

    var courseList = [];
    for(let i = 0; i < popularCourse.length; i++){
        courseList.push(
            <NavLink to={"/course/" + popularCourse[i].ID} className="course rel" key={"popular-course-" + i}>
                <div className="block rel" style={{
                    background: "#e2e2e2 url(" + popularCourse[i].poster +") no-repeat center"
                }}>

                    <div className="user abs aic flex">
                        <div className="pic">
                            <img src={popularCourse[i].tutor.dp} className="bl" />
                        </div>
                        <div className="meta rel">
                            <h2 className="s15 name fontb cfff">{popularCourse[i].tutor.name}</h2>
                            <h2 className="s13 uname fontn cfff">@{popularCourse[i].tutor.username}</h2>
                        </div>
                    </div>

                    <div className="dura abs">
                        <h2 className="s13 name fontb cfff">{popularCourse[i].duration}</h2>
                    </div>

                    <div className="course-title abs">
                        <h2 className="s15 name fontb cfff">{popularCourse[i].title}</h2>
                    </div>

                </div>
            </NavLink>
        );
    }

    return (
        <div className="home-page rel">

            <div className="section section-b rel">
                <h2 className="title s24 fontb">Popular</h2>
                <div className="section section-b rel">
                    {/* {createRows()} */}
                    {createExams()}
                </div>
            </div>

        </div>
    )
}

export default HomePage;