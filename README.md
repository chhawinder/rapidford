# *RapidFort: Word to PDF Converter*

RapidFort is a microservices-based application designed to simplify the process of converting Word documents to PDF. It utilizes AWS services for file storage and queuing, offering a scalable and efficient solution. 

## *Features*
1. *File Upload*: Upload Word files to AWS S3 using the upload-service.
2. *File Preview*: Preview uploaded files and enable file streaming via the preview-service.
3. *Word to PDF Conversion*: Convert Word documents to PDFs using the convert-service.
4. *Encrypted PDF Conversion*: Securely convert Word files to encrypted PDFs using the encrypted-convert-service.
5. *Frontend*: An intuitive React-based frontend to interact with all the services.

---

## *Project Architecture*
- *Frontend: A React application running on port **3000*.
- *Backend Services*:
  - upload-service: Handles file uploads and stores them in S3 (*Port 5001*).
  - preview-service: Provides previews and streaming functionality (*Port 5002*).
  - convert-service: Converts Word files to PDFs (*Port 5003*).
  - encrypted-convert-service: Converts Word files to encrypted PDFs (*Port 5004*).

---

## *Technologies Used*
- *Frontend*: React
- *Backend*: Node.js (Express.js)
- *AWS Services*:
  - S3 for file storage
  - SQS for queuing tasks
- *Docker*: Containerized architecture for all services
- *Docker Compose*: To manage multi-container deployments

---

## *Setup Instructions*

### *1. Prerequisites*
Ensure the following are installed on your system:
- Docker
- Docker Compose
- Node.js (if running locally without Docker)
- AWS credentials with access to S3 and SQS

### *2. Clone the Repository*
bash
git clone https://github.com/chhawinder/rapidford
cd rapidfort


### *3. Environment Variables Setup*
Create a .env file in the root of each backend service folder with the following variables (change PORT as per the service):

bash
PORT=<service-port>
AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_KEY>
AWS_REGION=<YOUR_AWS_REGION>
AWS_S3_BUCKET_NAME=<YOUR_AWS_BUCKET_NAME>
AWS_SQS_QUEUE_URL=<YOUR_AWS_SQS_QUEUE_URL>


### *4. Frontend*
Create a .env file in the root of each backend service folder with the following variables (change PORT as per the service):

bash
REACT_APP_UPLOAD_URL=http://localhost:5001/upload
REACT_APP_PREVIEW_URL=http://localhost:5002/preview
REACT_APP_SIMPLE_CONVERT_URL=http://localhost:5003/convert
REACT_APP_AUTH_CONVERT_URL=http://localhost:5004/convert-auth


### *5. Build and start the application*
Run the following command to start all services:
bash
docker-compose up --build


---

## *Build and Start the Application*

This will:

- Build Docker images for each service.
- Start the containers for the frontend and backend services.

---

## *Service Endpoints*

### *1. Upload Service*
- *URL*: http://localhost:5001/upload
- *Description*: Accepts Word files and uploads them to AWS S3.

### *2. Preview Service*
- *URL*: http://localhost:5002/preview
- *Description*: Retrieves and streams file previews.

### *3. Convert Service*
- *URL*: http://localhost:5003/convert
- *Description*: Converts Word files to PDF format.

### *4. Encrypted Convert Service*
- *URL*: http://localhost:5004/convert-auth
- *Description*: Converts Word files to encrypted PDF format for secure storage and sharing.

### *5. Frontend*
- *URL*: http://localhost:3000
- *Description*: User interface to interact with all backend services.

---

## *Environment Variables Overview*

### *Backend Services*

| Variable                  | Description                          | Example Value                                              |
|---------------------------|--------------------------------------|-----------------------------------------------------------|
| PORT                    | Port the service will run on         | 5001, 5002, 5003, 5004                            |
| AWS_ACCESS_KEY_ID       | AWS access key for authentication    | AKIAEXAMPLE12345678                                     |
| AWS_SECRET_ACCESS_KEY   | AWS secret key for authentication    | wJalrXUtnFEMI/K7MdL1xXXQ/abcd1234EXAMPLEkey                |
| AWS_REGION              | AWS region of resources              | us-west-2                                              |
| AWS_S3_BUCKET_NAME      | S3 bucket name for file storage      | example-bucket-1                                            |
| AWS_SQS_QUEUE_URL       | URL of the SQS queue                 | https://sqs.us-west-2.amazonaws.com/123456789012/example-queue |

### *Frontend*

| Variable                     | Description                             | Example Value                         |
|------------------------------|-----------------------------------------|---------------------------------------|
| REACT_APP_UPLOAD_URL       | URL for the upload service              | http://localhost:5001/upload        |
| REACT_APP_PREVIEW_URL      | URL for the preview service             | http://localhost:5002/preview       |
| REACT_APP_SIMPLE_CONVERT_URL | URL for the conversion service         | http://localhost:5003/convert       |
| REACT_APP_AUTH_CONVERT_URL | URL for the encrypted conversion service | http://localhost:5004/convert-auth |

---

## *How to Test the Application*

1. Start the application using docker-compose up --build.
2. Access the frontend at http://localhost:3000.
3. Upload a Word file via the interface.
4. Preview the uploaded file.
5. Convert the Word file to a PDF.
6. Optionally, create an encrypted PDF using the encrypted conversion service.

---



