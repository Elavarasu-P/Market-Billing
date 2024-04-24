const express = require('express');
const path = require('path');
// const mongoose = require('mongoose')
const bodyParser= require('body-parser')
const {UserSignin,AddStock,AddInvoice,GetIncome} = require('./schema.js')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
// parse application/json
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000;
// Serve static files (index.html, images, videos, etc.)
app.use(express.static(path.join(__dirname, 'img')));

// Define a route to serve the index.html file
app.get('/signup', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'signup.html'));

});

app.get('/', (req, res) => {
  
  res.sendFile(path.join(__dirname, 'signup.html'));

});
app.get('/auth', async (req, res) => {
  const { username, password } = req.query; // Use req.query instead of req.params
  
  // console.log({ username, password }, "request"); // Log the received parameters
  const userLogged = await UserSignin(username, password);
  if (userLogged.length > 0) {
    res.redirect('/home');
  } else {
    res.redirect('/signup');
  }
});

app.get('/home',(req,res)=>{
  res.sendFile(path.join(__dirname, 'index.html'));

})
app.get('/staff', (req, res) => {
  res.sendFile(path.join(__dirname, 'invoice.html'));
});
app.get('/stock',(req,res)=>{
  res.sendFile(path.join(__dirname, 'stock.html'));
});
// app.get('/income',(req,res)=>{
//   res.sendFile(path.join(__dirname, 'income.html'));
// });


app.get('/print',(req,res)=>{
  res.send("hello ")
})
app.post('/addStock', async (req, res) => {
  try {
      const data = req.body;

      const addStockPromises = [];

        // Iterate over each item in the data array
        for (let i = 0; i < data.length; i++) {
            const productName = data[i][0];
            const quantity = Number(data[i][1]);
            addStockPromises.push({productName,quantity })
        }

        await AddStock(addStockPromises)

      res.status(200).send('Stock items added successfully');
  } catch (error) {
      console.error('Error adding stock items:', error);
      res.status(500).send('Internal Server Error');
  }
});


app.post('/addInvoice',async(req,res)=>{
  const data = req.body;
  await AddInvoice(data);
  
})
// let totalIncome = 0;
// app.get('/some',(req,res)=>{
//   // res.render
//   res.render('incomeSearch', { totalIncome });
// })
// app.post('/getIncome',async(req,res)=>{
//   const data = req.body;
//   totalIncome =  await GetIncome(data)
//   res.redirect('/some')
//   // res.render('incomeSearch', { totalIncome });
//   // console.log(data)
// })
var totalIncome = 0;
app.get('/some', (req, res) => {
  // Render the template with the totalIncome value
  res.render('incomeSearch', { totalIncome });
});

app.post('/getIncome', async (req, res) => {
  try {
      const data = req.body;
      // Compute the total income
       totalIncome = await GetIncome(data);
      // Redirect to /some with the totalIncome value as a query parameter
      console.log(totalIncome)
      res.redirect(`/some?totalIncome=${totalIncome}`);
  } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


// Assuming you have an Express route to render the template
app.get('/income', (req, res) => {
  const totalIncome = 0; // Get current date in yyyy-mm-dd format
  res.render('incomeSearch', { totalIncome });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
