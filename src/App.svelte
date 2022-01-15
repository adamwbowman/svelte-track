
<script>
	import { db } from './firebase.js'
	import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore"; 
	
	// initial collection
	let expenses = [];
	let tags = [];

	// firestore vars
	const expensesCol = collection(db, 'expenses');
	const queryAll = query(expensesCol, orderBy("createdAt", "asc"));
	const tagsCol = collection(db, 'tags');
	const queryAllTags = query(tagsCol, orderBy("name", "asc"));

	// listener for collection reactivity
	const listenCol = onSnapshot(queryAll, (querySnapshot) => {
			expenses = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			});
			console.table(expenses);
	});
	const listenColTags = onSnapshot(queryAllTags, (querySnapshot) => {
			tags = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			});
			console.table(tags);
	});

	// page vars
	const Total = parseInt(500);
	let subTotal = parseInt(0);

	// form vas
	let newLocation = "", newAmount = "", newNote = "";
	let error = "";

	// functions
	function addExpense() {
		resetSubTotal();
		if ((newLocation != "") && (newAmount != "")) {
			//expenses = [...expenses, {location: newLocation}];
			const docRef = addDoc(expensesCol, {
				location: newLocation,
				amount: newAmount,
				note: newNote,
				createdAt: new Date()
			});
			newLocation = "", newAmount = "", newNote = "";	
			error = "";
		} else {
			error = "Both location and an amount are required."
		}
	}

	async function deleteExpense(index) {
		resetSubTotal();
		await deleteDoc(doc(db, "expenses", index));
	}

	function resetSubTotal(){
		subTotal = parseInt(0);
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

	function init(el) {
		el.focus()
	}
</script>

<main>
	<!-- navbar -->
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid mb-0 h1">
			<a class="navbar-brand" href="#/">${Total}</a>
		</div>
	</nav>
	<div class="container">
		<!-- button group -->
		<div class="row border justify-content-center">
			<div class="col-lg-4 border mb-3">
				<div class="btn-group d-flex" role="group" aria-label="Tag Button Group">
					<!-- grocery button -->
					<input type="radio" class="btn-check" name="btnradio" id="btnradioGrocery" autocomplete="off" checked />
					<label class="btn btn-outline-secondary" for="btnradioGrocery"><ion-icon name="cart"></ion-icon></label>
					<!-- home button -->
					<input type="radio" class="btn-check" name="btnradio" id="btnradioHome" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradioHome"><ion-icon name="home"></ion-icon></label>
					<!-- restaurant button -->
					<input type="radio" class="btn-check" name="btnradio" id="btnradioRestaurant" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradioRestaurant"><ion-icon name="restaurant"></ion-icon></label>
					<!-- clothes button -->
					<input type="radio" class="btn-check" name="btnradio" id="btnradioClothes" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradioClothes"><ion-icon name="shirt"></ion-icon></label>
					<!-- amazon button -->
					<input type="radio" class="btn-check" name="btnradio" id="btnradioAmazon" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradioAmazon"><ion-icon name="logo-amazon"></ion-icon></label>
					<!-- transit button -->
					<input type="radio" class="btn-check" name="btnradio" id="btnradioTransit" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradioTransit"><ion-icon name="subway"></ion-icon></label>
				</div>
			</div>
			<!-- location -->
			<div class="col-md-4 col-lg-4 border mb-3">
					<input type="type" class="form-control" id="exampleLocation" placeholder="Location" use:init />
			</div>
			<!-- amount -->
			<div class="col-md-3 col-lg-2 border mb-3">
					<input type="number" class="form-control" id="exampleAmount" placeholder="Amount" />
			</div>
			<!-- add button -->
			<div class="col-md-2 border mb-3">
				<button type="button" class="btn btn-success" style="width: 100%">Add</button>
			</div>
		</div>
		<!-- journal -->
		<div class="row border mb-2">
			<div class="col-1 col-lg-3"></div>
			<div class="col-1 border"><button type="button" class="btn btn-primary btn-sm"><ion-icon name="cart"></ion-icon></button></div>
			<div class="col-5 col-lg-3 border">Target</div>
			<div class="col-2 col-lg-1 border">(23.23)</div>
			<div class="col-2 col-lg-1 border"><p class="text-secondary">$-432.32</p></div>
			<div class="col-1 border d-none d-md-block"><button type="button" class="btn btn-secondary btn-sm"><ion-icon name="trash"></ion-icon></button></div>
		</div>
		<!-- footer -->
	</div>



<!-- 

col-sm-2 col-lg-3
btn-group d-flex
col-sm-4 col-lg-3
col-sm-2 col-lg-2
col-sm-2


	<div class="container">
		<div class="row">
			<div class="col-12 col-md-3 input-group-sm"><input type="text" class="form-control" placeholder="Location" on:keypress="{handleEnter}" bind:value="{newLocation}"/></div>
			<div class="col-12 col-md-2">
				<div class="input-group input-group-sm mb-2">
					<span class="input-group-text">$</span>
					<input type="number" class="form-control" aria-label="Dollar amount"  on:keypress="{handleEnter}" bind:value="{newAmount}"/>
				</div>
			</div>
			<div class="col-12 col-md-2"></div>
			<div class="col-10 col-md-4 input-group-sm"><input type="text" class="form-control" placeholder="Tags" on:keypress="{handleEnter}" bind:value="{newNote}"/></div>
			<div class="col-2 col-md-1"><button type="button" class="btn btn-success btn-sm" on:click="{addExpense}"><span class="fas fa-plus"></span></button></div>
		</div>
		{#each expenses as expense}
		<div class="row" style="height: 40px">
			<div class="col-6 col-md-3">{expense.location}</div>
			<div class="col-6 col-md-2 clearfix">
				<div class="float-start"></div>
				<div class="float-end">({expense.amount})</div>
			</div>
			<div class="col-6 col-md-2 clearfix">
				<div class="float-start">$</div>
				<div class="float-end">{getSubTotal(expense.amount)}</div>
			</div>
			<div class="col-6 col-md-4"><span class="badge rounded-pill bg-info">{expense.note}</span></div>
			<div class="col-12 col-md-1"><button class="btn btn-outline-secondary btn-sm" on:click="{deleteExpense(expense.id)}"><span class="fas fa-trash-alt"></span></button></div>
		</div>
		{/each}
		<div class="row">
			<div class="col-md-5">
			{#if (error != "") }
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
					<span class="fas fa-exclamation-circle"></span> {error} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				</div>
			{/if}
			</div>
		</div>
	</div> -->
</main>

<style>
.navbar {
	margin-bottom: 15px;
}
</style>