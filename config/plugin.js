/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  // config/plugin.js
graphql: {
  enable: true,
  package: 'egg-graphql',
},

mongoose: {
  enable: true,
  package: 'egg-mongoose',
},

redis: {
  enable: true,
  package: 'egg-redis',
},

jwt: {
  enable: true,
  package: "egg-jwt"
},

cors: {
  enable: true,
  package: 'egg-cors',
},

};
