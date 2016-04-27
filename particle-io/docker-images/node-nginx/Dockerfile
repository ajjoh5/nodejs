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

## Install nginx
RUN apt-get install -y nginx

## Install git
RUN apt-get install -y git