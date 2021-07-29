//library
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//models
import { UserModel } from "../../database/user";

const Router = express.Router();
/*
Route     /signup
Des       Register new user
Params    none
Access    Public
Method    POST  
*/
Router.post("/signup", async (req, res) => {
    try {
      
      //check whether user exist or not(check in user folder -> index.js)
      await UserModel.findByEmailAndPhone(req.body.credentials);

      /*Now hashing is done in user folder by using pre method.so only we want to save data to DB
      //hash the password (password encrypt)
    
      //if salt(8).It will encrypt again and again for 8times(if salt is more then it will more secure but it affect performance becz it use cpu for encrypt)
      const bcryptSalt = await bcrypt.genSalt(8);       
      const hashedPassword = await bcrypt.hash(password, bcryptSalt); 

      //save to DB
      await UserModel.create({
        ...req.body.credentials,    //user given remaining data is stored in DB
        password: hashedPassword,   //hashed password stored in DB (not user given password)
      });  */

      //save to DB(pre method is triggered)
      const newUser = await UserModel.create(req.body.credentials);

      //generate JWT auth token
      const token = newUser.generateJwtToken();
      
      //return
      return res.status(200).json({ token, status:"success" });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
});

export default Router;