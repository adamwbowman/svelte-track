
<script>
	import { db } from './firebase.js'
	import { collection, query, orderBy, getDocs, onSnapshot } from "firebase/firestore"; 

	// let expenses = [
	// 	{note: "N1", createdAt: "12/31", location: "Loc1", amount: 100},
	// 	{createdAt: "12/24", note: "N2", amount: 150, location: "L2"}
	// ];
	// 	console.log(`${doc.id} => ${doc.data()}`);

	const expensesCol = collection(db, 'expenses');
	const queryAll = query(expensesCol, orderBy("createdAt", "desc"));


	const getExpenses = async () => {
			const expensesGetAll = await getDocs(queryAll);
			const expenses = expensesGetAll.docs.map(doc => doc.data());
			console.log(expenses);
			return expenses;
		}

	$: expenses = () => {
		const unsubscribe = onSnapshot(queryAll, (querySnapshot) => {
			// const expenses = [];
			querySnapshot.forEach((doc) => {
				expenses.push(doc.data());
			});
		})
	}

	let newLocation = "";
	let error = "";

	const addExpense = () => {
		if (newLocation != "") {
			expenses = [...expenses, {location: newLocation}];
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
	{#await getExpenses()}
		<p class="waiting">pending...</p>
	{:then expenses}
	<ul>
		{#each expenses as expense, index}
			<li>{expense.location}
			<button on:click="{() => deleteExpense(index)}">x</button>
			</li>
		{/each}
	</ul>
	{:catch error}
		<p class="error">{error}</p>
	{/await}
	<input type="text" placeholder="Location" bind:value="{newLocation}" />
	<button on:click="{addExpense}">Add</button>
</main>

<style>
	.error {
		color: red;
	}
</style>