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
let transactions = [];

// ==========================================================================
// 3. BUSINESS LOGIC (The brain of the application)
// ==========================================================================

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

    // Choose the balance color: Green if we are in the positive/at zero, Red if we are in the negative
    const color = total >= 0 ? '#27ae60' : '#c0392b';

    // Display the result in the Dashboard
    balanceDisplay.innerHTML = `<h3 style="color: ${color}; font-size: 2rem;">${total.toFixed(2)} €</h3>`;
}

function renderHistory() {
    // Clear the list before redrawing it
    historyList.innerHTML = '';

    // We iterate through each transaction and create a visual card
    transactions.forEach(transaction => {
        const item = document.createElement('div');

        // We check whether it is an income or an expense
        const isIncome = transaction.amount >= 0;
        const sign = isIncome ? '+' : ''; // Negative numbers already have a '-' in front
        const amountColor = isIncome ? '#27ae60' : '#c0392b';

        // Styling the row in the history
        item.style.padding = '1rem';
        item.style.backgroundColor = '#ffffff';
        item.style.marginBottom = '0.75rem';
        item.style.borderRadius = '8px';
        item.style.boxShadow = '0 2px 5px rgba(0,0,0,0.03)';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.borderLeft = isIncome ? '5px solid #27ae60' : '5px solid #c0392b';

        // Display the Description + Category on the left, and the colored Amount on the right
        const details = document.createElement('div');

        const description = document.createElement('strong');
        description.style.display = 'block';
        description.style.fontSize = '1.05rem';
        description.textContent = transaction.description;

        const category = document.createElement('small');
        category.style.color = '#7f8c8d';
        category.textContent = transaction.category_name;

        details.appendChild(description);
        details.appendChild(category);

        const amount = document.createElement('strong');
        amount.style.color = amountColor;
        amount.style.fontSize = '1.1rem';
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

// Initialize the Dashboard with €0.00 when the application starts
updateDashboard();