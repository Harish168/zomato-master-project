//importing env variables
require("dotenv").config();

//library
import express from "express";
import cors from "cors";
import helmet from "helmet";

//microservice Route
import Auth from "./API/Auth";

//DB connection
import ConnectionDB from "./database/connection";

const zomato = express();

//application middleware
zomato.use(express.json());
zomato.use(express.urlencoded({ extended : false }));
zomato.use(helmet());
zomato.use(cors());

//Application Routes
zomato.use("/auth", Auth);

zomato.get("/",(req,res) => {
    res.json({message:"Setup sucess"})
});
zomato.listen(4000, () => 
  ConnectionDB()
   .then(() => console.log("Server is running🚀")) 
   .catch(() => console.log("Server is running, but database connection failed...!!!"))
);