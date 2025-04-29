# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

# Clean previous build artifacts
RUN rm -rf dist

# Build the NestJS application
RUN npm run build

# Add debug listings
RUN ls -l /app
RUN ls -l /app/dist

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD [ "node", "dist/main" ]
