FROM nginx:1.23.3-alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY dist/liberty-utils-ui/browser /usr/share/nginx/html
