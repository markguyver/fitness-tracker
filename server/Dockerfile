# Image Configuration
FROM node:14.17.1-alpine3.13

# Environment Provisioning
EXPOSE 5000/tcp
WORKDIR /var/node
RUN npm install -g typescript nodemon sequelize-cli redoc-cli uglify-js

# Application Provisioning
COPY application /var/node
RUN npm install && \
    npm run compile && \
    rm -rf src
CMD ["npm", "start"]