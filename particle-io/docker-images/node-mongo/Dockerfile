FROM ubuntu:14.04

# Update apt-get to update programs list
RUN apt-get -y update

## Install the WGET downloader (downloads files from URLs), Supervisor, Nano
RUN apt-get install -y wget supervisor nano
RUN service supervisor restart

## Get the latest NodeJS dist
RUN wget https://nodejs.org/dist/v4.4.3/node-v4.4.3-linux-x64.tar.gz

## Unzip the latest NodeJS dist to /usr/local
RUN tar -C /usr/local --strip-components 1 -xzf node-v4.4.3-linux-x64.tar.gz
RUN rm node-v4.4.3-linux-x64.tar.gz

RUN wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-3.2.5.tgz
RUN mkdir -p mongodb
RUN tar -C /mongodb --strip-components 1 -xzf mongodb-linux-x86_64-ubuntu1404-3.2.5.tgz
RUN rm mongodb-linux-x86_64-ubuntu1404-3.2.5.tgz
RUN mkdir -p /data/db

# Set environment path to include MongoDB directory so we can run mongod from command line
ENV PATH /mongodb/bin:$PATH


