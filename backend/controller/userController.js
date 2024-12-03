
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userData');

//user registration
const userRegistration = async (req, res) => {
    try {
        const {fullName, emailId, userName, password} = req.body;

        if(!fullName || !emailId || !userName || !password) {
           return res.status(404).send({message:"All fields are required"});
        }
        const existingUser = await userModel.findOne({emailId});
        if(existingUser) {
           return res.status(404).send({message:"Email Already in use"});
        }
        // Generate salt (10 rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const userData = new userModel({
                            fullName,
                            emailId,
                            userName,
                            role:'user',
                            password:hashedPassword
                        });
        const savedData = await userData.save();
        res.status(200).send(savedData);
    }catch(err) {
        res.status(404).send(err);
    }
}

//login user or admin
const login = async (req,res) => {
    try {
        const { emailId, password } = req.body;
        const user = await userModel.findOne({emailId});
        if(!user) {
           return res.status(400).send({ message:"User does not exist" });
        }

        bcrypt.compare(password, user.password, (err, result) => {
                if(err) {
                    return res.status(404).send({ message:"Error comparing passwords" });
                }else if(result) {
                    const token = jwt.sign({email:user.emailId},'secret',{expiresIn: '1hr'});
                    return res.status(200).send({ message:"Login successfull",token:token});
                }else {
                    return res.status(404).send({ message:"Invalid Password" });
                }
        })
        

    }catch(err) {
        res.status(404).send("Error logging in");
    }
}
module.exports = {userRegistration, login};