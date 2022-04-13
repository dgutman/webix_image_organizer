

DROP TABLE IF EXISTS SQLShackGeomTest;

CREATE TABLE SQLShackGeomTest (
	sensor_id VARCHAR(50) PRIMARY KEY NOT NULL,
	longitude VARCHAR(50),
	latitude VARCHAR(50),
	country TEXT,
	sensorTemp INTEGER,
	sensorPressure INTEGER,
	sensorTime TIMESTAMP,
	sensorLocation GEOMETRY
);

CREATE INDEX SQLShackGeomTest_geom_idx
  ON SQLShackGeomTest
  USING GIST (geography(sensorLocation));


INSERT INTO SQLShackGeomTest (sensor_id, longitude, latitude, country, sensorTemp, sensorPressure, sensorTime, sensorLocation) 
VALUES ('F040520 BJI910J', -0.138702, 51.501220, 'UK', 0, 996, now(), ST_GeomFromText('POINT(-0.138702 51.501220)',4326));


SELECT * FROM SQLShackGeomTest;
