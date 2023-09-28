FROM node:20-alpine

# Declare ENV
ENV BUILD_DIR ./E-COMMERCE
ENV ROOT_DIR /usr/src

WORKDIR ${ROOT_DIR}/app

# Copy source code to container
COPY ${BUILD_DIR}/package.json .

COPY ${BUILD_DIR}/yarn.lock .

COPY ${BUILD_DIR} .

# Copy common-lib code to container
COPY ./common-lib ${ROOT_DIR}/common-lib

# Build common-lib
RUN cd ${ROOT_DIR}/common-lib && yarn && yarn build

# Run App
RUN cd ${ROOT_DIR}/app && yarn

CMD ["yarn", "start"]