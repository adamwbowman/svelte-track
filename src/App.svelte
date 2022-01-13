
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
	</script>

<main>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid mb-0 h1">
			<a class="navbar-brand" href="#/">${Total}</a>
		</div>


	</nav>
	<div class="container">
		<div class="row">
			<div class="col border">1</div>
			<div class="col border">2</div>
			<div class="col border">3</div>
			<div class="col border">4</div>
			<div class="col border">5</div>
			<div class="col border">6</div>
			<div class="col border">7</div>
			<div class="col border">8</div>
			<div class="col border">9</div>
			<div class="col border">10</div>
			<div class="col border">11</div>
			<div class="col border">12</div>
			<div class="col border">13</div>
		</div>
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
					<input type="text" class="form-control" aria-label="Dollar amount"  on:keypress="{handleEnter}" bind:value="{newAmount}"/>
				</div>
			</div>
			<div class="col-md-2"></div>
			<div class="col-md-4 input-group-sm"><input type="text" class="form-control" placeholder="Tags" on:keypress="{handleEnter}" bind:value="{newNote}"/></div>

			
			<div class="col-md-1"><button type="button" class="btn btn-success btn-sm" on:click="{addExpense}"><span class="fas fa-plus"></span></button></div>
		</div>
		<!-- error alert -->
		<div class="row">
			<div class="col-md-5">
			{#if (error != "") }
				<div class="alert alert-danger alert-dismissible fade show" role="alert">
					<span class="fas fa-exclamation-circle"></span> {error} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				</div>
			{/if}
			</div>
		</div>


<!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
	Launch demo modal
</button>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">Tags</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				{#each tags as tag}
				<div class="alert alert-{tag.color}" role="alert">
					{tag.name}
				</div>
				{/each}
			</div>
		</div>
	</div>
</div> -->


<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
  Button with data-bs-target
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div>
      Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
    </div>
    <div class="dropdown mt-3">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
        Dropdown button
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li><a class="dropdown-item" href="/#">Action</a></li>
        <li><a class="dropdown-item" href="/#">Another action</a></li>
        <li><a class="dropdown-item" href="/#">Something else here</a></li>
      </ul>
    </div>
  </div>
</div>
	</div>
</main>

<style>
.navbar {
	margin-bottom: 15px;
}
@media only screen and (max-width: 600px) {
  main {
    background-color: lightblue;
  }
}
</style>