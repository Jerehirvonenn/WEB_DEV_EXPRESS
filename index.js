const express = require('express')  // Import Express framework
const { Pool } = require('pg')
const app = express()               // Create instance of Express application
const port = 3000                  // Define the port number where the app will listen for requests


// Middleware that parses incoming JSON requests and makes the data available in req.body
app.use(express.json());

const pool = new Pool({
	user: 'youruser',
	host: 'localhost',
	database: 'tododb',
	password: 'yourpassword',
	port: 5432,
  })


// GET request handler for the root route ('/'), returns the entire todo list
app.get('/', async (req, res) => {
	try {
		const result = await pool.query(`SELECT * FROM todos;`)
		res.json(result)
	} catch(err) {
		console.log(err, hello)  //learn error handling later
	}
})

// POST request handler for creating a new todo item
app.post('/', (req, res) => {
	//req.body holds the sent body. . operator can access spesific values from it
	const todo = req.body.text  // Get the 'text' field from the request body
	const newTodo = {
		id: Date.now(),         // Assign a unique ID using the current timestamp
		text: todo,             // Store the text of the new todo
		completed: false        // Set the initial 'completed' status to false
	}
	
	todoData.push(newTodo)   // Add the new todo to the back of 'todoData' array
	saveDataToFile()         // Save the updated 'todoData' array to 'database.json'
	res.send(todoData)       // Send back the updated list of todos
})
//FROM HERE
// DELETE request handler to delete a todo item by its ID
app.delete('/delete/:id', (req, res) => {
	//req.params hold inside the sent url.
	//example localhost:3000/delete/1 -> where 1 takes place of the specified :id
	const todoId = parseInt(req.params.id)  // Get the 'id' from the request parameters and convert it to an integer

	todoData = todoData.filter((todo) => todo.id !== todoId);  // Remove the todo with the matching 'id' from 'todoData'
	saveDataToFile()      // Save the updated 'todoData' array to 'database.json'
	res.send(todoData)    // Send back the updated list of todos
})

// PUT request handler to update a todo item by its ID
app.put('/todo/:id', (req, res) => {
	const todoId = parseInt(req.params.id)  // Get the 'id' from the request parameters and convert it to an integer
	const newTodo = req.body  // Get the updated fields from the request body

	todoData = todoData.map((todo) => {
		if (todo.id === todoId) {  // If the 'id' matches, update the todo
			return {
				id: todo.id,                      // Keep the original id from the 'todo'
				text: newTodo.text || todo.text,  // Use the new 'text' if provided, otherwise keep the old one
				completed: newTodo.completed !== undefined ? newTodo.completed : todo.completed
				// Use new 'completed' if provided, else keep old value
			  };
		}
		return todo  // If no match, return the todo unchanged
	})
	
	saveDataToFile()  // Save the updated 'todoData' array to 'database.json'
	res.send(todoData)  // Send back the updated list of todos
})

// Start the Express app and listen on the defined port (3000)
app.listen(port, () => {
  console.log(`Hello from port ${port}`)  // Log a message indicating the app is running
})