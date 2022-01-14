
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
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid mb-0 h1">
			<a class="navbar-brand" href="#/">${Total}</a>
		</div>
	</nav>
	<div class="container">
		<div class="row">

			<div class="col-sm-2 mb-4">
				<!-- <label for="exampleTag" class="form-label">&nbsp;</label> -->
				<div class="btn-group d-flex" role="group" aria-label="Tag Button Group">
					<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked />
					<label class="btn btn-outline-secondary" for="btnradio1"><span class="fas fa-shopping-cart"></span></label>
				
					<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradio2"><span class="fas fa-home"></span></label>
				
					<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradio3"><span class="fas fa-utensils"></span></label>
					
					<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradio3"><span class="fab fa-amazon"></span></label>
					
					<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
					<label class="btn btn-outline-secondary" for="btnradio3"><span class="fas fa-subway"></span></label>
				</div>
			</div>

			<div class="col-sm-4 mb-4">
					<!-- <label for="exampleLocation" class="form-label">Location</label> -->
					<input type="type" class="form-control" id="exampleLocation" placeholder="Location" use:init />
			</div>

			<div class="col-sm-2 mb-4">
					<!-- <label for="exampleAmount" class="form-label">Amount</label> -->
					<input type="number" class="form-control" id="exampleAmount" placeholder="Amount" />
			</div>


			<div class="col-sm-2 mb-5">
				<!-- <label for="exampleAction" class="form-label">&nbsp;</label> -->
				<button type="button" class="btn btn-success" style="width: 100%">Add</button>
			</div>
		</div>
		<div class="row mx-1 mb-2">
			<div class="col-1"><button type="button" class="btn btn-primary btn-sm"><span class="fas fa-shopping-cart"></span></button></div>
			<div class="col">Target</div>
			<div class="col-2">(23.23)</div>
			<div class="col-2">$432.32</div>
			<div class="col-1 d-none d-md-block"><button type="button" class="btn btn-secondary btn-sm"><span class="fas fa-trash"></span></button></div>
		</div>
		 <div class="row mx-1 mb-2">
			<div class="col-1"><button type="button" class="btn btn-danger btn-sm"><span class="fas fa-home"></span></button></div>
			<div class="col">Home Depot</div>
			<div class="col-2">(23.23)</div>
			<div class="col-2">$432.32</div>
			<div class="col-1 d-none d-md-block"><button type="button" class="btn btn-secondary btn-sm"><span class="fas fa-trash"></span></button></div>
 		</div>
		 <div class="row mx-1 mb-2">
			<div class="col-1"><button type="button" class="btn btn-warning btn-sm"><span class="fab fa-amazon"></span></button></div>
			<div class="col">Dresser Place</div>
			<div class="col-2">(23.23)</div>
			<div class="col-2">$432.32</div>
			<div class="col-1 d-none d-md-block"><button type="button" class="btn btn-secondary btn-sm"><span class="fas fa-trash"></span></button></div>
 		</div>
		 <div class="row mx-1 mb-2">
			<div class="col-1"><button type="button" class="btn btn-info btn-sm"><span class="fas fa-utensils"></span></button></div>
			<div class="col">El Limon</div>
			<div class="col-2">(23.23)</div>
			<div class="col-2">$432.32</div>
			<div class="col-1 d-none d-md-block"><button type="button" class="btn btn-secondary btn-sm"><span class="fas fa-trash"></span></button></div>
 		</div>
		 <div class="row mx-1 mb-2">
			<div class="col-1"><button type="button" class="btn btn-dark btn-sm"><span class="fas fa-subway"></span></button></div>
			<div class="col">Ventra</div>
			<div class="col-2">(23.23)</div>
			<div class="col-2">$432.32</div>
			<div class="col-1 d-none d-md-block"><button type="button" class="btn btn-secondary btn-sm"><span class="fas fa-trash"></span></button></div>
 		</div>
	</div>











<!-- 
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
/* .container {
	margin-left: 50px;
	margin-right: 50px;
} */
@media only screen and (max-width: 576px) {
	main {
		background-color: lightblue;
	}
}

</style>