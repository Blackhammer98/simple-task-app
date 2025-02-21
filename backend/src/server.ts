
import dotenv from "dotenv";
import express  from "express";
import cors from "cors"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/" , (req,res) => {
    res.send ("hello world")
})

const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
})