
export function formatDay(day) {

}

export function formatMonth(month) {
	var vMonth = "";
	switch (month) {
		case 0:
			return vMonth = "January"; break;
		case 1:
			return vMonth = "February"; break;
		case 2:
			return vMonth = "March"; break;
		case 3:
			return vMonth = "April"; break;
		case 4:
			return vMonth = "May"; break;
		case 5:
			return vMonth = "June"; break;
		case 6:
			return vMonth = "July"; break;
		case 7:
			return vMonth = "August"; break;
		case 8:
			return vMonth = "September"; break;
		case 9:
			return vMonth = "October"; break;
		case 10:
			return vMonth = "November"; break;
		case 11:
			return vMonth = "December"; break;
		default:
			return vMonth = "Error"; break;
	}
}