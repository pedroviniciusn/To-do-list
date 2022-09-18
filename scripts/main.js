const Main = {

    tasksToDo: [],
    
    init: function() {
        
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
        
    },

    cacheSelectors: function() {

        this.inputTask = document.querySelector('#inputTask')
        this.btnAddTask = document.querySelector('#btnAddTask')
        this.checkButtons = document.querySelectorAll('#btnCheck')
        this.inputNewValueTask = document.querySelectorAll('#inputNewValueTask')
        this.editButtons = document.querySelectorAll('#btnEdit')
        this.removeButtons = document.querySelectorAll('#btnRemove')
        this.todoList = document.querySelectorAll('#todoList')   
    },

    bindEvents: function() {

        const Self = this
        
        this.btnAddTask.onclick = Self.Events.addTask.bind(this)
        
        this.inputTask.onkeypress = Self.Events.inputTaskKeypress

        this.inputNewValueTask.forEach(function(input) {    
           input.onkeypress = Self.Events.saveEditTask.bind(this)
        }.bind(this))

        this.checkButtons.forEach(function(button) {
            button.onclick = Self.Events.checkButtonsClick
        })

        this.editButtons.forEach(function(button) {
            button.onclick = Self.Events.editButtonsClick.bind(this)
        }.bind(this))

        this.removeButtons.forEach(function(button){
            button.onclick = Self.Events.removeButtonsClick.bind(Self)
        })

    },

    getStoraged: function() {
        if(!localStorage.getItem('tasks')) {
            return 
        } else {
            const tasks = localStorage.getItem('tasks');
            this.tasksToDo = JSON.parse(tasks);
        }   
        console.log(this.tasksToDo)
    },

    getTaskHtml: function(tasks) {
        return `
            <li class="task_list" id="taskList">
                <button class="fa-solid fa-check fa-2xl" id="btnCheck"></button>
                <span>${tasks}</span>
                <button class="fa-solid fa-pen-to-square fa-2xl" id="btnEdit"></button>
                <button  class="fa-solid fa-trash fa-2xl" id="btnRemove" data-tasks="${tasks}"></button>
            </li>
        `
    },

    buildTasks: function() { 
        let html = ''

        this.tasksToDo.forEach(item => {   
           html += this.getTaskHtml(item.task)
        })

        todoList.innerHTML = html ;

        this.cacheSelectors()
        this.bindEvents()
    },

    Events: {

        inputTaskKeypress: function(e) {
            var key = e.key
        
            key === "Enter"  
            ? btnAddTask.click() 
            : ''
        },
        
        addTask: function() {

            const value = inputTask.value

            value === '' 
            ? alert('Por favor digite algo') 
            : todoList.innerHTML += this.getTaskHtml(value)
           
            inputTask.value = ''

            
            const savedTask = localStorage.getItem('tasks')
            
            const savedTaskObj = JSON.parse(savedTask)
            
            if(!savedTaskObj) {
                const tasksObj = [{task: value}]

                localStorage.setItem('tasks', JSON.stringify(tasksObj)) 
            } else {
                const tasksObj = [{task: value}, ...savedTaskObj]
                
                localStorage.setItem('tasks', JSON.stringify(tasksObj)) 
            }
            
            this.cacheSelectors()
            this.bindEvents()
        },


        checkButtonsClick: function(e) {

            const li = e.target.parentElement
            const isDone = li.classList.contains('done')
            
            if(!isDone) {
                li.classList.add('done')
                return
            }

            li.classList.remove('done')
        },

        editButtonsClick: function(e) {
            const li = e.target.parentElement
            const span = li.children[1]
            const input = document.createElement('input')
            input.type = 'text'
            input.id = 'inputNewValueTask'
            input.value = span.textContent
            li.insertBefore(input, span)
            li.removeChild(span)

            this.cacheSelectors()
            this.bindEvents()
        },
        
        saveEditTask: function(e) {
            const key = e.key 
            if(key === "Enter") {
                const li = e.target.parentElement
                const input = li.children[1]
                const span = document.createElement('span')
                span.textContent = input.value
                li.insertBefore(span, input)
                li.removeChild(input)
            } 

            this.cacheSelectors()
            this.bindEvents()
        },
        
        removeButtonsClick: function(e) {

            const li = e.target.parentElement
            const value =  e.target.dataset['tasks']
        

            const newTasksValue = this.tasksToDo.filter(tasks => tasks.task !== value)
            console.log(newTasksValue)
            
            
            localStorage.setItem('tasks', JSON.stringify(newTasksValue))

            
            li.classList.add('removed')

        
            setTimeout(function(){
                li.classList.add('hidden')
            },300)

            this.cacheSelectors()
            this.bindEvents()
            this.getStoraged()
        }
    }
}
    
Main.init()