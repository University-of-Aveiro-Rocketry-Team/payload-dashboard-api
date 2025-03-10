# Use a smaller base image for production
FROM node:lts-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files for installing dependencies
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Use a smaller runtime image for final deployment
FROM node:lts-alpine AS runtime

# Set working directory
WORKDIR /usr/src/app

# Copy only necessary files from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
