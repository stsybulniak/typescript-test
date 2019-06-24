FROM node:alpine

WORKDIR '/app'

COPY ./package.json ./
RUN npm install

RUN npm install -g pm2

COPY . .

CMD ["npm", "run", "build"]

CMD ["pm2-runtime", "start", "build/index.js"]