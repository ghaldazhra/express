import express from 'express';

const app = express();

app.use((req, res, next) => {       // Middleware untuk mencetak path setiap kali ada permintaan masuk //
  console.log(`req baruu: ${req.path}`); 
  next();
});

const port = 3000;  
app.get('/', (req, res) => {
  res.send('Hello Ghalda!');
});

app.get('/say/:greeting', (req, res) => {
    const { greeting } = req.params;
    res.send(greeting);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});