FROM ubuntu:14.04

### Get the WGET downloader (downloads files from URLs)
#RUN apt-get install -y wget
#
### Get the latest NodeJS dist
#RUN wget https://nodejs.org/dist/v4.4.3/node-v4.4.3-linux-x64.tar.gz
#
### Unzip the latest NodeJS dist to /usr/local
#RUN tar -C /usr/local --strip-components 1 -xzf node-v4.4.3-linux-x64.tar.gz
#RUN rm node-v4.4.3-linux-x64.tar.gz
#

### Get the Latest MongoDB dist (key, filelist, update apt-get, install mongodb-org)
#RUN sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
#RUN echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
#RUN sudo apt-get -y update
#RUN sudo apt-get install -y mongodb-org

### Add entire nodejs app, in local 'web' directory
#ADD /app/package.json /app/package.json
#RUN cd app; npm install
#
### Copy entire nodejs app across to image
#ADD /app /app
#
### Expose the port 3000 - because that's the nodejs app port we are using
#EXPOSE 5555
#
### Run the node server
### CMD ["node", "/web/server.js"]
