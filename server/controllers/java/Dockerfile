FROM ubuntu


RUN apt-get update
RUN apt-get install -y openjdk-8-jdk

WORKDIR /usr/src/app

COPY . .

RUN javac script.java

CMD ["java", "script"]
