const expensesCollName = "expenses";
let editID = -1;
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
        const expenses = LocalStore.getData(expensesCollName);
        // console.log(expenses);

        expenses.forEach(expense => {
            UI.addExpenseToList(expense);
        });

        UI.showCancelBtn(false)
    }

    static showCancelBtn(show){
        let cancelBTN = document.querySelector("#cancel-btn");
        cancelBTN.style.display = show?'block':'none';
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
        }" class="btn btn-danger delete">Delete</a>
        <a href="#${
            expense.id
          }" class="btn btn-info edit">Edit</a>
        </td>
        `;

        tableList.appendChild(row);
    }

    static refreshExpenses(){

        document.querySelector("#expenses-list").innerHTML = "";
        UI.showExpenses()

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
        UI.clearForm(document.querySelector("#expense-form").querySelectorAll("input, select"))
        editID = -1;
    }

    static editRow(){

        let data = LocalStore.getData(expensesCollName);

        const exp1 = data.filter(exp => exp.id == editID)

        if (exp1.length == 1 ){
            const e = exp1[0]
            setFieldValue("name", e.name);
            setFieldValue("comment", e.comment);
            setFieldValue("period-type", e.periodType);
            setFieldValue("period-value", e.periodValue);
            setFieldValue("amount", e.amount);
            setFieldValue("currency-type", e.currency);
            setFieldValue("date", e.date);

        }

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

document.querySelector("#cancel-btn").addEventListener("click", e=>{
    e.preventDefault();
    UI.showCancelBtn(false)
    UI.clearForm(document.querySelector("#expense-form").querySelectorAll("input, select"))
    editID = -1;
})


// Events - display expense

document.addEventListener("DOMContentLoaded", UI.showExpenses);

// Event - add

document.querySelector("#expense-form").addEventListener("submit", e => {
    //submit cannot reload the page
    e.preventDefault();
    submitData()
  
    
});

function submitData(){

    const name = getFieldValue("name");
    const comment = getFieldValue("comment");
    const periodType = getFieldValue("period-type");
    const periodValue = getFieldValue("period-value");
    const amount = getFieldValue("amount");
    const currency = getFieldValue("currency-type");
    const date = getFieldValue("date");

    const expense = new Expense(
        editID,
        name,
        comment,
        periodValue,
        periodType,
        amount,
        currency,
        date
    );

   
    
    if (!expense.validate()) {
        UI.showAlert("Form is invalid", "danger");
        return
    }
    if(editID > -1){
        UI.showAlert("Element edited to the list", "success");
        // console.log(expense);
        
        LocalStore.saveData(expense);
        // TODO - refresh temporary - edit row is expected
        UI.refreshExpenses()
    }
    if(editID == -1){
        UI.showAlert("Element added to the list", "success");
        UI.addExpenseToList(expense);
        LocalStore.addData(expense);
    }

    UI.clearForm(document.querySelector("#expense-form").querySelectorAll("input, select"));
    UI.showCancelBtn(false)
    editID = -1;
    
}

function getFieldValue(id){
    return document.querySelector(`#${id}`).value;
}

function setFieldValue(id, value){
    return document.querySelector(`#${id}`).value = value;
}

// Event - remove

document.querySelector("#expenses-list").addEventListener("click", e => {
    // console.log(e.target);
    e.preventDefault();
    const id = e.target.parentElement.querySelector("a").href.split("#")[1];

    if (e.target.classList.contains("delete")) {
        if (id) {
            UI.deleteRow(e.target);
            LocalStore.removeData(id, expensesCollName);
        }
    }
    if(e.target.classList.contains("edit")){
        console.log("edit hit", id);
        if (id) {
            editID = id
            UI.editRow();
            UI.showCancelBtn(true)
        }
    }
});


// Store class - handle storage (first local storage)

class LocalStore {
    static getData(collName) {
        let collection = [];
        if (localStorage.getItem(collName) != null) {
            collection = JSON.parse(localStorage.getItem(collName));
        }
        return collection;
    }

    static addData(data) {
        let array = LocalStore.getData(data.collectionName());

        let maxID = array.reduce((acc, val) => {
            return acc > val.id ? acc : val.id;
        }, 0);
        data.id = maxID + 1;

        array.push(data);
        localStorage.setItem(data.collectionName(), JSON.stringify(array));
    }

    static saveData(data){

        let array = LocalStore.getData(data.collectionName());
        array.forEach((element, index) =>{
            if(element.id == data.id)
               array[index] = data;
        })
        localStorage.setItem(data.collectionName(), JSON.stringify(array));


    }

    static removeData(id, collName) {
        let array = LocalStore.getData(collName);
        let newData = array.filter(arr => arr.id != id);
        localStorage.setItem(collName, JSON.stringify(newData));
    }
}