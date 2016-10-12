$(document).ready(function() {

	//------------------------------------------------------------
	// toDo Object Constructor Function
	//------------------------------------------------------------
	function toDo(task, isCompleted)
	{
		this.id 			= Date.now() + Math.floor(Math.random(2000));
		this.task 			= task;
		this.isCompleted 	= isCompleted;
	}

	// Holds all toDo objects
	var toDos = [];



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
		var toDoItem = new toDo($task.val(), false);

		// Push into ToDo array
		toDos.push(toDoItem);

		// Clear value
		$task.val('');

		// Display todos
		displayToDo();
	}



	//------------------------------------------------------------
	// Displays and refreshes all toDos
	//------------------------------------------------------------
	function displayToDo()
	{
		var $items = $('.items');

		// Empty out old items from task list
		$items.empty();

		// Loops through each task in toDos array
		toDos.forEach(function(task, index)
		{
			// Gets HTML to display for task
			var toDoHTML = getToDoHTML(task);

			// Displays task
			$items.append(toDoHTML);
		})
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
		var incompleteTasks = filterCompletedTasks(false);
		var completedTasks = filterCompletedTasks(true);

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

		// Update todo's on HTML
		displayToDo();
	});



	//------------------------------------------------------------
	// Filters tasks from toDos array based on completion
	//------------------------------------------------------------
	function filterCompletedTasks(isCompleted)
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
		self = this;

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

		// Update todo's on HTML
		displayToDo();
	});


});