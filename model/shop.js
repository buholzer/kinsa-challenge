'use strict';


const Joi = require('joi');

const Schema = Joi.object().keys({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
})

module.exports =  {
  Schema
};
