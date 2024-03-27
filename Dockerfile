# Using an official Node.js runtime as a parent image
FROM node:20.11.1

<<<<<<< HEAD
# RUN apt-get update \
#      && apt-get install default-jre -y \
#      && apt-get install default-jdk -y

=======
>>>>>>> 48a8b605a0577ee85f6c6560dc80fe93a49e86d6
# Setting the working directory in the container
WORKDIR /task-web-interface

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
<<<<<<< HEAD
EXPOSE 3000
=======
EXPOSE 3008
>>>>>>> 48a8b605a0577ee85f6c6560dc80fe93a49e86d6

# Command to run the application
 # CMD ["node", "index.js"]

 CMD node index.js
