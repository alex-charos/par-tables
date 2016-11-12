'use strict';

import mongoose from 'mongoose';

var ParSchema = new mongoose.Schema({
	matchday: Number,
	pars : [{ team :{
	        type: mongoose.Schema.ObjectId,
	        ref: 'Team'}
   	 , par:Number}]

});

export default mongoose.model('Par', ParSchema);
