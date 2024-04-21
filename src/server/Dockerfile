FROM node:18.16.0

LABEL maintainer="Hashem Tarek - hashemtarek2012@gmail.com"
ARG PORT=8080


WORKDIR /server

COPY package.json .

RUN ["npm", "install"]

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "run", "dev" ]

