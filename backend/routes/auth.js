import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "./sendEmail.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "User already existing" });

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(200).json({ message: "User Registered Successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invaild credentails" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },

        })

    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.post("/forget-password", async (req, res) => {
    try{
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000;

    const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    await sendEmail(
        user.email,
        "Password Reset Request",
        `Click here to reset your password: ${resetLink}`
    )

    res.status(200).json({message: "Password reset link sent to your email."});
}catch(error){
    res.status(500).json({message: error.message})
}

})


router.post("/reset-password/:token", async (req,res)=>{
    try{

    const {token}=req.params
    const {newPassword}=req.body

    const user= await User.findOne({
        resetToken: token,
        resetTokenExpiry:{$gt: Date.now() }
    })

    if(!user) return res.status(500).json({message: "invaild or token expired"});

    user.password=await bcryptjs.hash(newPassword,10);
    user.resetToken=null;
    user.resetTokenExpiry=null;
    await user.save();

    res.status(200).json({message: "Password Reset Successfully"})
}catch(error){
    res.status(500).json({message: error.message})
}

})
export default router;

