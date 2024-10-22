# Use the official Node.js image as a base
FROM node:16

# Install nano and other necessary packages
RUN apt-get update && apt-get install -y nano

# Set the working directory
WORKDIR /usr/src/api

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]