import express from 'express';
import notesRouter from './routes/notes.js'; 
import mongoose from 'mongoose';

// -- connect to MongoDB
// mongoose.connect('mongodb+srv://ghaldazhra1_db_user:ghalda2513@cluster0.pfofhgy.mongodb.net/?appName=Cluster0')
mongoose.connect('mongodb://ghaldazhra1_db_user:ghalda2513@ac-huxnyth-shard-00-00.pfofhgy.mongodb.net:27017,ac-huxnyth-shard-00-01.pfofhgy.mongodb.net:27017,ac-huxnyth-shard-00-02.pfofhgy.mongodb.net:27017/?ssl=true&replicaSet=atlas-5w9vk0-shard-0&authSource=admin')
.then(() => {
  console.log('Connected to MongoDB');
  const testdb = 'Hello MongoDB';
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  const testdb = `Failed to connect to MongoDB: ${error.message}`;
});

const app = express();
app.use(express.json()); 
app.use("/notes", notesRouter); 

// -- belajar routing  
const port = 3000;  
// app.get('/', (req, res) => {
//   res.send('Hello Ghalda!' + testdb);
// });
app.get('/', (req, res) => {
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const status = mongoose.connection.readyState;
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting"
  };

  res.send(`Hello Ghalda! Status Database: ${statusMap[status]}`);
});

// -- belajar route parameter
app.get('/say/:greeting', (req, res) => {
    const { greeting } = req.params;
    res.send(greeting);
});

// -- belajar GET method
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send(`User ID: ${id}, Name: Lee`);
});

app.get("/ghalda", (req, res) => {
  const { ghalda } = req.query;
  res.send(`HIHIHI GHAL ${ghalda}`);
});

app.get("/auth", (req, res) => {
  res.status(401).send("Unauthorized access");
});

// -- belajar POST method
app.post("/hello", (req, res) => {
  res.send("This is POST method!");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;  

  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }

  if(username === "lee leo" && password === "123456"){
    return res.status(200).send("Login successful");
  }

  return res.status(401).send("Invalid username or password");
});

// -- belajar middleware
app.use((req, res, next) => {     
  console.log(`req baruu: ${req.path}`); 
  next();
});

// -- error handling middleware
app.use((req, res, next) => {
if(false){ 
    next(new Error('Not Authorized'));
    return;
  }   
next();
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send(err.message);
});

// -- belajar query parameter
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});