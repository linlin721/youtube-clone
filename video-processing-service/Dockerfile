# build a production Dockerfile
# use muti-stage build to reduce the size of the image, no source files, only the complied files

# stage 1: build stage, use to build the app
FROM node:18 AS builder
# set the working directory in the container to /app
WORKDIR /app

# copy package.json and package-lock.json into the working dir
COPY package*.json ./

# install the needed packages specified in the package.json
RUN npm install

# build the app source inside the docker image
COPY . .

# build the app
RUN npm run build

# stage 2: production stage, used to run the app
FROM node:18

# install ffmpeg inside the container
# RUN brew upgrade && brew install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# set the working directory
WORKDIR /app

# copy the package.json and package-locl.json
COPY package*.json ./

# install only production dependencies
RUN npm install --only=production

# copy built app from the builder stage
COPY --from=builder /app/dist ./dist

# make port available to the world outside this container
EXPOSE 3000

# define the command to run the app using CMD which defines the runtime
# CMD can be used only once 
CMD ["npm", "run", "serve"]

########simple approch########

# # starting with the base image
# # use an official Node runtimes as a parent image, build on top of a linux image
# FROM node:18 

# # set the working directory in the container to /app
# # a container has a file system
# # docker image can be used to instantiate containers one or more
# # a docker file is a blueprint for a docker image,
# # a docker image is like a blueprint for a containers
# # and the container is going to run our codes in its isolated enviroment with its own file system
# WORKDIR /app

# # Copy package.json and package-lock.json into the working directory
# COPY package*.json ./

# # install ffmpeg in the container, the dependency
# RUN brew update && brew install ffmpeg

# # install any needed packages specified in the package.json
# RUN npm install

# # copy app source inside the docker image
# COPY . .

# # make port 3000 available outside this container, it can run inside but it is not necessary  
# # running outside
# EXPOSE 3000

# # Define the command to run your app using CMD (only one CMD is allowed)
# CMD ["nmp", "start"]
