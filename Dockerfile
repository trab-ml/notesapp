FROM node:20-alpine
WORKDIR /app
COPY package*.json ./

# Ensure vite installation
RUN npm install --include=dev && \
    npm install -g vite

COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
