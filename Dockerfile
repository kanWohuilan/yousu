FROM nginx
RUN rm -v /etc/nginx/nginx.conf
ADD ./nginx.conf /etc/nginx/
COPY dist /usr/share/nginx/html 
EXPOSE 80
ENTRYPOINT nginx -g "daemon off;"