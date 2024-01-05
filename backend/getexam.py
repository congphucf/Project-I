import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Blueprint
import mysql.connector

app = Blueprint('router2', __name__)
CORS(app, supports_credentials=True, allow_headers=["Content-Type"])

@app.route('/getexam', methods=['GET'])
def get_data():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="congphu123",
        database="user"
    )
    cursor = mydb.cursor()
    data=[]
    select_query = "SELECT * FROM my_exam"
    try:
        cursor.execute(select_query)

        # Lấy tất cả các dòng kết quả
        rows = cursor.fetchall()

        # In thông tin từ mỗi dòng
        for row in rows:
            data.append({"ID": row[0], "Name": row[1], "Answer": row[2]})
        print(data)
        json_string = json.dumps(data)
    except Exception as e:
        print(f"Lỗi khi thực hiện SELECT: {e}")

    return jsonify(json_string)

@app.route('/exam', methods=['POST'])
def receive_data():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="congphu123",
        database="user"
    )

    request_data = request.get_json()

    # Truy cập giá trị của 'examId' từ dữ liệu JSON
    examId = request_data.get('examId')

    cursor = mydb.cursor()
    data={}
    select_query = "SELECT * FROM my_exam WHERE id = " + str(examId)
    try:
        cursor.execute(select_query)

        # Lấy tất cả các dòng kết quả
        rows = cursor.fetchall()

        # In thông tin từ mỗi dòng
        for row in rows:
            data = {"ID": row[0], "Name": row[1], "Answer": row[2]}
        print(data)
        json_string = json.dumps(data)
    except Exception as e:
        print(f"Lỗi khi thực hiện SELECT: {e}")

    return jsonify(json_string)

@app.route('/getexampopular', methods=['GET'])
def get():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="congphu123",
        database="user"
    )
    cursor = mydb.cursor()
    data=[]
    select_query = """SELECT 
                        my_exam.id AS exam_id,
                        my_exam.name AS exam_name,
                        my_exam.answer AS answer,
                        COUNT(student_submit.id) AS submission_count
                    FROM 
                        my_exam
                    LEFT JOIN 
                        student_submit ON my_exam.id = student_submit.exam_id
                    GROUP BY 
                        my_exam.id
                    ORDER BY 
                        submission_count DESC
                    LIMIT 3;"""
    try:
        cursor.execute(select_query)

        # Lấy tất cả các dòng kết quả
        rows = cursor.fetchall()

        # In thông tin từ mỗi dòng
        for row in rows:
            data.append({"ID": row[0], "Name": row[1], "Answer": row[2]})
        print(data)
        json_string = json.dumps(data)
    except Exception as e:
        print(f"Lỗi khi thực hiện SELECT: {e}")

    return jsonify(json_string)


@app.route('/deleteexam', methods=['POST'])
def deleteexam():
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="congphu123",
        database="user"
    )

    request_data = request.get_json()

    # Truy cập giá trị của 'examId' từ dữ liệu JSON
    examId = request_data.get('examId')
    print(examId)
    json_string=""

    cursor = mydb.cursor()
    try:
        delete_query="DELETE FROM student_submit WHERE exam_id = "+str(examId)
        cursor.execute(delete_query)
        delete_query="DELETE FROM my_exam WHERE id = " + str(examId)
        cursor.execute(delete_query)
        mydb.commit()

        json_string = "Thành công"
    except Exception as e:
        print(f"Lỗi khi thực hiện SELECT: {e}")

    return jsonify(json_string)




