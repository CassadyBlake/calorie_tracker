// Storage Controller

// Item Controller
const ItemCtrl = (function(){
    // Item Contructor
    const Item = function(id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    // Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 500}
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods
    return {
        getItems: function(){
            return data.items
        },
        addItem: function(name, calories){
            let ID
            console.log("add!")
            // Create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }

            // Calories to number
            calories = parseInt(calories)

            // Create new item
            const newItem = new Item(ID, name, calories)

            data.items.push(newItem)
            return newItem
        },
        getTotalCalories: function() {
            let total = 0
            data.items.forEach((item) => {
                total += item.calories
            })

            // Set data property
            data.totalCalories = total

            return data.totalCalories
        },
        logData: function(){
            return data
        }
    }
})()

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public Methods
    return {
        populateItemList: function(items){
            let html = ''

            items.forEach((item) => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `
            })

            // Insert items into UI
            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show list
            document.querySelector(UISelectors.itemList).style.display = 'block'
            // Create li element
            const li = document.createElement('li')

            // Add class, id, html
            li.className = 'collection-item'
            li.id = `item-${item.id}`
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `

            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        clearInputs: function() {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        getSelectors: function() {
            return UISelectors
        }
    }
})()

// App Controller
const AppCtrl = (function(ItemCtrl, UICtrl){
    // Load event listeners
    const loadEventListeners = function() {
        // Get UI selector ids
        const UISelectors = UICtrl.getSelectors()

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // Get form input from UICtrl
        const input = UICtrl.getItemInput() 
        
        // Check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            // Add item to UI
            UICtrl.addListItem(newItem)

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories()

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories)

            // Clear fields
            UICtrl.clearInputs()
        }

        e.preventDefault()
    }

    // Public Methods
    return {
        // Edit state cleared
        init: function(){
            // Fetch items from data structure
            const items = ItemCtrl.getItems()
            // Check if there are items
            if(items.length === 0) {
                UICtrl.hideList()
            } else {
                // Populate list with items
                UICtrl.populateItemList(items)
            }
            
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories()

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories)

            // Load event listeners
            loadEventListeners()
        }
    }

})(ItemCtrl, UICtrl)

AppCtrl.init()