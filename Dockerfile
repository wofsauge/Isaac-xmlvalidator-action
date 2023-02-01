FROM python:3-alpine AS builder
ADD . /app

# main workdir
WORKDIR /app

#Install git
RUN apk add git
RUN cd /app

# We are installing a dependency here directly into our app source dir
RUN pip install --target=/app isaac-xml-validator

ENV PYTHONPATH /app

CMD  [ "python", "/app/isaac_xml_validator.py"]