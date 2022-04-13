FROM jupyter/datascience-notebook
USER root
USER jovyan
RUN pip install ipython-sql sqlalchemy
RUN pip install psycopg2-binary
ENTRYPOINT [ "jupyter","notebook" ]
