FROM ubuntu

RUN apt-get update
RUN apt-get install -y golang

WORKDIR /usr/src/app

COPY . .

RUN go build -o main script.go

CMD ["./main"]
