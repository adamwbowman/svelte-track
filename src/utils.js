
export function formatDay(day) {
	var vDay = "";
	switch (day) {
		case 0: return vDay = "Sunday"; break;
		case 1: return vDay = "Monday"; break;
		case 2: return vDay = "Tuesday"; break;
		case 3: return vDay = "Wednesday"; break;
		case 4: return vDay = "Thursday"; break;
		case 5: return vDay = "Friday"; break;
		case 6: return vDay = "Saturday"; break;
		default: return vDay = "Error"; break;
	}
}

export function formatMonth(month) {
	var vMonth = "";
	switch (month) {
		case 0: return vMonth = "January"; break;
		case 1: return vMonth = "February"; break;
		case 2: return vMonth = "March"; break;
		case 3: return vMonth = "April"; break;
		case 4: return vMonth = "May"; break;
		case 5: return vMonth = "June"; break;
		case 6: return vMonth = "July"; break;
		case 7: return vMonth = "August"; break;
		case 8: return vMonth = "September"; break;
		case 9: return vMonth = "October"; break;
		case 10: return vMonth = "November"; break;
		case 11: return vMonth = "December"; break;
		default: return vMonth = "Error"; break;
	}
}