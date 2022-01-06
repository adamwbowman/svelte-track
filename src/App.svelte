
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
		resetSubTotal();
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
		resetSubTotal();
		await deleteDoc(doc(db, "expenses", index));
	}

	function resetSubTotal(){
		subTotal = parseInt(0);
	}

	const Total = parseInt(500);
	let subTotal = parseInt(0);
	function getSubTotal(amount) {
		if (subTotal == 0) {
			subTotal = (500-amount);
		} else {
			subTotal = (subTotal-amount);
		}
		return subTotal;
	}

	// let editing = false;
	// function edit() {
  //   editing = true
  // }
	</script>

<main class="container">
	<div class="div1">Total: {Total}</div>
		{#each expenses as expense}
		<div class="parent">

		<div class="div2">{expense.location}</div>
			<div class="div3">(${expense.amount})</div>
			<div class="div4">{expense.note}</div>
			<div class="div5">${getSubTotal(expense.amount)}<button on:click="{deleteExpense(expense.id)}">x</div>
			</div>

				{/each}
	<div class="parent">
		<div class="div2"><input type="text" placeholder="Location" bind:value="{newLocation}" /></div>
		<div class="div3"><input type="text" placeholder="Amount" bind:value="{newAmount}" /></div>
		<div class="div4"><input type="text" placeholder="Note" bind:value="{newNote}" />
		<button on:click="{addExpense}">Add</button></div>
	</div>
	<div class="div5"></div>
</main>

<style>
.parent { 
	display: grid; 
	grid-template-columns: repeat(4, 1fr); 
	grid-template-rows: repeat(2, 1fr); 
	grid-column-gap: 10px;
	grid-row-gap: 10px; 
}
.div1 { grid-area: 1 / 1 / 2 / 5; } 
.div2 { grid-area: 2 / 1 / 3 / 2; } 
.div3 { grid-area: 2 / 2 / 3 / 3; } 
.div4 { grid-area: 2 / 3 / 3 / 4; } 
.div5 { grid-area: 2 / 4 / 3 / 5; } 
</style>