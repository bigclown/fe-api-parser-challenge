FROM node:16-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install
# Copy app files
COPY . .
# Expose port, please dont change this port!
EXPOSE 2600
# Start the app
CMD [ "yarn", "start" ]
