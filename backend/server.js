const express=require("express");
const app=express();
const dotenv=require("dotenv");
dotenv.config();
app.use(express.json());
const port=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('Hello World');
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
