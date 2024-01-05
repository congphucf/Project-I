import React, {useEffect, useState} from "react";
import axios from "axios";
import { Button, Modal } from 'react-bootstrap';

function CoursePage(props){

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const examId = props.match.params.courseid;
    const [additionalData, setAdditionalData] = useState('');
    

    
    const [exam, setExam] = useState({
        id:"",
        name:"",
        answer:""
    });

    const [formData, setFormData] = useState({
        examId: examId
    });

    const [score, setScore] = useState({
        studentId:'',
        grade:''
    })
    useEffect(() => {
    const fetchData = async() => {
        try {
            setAdditionalData(examId);
            formData.examId=examId;
            // Make a GET request to the Flask route
            const response = await axios.post("http://127.0.0.1:5000/router2/exam", formData);
            const decodedArray = JSON.parse(response.data);
            setExam({
                id: decodedArray.ID,
                name: decodedArray.Name,
                answer: decodedArray.Answer
            });

        } catch (error) {
            // Handle errors
            console.error('Error fetching data from Flask:', error);
        }
    };
        fetchData();
    }, []);

    const [selectedFile, setSelectedFile] = useState(null);
    

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select an image first.');
            return;
        }
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('additionalData', additionalData);

        try {
            const response = await axios.post("http://127.0.0.1:5000/router3/upload", formData);
            console.log(response.data); // Thông tin từ server
            alert('Image uploaded successfully!');
            setScore({
                studentId : response.data.student_id,
                grade : response.data.grade
            })
            setModalIsOpen(true);
            console.log(response.data);
        
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
        }
    };
    const closeModal = () => {
        setModalIsOpen(false);
        window.location.reload();
    };
    const rendermodal = () => {
        
        return <Modal
            show={modalIsOpen} onHide={closeModal}
        >
             <div className="modal-overlay">
                <div className="alert-modal">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2>Điểm thi của học sinh </h2>
                    <p>Số báo danh : {score.studentId}</p>
                    <p>Điểm : {score.grade}</p>
                </div>
            </div>
            <button onClick={closeModal}>Close</button>
        </Modal>
    }

    const [studentScore, setStudenScore] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            // Make a GET request to the Flask route
            const response = await axios.post("http://127.0.0.1:5000/router3/getstudentscore", formData);

            const decodedArray = JSON.parse(response.data);
            
            // Cập nhật state exam bằng cách kết hợp mảng cũ với decodedArray
            setStudenScore([...decodedArray]);
        } catch (error) {
            // Handle errors
            console.error('Error fetching data from Flask:', error);
        }
        };

        fetchData();
    }, []);

    console.log(studentScore);
    const rederStudentScore = () =>{
        return <div style={{ overflowX: 'auto', maxHeight: '600px', minHeight:'450px', padding:'40px 0px 0px 0px' }}>
        <h1 style={{ padding:'0px 40px 40px 0px' }} className="s24 title fontb c333">Bảng thống kê kết quả</h1>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Số báo danh</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {studentScore.map((student, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.student_id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    }
    
   
    
    return (
        <div className="course-page rel flex">
            <div className="course-info rel">

                <div className="course-meta">
                    <h2 className="s24 title fontb c333">{exam.name}</h2>
                    <div className="rel">
                        <p className="s18 about fontn c777">Tải file ảnh lên để chấm điểm</p>
                        <input className=" s15 c333" type="file" onChange={handleFileChange} />
                        <button className="button s15  c333" onClick={handleUpload}>Upload Image</button>
                        {rendermodal()}
                        
                    </div>
                </div>
                {/* <h1 className="page-title s24 fontb c333">Create exam</h1>

                <div className="exam-form-container">

                <div className="exam-section">
                    <form>
                    <label className="s20 fontb" htmlFor="examName">Tên Đề Thi:   </label>
                    <input
                        type="text"
                        id="examName"
                        name="examName"
                        value={exam.name}
                        // onChange={handleExamNameChange}
                        className="input-text"
                        required
                    />
                    </form>
                </div> 

                 <div className="exam-section">
                    <h3>Phần Đáp Án Câu Hỏi Trắc Nghiệm:</h3>
                    <div className="questions-container">
                    {[...Array(50).keys()].map((questionNumber) => (
                        <div key={questionNumber} className="question">
                        <p>Câu hỏi {questionNumber + 1}:</p>
                        {['A', 'B', 'C', 'D'].map((choice) => (
                            <label key={choice}>
                            <input
                                type="radio"
                                name={`q${questionNumber + 1}`}
                                value={choice}
                                // onChange={() => handleAnswerChange(questionNumber + 1, choice)}
                                required
                            />
                            {` ${choice}`}
                            </label>
                        ))}
                        </div>
                    ))}
                    </div>
                </div>

            <br />

            <button className="button_submit s24 fontb c333" type="button" >
                Tạo Đề Thi
            </button>
                        </div>*/}

            </div>

            <div className="course-preview rel">

                {rederStudentScore()}

            </div>

        </div>
    )
}

export default CoursePage;