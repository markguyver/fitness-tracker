# Image Configuration
FROM node:14.17.2-alpine3.13

# Environment Provisioning
EXPOSE 3000/tcp
WORKDIR /var/node
RUN npm install -g @vue/cli serve

# Application Provisioning
COPY ./application /var/node
RUN npm install && \
    npm run build && \
    rm -rf src
CMD ["serve", "/var/node/dist", "-l", "3000"]