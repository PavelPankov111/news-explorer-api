const { Schema, model } = require('mongoose');

const article = new Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/.test(url),
      message: (props) => `${props.value} - некорректный url`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/.test(url),
      message: (props) => `${props.value} - некорректный url`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    select: false,
  },
});

module.exports = model('article', article);
