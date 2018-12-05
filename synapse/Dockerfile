FROM tutum/nginx
RUN rm /etc/nginx/sites-enabled/default
ADD ./nginx /etc/nginx
COPY dist /usr/src/app
COPY /sbin/entrypoint.sh /sbin/entrypoint.sh
RUN chmod +x /sbin/entrypoint.sh
CMD ["/sbin/entrypoint.sh"]
