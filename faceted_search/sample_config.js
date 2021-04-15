module.exports = {
  archive_upload_path: __dirname + '/upload',
  images_folder: __dirname + '/upload/images',
  mongo: 'mongodb://localhost:27017/faceted_search',
  session_secret: 'sample-secret',
  hosts_list: [
    {id: "1", value: "Girder", hostAPI: "http://dermannotator.org:8080/api/v1"},
    {id: "2", value: "Cancer digital slide archive", hostAPI: "http://candygram.neurology.emory.edu:8080/api/v1"},
    {id: "3", value: "HTAN", hostAPI: "https://imaging.htan.dev/girder/api/v1"}
  ]
};