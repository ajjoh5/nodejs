FROM ubuntu:14.04

## Get the WGET downloader (downloads files from URLs)
RUN apt-get install -y wget

## Get the latest NodeJS dist
RUN wget https://nodejs.org/dist/v5.4.1/node-v5.4.1-linux-x64.tar.gz

## Unzip the latest NodeJS dist to /usr/local
RUN tar -C /usr/local --strip-components 1 -xzf node-v5.4.1-linux-x64.tar.gz
RUN rm node-v5.4.1-linux-x64.tar.gz

## Add entire nodejs app, in local 'web' directory
ADD /web/package.json /web/package.json
RUN cd web; npm install

## Copy entire nodejs app across to image
ADD /web /web

## Expose the port 3000 - because that's the nodejs app port we are using
EXPOSE 3000

## Run the node server
## CMD ["node", "/web/server.js"]
