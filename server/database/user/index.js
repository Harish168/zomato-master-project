import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required:true },
    email: { type: String, required:true },
    password: { type: String },
    address: [{ detail: { type:String }, for: { type: String } }],
    phoneNumber: [{ type:Number }],
  },
  {
    timestamps: true, // it will show when object createAt,updateAt
  },
);

//generate JWT auth token(if new user)
UserSchema.methods.generateJwtToken = function(){
  return jwt.sign({ user: this._id.toString()}, "ZomatoAPP");
}

//statics is same as method(func).By using statics findByEmailAndPhone is directly assign to userModel(need to initialize with variable in statics)
//method eg: const userCheck = UserSchema.findBy  
//static eg:  UserSchema.statics.findBy 
UserSchema.statics.findByEmailAndPhone = async ({ email, phoneNumber }) => {
  // check whether email exist
  const checkUserByEmail = await UserModel.findOne({ email });
  const checkUserByPhone = await UserModel.findOne({ phoneNumber });

  if (checkUserByEmail || checkUserByPhone) {
    throw new Error("User Already Exist...!");
  }

  return false;
};

//pre method is used to run function in particular state of mongoose(state: save & create)
//save is used to run while creating new data in database.it is triggered.
//next method is mongoose fn.If we written next then after login done it will execute the next function else it will not execute other function
UserSchema.pre("save", function (next) {
  const user = this;

  // password is modified
  if (!user.isModified("password")) return next();

  // generate bcrypt salt
  bcrypt.genSalt(8, (error, salt) => {
    if (error) return next(error);

    // hash the password
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error);

      // assigning hashed password
      user.password = hash;
      return next();
    });
  });
});

export const UserModel = mongoose.model("Users", UserSchema);