
<script>
	import { db } from './firebase.js'
	import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore"; 

	// initial collection
	let expenses = [];

	// firestore vars
	const expensesCol = collection(db, 'expenses');
	const queryAll = query(expensesCol, orderBy("createdAt", "asc"));

	// listener for collection reactivity
	const listenCol = onSnapshot(queryAll, (querySnapshot) => {
			expenses = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			});
			console.table(expenses);
	});


	// page vars
	const Total = parseInt(500);
	let subTotal = parseInt(0);

	// form vas
	let newLocation = "", newAmount = "", newNote="";
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
			error = "Location is required"
		}
	}

	async function deleteExpense(index) {
		console.log(index);
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
	</script>

<!-- <main>
	<div class="container">
		<table class="table caption-top table-striped table-hover">
			<caption>Total: ${Total}</caption>
			<thead>
				<tr class="d-flex">
					<th scope="col" class="col-3">Location</th>
					<th scope="col" class="col-1">&nbsp;</th>
					<th scope="col" class="col-1 text-end">Amount</th>
					<th scope="col" class="col-1">&nbsp;</th>
					<th scope="col" class="col-2 text-end">SubTotal</th>
					<th scope="col" class="col-2">Tags</th>
					<th scope="col" class="col-2">&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				{#each expenses as expense}
				<tr class="d-flex">
					<td class="col-3">{expense.location}</td>
					<td class="col-1">$</td>
					<td class="col-1 text-end">({expense.amount})</td>
					<td class="col-1">$</td>
					<td class="col-2 text-end">{getSubTotal(expense.amount)}</td>
					<td class="col-2"><span class="badge rounded-pill bg-info">{expense.note}</span></td>
					<td class="col-2 text-center "><button class="btn btn-secondary btn-sm" on:click="{deleteExpense(expense.id)}"><span class="fas fa-trash-alt"></span></button></td>
				</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr class="d-flex">
					<td class="col-3"><input type="text" class="form-control" placeholder="Location" on:keypress="{handleEnter}" bind:value="{newLocation}"/></td>
					<td class="col-1">$</td>
					<td class="col-1"><input type="text" class="form-control" on:keypress="{handleEnter}" bind:value="{newAmount}"/></td>
					<td class="col-1">$</td>
					<td class="col-2">&nbsp;</td>
					<td class="col-2"><input type="text" class="form-control" placeholder="Tags" on:keypress="{handleEnter}" bind:value="{newNote}"/></td>
					<td class="col-2 text-center"><button type="button" class="btn btn-primary" on:click="{addExpense}">Add</button></td>
				</tr>
			</tfoot>
		</table>
	</div>
</main> -->

<main>
	<nav class="navbar navbar-expand-lg navbar-light bg-light">
		<div class="container-fluid">
			<a class="navbar-brand" href="#/">${Total}</a>
		</div>
	</nav>
	<div class="container">
		{#each expenses as expense}
		<div class="row" style="height: 40px">
			<div class="col-md-3">{expense.location}</div>
			<div class="col-md-2 clearfix">
				<div class="float-start"></div>
				<div class="float-end">({expense.amount})</div>
			</div>
			<div class="col-md-2 clearfix">
				<div class="float-start">$</div>
				<div class="float-end">{getSubTotal(expense.amount)}</div>
			</div>
			<div class="col-md-4"><span class="badge rounded-pill bg-info">{expense.note}</span></div>
			<div class="col-md-1"><button class="btn btn-outline-secondary btn-sm" on:click="{deleteExpense(expense.id)}"><span class="fas fa-trash-alt"></span></button></div>
		</div>
		{/each}
		<div class="row">
			<div class="col-md-3 input-group-sm"><input type="text" class="form-control" placeholder="Location" on:keypress="{handleEnter}" bind:value="{newLocation}"/></div>
			<div class="col-md-2">
				<div class="input-group input-group-sm mb-2">
					<span class="input-group-text">$</span>
					<input type="text" class="form-control" aria-label="Dollar amount">
				</div>
			</div>
			<div class="col-md-2"></div>
			<div class="col-md-4 input-group-sm"><input type="text" class="form-control" placeholder="Tags" on:keypress="{handleEnter}" bind:value="{newNote}"/></div>
			<div class="col-md-1"><button type="button" class="btn btn-success btn-sm" on:click="{addExpense}"><span class="fas fa-plus"></span></button></div>
		</div>
	</div>
</main>

<style>
.navbar {margin-bottom: 15px;}
</style>