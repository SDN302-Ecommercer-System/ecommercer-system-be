import express from 'express'
import * as dotenv from 'dotenv'
import mainRoute from './routes/index.js'
import cors from 'cors'

dotenv.config();

const app = express()

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1', mainRoute);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`)
})






