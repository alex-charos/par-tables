'use strict';

import mongoose from 'mongoose'; 


var SeasonSchema = new mongoose.Schema({
  name: String,
  info: String,
  year: String,
  seasonId  : Number

});

export default mongoose.model('Season', SeasonSchema);
