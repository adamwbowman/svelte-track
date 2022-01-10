
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

<main>
	<div class="container">
		<div class="row">
				<div class="col">Total: {Total}</div>
		</div>
		<table class="table table-striped">
			<thead>
				<tr>
					<th scope="col">Location</th>
					<th scope="col">Amount</th>
					<th scope="col">SubTotal</th>
					<th scope="col">Tags</th>
					<th scope="col">&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				{#each expenses as expense}
				<tr>
					<td>{expense.location}</td>
					<td>({expense.amount})</td>
					<td>{getSubTotal(expense.amount)}</td>
					<td><span class="badge rounded-pill bg-info">{expense.note}</span></td>
					<td><button class="btn btn-secondary btn-sm" on:click="{deleteExpense(expense.id)}"><span class="fas fa-trash-alt"></span></button></td>
				</tr>
				{/each}
				<tr>
					<td><input type="form-control" on:keypress="{handleEnter}" bind:value="{newLocation}"/></td>
					<td><input type="form-control" on:keypress="{handleEnter}" bind:value="{newAmount}"/></td>
					<td>&nbsp;</td>
					<td><input type="form-control" on:keypress="{handleEnter}" bind:value="{newNote}"/></td>
					<td><button type="button" class="btn btn-success btn-sm" on:click="{addExpense}">Add</button></td>
				</tr>
			</tbody>
		</table>
	</div>
</main>

<style>

</style>