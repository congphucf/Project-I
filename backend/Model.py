from imutils.perspective import four_point_transform
from imutils import contours
import numpy as np
import argparse
import imutils
import cv2

def evaluate(image, answer):
	exchange={'A':0, 'B':1, 'C':2, 'D':3, 'E':4}
	if (answer!=None):
		n=len(answer)
	else:
		n=0
		answer=""
	if(n<50):
		answer =answer + ("E"*(50-n))
	student_anwer = {}
	grade=0
	student_id=""

	# image = cv2.imread("Test4.jpg")
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	blurred = cv2.GaussianBlur(gray, (5, 5), 0)
	edged = cv2.Canny(blurred, 75, 200)

	cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
	cnts = imutils.grab_contours(cnts)
	docCnt = None
	cv2.drawContours(image, cnts, -1, (0, 255, 0), 2)
	imgs=[]
	# ensure that at least one contour was found
	if len(cnts) > 0:
		# sort the contours according to their size in
		# descending order
		cnts = sorted(cnts, key=lambda x: cv2.minEnclosingCircle(x)[0][0])
		# loop over the sorted contours
		for c in cnts:
			# approximate the contour
			peri = cv2.arcLength(c, True)
			approx = cv2.approxPolyDP(c, 0.05 * peri, True)
			# if our approximated contour has four points,
			# then we can assume we have found the paper
			if len(approx) == 4:
				docCnt = approx
				approx=[]
				paper = four_point_transform(image, docCnt.reshape(4, 2))
				warped = four_point_transform(gray, docCnt.reshape(4, 2))
				thresh = cv2.threshold(warped, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
				current_height, current_width, _ = paper.shape
				if current_height/current_width>=2 and current_width*current_height>=5000:
					imgs.append(paper)

	imgs.sort(key=lambda x: x.shape[1])

	for index, img in enumerate(imgs):
		filled_circles_indices = []
		questionCnts = []
		gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		blurred = cv2.GaussianBlur(gray, (5, 5), 0)
		edged = cv2.Canny(blurred, 0, 100)
		bubbled = None
		if index<2:
			circles =  cv2.HoughCircles(
				edged,
				cv2.HOUGH_GRADIENT,
				dp=1, minDist=20, param1=50, param2=12, minRadius=10, maxRadius=17
			)
			thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
		else:
			circles =  cv2.HoughCircles(
				edged,
				cv2.HOUGH_GRADIENT,
				dp=1, minDist=20, param1=50, param2=13, minRadius=10, maxRadius=17
			)
			thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
			
		if circles is not None:
			# Làm tròn tọa độ và bán kính
			circles = np.uint16(np.around(circles))
			black_image = np.zeros_like(img)

			if index==0 or index==1:
				circles_sorted = sorted(circles[0, :], key=lambda x: x[0])
				paired_circles = [circles_sorted[i:i + 10] for i in range(0, len(circles_sorted), 10)]
				student_id=""
				for i, pair in enumerate(paired_circles):
					bludded=None
					pair.sort(key=lambda x: x[1])
					for k,circle in enumerate(pair):
						mask = np.zeros_like(gray)
						cv2.circle(mask, (circle[0], circle[1]), circle[2], 255, thickness=cv2.FILLED)
						filtered_circles = cv2.bitwise_and(thresh, thresh, mask=mask)
						total = cv2.countNonZero(filtered_circles)
						if total > 170:
							student_id=student_id+str(k)
							cv2.circle(img, (circle[0], circle[1]), circle[2], (0, 255, 0), 2)
				print(student_id)

			if index>=2:
				circles_sorted = sorted(circles[0, :], key=lambda x: x[1])
				paired_circles = [circles_sorted[i:i + 4] for i in range(0, len(circles_sorted), 4)]

				for i, pair in enumerate(paired_circles):
					bludded=None
					pair.sort(key=lambda x: x[0])
					if index==2:
						student_anwer[i]=-1
					else:
						student_anwer[i+25]=-1
					for k,circle in enumerate(pair):

						mask = np.zeros_like(gray)
						cv2.circle(mask, (circle[0], circle[1]), circle[2], 255, thickness=cv2.FILLED)
						filtered_circles = cv2.bitwise_and(thresh, thresh, mask=mask)
						total = cv2.countNonZero(filtered_circles)
						if total > 200:
							if index==2:
								student_anwer[i]=k
							else:
								student_anwer[i+25]=k
						cv2.circle(img, (circle[0], circle[1]), circle[2], (0, 255, 0), 2)
					if index==2:
						if(student_anwer[i]==exchange[answer[i]]):
							grade+=2
					else:
						if(student_anwer[i+25]==exchange[answer[i+25]]):
							grade+=2


	print(student_id)
	print(grade)
	print(student_anwer)
	return grade, student_id, student_anwer


