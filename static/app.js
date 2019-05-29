const expensesCollName = "expenses";
// Expense Class - object
class Expense {
    constructor(
        id,
        name,
        comment,
        periodValue,
        periodType,
        amount,
        currency,
        date
    ) {
        this.id = id;
        this.name = name;
        this.comment = comment;
        this.periodType = periodType;
        this.periodValue = periodValue;
        this.amount = amount;
        this.currency = currency;
        this.date = date;
    }
    validate() {
        if (
            this.name.trim().length < 1 ||
            this.amount.trim().length < 1 ||
            this.currency == "0"
        )
            return false;
        if (this.periodValue.trim().length > 0 && this.periodType == "0")
            return false;
        // TODO - check date
        return true;
    }
    collectionName() {
        return expensesCollName;
    }
}

// UI Class - handle UI
class UI {
    // view is static

    static showExpenses() {
        //TODO replace it local storage/DB - PAW
        // const storedExpenses =[
        //     {
        //         id : 1,
        //         name : "First expense",
        //         comment : "comment",
        //         periodType : "DAY",
        //         periodValue : 2,
        //         amount : 134.01,
        //         currency : "USD",
        //         date : "2019-05-01T23:28:56.782Z"
        //     },
        //     {
        //         id: 2,
        //         name : "Second expense",
        //         comment : "comment",
        //         periodType : "MONTH",
        //         periodValue : 5,
        //         amount : 3134.01,
        //         currency : "EUR",
        //         date : "2019-05-03T23:28:56.782Z"
        //     }
        // ];
        const expenses = Store.getData(expensesCollName);
        // console.log(expenses);

        expenses.forEach(expense => {
            UI.addExpenseToList(expense);
        });
    }

    static addExpenseToList(expense) {
        const tableList = document.querySelector("#expenses-list");
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.amount}</td>
        <td>${expense.currency}</td>
        <td><a href="#${
          expense.id
        }" class="btn btn-danger delete">Delete</a></td>
        `;

        tableList.appendChild(row);
    }

    static clearForm(elements) {
        elements.forEach(element => {
            if (
                element.type == "text" ||
                element.type == "number" ||
                element.type == "date"
            )
                element.value = "";
            else if (element.nodeName == "SELECT") element.value = "0";
        });
    }
    static deleteRow(el) {
        // confirm?
        el.parentElement.parentElement.remove();
        UI.showAlert("Row removed", "info");
    }

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#expense-form");
        container.insertBefore(div, form);
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 2000);
    }
}

// Store class - handle storage (first local storage)

class Store {
    static getData(collName) {
        let collection = [];
        if (localStorage.getItem(collName) != null) {
            collection = JSON.parse(localStorage.getItem(collName));
        }
        return collection;
    }

    static addData(data) {
        let array = Store.getData(data.collectionName());

        let maxID = array.reduce((acc, val) => {
            return acc > val.id ? acc : val.id;
        }, 0);
        data.id = maxID + 1;

        array.push(data);
        localStorage.setItem(data.collectionName(), JSON.stringify(array));
    }

    static removeData(id, collName) {
        let array = Store.getData(collName);
        let newData = array.filter(arr => arr.id != id);
        localStorage.setItem(collName, JSON.stringify(newData));
    }
}

// Events - display expense

document.addEventListener("DOMContentLoaded", UI.showExpenses);

// Event - add

document.querySelector("#expense-form").addEventListener("submit", e => {
    //submit cannot reload the page
    e.preventDefault();
    const name = document.querySelector("#name").value;
    const comment = document.querySelector("#comment").value;
    const periodType = document.querySelector("#period-type").value;
    const periodValue = document.querySelector("#period-value").value;
    const amount = document.querySelector("#amount").value;
    const currency = document.querySelector("#currency-type").value;
    const date = document.querySelector("#date").value;

    //validation

    const expense = new Expense(
        -1,
        name,
        comment,
        periodType,
        periodValue,
        amount,
        currency,
        date
    );
    // console.log(expense);

    if (expense.validate()) {
        UI.showAlert("Element added to the list", "success");
        UI.addExpenseToList(expense);
        Store.addData(expense);
        UI.clearForm(
            document.querySelector("#expense-form").querySelectorAll("input, select")
        );
    } else {
        UI.showAlert("Form is invalid", "danger");
    }
});

// Event - remove

document.querySelector("#expenses-list").addEventListener("click", e => {
    // console.log(e.target);
    e.preventDefault();
    if (e.target.classList.contains("delete")) {
        const id = e.target.parentElement.querySelector("a").href.split("#")[1];
        if (id) {
            UI.deleteRow(e.target);
            Store.removeData(id, expensesCollName);
        }
    }
});