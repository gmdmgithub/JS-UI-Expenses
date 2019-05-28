// Expense Class - object
class Expense{
    constructor(name, comment, periodValue, periodType, amount, currency, date){
        this.name = name;
        this.comment = comment;
        this.periodType = periodType;
        this.periodValue = periodValue;
        this.amount = amount;
        this.currency = currency;
        this.date = date;
    }
}

// UI Class - handle UI
class UI{ // view is static

    static showExpenses(){
        //TODO replace it local storage/DB - PAW
        const storedExpenses =[
            {
                name : "First expense",
                comment : "comment",
                periodType : "DAY",
                periodValue : 2,
                amount : 134.01,
                currency : "USD",
                date : "2019-05-01T23:28:56.782Z"
            },
            {
                name : "Second expense",
                comment : "comment",
                periodType : "MONTH",
                periodValue : 5,
                amount : 3134.01,
                currency : "EUR",
                date : "2019-05-03T23:28:56.782Z"
            }
        ];

        const expenses = storedExpenses;

        expenses.forEach(expense =>{
            UI.addExpenseToList(expense);
        })
    }

    static addExpenseToList(expense){
        const tableList = document.querySelector("#expenses-list")
        const row = document.createElement("tr")

        row.innerHTML =`
        <td>${expense.name}</td>
        <td>${expense.amount}</td>
        <td>${expense.currency}</td>
        <td><a href="#" class="btn btn-danger delete">Delete</a></td>
        `; 

        tableList.appendChild(row);
    }
}

// Store class - handle storage (first local storage)

// Events - display expense

document.addEventListener("DOMContentLoaded", UI.showExpenses)

// Event - add

document.querySelector("#expense-form").addEventListener("submit", (e)=>{
    e.preventDefault();
    const name =document.querySelector("#name").value;
    const comment =document.querySelector("#comment").value;
    const periodType =document.querySelector("#period-type").value;
    const periodValue =document.querySelector("#period-value").value;
    const amount =document.querySelector("#amount").value;
    const currency =document.querySelector("#currency-type").value;
    const date =document.querySelector("#date").value;

    const expense = new Expense(name,comment, periodType,periodValue , amount, currency, date);
    // console.log(expense);

    UI.addExpenseToList(expense);

})

// Event - remove