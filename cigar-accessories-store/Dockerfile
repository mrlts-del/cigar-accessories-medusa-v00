# Use an official Node.js runtime as a parent image
# Make sure this matches the Node version specified in your package.json engines field if possible
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Install necessary build tools if needed (uncomment if build requires python, make, g++)
# RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package.json and yarn.lock (or package-lock.json)
COPY package.json yarn.lock* ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the Medusa application (including the admin)
# Ensure NODE_OPTIONS is set here if needed for build memory, or set via fly secrets later
# RUN yarn build
# Note: We will run the build as part of the release command in fly.toml instead
# to ensure it runs with production environment variables/secrets available.

# Expose the port Medusa runs on (default 9000, but Fly will map it)
EXPOSE 9000

# Define the command to run your app
CMD ["yarn", "start"]