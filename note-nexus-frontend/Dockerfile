# Use a lightweight Node.js image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /note-nexus/frontend/

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend code to the container
COPY . .

# Expose the port React runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start", "--watch"]
