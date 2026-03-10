# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /apps
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
