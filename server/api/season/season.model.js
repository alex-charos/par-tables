'use strict';

import mongoose from 'mongoose'; 

var FixtureSchema = new mongoose.Schema({
	homeTeam: {
	        type: mongoose.Schema.ObjectId,
	        ref: 'Team'
   	 },
	awayTeam:  {
	        type: mongoose.Schema.ObjectId,
	        ref: 'Team'
   	 },
	kickOff: Date,
	homeScore: Number,
	awayScore: Number

});

var SeasonSchema = new mongoose.Schema({
  name: String,
  info: String,
  year: String,
  fixtures: [FixtureSchema]

});

export default mongoose.model('Season', SeasonSchema);
