from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import Blueprint
import mysql.connector

app = Blueprint('router1', __name__)
CORS(app, supports_credentials=True, allow_headers=["Content-Type"])

@app.route('/addexam', methods=['POST'])
def receive_data():
    try:
        # Nhận dữ liệu từ yêu cầu POST
        data_received = request.get_json()

        # Xử lý dữ liệu ở đây
        # ...

        # Trả về phản hồi cho clien
        print("Data received:", data_received.get('name'), data_received.get('answer'))
        response_data = {'status': 'success', 'message': 'Data received successfully'}
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="congphu123",
            database="user"
        )

        cursor= mydb.cursor()
        insert_query = "INSERT INTO my_exam (name, answer) VALUES (%s, %s)"
        data_to_insert = (data_received.get('name'), data_received.get('answer'))

        try:
            cursor.execute(insert_query, data_to_insert)

            # Lưu thay đổi và đóng kết nối
            mydb.commit()
            print("Insert thành công!")
        except Exception as e:
            print(f"Lỗi khi thực hiện INSERT: {e}")
        finally:
            mydb.close()
            

        return jsonify(response_data)
    except Exception as e:
        # Trả về lỗi nếu có bất kỳ lỗi nào xảy ra
        error_message = {'status': 'error', 'message': str(e)}
        return jsonify(error_message)


