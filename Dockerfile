# Use a LTS version of Node.js
FROM node:22.14.0
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of the application files
COPY . .
 
# Expose the port the app runs on
EXPOSE 5173
 
# Define the command to run the app
CMD ["npm", "run", "dev"]