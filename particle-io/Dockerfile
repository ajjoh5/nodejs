FROM adamj/nodemongo

## Add entire nodejs app, in local 'web' directory
ADD /app/package.json /app/package.json
RUN cd app; npm install

## Copy entire nodejs app across to image
ADD /app /app

## Expose the port 5555, 27017
## [ 5555 - partico.io nodejs app port | 27017 - mongodb ]
EXPOSE 5555 27017

#Run the supervisor in nodaemon mode
ADD /supervisor.conf /app/supervisor.conf
CMD ["supervisord", "-c", "/app/supervisor.conf", "-n"]


