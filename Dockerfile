FROM python:3-alpine AS builder
ADD . /app

# main workdir
WORKDIR /app

#Install git
RUN apk add git
RUN cd /app

RUN apk add --update --no-cache g++ gcc libxslt-dev && \
    pip --no-cache-dir install lxml
# We are installing a dependency here directly into our app source dir
RUN pip install --target=/app requests
RUN pip --no-cache-dir install isaac-xml-validator

ENV PYTHONPATH /app

# Github env vars
ARG INPUT_ROOTFOLDER=${INPUT_ROOTFOLDER}
ARG INPUT_RECURSIVE=${INPUT_RECURSIVE}
ARG INPUT_EXPECTEDERRORCOUNT=${INPUT_EXPECTEDERRORCOUNT}
RUN isaac-xml-validator -r $INPUT_RECURSIVE -p $INPUT_ROOTFOLDER -e $INPUT_EXPECTEDERRORCOUNT