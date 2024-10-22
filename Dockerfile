# Start with a base image containing Java runtime
FROM node:20.11.0

# build file copy
COPY package.json /app/
COPY *.js /app/
COPY src /app/src/
COPY public /app/public/
COPY . /app/

# work diractory
WORKDIR /app/

# node install
RUN npm install

# node env development setting
ENV NODE_MODE=development

EXPOSE 3000

# node run
ENTRYPOINT ["npm", "run", "dev"]