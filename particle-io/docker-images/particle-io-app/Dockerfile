FROM adamj/node-nginx

## Add entire nodejs app, in local 'web' directory
## (Clone git repo + extract out app)
RUN git clone https://github.com/ajjoh5/nodejs.git
RUN cp -a /nodejs/particle-io/ /particle-io

## Cleanup unused git files / folders
RUN rm -rf /nodejs
RUN rm -rf /particle-io/docker-images

## Create nginx default hosts file - reverse proxy apps
RUN cp /particle-io/default /etc/nginx/sites-available/default

## setup modules for app
RUN cd /particle-io/saas-app; npm install

## Expose the port 5555, 27017
## [ 5555 - partico.io nodejs app port | 27017 - mongodb ] - eg. EXPOSE 5555 80
EXPOSE 80

#Run the supervisor in nodaemon mode
CMD ["supervisord", "-c", "/particle-io/supervisor.conf", "-n"]


