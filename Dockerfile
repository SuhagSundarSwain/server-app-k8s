# Base image: lightweight Node.js (v20) on Alpine Linux
FROM node:20-alpine

# Install tools needed during build to fetch and extract the artifact
RUN apk add --no-cache curl unzip

# Set working directory inside the image where the app will live
WORKDIR /app

# Ensure Node runs in production mode (optimizations, no dev warnings)
ENV NODE_ENV=production

# Configure the app to listen on port 80 inside the container
ENV PORT=80

# Build-time variable: Google Drive file ID for the production zip
ARG ZIP_ID=1e2PYAm0Yvymi83t59y2WGY1kMdS_iFn3

# Download the production artifact zip from Google Drive using the file ID
RUN curl -L "https://drive.google.com/uc?export=download&id=${ZIP_ID}" -o /tmp/artifact.zip

# Extract the zip into /app; treat exit code 1 from unzip as a non-fatal warning
RUN unzip -o /tmp/artifact.zip -d /app || code=$?; if [ "${code:-0}" -eq 1 ]; then echo "unzip finished with warnings"; else exit "${code:-0}"; fi

# Install only production dependencies using the lockfile for reproducible installs
RUN npm ci --omit=dev

# Document that the container exposes port 80 (for orchestrators and humans)
EXPOSE 80

# Start the Express server (server.js) when the container launches
CMD ["node", "server.js"]
