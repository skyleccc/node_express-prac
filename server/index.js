const express = require("express"); // importing express

const app = express(); // create an instance of an express server
const port = 3000;

const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
}

const routes = require("./routes");

app.use(cors(corsOptions));
app.use(express.json()); // use express.json to handle json requests

app.use("/notes", routes.notesRoutes);
app.use("/user", routes.userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); // node index.js in terminal

// users
// settings
// chats
// notes

