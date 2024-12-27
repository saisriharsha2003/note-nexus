# Stage 1: Build
# Use a lightweight Node.js image
FROM alpine:3.18 AS build

# Install Node.js runtime
RUN apk add --no-cache nodejs npm

# Set the working directory inside the container
WORKDIR /note-nexus/frontend/

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire frontend code to the container
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
# Use a minimal base image
FROM alpine:3.18

# Install Node.js runtime
RUN apk add --no-cache nodejs npm

# Set the working directory inside the container
WORKDIR /note-nexus/frontend/

# Copy the built files from the build stage
COPY --from=build /note-nexus/frontend/build ./build

# Expose the port React runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start", "--watch"]
