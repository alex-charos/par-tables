'use strict';

import mongoose from 'mongoose'; 

var FixtureSchema = new mongoose.Schema({
	fixtureId: String,
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
	awayScore: Number,
	matchday : Number,
	seasonId: Number

});

export default mongoose.model('Fixture', FixtureSchema);
