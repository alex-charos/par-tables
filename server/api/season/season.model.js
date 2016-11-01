'use strict';

import mongoose from 'mongoose';

var TeamSchema = new mongoose.Schema({
	name:String,
	emblem: String,
	lastYearPosition: Number

});

var FixtureSchema = new mongoose.Schema({
	homeTeam: TeamSchema,
	awayTeam: TeamSchema,
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
