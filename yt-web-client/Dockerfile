# Stage 1: Build stage
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy other source code files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Production stage
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the listening port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]


# docker push us-central1-docker.pkg.dev/yt-clone-a06b2/yt-web-client-repo/yt-web-client
# Deploy container to cloud run
# gcloud run deploy yt-web-client --image us-central1-docker.pkg.dev/yt-clone-a06b2/yt-web-client-repo/yt-web-client \
# --region=us-central1 \
# --platform managed \
# --timeout=3600 \
# --memory=2Gi \
# --cpu=1 \
# --min-instances=0 \
# --max-instances=1
