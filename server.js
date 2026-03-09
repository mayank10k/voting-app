const express=require('express')    
const app = express()
const db=require('./db')
  
require('dotenv').config();
app.use(express.json());   
const PORT=process.env.PORT || 3000;

const userRoutes=require('./routes/userRoutes');

app.use('/user',userRoutes);

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000')
})