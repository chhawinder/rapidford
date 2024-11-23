# Base image
FROM node:21.0.0

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port for the service
EXPOSE 5001

# Start the service
CMD ["node", "index.js"]