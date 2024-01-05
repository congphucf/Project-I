import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Blueprint
import mysql.connector
import Model as md
import cv2
import numpy as np

app = Blueprint('router3', __name__)
CORS(app, supports_credentials=True, allow_headers=["Content-Type"])

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    uploaded_file = request.files['image']
    examId = request.form['additionalData']

    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="congphu123",
        database="user"
    )
    
    cursor = mydb.cursor()

    data=[]
    select_query = "SELECT * FROM my_exam WHERE id = " + str(examId)

    try:
        cursor.execute(select_query)

        # Lấy tất cả các dòng kết quả
        rows = cursor.fetchall()

        # In thông tin từ mỗi dòng
        for row in rows:
            answer = row[2]
    except Exception as e:
        print(f"Lỗi khi thực hiện SELECT: {e}")

    img_array = np.frombuffer(uploaded_file.read(), dtype=np.uint8)
    image = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    # # Làm gì đó với ảnh, ví dụ lưu vào thư mục hoặc xử lý thông tin ảnh
    grade, student_id, student_answer = md.evaluate(image, answer)
    print(answer)
    print(grade)
    studentAnswer=""
    for key, value in student_answer.items():
        if value == 0:
            studentAnswer=studentAnswer+'A'
        elif value == 1:
            studentAnswer=studentAnswer +'B'
        elif value == 2:
            studentAnswer=studentAnswer +'C'
        elif value ==3:
            studentAnswer=studentAnswer +'D'
        else:
            studentAnswer=studentAnswer+'E'

    
    insert_query = "INSERT INTO student_submit( exam_id, student_id, answer, score) VALUES (%s, %s, %s, %s)"
    data_to_insert = (examId, student_id, studentAnswer, grade)

    try:
        cursor.execute(insert_query, data_to_insert)

        # Lưu thay đổi và đóng kết nối
        mydb.commit()
        print("Insert thành công!")
    except Exception as e:
        print(f"Lỗi khi thực hiện INSERT: {e}")
    print(answer)
    print(studentAnswer)

    data={'grade': grade, 'student_id': student_id}
    return jsonify(data), 200

@app.route('/getstudentscore', methods=['POST'])
def get_data():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="congphu123",
        database="user"
    )

    cursor = mydb.cursor()
    request_data = request.get_json()

    # Truy cập giá trị của 'examId' từ dữ liệu JSON
    examId = request_data.get('examId')
    data=[]
    select_query = "SELECT * FROM student_submit where exam_id=" + str(examId)
    try:
        cursor.execute(select_query)

        # Lấy tất cả các dòng kết quả
        rows = cursor.fetchall()

        # In thông tin từ mỗi dòng
        for row in rows:
            data.append({"exam_id": row[1], "student_id": row[2], "student_answer": row[3], "score": row[4]})
        json_string = json.dumps(data)
        print(data)
    except Exception as e:
        print(f"Lỗi khi thực hiện SELECT: {e}")

    return jsonify(json_string)


