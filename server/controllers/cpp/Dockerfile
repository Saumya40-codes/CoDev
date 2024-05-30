FROM ubuntu

RUN apt-get update
RUN apt-get install -y g++

WORKDIR /usr/src/app

COPY . .

RUN g++ -o main script.cpp

CMD ["./main"]
