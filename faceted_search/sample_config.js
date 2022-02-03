module.exports = {
  archive_upload_path: __dirname + '/upload',
  images_folder: __dirname + '/upload/images',
  mongo: {
    name: process.env.MONGODB_NAME || "faceted_search",
    host: process.env.MONGODB_HOST || "localhost",
    port: process.env.MONGODB_PORT || 27017
  },
  session_secret: 'sample-secret',
  hosts_list: [
    {id: "1", value: "CB", hostAPI: "https://computablebrain.emory.edu/girder/api/v1"},
    {id: "2", value: "Styx", hostAPI: "https://styx.neurology.emory.edu/girder/api/v1"}

  ]
};
