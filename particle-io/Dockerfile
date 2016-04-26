FROM adamj/node-nginx

## Add entire nodejs app, in local 'web' directory
ADD /saas-app/package.json /saas-app/package.json
RUN cd saas-app; npm install

## Copy entire nodejs app across to image
ADD /saas-app /saas-app

## Expose the port 5555, 27017
## [ 5555 - partico.io nodejs app port | 27017 - mongodb ]
#EXPOSE 5555 80
EXPOSE 80

#Run the supervisor in nodaemon mode
ADD /supervisor.conf /saas-app/supervisor.conf
ADD /default /etc/nginx/sites-available/default
CMD ["supervisord", "-c", "/saas-app/supervisor.conf", "-n"]


