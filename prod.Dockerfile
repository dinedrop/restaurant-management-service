# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock file to the working directory
COPY package.json yarn.lock /app/

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy the rest of the application code to the working directory
COPY . /app/

# Set the environment variable to production
ENV NODE_ENV=production

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
