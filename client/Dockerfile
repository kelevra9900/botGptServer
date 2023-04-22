# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app/client

# Copy the package and lock files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the client files to the container
COPY . .

# Build the client
RUN npm run build

# Expose the port that the client will be served on
EXPOSE 5000

# Start the client server
CMD [ "npm", "start" ]