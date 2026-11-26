// ==========================================================================
// 1. DOM ELEMENTS (Bridges to our HTML, using precise IDs)
// ==========================================================================
const transactionform = document.querySelector('#tx-form');
const descriptionInput = document.querySelector('#desc-input');
const amountInput = document.querySelector('#amount-input');
const categorySelect = document.querySelector('#category-select');
const balanceDisplay = document.querySelector('.balance-card');
const historyList = document.querySelector('.history-list');

// ==========================================================================
// 2. APPLICATION STATE (Application memory)
// ==========================================================================
const STORAGE_KEY = 'finance_sensei_transactions';
let transactions = [];

// ==========================================================================
// 3. BUSINESS LOGIC (The brain of the application)
// ==========================================================================

function saveTransactions() {
    const serializedData = JSON.stringify(transactions);
    localStorage.setItem(STORAGE_KEY, serializedData);
}

function loadTransactions() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData !== null) {
        transactions = JSON.parse(savedData);
    }
} 

function addTransaction(event) {
    // Prevent the page from reloading when the form is submitted
    event.preventDefault();

    // 1. Read the values ​​entered by the user
    const description = descriptionInput.value.trim();
    const rawAmount = parseFloat(amountInput.value); // Gross amount (always positive in the input)
    const categoryId = parseInt(categorySelect.value); // Category ID (e.g., 1 for Wohnen)

    // 2. Determine which option was selected from the dropdown menu
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const transactionType = selectedOption.getAttribute('data-type'); // 'income' or 'expense'
    const categoryName = selectedOption.text; // Visible text, e.g., "🏠 Housing (Rent)"

    // 3. Safety validation
    if (description === '' || isNaN(rawAmount) || rawAmount <= 0 || !categoryId) {
        alert('Bitte füllen Sie alle Felder korrekt aus!');
        return;
    }

    // 4. FINANCIAL LOGIC: If it is an 'expense', we convert the amount into a negative number (-)!
    // We use Math.abs() to ensure that we start with a positive number.
    const finalAmount = transactionType === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount);

    // 5. We create the transaction object (exactly like a row in our SQL table!)
    const transaction = {
        id: Date.now(),                 // Primary Key (unique)
        description: description,       // ex: "Miete"
        amount: finalAmount,            // ex: -850.00
        type: transactionType,          // 'income' or 'expense' 
        category_id: categoryId,        // Foreign key to the categories table (e.g., 1)
        category_name: categoryName     // We also save the name so it can be displayed nicely in the history (like an SQL JOIN)
    };

    // 6. Add the transaction to memory
    transactions.push(transaction);
    saveTransactions();

    // 7. Update the screen (Dashboard + History)
    updateDashboard();
    renderHistory();

    // 8. Clear the form for the next transaction
    transactionform.reset();
}

function updateDashboard() {
    // We calculate the total balance (income is added, expenses are automatically subtracted because they have a minus sign!)
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
        total += transactions[i].amount;
    }

    const statusClass = total >= 0 ? 'is-income' : 'is-expense';

    // Display the result in the Dashboard
    balanceDisplay.textContent = '';

    const balanceHeading = document.createElement('h3');
    balanceHeading.classList.add('balance-amount', statusClass);
    balanceHeading.textContent = `${total.toFixed(2)} €`;

    balanceDisplay.appendChild(balanceHeading);
}

function renderHistory() {
    // Clear the list before redrawing it
    historyList.textContent = '';

    // We iterate through each transaction and create a visual card
    transactions.forEach(transaction => {
        const isIncome = transaction.amount >= 0;
        const sign = isIncome ? '+' : ''; // Negative numbers already have a '-' in front
        const statusClass = isIncome ? 'is-income' : 'is-expense';

        
       const item = document.createElement('div');
        item.classList.add('history-item', statusClass);

        const details = document.createElement('div');
        details.classList.add('history-details');

        const description = document.createElement('strong');
        description.classList.add('history-desc');
        description.textContent = transaction.description;

        const category = document.createElement('small');
        category.classList.add('history-category');
        category.textContent = transaction.category_name;

        details.appendChild(description);
        details.appendChild(category);

        const amount = document.createElement('strong');
        amount.classList.add('history-amount');
        amount.textContent = `${sign}${transaction.amount.toFixed(2)} €`;

        item.appendChild(details);
        item.appendChild(amount);

        historyList.appendChild(item);
    });
}

// ==========================================================================
// 4. EVENT LISTENERS (Triggers)
// ==========================================================================
transactionform.addEventListener('submit', addTransaction);

// Upon application startup: load data from the vault and draw the screen
loadTransactions();
updateDashboard();
renderHistory();