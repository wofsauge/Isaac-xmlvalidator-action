FROM python:3-alpine AS builder
ADD . /app

# main workdir
WORKDIR /app

#Install git
RUN apk add git
RUN cd /app
RUN git clone https://github.com/wofsauge/isaac-xml-validator.git

RUN apk add --update --no-cache g++ gcc libxslt-dev && \
    pip --no-cache-dir install lxml
# We are installing a dependency here directly into our app source dir
RUN pip install --target=/app requests
RUN pip install --target=/app isaac-xml-validator
RUN pip install --target=/app importlib-metadata

ENV PYTHONPATH /app

CMD  [ "python", "/app/isaac-xml-validator/isaac_xml_validator.py"]