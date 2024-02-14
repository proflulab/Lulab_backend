module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const SmsSchema = new Schema({
      code: {type: String},
      mobile: {type: String},
      email: {type: String},
      area: {type: String},
      password: {type: String},
      expiration: { type: Date },
    });
  
    return mongoose.model('Sms', SmsSchema);
  }