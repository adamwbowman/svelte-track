
<script>
	import { db } from './firebase.js'
	import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore"; 

	let expenses = [];

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

	const Total = parseInt(500);
	let subTotal = parseInt(0);
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

	// let editing = false;
	// function edit() {
  //   editing = true
  // }
	</script>

<main>
	<div class="div1">Total: {Total}</div>
		{#each expenses as expense}
		<div class="parent">
			<div class="div2">{expense.location}</div>
			<div class="div3">$</div>
			<div class="div4">({expense.amount})</div>
			<div class="div5">$</div>
			<div class="div6">{getSubTotal(expense.amount)}</div>
			<div class="div7"><button class="button button4">{expense.note}</button></div>
			<div class="div8"><button class="button button4" on:click="{deleteExpense(expense.id)}">x</div>
		</div>
		{/each}
		<div class="parent">
			<div class="div2">
				<input type="text" placeholder="Location" on:keypress="{handleEnter}" bind:value="{newLocation}" size="18" />
			</div>
			<div class="div3"></div>
			<div class="div4">
				<input type="text" placeholder="$" on:keypress="{handleEnter}" bind:value="{newAmount}" size="5" />
			</div>
			<div class="div5"></div>
			<div class="div6"></div>
			<div class="div7">
				<input type="text" placeholder="Note" on:keypress="{handleEnter}" bind:value="{newNote}" size="18" />
			</div>
			<div class="div8">
				<button on:click="{addExpense}">Add</button>
			</div>
		</div>
</main>

<style>
.parent { 
	display: grid; 
	grid-template-rows: 25px 0px; 
	grid-template-columns: 200px 0px 100px 0px 100px 200px 0px; 
	grid-row-gap: 10px; 
	grid-column-gap: 5px;
}
.div1 { grid-area: 1 / 1 / 2 / 8; } 
.div2 { grid-area: 2 / 1 / 3 / 2; } 
.div3 { grid-area: 2 / 2 / 3 / 3; } 
.div4 { 
	grid-area: 2 / 3 / 3 / 4; 
	text-align: right;
} 
.div5 { 
	grid-area: 2 / 4 / 3 / 5; 
	font-weight: bold;
	font-style: italic;
} 
.div6 { 
	grid-area: 2 / 5 / 3 / 6;
	text-align: right; 
	font-weight: bold;
	font-style: italic;
}
.div7 { grid-area: 2 / 6 / 3 / 7; }
.div8 { grid-area: 2 / 7 / 3 / 8; } 
.button {
  background-color: lightgray;
  border: 1px solid black;
  color: black;
  padding: 4px 10px 4px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 0px 0px;
}
.button4 {border-radius: 4px;}
</style>