import React, {useEffect, useState} from "react";
import axios from 'axios';

function CategoriesPage(){

    useEffect(()=>{
        document.title = "Create Exam";
    })

    const [formData, setFormData] = useState({
        name: '',
        answer: '',
    });

    // State để lưu trữ tên đề thi
    const [examName, setExamName] = useState('');

    // State để lưu trữ đáp án cho mỗi câu hỏi
    const [answers, setAnswers] = useState({});

    // Hàm xử lý thay đổi tên đề thi
    const handleExamNameChange = (event) => {
        setExamName(event.target.value);
    };

    // Hàm xử lý thay đổi đáp án cho mỗi câu hỏi
    const handleAnswerChange = (questionNumber, answer) => {
        setAnswers({ ...answers, [questionNumber]: answer });
    };

    // Hàm xử lý khi nhấn nút tạo đề thi
    const submitForm = async () => {
        // Hiển thị thông tin đề thi
        const length =  Object.keys(answers).length;
        if (length<50){
            alert("Chưa trả lời toàn bộ câu hỏi");
        }
        else{
            const answer = Object.values(answers).join('');
            formData.answer=answer;
            formData.name=examName;
            console.log('Chuỗi giá trị gộp lại:', answer);
            console.log('name: ', examName);
            try {
                const response = await axios.post('http://127.0.0.1:5000/router1/addexam', formData);
                console.log('Response from server:');
              } catch (error) {
                console.error('Error while sending data:', error);
            }
        }
    };

    return (
        <div className="app-page rel">
            <h1 className="page-title s24 fontb c333">Create exam</h1>

            <div className="exam-form-container">

            <div className="exam-section">
                <form>
                <label className="s20 fontb" htmlFor="examName">Tên Đề Thi:   </label>
                <input
                    type="text"
                    id="examName"
                    name="examName"
                    value={examName}
                    onChange={handleExamNameChange}
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
                            onChange={() => handleAnswerChange(questionNumber + 1, choice)}
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

            <button className="button_submit s24 fontb c333" type="button" onClick={submitForm}>
                Tạo Đề Thi
            </button>
            </div>
        </div>
    )
}

export default CategoriesPage;