#FROM ubuntu:14.04
FROM adamj/ubuntu-node

# Update apt-get to update programs list
RUN apt-get -y update

## Install the WGET downloader (downloads files from URLs), Supervisor, Nano
RUN apt-get install -y wget supervisor nano
RUN service supervisor restart

### Get the latest NodeJS dist
#RUN wget https://nodejs.org/dist/v4.4.3/node-v4.4.3-linux-x64.tar.gz

### Unzip the latest NodeJS dist to /usr/local
#RUN tar -C /usr/local --strip-components 1 -xzf node-v4.4.3-linux-x64.tar.gz
#RUN rm node-v4.4.3-linux-x64.tar.gz

### Get the Latest MongoDB dist (install from ubuntu apt-get)
#RUN sudo apt-get -y update
#RUN sudo apt-get install -y mongodb
#RUN sudo service mongodb start

RUN wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-3.2.5.tgz
RUN mkdir -p mongodb
RUN tar -C /mongodb --strip-components 1 -xzf mongodb-linux-x86_64-ubuntu1404-3.2.5.tgz
RUN rm mongodb-linux-x86_64-ubuntu1404-3.2.5.tgz
RUN mkdir -p /data/db
#RUN export PATH=/mongodb/bin:$PATH
ENV PATH /mongodb/bin:$PATH

RUN echo $PATH

## Add entire nodejs app, in local 'web' directory
ADD /app/package.json /app/package.json
RUN cd app; npm install

## Copy entire nodejs app across to image
ADD /app /app

## Expose the port 5555 - because that's the nodejs app port we are using
EXPOSE 5555

## Run the node server - using forever
#CMD ["forever", "-c","node","/app/app.js"]

#Run the supervisor in nodaemon mode
ADD /supervisor.conf /app/supervisor.conf
#CMD ["supervisord", "-c", "/app/supervisor.conf", "-n"]
#supervisord -c /app/supervisor.conf -n


