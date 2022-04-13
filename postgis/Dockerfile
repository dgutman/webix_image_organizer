FROM python:3.8
RUN pip install ipython-sql sqlalchemy
RUN pip install psycopg2-binary
RUN pip install jupyter
EXPOSE 8888
RUN mkdir /app
WORKDIR /app

ENTRYPOINT [ "jupyter","notebook","--allow-root","--ip","0.0.0.0" ]
