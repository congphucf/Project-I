import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="congphu123",
    database="user"
)
cursor= mydb.cursor()

try:
    show_tables_query = "SHOW TABLES"
    cursor.execute(show_tables_query)

    # Lấy tất cả các tên bảng
    tables = cursor.fetchall()

    if tables:
        print("Danh sách các bảng trong cơ sở dữ liệu:")
        for table in tables:
            print(table[0])
    else:
        print("Không có bảng nào trong cơ sở dữ liệu.")

except Exception as e:
    print(f"Lỗi khi thực hiện SHOW TABLES: {e}")




create_table_query = """
CREATE TABLE IF NOT EXISTS my_exam (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    answer VARCHAR(50)
)
"""

create_table_query = """
CREATE TABLE IF NOT EXISTS student_submit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT,
    student_id VARCHAR(50),
    answer VARCHAR(50),
    score INT,
    FOREIGN KEY (exam_id) REFERENCES my_exam(id)
)
"""

cursor.execute(create_table_query)
select_query = "SELECT * FROM student_score"

try:
    cursor.execute(select_query)

    # Lấy tất cả các dòng kết quả
    rows = cursor.fetchall()

    # In thông tin từ mỗi dòng
    for row in rows:
        print(f"ID: {row[0]}, Name: {row[1]}, Answer: {row[2]}")

except Exception as e:
    print(f"Lỗi khi thực hiện SELECT: {e}")

