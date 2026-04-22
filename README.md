# TalentBridge: Intelligent Placement Management System

TalentBridge is a full-stack web-based platform designed to streamline and automate the college placement process. It connects students, recruiters, alumni, and the Training & Placement (TNP) cell through a unified system, enhancing efficiency, transparency, and decision-making.

---

## Features

###  Student
- Browse and apply to job opportunities
- Track on-campus and off-campus applications
- View application status (applied, shortlisted, selected, rejected)
- Access alumni interview experiences
- Receive real-time and email notifications

###  Recruiter
- View applicants for job postings
- Filter candidates based on similarity score (AI-based)
- Sort candidates (highest/lowest match)
- Update application status

### TNP / Admin
- Post job opportunities
- Assign recruiters to jobs
- Monitor applications
- View analytics dashboards (charts, placement stats)

### Alumni
- Share interview experiences
- Help students prepare for placements

---

## Intelligent Feature (USP)

- Resume–Job Matching using Machine Learning
- Uses Sentence Transformers (`all-MiniLM-L6-v2`)
- Computes similarity using cosine similarity
- Helps recruiters filter candidates efficiently

---

##  Notification System

-  Real-time notifications using Firebase
-  Persistent notifications stored in database
-  Email alerts for:
  - Job postings
  - Application status updates
  - Recruiter assignments

---

##  Tech Stack

### Frontend
- React.js
- Axios
- Recharts (for analytics)

### Backend
- Spring Boot (REST APIs)
- JWT Authentication

### Database
- MySQL

### Machine Learning Microservice
- Python (Flask)
- Sentence Transformers

### Other Tools
- Firebase (Real-time notifications)
- Email Service (SMTP)

---

##  System Architecture

- Three-tier architecture:
  - Client Layer (React)
  - Application Layer (Spring Boot)
  - Data Layer (MySQL)
- Integrated with:
  - Python ML microservice
  - Firebase notification service

---

##  Workflow

1. Student logs in and applies for a job  
2. Resume is processed by ML microservice  
3. Similarity score is generated  
4. Recruiter filters and evaluates candidates  
5. Application status is updated  
6. Notifications are sent to users  

---


## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/SHUBIKAARORA/talentbridge.git
cd talentbridge

cd talentbridge
mvn spring-boot:run

cd talentbridge-frontend
npm install
npm start

cd matching-service
pip install -r requirements.txt
python app.py

Create MySQL database
Import schema
Update application.properties

Author 
Shubika Arora