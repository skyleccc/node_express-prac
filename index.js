const express = require("express"); // importing express

const app = express(); // create an instance of an express server
const port = 3000;

const routes = require("./routes");
app.use(express.json()); // use express.json to handle json requests

app.use("/notes", routes.notesRoutes);
app.use("/user", routes.userRoutes);

app.listen(port, () => {
  console.log("Server is running on port 3000");
}); // node index.js in terminal

// users
// settings
// chats
// notes
