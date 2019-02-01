FROM node:latest

# Install Haraka
RUN npm install -g Haraka --unsafe
RUN haraka -i /usr/local/haraka
ADD ./ /usr/local/haraka/
RUN cd /usr/local/haraka && npm install


COPY run.sh /run.sh
RUN chmod +x /run.sh


ENTRYPOINT ["/run.sh"]
