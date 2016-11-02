

function getTeamPosition(teamName) {
	return 1;
}

function getParPoints(teamName, atHome,homeScore,awayScore) {
	var position = getTeamPosition(teamName);
	var parPoints = 0;
	if (atHome) {
		if (homeScore > awayScore) {
			parPoints = 0;
		}
		if (homeScore < awayScore) {
			parPoints = -3;
		}
		if (homeScore === awayScore) {
			parPoints = -2;
		}
	} else {
		if (homeScore > awayScore) {
			if (position >=14) {}
				parPoints = 0;
			} else {
				parPoints = 2;
			}
		}
		if (homeScore < awayScore) {
			if (position >=14) {}
				parPoints = -3;
			} else {
				parPoints = -1;
			}
		}
		if (homeScore === awayScore) {
			if (position >=14) {}
				parPoints = -2;
			} else {
				parPoints = 0;
			}
		}
	}
	return parPoints;
}