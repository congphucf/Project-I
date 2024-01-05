import React, {useEffect, useState} from "react";
import axios from "axios";
import { Button, Modal } from 'react-bootstrap';


function DiscoverPage(){
    useEffect(()=>{
        document.title = "My Exam";
    })

    const [showModal, setShowModal] = useState(false);
    const [examToDelete, setExamToDelete] = useState(0);

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
            const response = await axios.get("http://127.0.0.1:5000/router2/getexam");

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

    // const handleDeleteButtonClick = async (examId, event) => {
       
    //     const formData = {
    //         examId: examId
    //     };
    //     console.log(formData);
    //     try {
    //         // Make a GET request to the Flask route
    //         const response = await axios.post("http://127.0.0.1:5000/router2/deleteexam", formData);

    //        console.log(response.data);
    //        window.location.reload();
            
    //         // Cập nhật state exam bằng cách kết hợp mảng cũ với decodedArray

    //     } catch (error) {
    //         // Handle errors
    //         console.error('Error fetching data from Flask:', error);
    //     }
    // }

    const handleDeleteButtonClick = async (examId, event) => {
        setExamToDelete(examId);
        setShowModal(true);
    };

    const handleConfirmDelete = async() => {
        const formData = {
            examId: examToDelete
        };
        console.log(formData);
        try {
            // Make a GET request to the Flask route
            const response = await axios.post("http://127.0.0.1:5000/router2/deleteexam", formData);

           console.log(response.data);
           window.location.reload();
            
            // Cập nhật state exam bằng cách kết hợp mảng cũ với decodedArray

        } catch (error) {
            // Handle errors
            console.error('Error fetching data from Flask:', error);
        }
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };
    

    const createExams = () => {
        const rows = [];
        for(let j=0; j<(exam.length)/3; j++){
            var courseList = [];
            for(let i = j*3; i<Math.min(exam.length, j*3+3); i++){
                courseList.push(
                    <div className="course rel" >
                        <div className="block rel" style={{
                            background: "#e2e2e2 url no-repeat center"
                        }}>
                        <button className="round-button" style={{ backgroundColor: "red" }} onClick={(e) => handleDeleteButtonClick(exam[i].ID, e)} ></button>

                            <div className="course-title abs" onClick={(e) => handleDivClick(exam[i].ID, e)}>
                                <h2 className="s15 name fontb cfff" >{exam[i].Name}</h2>
                            </div>

                        </div>
                        <Modal show={showModal} onHide={handleCancelDelete}>
                            <Modal.Header closeButton>
                            <Modal.Title>Xác nhận xóa</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            Bạn có chắc chắn muốn xóa không?
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={handleCancelDelete}>
                                Hủy
                            </Button>
                            <Button variant="danger" onClick={handleConfirmDelete}>
                                Xóa
                            </Button>
                            </Modal.Footer>
                        </Modal>
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

    return (
        <div className="app-page rel">
            <h1 className="page-title s24 fontb c333">My exams</h1>

            <div className="section section-b rel">
                    {/* {createRows()} */}
                    {createExams()}
            </div>
        </div>

    )
}

export default DiscoverPage;