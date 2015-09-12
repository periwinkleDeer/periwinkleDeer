##Nibbler
###About  
----------
> Find up to 3 highly rated delectable tasty courses and have the app plan your night out. Found an insatiable treat? Upload it to the site so others can enjoy it too next time they plan their foodie-night-out event.
> Users can use the site to find food via individual dishes. Content and ratings are user submitted.
<div style="text-align:center"><img height="400" src="https://github.com/kshiraiw/periwinkleDeer/blob/master/client/assets/display.png?raw=true"></div>

### Table of Contents

 - [Tech Stack](#tech-stack)
 - [Requirements](#requirements)
 - [Keys](#keys)
 - [Getting Started](#getting-started)
 - [Team](#team)
 - [Contributing](#contributing)

### Tech Stack
 - Front End
   - React -- Utilizes fast rendering using a virtual DOM
   - Browserify -- Compiles JSX into JavaScript
   - GoogleMaps API -- Shows restaurant locations and links to Google Maps Navigation
   - Facebook SDK 
   - Bootstrap

<center><img height="400" src="https://github.com/kshiraiw/periwinkleDeer/blob/master/client/assets/map.png?raw=true">

 - Back End
   - PostgreSQL with Sequelize -- Allows for relationships between restaurants, users, and dishes
   - Node.js/Express

<center><img height="400" src="https://github.com/kshiraiw/periwinkleDeer/blob/master/client/assets/db_schema.png?raw=true"></center>

### Requirements

- Node 0.12.x
- NPM 2.11+
- React.js
- Postgres
- Gulp
- Express 4.x

### Keys
-create a [facebook](https://developers.facebook.com/) application id 
-add in App.js 


### Getting Started

 - Web App
   - Fork the repo
   - Clone from your fork
   - npm install
 - Database
   - install PostgreSQL
   - open up the postgres shell
   - CREATE ROLE postgres LOGIN;
   - CREATE DATABASE foodie;
 - Run the App
   - npm start
 
### Team
  - __Product Owner__: [@kshiraiw ](https://github.com/kshiraiw)/ [@kevbyte](https://github.com/kevbyte)
  - __Scrum Master__: [@jeremyhu9](https://github.com/jeremyhu9) / [@ChiMarvine](https://github.com/chimarvine)
  
### Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.# periwinkleDeer
