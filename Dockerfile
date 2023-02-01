FROM python:3-alpine AS builder

WORKDIR /usr/src/app

# We are installing a dependency here directly into our app source dir
RUN pip install --no-cache-dir isaac-xml-validator

CMD  [ "python", "./isaac_xml_validator.py"]