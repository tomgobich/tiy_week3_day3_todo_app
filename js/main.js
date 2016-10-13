$(document).ready(function() {

	// Constants
	const VIEW_STATE_ALL		= 'show-all';
	const VIEW_STATE_ACTIVE		= 'show-active';
	const VIEW_STATE_COMPLETED 	= 'show-completed';

	//------------------------------------------------------------
	// toDo Object Constructor Function
	//------------------------------------------------------------
	function toDo(task)
	{
		this.id 			= Date.now() + Math.floor(Math.random(2000));
		this.task 			= task;
		this.isCompleted 	= false;
	}

	// Holds all toDo objects
	var toDos = [];

	// Show what's in local storage on reload
	if(JSON.parse(localStorage.getItem('toDos')))
	{ 
		// Load toDos from local storage
		toDos = loadFromLocalStorage('toDos');

		// Display to do tasks
		displayToDo();
	}



	//------------------------------------------------------------
	//------------------------------------------------------------
	//
	// Adding ToDo Task
	//
	//------------------------------------------------------------
	//------------------------------------------------------------
	
	// Event Listener for toDoForm
	$('#toDoForm').on('submit', function(e)
	{
		// Prevent form from submitting & refreshing page
		e.preventDefault();

		// Get current view state
		var viewState = loadFromLocalStorage('viewState');

		// Is view state completed?
		if(viewState === VIEW_STATE_COMPLETED)
		{
			// Yes, show active (allows user to see newly added item)
			saveInLocalStorage('viewState', VIEW_STATE_ACTIVE);
		}

		// Create new todo
		createNewToDo();
	});



	//------------------------------------------------------------
	// Creates a new toDo object, and pushes it onto toDos array
	//------------------------------------------------------------
	function createNewToDo()
	{
		var $task = $('.new-todo');

		// Create new toDo item
		var toDoItem = new toDo($task.val());

		// Push into ToDo array
		toDos.push(toDoItem);

		// Add array to local storage
		saveInLocalStorage('toDos', toDos);

		// Clear value
		$task.val('');

		// Display todos
		displayToDo();
	}



	//------------------------------------------------------------
	// Saves an item in local storage
	//------------------------------------------------------------
	function saveInLocalStorage(name, value)
	{
		localStorage.setItem(name, JSON.stringify(value));
	}



	//------------------------------------------------------------
	// Returns an item from local storage
	//------------------------------------------------------------
	function loadFromLocalStorage(name)
	{
		return JSON.parse(localStorage.getItem(name));
	}



	//------------------------------------------------------------
	// Displays and refreshes all toDos
	//------------------------------------------------------------
	function displayToDo()
	{
		var $items 		= $('.items');
		var viewState 	= loadFromLocalStorage('viewState');

		// Empty out old items from task list
		$items.empty();

		// Update current number of incomplete tasks
		displayIncompleteTaskCount();

		// Get current dataSet based off current view state
		dataSet = changeViewState(viewState);

		// Loops through each task in toDos array
		dataSet.forEach(function(task)
		{
			// Gets HTML to display for task
			var toDoHTML = getToDoHTML(task);

			// Displays task
			$items.append(toDoHTML);
		})
	}



	//------------------------------------------------------------
	// Display number of incomplete tasks
	//------------------------------------------------------------
	function displayIncompleteTaskCount()
	{
		var incompleteTasks = filterTasksByCompletionStatus(false); 
		var incompleteTaskCount = incompleteTasks.length;

		$('.incomplete-items').text(incompleteTaskCount);
	}



	//------------------------------------------------------------
	// Prepares HTML for todo item for display
	//------------------------------------------------------------
	function getToDoHTML(task)
	{
		var toDoHTML = null;

		// Is the task incomplete?
		if(!task.isCompleted)
		{
			// Yes, use this li block
			toDoHTML =
			`
				<li>
                    <article id="${task.id}">
                        <button class='check'></button>
                        <p>${task.task}</p>
                        <input type='text' class='edit-todo' value='learn html'>
                        <button class='delete'>X</button>
                    </article>
                </li>
			`;
		}
		else
		{
			// No, it's completed so use this li block
			toDoHTML =
			`
				<li>
                    <article id="${task.id}" class='completed'>
                        <button class='check'></button>
                        <p class='complete'>${task.task}</p>
                        <input type='text' class='edit-todo' value='learn css'>
                        <button class='delete'>X</button>
                    </article>
                </li>
			`;
		}

		return toDoHTML;
	}



	//------------------------------------------------------------
	//------------------------------------------------------------
	//
	// Marking ToDo Task Complete / Incomplete
	//
	//------------------------------------------------------------
	//------------------------------------------------------------

	// Event Listener for check class
	$('body').on('click', '.check', function()
	{
		var self = this;

		// Collects array of incomplete / completed tasks and separates them into 2 variables
		var incompleteTasks = filterTasksByCompletionStatus(false);
		var completedTasks 	= filterTasksByCompletionStatus(true);

		// Does parent have class 'completed'?
		if($(self).parent().hasClass('completed'))
		{
			// Yes, switch task to incomplete
			setTaskStatus(self, completedTasks, false);
		}
		else
		{
			// No, switch task to complete
			setTaskStatus(self, incompleteTasks, true);
		}

		// Save to local storage
		saveInLocalStorage('toDos', toDos);

		// Update todo's on HTML
		displayToDo();
	});



	//------------------------------------------------------------
	// Filters tasks from toDos array based on completion
	//------------------------------------------------------------
	function filterTasksByCompletionStatus(isCompleted)
	{
		// Filter tasks from toDos array based on completion
		var tasksToReturn = toDos.filter(function(task)
		{
			return task.isCompleted === isCompleted;
		});

		// Return filtered tasks
		return tasksToReturn;
	}



	//------------------------------------------------------------
	// Updates a tasks completion status in task's object
	//------------------------------------------------------------
	function setTaskStatus(self, arrayToLoop, isCompleted)
	{
		// Get id from article
		var selfId = $(self).closest('article').attr('id');

		// Loop through passed in array
		arrayToLoop.forEach(function(task)
		{
			// Search for id match on article and object
			if(selfId == task.id)
			{
				// Mark task with passed in completion status
				task.isCompleted = isCompleted;
			}
		});
	}



	//------------------------------------------------------------
	//------------------------------------------------------------
	//
	// Delete a task
	//
	//------------------------------------------------------------
	//------------------------------------------------------------

	// Event Listener for 'delete' class
	$('body').on('click', '.delete', function()
	{
		var self = this;

		// Get id from article
		var selfId = $(self).closest('article').attr('id');

		// Loop through toDos array
		toDos.forEach(function(task, index)
		{
			// Search for id match on article and object
			if(selfId == task.id)
			{
				// Delete matched index from toDos array
				toDos.splice(index, 1);
			}
		});

		saveInLocalStorage('toDos', toDos);

		// Update todo's on HTML
		displayToDo();
	});



	//------------------------------------------------------------
	//------------------------------------------------------------
	//
	// Switch View State (All | Active | Completed)
	//
	//------------------------------------------------------------
	//------------------------------------------------------------

	// Event Listener for 'show-all' class
	$('.show-all').on('click', function()
	{
		// Filter task list to view state
		var dataSet = changeViewState(VIEW_STATE_ALL);

		// Display newly setup dataSet
		displayToDo();
	});

	// Event Listener for 'show-active' class
	$('.show-active').on('click', function()
	{
		// Filter task list to view state
		var dataSet = changeViewState(VIEW_STATE_ACTIVE);

		// Display newly setup dataSet
		displayToDo();
	});

	// Event Listener for 'show-completed' class
	$('.show-completed').on('click', function()
	{
		// Filter task list to view state
		var dataSet = changeViewState(VIEW_STATE_COMPLETED);

		// Display newly setup dataSet
		displayToDo();
	});



	//------------------------------------------------------------
	// Changes the view state of tasks (All | Active | Completed)
	//------------------------------------------------------------
	function changeViewState(state)
	{
		var dataSet = null;

		// Remove active class from previously active view state
		$('footer .active').removeClass('active');

		// Determine dataset
		switch(state)
		{
			case VIEW_STATE_ACTIVE:

				// Filter toDos by false completion status
				dataSet = filterTasksByCompletionStatus(false);
				
				// Add active class to new view state
				$('.show-active').addClass('active');

				break;

			case VIEW_STATE_COMPLETED:

				// Filter toDos by true completion status
				dataSet = filterTasksByCompletionStatus(true);

				// Add active class to new view state
				$('.show-completed').addClass('active');

				break;

			default:

				// Default to show all toDos
				dataSet = toDos;

				// Add active class to new view state
				$('.show-all').addClass('active');

				break;
		}

		saveInLocalStorage('viewState', state);

		return dataSet;
	}
	
	


});