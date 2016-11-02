'use strict';

import mongoose from 'mongoose';

var ParSchema = new mongoose.Schema({
	teamName:String,
	lastYearPosition: Number

});


export default mongoose.model('Par', ParSchema);
