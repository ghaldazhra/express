import express from 'express';

const app = express();

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
  res.send('Error Occured');
});

// -- belajar routing  
const port = 3000;  
app.get('/', (req, res) => {
  res.send('Hello Ghalda!');
});

// -- belajar route parameter
app.get('/say/:greeting', (req, res) => {
    const { greeting } = req.params;
    res.send(greeting);
});

// -- belajar GET method
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  res.send({ id, name: "Lee" });
});

// -- belajar query parameter
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});