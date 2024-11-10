const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const express = require('express');
const router = express.Router();
const User=require('./models/Users')
router.post('/',async(req,res)=>{
    const {email,password}=req.body;
    
    try
    {
        const user=await User.findOne({email});
       
        if(!user)
            return res.json({error:"User does not exist"});
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.json({error:"Invalid Password"});
        const token=jwt.sign({id:user._id},process.env.Secret_Key);
        const id=user._id;
        return res.json({token,id});
    }
    catch(err)
    {
        res.json({err});
    }
})
module.exports=router;