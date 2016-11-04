
'use strict';

import mongoose from 'mongoose';

var TeamSchema = new mongoose.Schema({
	name:  String,
	badge: String,
	color: String,
	shortName: String,
	rank: Number 


});


export default mongoose.model('Team', TeamSchema);
