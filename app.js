// Local Storage controller

// -- ITEM CONTROLLER --
const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / State
  // Data is private, we use the module pattern
  const data = {
    items: [
      // { id: 0, name: 'Steak Dinner', calories: 900 },
      // { id: 1, name: 'Cookie', calories: 400 },
      // { id: 2, name: 'Eggs', calories: 300 }
    ],
    // when we click the update icon next to an item, the item will become the
    // current item and will be put in the form to be updated
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Parse calories as a number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // Loop through items and add each calorie count to total
      data.items.forEach(function(item) {
        total += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = total;

      // Return total calories
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  };
})();

// -- UI CONTROLLER --
const UICtrl = (function() {
  // Define one-time selectors for HTML elements
  const UISelectors = {
    itemList: '#item-list', // Grab the ul where we insert the li items
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  };

  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
         </li>
        `;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // Make sure to unhide the ul
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class to li
      li.className = 'collection-item';
      // Add ID to li
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `
          <strong>${item.name}: </strong><em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// -- APP CONTROLLER --
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Show total calories in the UI
      UICtrl.showTotalCalories(totalCalories);

      // Clear form fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Public methods
  return {
    init: function() {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items, if not hide ul
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }
      // !-- Get and show calories from persisted data in the LS (TODO)
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total calories in the UI
      UICtrl.showTotalCalories(totalCalories);
      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

// Initialize app (edit state is clear, call getItems method)
App.init();
