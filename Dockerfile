# Use Node.js as the base image
FROM node:21.0.0

# Set the working directory inside the container
WORKDIR /app

# Copy and install dependencies for each backend service
COPY encrypted-convert-service/package.json encrypted-convert-service/
COPY convert-service/package.json convert-service/
COPY preview-service/package.json preview-service/
COPY upload-service/package.json upload-service/

RUN cd encrypted-convert-service && npm install && cd .. \
    && cd convert-service && npm install && cd .. \
    && cd preview-service && npm install && cd .. \
    && cd upload-service && npm install && cd ..

# Copy backend services files
COPY encrypted-convert-service ./encrypted-convert-service
COPY convert-service ./convert-service
COPY preview-service ./preview-service
COPY upload-service ./upload-service

# Install PM2 globally for backend process management
RUN npm install -g pm2

# Copy and build the frontend
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Expose backend and frontend ports
EXPOSE 5001 5002 5003 5004 3000

# Command to start backend services and serve the frontend
CMD ["sh", "-c", "pm2 start encrypted-convert-service/index.js --name encrypted-convert-service --watch && \
                   pm2 start convert-service/index.js --name convert-service --watch && \
                   pm2 start preview-service/index.js --name preview-service --watch && \
                   pm2 start upload-service/index.js --name upload-service --watch && \
                   pm2 serve ./frontend/build 3000 --name frontend --watch && \
                   pm2 logs"]