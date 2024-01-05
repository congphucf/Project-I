import React, {useEffect, useState} from "react";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { saveAs } from 'file-saver';
import picture from '../ExamPaper.jpg';


function MyCoursesPage() {
    useEffect(()=>{
        document.title = "Exam Paper";
    })

    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        setSelectedFile(file);
    };
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const onUpload = async () => {
          if (!selectedFile) {
          alert('Please select an image first.');
          return;
          }

          const formData = new FormData();
          formData.append('image', selectedFile);

          try {
          const response = await axios.post("http://127.0.0.1:5000/upload", formData);
          console.log(response.data); // Thông tin từ server
          alert('Image uploaded successfully!');
          } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image. Please try again.');
          }
    };
    const downloadPdf = () => {
      // Tạo một đường link đến file PDF
      const pdfPath = picture;
      fetch(pdfPath)
      .then(response => response.blob())
      .then(blob => saveAs(blob, 'ExamPaper.jpg'))
      .catch(error => console.error('Lỗi khi tải xuống file:', error));
  
      // // Tạo một đối tượng <a> ẩn để tải xuống file
      // const link = document.createElement('a');
      // link.href = pdfUrl;
      // link.download = 'ExamPaper.pdf';
      
      // // Thêm đối tượng <a> vào DOM và kích hoạt sự kiện click để bắt đầu tải xuống
      // document.body.appendChild(link);
      // link.click();
  
      // // Xóa đối tượng <a> sau khi đã tải xuống xong
      // document.body.removeChild(link);
    };


    useEffect(()=>{
        document.title = "My Courses";
    })

    return (
        <div className="app-page rel">
            <h1 className="page-title s24 fontb c333">Get exam paper</h1>

            <div className="centered-container">
                <p className="s18 oline fontn">Tải xuống giấy thi ở đây</p>
                <button className="button s15 fontb c333" onClick={downloadPdf}>Tải xuống</button>
            </div>
        </div>

       
    )
}

export default MyCoursesPage;