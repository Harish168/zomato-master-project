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
      const { email, password, fullname, phoneNumber } = req.body.credentials;

      //check whether email exists
      const checkUserByEmail = await UserModel.findOne({ email });  //both key&value same so { email: email } => {email}
      const checkUserByPhone = await UserModel.findOne({ phoneNumber });  //both key&value same so { email: email } => {email}
      if(checkUserByEmail || checkUserByPhone){
        return res.json({ error: "User already exists!"});
      }

      //hash the password (password encrypt)
      //if salt(8).It will encrypt again and again for 8times(if salt is more then it will more secure but it affect performance becz it use cpu for encrypt)
      const bcryptsalt = await bcrypt.gensalt(8);      
      const hashedPassword = await bcrypt.hash(password, bcryptsalt);

      //save to DB
      await UserModel.create({
        ...req.body.credentials,
        password: hashedPassword,
      });

      //generate JWT auth token(if new user)
      const token = jwt.sign({ user: {fullname, email }}, "ZomatoAPP");
      
      //return
      return res.status(200).json({ token, status:"success" });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
});

export default Router;