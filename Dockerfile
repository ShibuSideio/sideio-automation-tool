# Use a lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Exposure
ENV PORT=8080
EXPOSE 8080

# Start
CMD [ "node", "server.js" ]
