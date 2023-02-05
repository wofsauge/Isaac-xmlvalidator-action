FROM python:3-alpine AS builder

RUN pip install isaac-xml-validator

CMD  [ "python", "/isaac_xml_validator.py"]