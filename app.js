// Storage Controller
const StorageCtrl = (function(){
    // Public methods
    return {
        storeItem: function(item) {
            let items
            // Check if any items in local storage
            if(!localStorage.getItem('items')) {
                // add first item to list
                items = []
                // push new item
                items.push(item)
                // set local storage
                localStorage.setItem('items', JSON.stringify(items))
            } else {
                // Get local storage then add new item
                items = JSON.parse(localStorage.getItem('items'))
                items.push(item)
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemsFromStorage: function() {
            let items
            if(!localStorage.getItem('items')) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }

            return items
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach( (item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem)
                }
            })

            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach( (item, index) => {
                if(id === item.id) {
                    items.splice(index, 1)
                }
            })

            localStorage.setItem('items', JSON.stringify(items))
        },
        removeAllItemsFromStorage: function() {
            // localStorage.setItem('items', '')
            localStorage.removeItem('items')
        }
    }
})()

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
        items: StorageCtrl.getItemsFromStorage(),
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 400},
        //     // {id: 2, name: 'Eggs', calories: 500}
        // ],
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
        getItemById: function(id) {
            let found = null
            // loop through items
            data.items.forEach((item) => {
                if(item.id === id) {
                    found = item
                }
            })

            return found
        },
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories)

            let found = null

            data.items.forEach( item => {
                if(item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = calories
                    found = item
                }
            })

            return found
        },
        deleteItem: function(id) {
            // Get Ids
            ids = data.items.map( item => {
                return item.id
            })

            // Get index
            const index = ids.indexOf(id)

            // Remove Item
            data.items.splice(index, 1)
        },
        clearAllItems: function() {
            data.items = []
        },
        setCurrentItem: function(item) {
            data.currentItem = item
        },
        getCurrentItem: function() {
            return data.currentItem
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn'
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
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            // Turn node list into array
            listItems = Array.from(listItems)

            listItems.forEach( listItem => {
                const itemID = listItem.getAttribute('id')
                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `
                }
            })
        },
        deleteListItem: function(id) {
            const itemId = `#item-${id}`
            const item = document.querySelector(itemId)
            item.remove()
        },
        removeItemList: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            // Turn Node list into array
            listItems = Array.from(listItems)

            listItems.forEach( item => {
                item.remove()
            })
        },
        clearInputs: function() {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UICtrl.showEditState()
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        clearEditState: function() {
            UICtrl.clearInputs()
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
        },
        getSelectors: function() {
            return UISelectors
        }
    }
})()

// App Controller
const AppCtrl = (function(ItemCtrl, UICtrl, StorageCtrl){
    // Load event listeners
    const loadEventListeners = function() {
        // Get UI selector ids
        const UISelectors = UICtrl.getSelectors()

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        // Disable submit on enter
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })

        // Edit Icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        // Update Item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

        // Delete Item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', cancelItemUpdateClick)

        // Clear All button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)

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

            // Store in local storage
            StorageCtrl.storeItem(newItem)

            // Clear fields
            UICtrl.clearInputs()
        }

        e.preventDefault()
    }

    // Click edit item
    const itemEditClick = function(e) {
        // because the edit-item icon is added after load we need to target it from the parent div...
        if(e.target.classList.contains('edit-item')) {
            // Get list item id
            const listId = e.target.parentNode.parentNode.id
            
            // Break into an array
            const listIdArr = listId.split('-')
            
            // Get the actual id
            const id = parseInt(listIdArr[1])

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id)

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit)

            // Add item to form
            UICtrl.addItemToForm()
        }

        e.preventDefault()
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput()

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

        // Update UI
        UICtrl.updateListItem(updatedItem)

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories)

        // Update to local storage
        StorageCtrl.updateItemStorage(updatedItem)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem()

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id)

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id)

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories)

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id)

        UICtrl.clearEditState()

        e.preventDefault()
    }

    const cancelItemUpdateClick = function(e) {
        UICtrl.clearEditState()

        e.preventDefault()
    }

    const clearAllItemsClick = function(e) {
        // Delete all items from data
        ItemCtrl.clearAllItems()

        // Remove all items from UI
        UICtrl.removeItemList()

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories)

        // Remove all items from UI
        UICtrl.removeItemList()

        // Remove all items from storage
        StorageCtrl.removeAllItemsFromStorage()

        // Hide UL
        UICtrl.hideList()
        
        e.preventDefault()
    }

    // Public Methods
    return {
        // Edit state cleared
        init: function(){
            // Clear edit state
            UICtrl.clearEditState()

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

})(ItemCtrl, UICtrl, StorageCtrl)

AppCtrl.init()