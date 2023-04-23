# Base image
FROM node:alpine

# Set the working directory
WORKDIR /app/server

# Copy the package and lock files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the server files to the container
COPY . .

# Expose the port that the server will listen to
EXPOSE 3000

# Start the server
CMD [ "npm", "start" ]