### Requirements

-   [Node](https://doc.ubuntu-fr.org/nodejs#depuis_un_ppa)
-   [MongoDB](https://doc.ubuntu-fr.org/mongodb#installation)
-   [Nodemon](http://nodemon.io/)
-   [Bower](https://bower.io/)


#### Installation

```bash
git clone git@github.com:JbPasquier/mean-starter-es6.git
cd mean-starter-es6
npm install
bower install
```

#### Run

1. `npm i`
2. create `tmp`, `upload`, `upload/images`, `upload/archive`, `upload/extract` folders
3. create `config.js` file and add fields like in `sample_config.js`
4. `npm start`.
The app uses `8000` port.

#### Run inside Docker
1. create `config.js` file and add fields like in `sample_config.js`
2. run `docker build -t faceted_search .` command
3. run `docker run --network="host" -d faceted_search` command (-d for detached mode, --network="host" to run docker container inside local machine network instead of making it's own one)
