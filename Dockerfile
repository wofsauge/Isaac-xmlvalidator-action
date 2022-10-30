FROM python:3-slim AS builder
ADD . /app
WORKDIR /app

# We are installing a dependency here directly into our app source dir
RUN pip install --target=/app requests
RUN pip install --target=/app xsd-validator

# A Java 8 runtime example
# The official Red Hat registry and the base image
FROM registry.access.redhat.com/rhel7-minimal
USER root
# Install Java runtime
RUN microdnf --enablerepo=rhel-7-server-rpms \
install java-1.8.0-openjdk --nodocs ;\
microdnf clean all
# Set the JAVA_HOME variable to make it clear where Java is located
ENV JAVA_HOME /etc/alternatives/jre
ENV PATH="${PATH}:/etc/alternatives/jre"

# Finally, run the script
CMD [ "/app/run-java.sh" ]
# A distroless container image with Python and some basics like SSL certificates
# https://github.com/GoogleContainerTools/distroless
FROM gcr.io/distroless/python3-debian10
COPY --from=builder /app /app
WORKDIR /app
ENV PYTHONPATH /app
CMD ["/app/main.py"]