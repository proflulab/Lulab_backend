// {app_root}/app/model/user.js
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const UserSchema = new Schema({
      name: { type: String  },
      password: { type: String  },
      email: {type: String},
      mobile:{type: String},
      area:{type: String},
      dsc: {type: String},
      sex: {type: String},
    });
  
    return mongoose.model('User', UserSchema);
  }