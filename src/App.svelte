
<script>
	import { db } from './firebase.js'
	import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore"; 

	let expenses = [];
	// 	console.log(`${doc.id} => ${doc.data()}`);

	const expensesCol = collection(db, 'expenses');
	const queryAll = query(expensesCol, orderBy("createdAt", "asc"));

	const listenCol = onSnapshot(queryAll, (querySnapshot) => {
			expenses = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			});
			console.table(expenses);
	});

	let newLocation = "", newAmount = "", newNote="";
	let error = "";

	function addExpense() {
		if (newLocation != "") {
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
		await deleteDoc(doc(db, "expenses", index));
	}

	let Total = 500;
	let subTotal = 500;
	function getSubTotal(amount) {
		subTotal = (subTotal-amount);
		return subTotal;
	}
	</script>

<main>
	<p>Total: {Total}</p>
	<ul>
		{#each expenses as expense}
			<li>{expense.location} || ${expense.amount} || {expense.note} || {getSubTotal(expense.amount)}
			<button on:click="{deleteExpense(expense.id)}">x</button>
			</li>
		{/each}
	</ul>
	<input type="text" placeholder="Location" bind:value="{newLocation}" />
	<input type="text" placeholder="Amount" bind:value="{newAmount}" />
	<input type="text" placeholder="Note" bind:value="{newNote}" />
	<button on:click="{addExpense}">Add</button>
</main>

<style>

</style>