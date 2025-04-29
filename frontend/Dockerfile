# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Re-run npm install after copying all files to ensure all dependencies are available
RUN npm install

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application (assuming a start script in package.json)
CMD sh -c "npm start & wait"
