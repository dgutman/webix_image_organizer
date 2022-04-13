FROM python:3.8
RUN pip install ipython-sql sqlalchemy psycopg2-binary jupyter pgspecial pandas
EXPOSE 8888
RUN mkdir /app
WORKDIR /app

ENTRYPOINT [ "jupyter","notebook","--allow-root","--ip","0.0.0.0" ]
