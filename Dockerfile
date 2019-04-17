FROM node:10.15

COPY . .
RUN npm install

EXPOSE 3000
CMD npm start