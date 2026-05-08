import Client  from './config/pgManager.js';
import express from 'express';
import createTables from './config/schema.js';
import investorRoute from './routes/investorRoutes.js';
import mutualRoute from './routes/mutualFundsRoutes.js';
import sipRoute from './routes/sipInstallmentRoutes.js';

const app=express();
app.use(express.json());

//await createTables();

app.use('/api/investor',investorRoute);
app.use('/api/mutual',mutualRoute);
app.use('/api/sip',sipRoute);
app.listen(5255,()=>{
    console.log("Server is running in port 5255");
})