# Image Configuration
FROM node:14.16.1-alpine3.13

# Environment Provisioning
EXPOSE 5000/tcp
WORKDIR /var/node
RUN npm install -g typescript nodemon sequelize-cli redoc-cli uglify-js
CMD ["npm", "start"]

# Application Provisioning
COPY application /var/node
RUN npm install && npm run compile