FROM ubuntu:22.04

RUN \
  apt-get update && \
  apt-get install -y python3-dev && \
  apt-get install -y software-properties-common && \
  apt-get install -y python3-pip && \
  apt-get install -y libmysqlclient-dev && \
  apt-get install -y libssl-dev && \
  apt-get install -y pkg-config && \
  apt-get install -y nginx

COPY ./nginx.conf /etc/nginx
COPY ./app/ /opt/app

WORKDIR /opt/app

RUN pip3 install --upgrade pip
RUN pip3 install -r ./requirements.txt

RUN python3 clear_page_cache.py && \
  python3 build_page_cache.py

CMD ["sh", "./scripts/start.sh"]
