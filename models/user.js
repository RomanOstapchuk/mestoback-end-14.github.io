const mongoose = require('mongoose');
const { checkLink } = require('../validators/checkLink');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    validate: {
      validator: checkLink,
      message: (props) => `${props.value} is not a valid link!`,
    },
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
