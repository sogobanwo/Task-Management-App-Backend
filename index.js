// import express
const express = require('express');
const app = express();

//Parse URL-encoded bodies - Allows
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// import cors
var cors = require('cors');
app.use(cors());

// import the harperdb instance
const db = require('./dbconfig');

// set your preferred server port
const port = 8080;

// 1. create your post route that handles creating new item item
app.post('/add', async (req, res) => {
  // 2. retrieve the item from req.body
  // 3. Validate the item to nsure the user does not submit an empty form
  if (!req.body.item || req.body.item === '') {
    res.status(400).send('item is required');
  } else {
    // 4. prepare the item in an object
    const option = {
      item: req.body.item,
      isCompleted: false,
    };
    // 5. ensure to catch the error using try/catch
    try {
      // 6. if the item is not empty
      const response = await db.insert({
        table: 'items',
        records: [option],
      });

      // 7. notify the frontend or sender with the success response
      res.status(200).send(response);
    } catch (error) {
      // 7. notify the frontend or sender with the error response
      res.status(500).send(error);
    }
  }
});

// 1. Route to retrieve all todos in the database
app.get("/todos/:id", async (req, res)=> {

  // 2. Use try/catch to control errors
  try{
  // 3. use searchByHash method to get the matching id item
  const response = await db.searchByHash({
    table:"items",
    hashValues: [req.params.id],
    attributes: ["id", "item", "isCompleted"],
  });
  // 4. send success message to the frontend
  res.status(200).send(response.data);
  }catch (error){
    // 4. send success message to the frontend
    res.status(500).send("something went wrong");
  }
});



// 1. route to retrieve all todos in the database
app.get('/todos', async (req, res) => {
  // 2. use try/catch to control errors
  try {
    // 3. use query method to get all item from the database table
    const response = await db.query('SELECT * FROM todos.items');
    // 4. send success message to the frontend
    res.status(200).send(response.data);
  } catch (error) {
    // 4. send error message to the frontend
    res.status(500).send('something went wrong');
  }
});

// 1. route to update a item
app.post('/edit', async (req, res) => {
  // 2. set the updated item and specify the item identifier - hash attribute
  const option = {
    id: req.body.id,
    item: req.body.item,
    status: req.body.status,
  };
  // 3. use try/catch to control errors
  try {
    // 4. send the updated item
    const response = await db.update({
      table: 'items',
      records: [option],
    });
    // 5. send success message to the frontend
    res.status(200).send(response);
  } catch (error) {
    // 5. send error message to the frontend
    res.status(500).send(error);
  }
});

app.patch("/todos/:item_id", async (req, res) => {
  try{
    const response1 = await db.searchByHash({
      table: "items",
      hashValues: [req.params.item_id],
      attributes: ["isCompleted"],
    });

    const currentIsCompleted = response1.data[0].isCompleted;

    const option = {
      id: req.params.item_id,
      isCompleted: !currentIsCompleted,
    };

    const response2 = await db.update({
      table: "items",
      records: [option],
    });

    res.status(200).send(response2);
  } catch(error){
    res.status(500).send(error);
  }
});

// 1. route to delete a todo using its id
app.post('/delete/:todo_id', async (req, res) => {
  // 2. get the id from the url parameter
  const { todo_id } = req.params;
  // 3. use try/catch to control errors
  try {
    // 4. Send a delete request to the database
    const response = await db.delete({
      table: 'items',
      hashValues: [todo_id],
    });

    // 5. send success message to the frontend
    res.status(200).send(response);
  } catch (error) {
    // 5. send error message to the frontend
    res.status(500).send(error);
  }
});

app.get('/', async (req, res) => {
  res.send('Hello world')
})


// just a notification in the console
app.listen(port, () => {
  console.log(`Your server ⚡ is running 🏃‍♂️ item on http://localhost:${port}`);
});