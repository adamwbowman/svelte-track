
<script>
	import { db } from './firebase.js'
	import { collection, query, orderBy, onSnapshot, addDoc, doc } from "firebase/firestore"; 

	let expenses = [];
	// 	console.log(`${doc.id} => ${doc.data()}`);

	const expensesCol = collection(db, 'expenses');
	const queryAll = query(expensesCol, orderBy("createdAt", "desc"));

	const listenCol = onSnapshot(queryAll, (querySnapshot) => {
			expenses = querySnapshot.docs.map(doc => doc.data());
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
			newLocation = "";	
			error = "";
		} else {
			error = "Location is required"
		}
	}

	const deleteExpense = (index) => {
		let deleteItem = expenses[index];
		expenses = expenses.filter((item) => item != deleteItem);
		error = "";
	}
</script>

<main>
	<ul>
		{#each expenses as expense, index}
			<li>{expense.location} || {expense.amount} || {expense.note}
			<button on:click="{() => deleteExpense(index)}">x</button>
			</li>
		{/each}
	</ul>
	<input type="text" placeholder="Location" bind:value="{newLocation}" />
	<button on:click="{addExpense}">Add</button>
</main>

<style>

</style>