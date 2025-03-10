// DOM Elements
const errorMsgEl = document.querySelector(".error_message");
const budgetForm = document.getElementById("budget-form");
const expensesForm = document.getElementById("expenses-form");
const budgetInputEl = document.querySelector(".budget_input");
const expenseInputEl = document.querySelector(".expenses_input");
const expenseAmountEl = document.querySelector(".expenses_amount");
const budgetCardEl = document.querySelector(".budget_card");
const expensesCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");
const expenseTableEl = document.querySelector(".tbl_tr_content");

// Application State
let budgetAmount = parseFloat(localStorage.getItem("budget")) || 0;
let expensesList = JSON.parse(localStorage.getItem("expenses")) || [];

// Initialize UI
document.addEventListener("DOMContentLoaded", () => {
    budgetCardEl.textContent = `$${budgetAmount.toFixed(2)}`;
    updateExpensesCard();
    updateExpenseTable();
    updateBalance();
});

// Budget Form Submit Event
budgetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const budgetValue = parseFloat(budgetInputEl.value);

    if (isNaN(budgetValue) || budgetValue <= 0) {
        showError("Please enter a valid budget greater than 0");
        return;
    }

    hideError();
    budgetAmount = budgetValue;
    localStorage.setItem("budget", budgetAmount);
    budgetCardEl.textContent = `$${budgetAmount.toFixed(2)}`;
    budgetInputEl.value = "";
    updateBalance();
});

// Expenses Form Submit Event
expensesForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const expenseName = expenseInputEl.value.trim();
    const expenseAmount = parseFloat(expenseAmountEl.value);

    if (expenseName === "" || isNaN(expenseAmount) || expenseAmount <= 0) {
        showError("Please enter a valid expense name and amount");
        return;
    }

    hideError();
    const newExpense = { id: Date.now(), name: expenseName, amount: expenseAmount };
    expensesList.push(newExpense);
    localStorage.setItem("expenses", JSON.stringify(expensesList));
    
    updateExpensesCard();
    updateExpenseTable();
    updateBalance();
    
    expenseInputEl.value = "";
    expenseAmountEl.value = "";
});

// Update Expenses Card
function updateExpensesCard() {
    const totalExpenses = expensesList.reduce((total, expense) => total + expense.amount, 0);
    expensesCardEl.textContent = `$${totalExpenses.toFixed(2)}`;
}

// Update Expense Table
function updateExpenseTable() {
    expenseTableEl.innerHTML = "";
    expensesList.forEach((expense) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>
                <button type="button" class="btn_edit" onclick="editExpense(${expense.id})">Edit</button>
                <button type="button" class="btn_delete" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        `;
        expenseTableEl.appendChild(row);
    });
}

// Edit Expense
function editExpense(id) {
    const expense = expensesList.find((exp) => exp.id === id);
    if (!expense) return;
    
    expenseInputEl.value = expense.name;
    expenseAmountEl.value = expense.amount;
    
    deleteExpense(id);
}

// Delete Expense
function deleteExpense(id) {
    expensesList = expensesList.filter((exp) => exp.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expensesList));
    updateExpensesCard();
    updateExpenseTable();
    updateBalance();
}

// Update Balance
function updateBalance() {
    const totalExpenses = expensesList.reduce((total, expense) => total + expense.amount, 0);
    const balance = budgetAmount - totalExpenses;
    balanceCardEl.textContent = `$${balance.toFixed(2)}`;
}

// Show Error Message
function showError(message) {
    errorMsgEl.textContent = message;
    errorMsgEl.style.display = "flex";
}

// Hide Error Message
function hideError() {
    errorMsgEl.style.display = "none";
}
// Clear Budget and Reset Everything
document.getElementById("reset-btn").addEventListener("click", function () {
    budgetAmount = 0;
    expensesList = [];
    
    // Clear from localStorage
    localStorage.removeItem("budget");
    localStorage.removeItem("expenses");

    // Reset UI
    budgetCardEl.textContent = "$0.00";
    balanceCardEl.textContent = "$0.00";
    expensesCardEl.textContent = "$0.00";
    expenseTableEl.innerHTML = "";

    showError("Budget has been reset"); // Temporary notification
    setTimeout(hideError, 2000); // Hide after 2 seconds
});

