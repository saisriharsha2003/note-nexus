# Stage 1: Build
# Use a lightweight Node.js image
FROM alpine:3.18 AS build

# Install Node.js runtime
RUN apk add --no-cache nodejs npm

# Set the working directory inside the container
WORKDIR /note-nexus/backend/

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci && npm install -g nodemon

# Copy the entire backend code to the container
COPY . .

# Stage 2: Production
# Use a minimal base image
FROM alpine:3.18

# Install Node.js runtime and nodemon globally
RUN apk add --no-cache nodejs npm && npm install -g nodemon

# Set the working directory inside the container
WORKDIR /note-nexus/backend/

# Copy the files from the build stage
COPY --from=build /note-nexus/backend/ .

# Expose the port
EXPOSE 3000

# Command to run the app
CMD ["nodemon", "index.js"]
