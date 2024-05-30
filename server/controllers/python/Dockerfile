FROM ubuntu

RUN apt-get update
RUN apt-get install -y python3

WORKDIR /usr/src/app

COPY . .

CMD ["python3", "script.py"]