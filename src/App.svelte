
<script>
	import { db } from './firebase.js'
	import { collection, query, where, orderBy, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore"; 
	import weeks from './weeks.js';

	// initial collections
	let expenses = [];

	// date processing
	let today = new Date();
	let month = (today.getMonth() +1);
	let day = (today.getDate());
	let year = (today.getFullYear());
	if (month.toString().length < 2) { month = '0' + month; }
	if (day.toString().length < 2) { day = '0' + day; }
	let dateToday = [month, day, year].join('/')
	let findWeek = weeks.find(el => (el.start > dateToday));
	let currentWeek = weeks.find(el => (el.week == (findWeek.week -1)));
console.log(findWeek);
	let startDate = new Date(currentWeek.start);
	let endDate = new Date(currentWeek.end);
	let formattedEndDate = currentWeek.end.replace("23:59:59", "");
console.log(startDate);
console.log(endDate);

	// firestore vars
	const expensesCol = collection(db, 'expenses');
	const queryAll = query(expensesCol,
		// where("createdAt", ">=", startDate),
		// where("createdAt", "<=", endDate),
		orderBy("createdAt", "asc")
		);

	// listener for collection reactivity
	const listenCol = onSnapshot(queryAll, (querySnapshot) => {
			expenses = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			});
			console.table(expenses);
	});

	function setTag(tagName) {
		let fitleredExpenses = expenses.filter(el => el.tag === tagName);
			console.table(fitleredExpenses);
	}



	// page vars
	const Total = parseInt(500).toFixed(2);
	let subTotal = parseInt(0);

	// form vas
	let newLocation = "", newAmount = "", newTag = "";
	let error = "";

	// functions
	function addExpense() {
		let tagInfo = getTagInfo(newTag).split(",");
		let newTagName= tagInfo[0];
		let newTagColor = tagInfo[1];
		resetSubTotal();
		if ((newLocation != "") && (newAmount != "")) {
			//expenses = [...expenses, {location: newLocation}];
			const docRef = addDoc(expensesCol, {
				location: newLocation,
				amount: newAmount,
				tag: newTagName,
				tagColor: newTagColor,
				createdAt: new Date(),
				year: new Date().getFullYear(),
				month: new Date().getMonth(),
				day: new Date().getDay(),
				date: new Date().getDate()
			});
			newLocation = "", newAmount = "", newTagName = "", newTagColor = "";	
			error = "";
		} else {
			if (newTagName == "error") {
				return error = "A tag is required."
			} else {
				return error = "Both location and an amount are required."
			}
		}
	}

	async function deleteExpense(index) {
		resetSubTotal();
		await deleteDoc(doc(db, "expenses", index));
	}

	function getTagInfo(tagNumber){
		switch (tagNumber) {
			case 1:
				return newTag = "cart,success";
				break;
			case 2:
				return newTag = "logo-amazon,warning";
				break;
			case 3:
				return newTag = "home,primary";
				break;
			case 4:
				return newTag = "restaurant,danger";
				break;
			case 5:
				return newTag = "subway,info";
				break;
			case 6:
				return newTag = "shirt,dark";
				break;
			default:
				return newTag = "error,error";
				break;
		}
	}

	function getSubTotal(amount) {
		if (subTotal == 0) {
			subTotal = (500-amount).toFixed(2);
		} else {
			subTotal = (subTotal-amount).toFixed(2);
		}
		return subTotal;
	}

	function handleEnter(event) {
		if (event.key == "Enter") {
			addExpense();
		}
	}

	function resetSubTotal(){ subTotal = parseInt(0); }
	function resetError() { return error = ""; }
	function init(el) { el.focus(); }
</script>

<main>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand" href="/#">${Total}</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarText">
				<!-- <ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="/#">Home</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/#">Features</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="/#">Pricing</a>
					</li>
				</ul> -->
				<span class="navbar-text">
					{currentWeek.start} - {formattedEndDate}
				</span>
			</div>
		</div>
	</nav>
	<div class="container">
<!-- error -->
		{#if (error != "")}
		<div class="row">
			<div class="col mb-2">
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
					<span class="fas fa-exclamation-circle"></span> {error} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
						on:click="{resetError}"
					></button>
				</div>
			</div>
		</div>
		{/if}
<!-- button group -->
		<div class="row justify-content-center">
			<div class="col-lg-4 mb-4">
				<div class="btn-group d-flex text-right" role="group" aria-label="Tag Button Group">
					<!-- grocery button -->
					<input type="radio" class="btn-check" name="btnradio" value={1} bind:group={newTag} id="btnradioGrocery" autocomplete="off" checked>
					<label class="btn btn-outline-secondary" for="btnradioGrocery"><ion-icon name="cart"></ion-icon></label>
					<!-- amazon button -->
					<input type="radio" class="btn-check" name="btnradio" value={2} bind:group={newTag} id="btnradioAmazon" autocomplete="off">
					<label class="btn btn-outline-secondary" for="btnradioAmazon"><ion-icon name="logo-amazon"></ion-icon></label>
					<!-- home button -->
					<input type="radio" class="btn-check" name="btnradio" value={3} bind:group={newTag} id="btnradioHome" autocomplete="off">
					<label class="btn btn-outline-secondary" for="btnradioHome"><ion-icon name="home"></ion-icon></label>
					<!-- restaurant button -->
					<input type="radio" class="btn-check" name="btnradio" value={4} bind:group={newTag} id="btnradioRestaurant" autocomplete="off">
					<label class="btn btn-outline-secondary" for="btnradioRestaurant"><ion-icon name="restaurant"></ion-icon></label>
					<!-- transit button -->
					<input type="radio" class="btn-check" name="btnradio" value={5} bind:group={newTag} id="btnradioTransit" autocomplete="off">
					<label class="btn btn-outline-secondary" for="btnradioTransit"><ion-icon name="subway"></ion-icon></label>
					<!-- clothes button -->
					<input type="radio" class="btn-check" name="btnradio" value={6} bind:group={newTag} id="btnradioClothes" autocomplete="off">
					<label class="btn btn-outline-secondary" for="btnradioClothes"><ion-icon name="shirt"></ion-icon></label>
				</div>
			</div>
			<!-- location -->
			<div class="col-md-4 col-lg-4 mb-4">
					<input type="type" class="form-control" id="exampleLocation" placeholder="Location" 
						on:keypress="{handleEnter}" 
						bind:value="{newLocation}" 
						use:init/>
			</div>
			<!-- amount -->
			<div class="col-md-3 col-lg-2 mb-4">
				<div class="input-group">
					<span class="input-group-text">$</span>
					<input type="number" class="form-control" id="exampleAmount" placeholder="Amount" 
						on:keypress="{handleEnter}" 
						bind:value="{newAmount}"/>
				</div>
			</div>
			<!-- add button -->
			<div class="col-md-2 mb-5">
				<button type="button" class="btn btn-success" style="width: 100%"
					on:click="{addExpense}"
				>Add</button>
			</div>
		</div>
<!-- journal -->
		{#each expenses as expense}
		<div class="row gx-3">
			<div class="col-1 col-lg-3"></div>
			<!-- tag -->
			<div class="col-1 pull-left">
					<button type="button" class="btn btn-{expense.tagColor} btn-sm"
						on:click="{setTag(expense.tag)}"
					>
							<ion-icon name="{expense.tag}"></ion-icon>
					</button>
				</div>
			<div class="col-5 col-lg-3">
				<p class="ps-2 p-md-0">{new Date(expense.createdAt * 1000).getDate()} - {expense.location}</p>
			</div>
			<div class="col-2 col-lg-1 overflow-auto">
				<p class="text-end">-{expense.amount}</p>
			</div>
			<div class="col-2 col-lg-1 overflow-auto">
				<p class="text-secondary text-end">{getSubTotal(expense.amount)}</p>
			</div>
			<!-- delete button -->
			<div class="col-1 d-none d-md-block">
				<button type="button" class="btn btn-outline-secondary btn-sm" 
					on:click="{deleteExpense(expense.id)}">
						<ion-icon name="trash"></ion-icon>
				</button>
			</div>
		</div>
		{/each}
	</div>
	
	
	
	<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Enable both scrolling & backdrop</button>
	<div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
		<div class="offcanvas-header">
			<h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Backdroped with scrolling</h5>
			<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body">
			<p>Try scrolling the rest of the page to see this option in action.</p>
		</div>
	</div>
</main>

<style>
	.navbar {
		margin-bottom: 15px;
	}
</style>