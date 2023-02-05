FROM python:3-alpine

RUN pip install isaac-xml-validator --upgrade

CMD  [ "isaac-xml-validator"]
