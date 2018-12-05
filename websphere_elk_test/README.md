# Websphere Docker w/ Elk Stack Logging

Test application that logs to a dockerised ELK stack. Uses:
- log4j output in JSON format
- Docker log-driver mechanism (via syslog) to update logstash

## ELK Stack

1. `git clone https://github.com/deviantony/docker-elk`
2. `cd docker-elk`
3. `docker-compose up -d`

## Test App

1. Build war: `mvn install`
2. Build docker image: `docker build --tag web .`
3. Run web app: `docker-compose up -d`

If you'd like to see what's being logged out of the app container you can run this command instead:

`docker run -p 80:9080 -p 443:9443 --name web --log-driver=syslog --log-opt syslog-address=tcp://127.0.0.1:5000 --log-opt tag=logger-test web`

## Verify

1. Open `http://localhost:5601`
2. Create default index patterns
3. View start up logs via Dev Tools: `GET _search`
4. Go to `http://localhost/websphere_elk_test`
5. View logged test message via Dev Tools: 

```
	GET _search
	{
	  "query": {
	    "match_all": {}
	  },
	  "sort": [
	    {"@timestamp" : {"order" : "desc"}}
	  ]
	}
```
