# Use official Node 22-alpine version
FROM node:22-alpine

# Set the working directory
WORKDIR /harsha_portfolio/

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install express

# Copy the rest of the application code to the working directory
COPY . .

# Expose the default port for React app (8080)
EXPOSE 8080

# Run the React development server using npm start
CMD ["npm", "start"]
