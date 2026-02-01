FROM ubuntu:24.04

RUN \
  apt-get update && \
  apt-get install -y python3-dev && \
  apt-get install -y software-properties-common && \
  apt-get install -y python3-pip && \
  apt-get install -y python3-venv && \
  apt-get install -y libmysqlclient-dev && \
  apt-get install -y libssl-dev && \
  apt-get install -y pkg-config && \
  apt-get install -y nginx && \
  apt-get install -y curl

# Install Dart Sass standalone binary
RUN curl -fsSL https://github.com/sass/dart-sass/releases/download/1.97.3/dart-sass-1.97.3-linux-x64.tar.gz \
    | tar -xz -C /usr/local \
    && ln -s /usr/local/dart-sass/sass /usr/local/bin/sass

COPY ./nginx.conf /etc/nginx
COPY ./app/ /opt/app

WORKDIR /opt/app

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt

RUN python clear_page_cache.py && \
  python build_page_cache.py

CMD ["sh", "./scripts/start.sh"]
