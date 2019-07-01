//Storage Controller
const StorageCtrl = (function() {

    //Public Method
    return{
        storeItem: function(item){
            let items;
            //Perform Storage Check
            if (localStorage.getItem('items') === null) {
                items = [];

                //Push the new item into items array
                items.push(item);

                //Set item to local storage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //Get what is already in local storage
                items = JSON.parse(localStorage.getItem('items'));

                //Push the new item to Items array
                items.push(item);

                //Re-set local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index)=>{
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(idOfItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index)=>{
                if (idOfItem === item.id) { 
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items)); 
        },
        clearAllItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        // items: [
        //     // {id: 0, name: 'Steak Dinner', calories: 1200},
        //     // {id: 1, name: 'Cookie', calories: 300},
        //     // {id: 2, name: 'Porridge', calories: 600}
        // ],
        items: StorageCtrl.getItemFromStorage(),
        currentItem: null,  //This is used when we click on edit icon - that particular clicked meal-item is set to currentItem in input field form to be updated
        totalCalories: 0
    }

    //Public Methods
    return{
        getData: function(){
            return data.items;
        },
        addItem: function(name, calories){
            // Create ID for the new item
            let ID;
            
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            // Convert calories(string) to number
            calories = parseInt(calories);

            // Create a new Item
            newItem = new Item(ID, name, calories);

            //Add the new Item to items Array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;

            data.items.forEach(item =>{
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            //Convert calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(item =>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            // First get the ids of all the items using map()
            const ids = data.items.map(item => {
                return item.id;
            });

            //Get the index of the currentItem id in the ids array
            const index = ids.indexOf(id);

            //Then remove the currentItem by id(index) from the array of items using splice fcn or filter fcn
            data.items.splice(index, 1);

        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach( item =>{
                total += item.calories;
            })
            data.totalCalories = total;

            return data.totalCalories;

        },
        logData: function(){
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function(){
    UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    //Public Methods
    return{
        populateItemList: function(items){
            let htmlList = '';

            items.forEach( (item)=> {
                htmlList += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em> ${item.calories} calories</em>
                        <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>
                    </li>
                `;
            });

            //Populate/Insert the ul html element with li items
            document.querySelector(UISelectors.itemList).innerHTML = htmlList;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            //Unhide the ul element
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // Create li element
            const li = document.createElement('li');

            //Add classname to the created li element
            li.className = 'collection-item';

            //Add id to the created li element
            li.id = `item-${item.id}`;

            //Add necessary Html values to the li element
            li.innerHTML = `<strong>${item.name}: </strong> <em> ${item.calories} calories</em>
                            <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>`;

            //Insert/Append the li element unto the ul
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn listItems which is node list to an array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em> ${item.calories} calories</em>
                                                                        <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i> </a>`;
                }
            });
        },
        deleteListItem: function(id){
            //Get the id of the list item to delete
            const itemID = `#item-${id}`;

            //Get the item to delete by it's id
            const item = document.querySelector(itemID);   

            //Delete the item from UI
            item.remove();
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearInputFields: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addEditItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeAllItems: function(){
            //Get all the list element
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            //Convert listItems(A node list) to array
            listItems = Array.from(listItems);
            
            //Loop through all list items and then remove them
            listItems.forEach(item => {
                item.remove();
            });
        },
        hideUlElementList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        clearEditState: function(){
            UICtrl.clearInputFields();
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//App Controller
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){
    //Load Event listeners
    const loadEventListener = function(){
        //Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter key
        document.addEventListener('keypress', e =>{
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
       
        //Update button click event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
        
        //Delete button click event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
       
        //Back button click event
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);
       
        //Clear all click event
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
    }
    //Create Add Item Submit (ItemAddSubmit) Definition
    const itemAddSubmit = function(e){
        //Get form input from  UI Controller
        const formInput = UICtrl.getItemInput();

        // Validate inputs from form
        if(formInput.name !=='' && formInput.calories !==''){
            //Add the input item to Item Controller
            const newItem = ItemCtrl.addItem(formInput.name, formInput.calories);

            // Add the new Item to the UI list
            UICtrl.addListItem(newItem);

            //Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            //Store item in local storage
            StorageCtrl.storeItem(newItem);

            //Clear Input fields after submission of item
            UICtrl.clearInputFields();
        }

        e.preventDefault();
    }

    //Create update item submit (itemUpdateSubmit) Definition
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();

        //Update item in Data structure
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        //Update item in the UI
        UICtrl.updateListItem(updatedItem);

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Also Update item in local Storage
        StorageCtrl.updateItemStorage(updatedItem);
        
        //Remove from edit state
        UICtrl.clearEditState();


        e.preventDefault();
    }

    // Create delete item submit function definition
    const itemDeleteSubmit = function(e){
        // Get current item to delete
        const currentItem = ItemCtrl.getCurrentItem();

        //First Delete current item from Data structure using it's ID
        ItemCtrl.deleteItem(currentItem.id);

        //Then Delete current item from UI controller
        UICtrl.deleteListItem(currentItem.id);

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete item form local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        
        //Remove from edit state
        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    //Create clear-All-Items-Click function/ Definition
    const clearAllItemsClick = function(){
        //First clear all items from the Data Structure
        ItemCtrl.clearAllItems();

        //Then remove all list items from the UI
        UICtrl.removeAllItems();

        //Also clear items from local storage
        StorageCtrl.clearAllItemsFromStorage();

        //Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();

        //Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Hide <ul> element
        UICtrl.hideUlElementList();
    }

    // Create Edit-Item-Click (itemEditClick) Definition
    const itemEditClick = function(e){
        if (e.target.classList.contains('edit-item')) {
            //Get list item id (item-0, item-1, etc)
            const listId = e.target.parentNode.parentNode.id;

            //Break listId into an array
            const listIdArr = listId.split('-');

            //Get the Actual list id
            const id = parseInt(listIdArr[1]);

            //Get the item to edit
            const itemToEdit = ItemCtrl.getItemById(id);

            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add edit item to form field
            UICtrl.addEditItemToForm();
        }
        e.preventDefault();
    }
    //Public Methods
    return {
        init: function(){
            // Clear edit state/ set initial state
            UICtrl.clearEditState();

            //fetch items from data structure
            const items = ItemCtrl.getData();

            // Check to see if there is any item(s)
            if (items.length === 0) {
                //hide ul list 
                UICtrl.hideUlElementList();    
            } else {
                //Populate list with items
                UICtrl.populateItemList(items); 
            }
            //Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            //LoadEvent Listeners
            loadEventListener();
        }
        
    }
})(ItemCtrl, StorageCtrl, UICtrl);


AppCtrl.init();