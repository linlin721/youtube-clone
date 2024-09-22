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
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

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