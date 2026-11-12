// ==========================================================================
// 1. DOM ELEMENTS (Bridges to our HTML)
// We use querySelector to grab elements exactly like we target them in CSS.
// ==========================================================================
const transactionForm = document.querySelector('#transaction-form form');
const descriptionInput = document.querySelector('input[type="text"]');
const amountInput = document.querySelector('input[type="number"]');
const balanceDisplay = document.querySelector('.balance-card');
const historyList = document.querySelector('.history-list');

// ==========================================================================
// 2. APPLICATION STATE (Temporary Memory)
// Later, this array will be replaced by a real database where foreign keys 
// link these transactions to specific users[cite: 5].
// ==========================================================================
let currentBalance = 0;
let transactions = [];
// ==========================================================================
// 3. BUSINESS LOGIC (The Brain)
// Functions that calculate data and update the UI.
// ==========================================================================

function addTransaction(event) {
    // Prevent the default browser behavior (which refreshes the page on form submit)
    event.preventDefault();

    // Get the values from the input fields
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value); // Convert string to a decimal number

    // Basic validation: ensure the fields are not empty and the amount is a valid number
    if (description.trim() === '' || isNaN(amount)) {
        alert('Bitte geben Sie eine gültige Beschreibung und einen Betrag ein.');
        return; // Stop execution if data is invalid
    }

    // Create a transaction object.
    // The 'id' here simulates a Primary Key, ensuring every record is uniquely identifiable[cite: 5].
    const transaction = {
        id: Date.now(), // Generate a unique timestamp ID
        description: description,
        amount: amount
    };

    // Add the new transaction to our temporary memory array
    transactions.push(transaction);

    // Update the UI
    updateDashboard();
    renderHistory();

    // Clear the input fields for the next entry
    descriptionInput.value = '';
    amountInput.value = '';
}

function updateDashboard() {
    // Calculate the total sum of all transactions
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
        total += transactions[i].amount;
    }
    
    // Display the result in the dashboard card
    balanceDisplay.innerHTML = `<h3>${total.toFixed(2)} €</h3>`;
}

function renderHistory() {
    // Clear the current list so we don't duplicate existing items
    historyList.innerHTML = '';

    // Loop through our memory and create HTML for each transaction
    transactions.forEach(transaction => {
        const item = document.createElement('div');
        
        // Add styling based on whether it's an income (positive) or expense (negative)
        item.style.padding = '1rem';
        item.style.backgroundColor = '#ffffff';
        item.style.marginBottom = '0.5rem';
        item.style.borderRadius = '6px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.borderLeft = transaction.amount >= 0 ? '5px solid #27ae60' : '5px solid #c0392b';
        
        item.innerHTML = `
            <span>${transaction.description}</span>
            <strong>${transaction.amount.toFixed(2)} €</strong>
        `;
        
        historyList.appendChild(item);
    });
}

// ==========================================================================
// 4. EVENT LISTENERS (The Triggers)
// Watching for user actions to execute our logic.
// ==========================================================================

// When the form is submitted, trigger the addTransaction function
transactionForm.addEventListener('submit', addTransaction);