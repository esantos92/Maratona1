const Modal = {
    open(){
        //abrir modal
        //adicionar a class active ao modal
        document.querySelector('.modal-overlay')
        .classList.add('active')
    },
    close(){
        // fechar o Modal
        //remover a classe active do modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
}

const Transaction = {
    all:transactions = [
        {
           description: 'Luz',
            amount: -50000,
            date: '23/01/2021',
        },    
        {
            description: 'Website',
            amount: 500000,
            date: '23/01/2021',
        },    
        {
            description: 'Internet',
            amount: -20000,
            date: '23/01/2021',
        }   
    ],

    add(transaction){
        Transaction.all.push(transaction);

        App.reload();
    },

    remove(index){
        Transaction.all.splice(index, 1);

        App.reload();
    },

    incomes() {
        //somar todas as entradas
        let income = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income;
    },
    expenses() {
        //somar saídas
        let expanse = 0;
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expanse += transaction.amount;
            }
        })

        return expanse;
    },
    total() {
        //entradas - saídas
        
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expanse"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount (value){
        value = Number(value) * 100

        return value
    },

    formatDate (date){
        const splittedDate = date.split("-");

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        
    },

    //nesta função criada os valores inteiros serão convertidos em floats de duas casas decimais e acrescentado o "$"
    formatCurrency(value) {
        const signal = Number (value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) /100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency:"BRL"
        })
        return signal + value
    }
}

const Form = {
    /*verificar se todas as informações foram preenchidas
    formatar os dados para salvar
    salvar
    apagar os dados do formulario
    modal fechar
    atualizar a aplicação
    */
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues () {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validateFields () {
        const {description, amount, date} = Form.getValues()

        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos.")
        }
    },

    formatValues () {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    SaveTransaction (transaction) {
        Transaction.add(transaction)

    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {              
        event.preventDefault();

        try {
            Form.validateFields();

            const transaction = Form.formatValues();

            Form.SaveTransaction(transaction);

            Form.clearFields();

            Modal.close();            

        } catch (error) {
            alert(error.message)
        }    
        
    },
}

const App ={
    init(){
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance();   
        
    },

    reload(){
        DOM.clearTransactions();
        App.init();
    },
}

App.init();

/*Transaction.add({
    description: 'App',
    amount: 80000,
    date: '29/03/2021',
})

//Transaction.remove(3)*/