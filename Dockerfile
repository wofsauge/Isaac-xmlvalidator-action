FROM python:3-alpine AS builder
ADD . /app
WORKDIR /app

#Install git
RUN apk add git
RUN git clone https://github.com/wofsauge/Isaac-XML-Validator.git


RUN apk add --update --no-cache g++ gcc libxslt-dev && \
    pip --no-cache-dir install lxml
# We are installing a dependency here directly into our app source dir
RUN pip install --target=/app requests
RUN pip install --target=/app lxml

ENV PYTHONPATH /app

CMD  [ "python", "/app/main.py"]