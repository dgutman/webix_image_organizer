FROM python:3.8
RUN pip install ipython-sql sqlalchemy psycopg2-binary jupyter pgspecial
EXPOSE 8888
RUN mkdir /app
WORKDIR /app
#COPY ./DSA.PostGIS.GettingStarted.ipynb /app
#COPY ./simple_db_example.sql /app
ENTRYPOINT [ "jupyter","notebook","--allow-root","--ip","0.0.0.0" ]
