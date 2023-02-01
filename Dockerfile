FROM python:3-alpine AS builder
ADD . /app

# main workdir
WORKDIR /app

RUN pip install --upgrade pip && \
    pip3 install -e .
# We are installing a dependency here directly into our app source dir
RUN pip install isaac-xml-validator

COPY . .

CMD  [ "python", "-m", "isaac-xml-validator"]