# Use an official Node.js runtime as a parent image
FROM node:18

# Install pnpm globally
RUN npm install -g pnpm

# Accept a build argument for the port
ARG PORT

# Set the environment variable
ENV PORT=${VITE_PORT}

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the application
CMD ["pnpm", "dev"]