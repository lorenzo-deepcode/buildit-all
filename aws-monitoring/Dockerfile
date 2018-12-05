FROM mhart/alpine-node:6.10.2
RUN \
  mkdir -p /aws && \
  apk -Uuv add groff less python py-pip && \
  pip install awscli && \
  apk --purge -v del py-pip && \
  rm /var/cache/apk/*

RUN npm i serverless -g

CMD "/bin/sh"
