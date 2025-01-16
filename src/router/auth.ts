import { Router } from "express";
import { Miel, TokenBlackList, User } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { DecodeToken, checkToken } from "../middlewares/checkToken";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    
    const userWithEmail = await User.findOne({ where: { username: username } });
    if (userWithEmail) {
        res.status(400).json("User already exists");
    }
    else {
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));
        const newUser = await User.create({ username: username, password: hashedPassword });
        delete newUser.dataValues.password;
        res.json(newUser);
    }
});

authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userWithLogin = await User.findOne({ where: { username: username } });
    if (!userWithLogin) {
        res.status(400).json("Email or Password is incorrect");
    }
    else {
        const isPasswordCorrect = await bcrypt.compare(password, userWithLogin.dataValues.password);
        if (isPasswordCorrect) {
            delete userWithLogin.dataValues.password;
            const token = jwt.sign(userWithLogin.dataValues, process.env.JWT_SECRET!);
            res.json({letoken: token});
        }
        else {
            res.status(400).json("Email or Password is incorrect");
        }
    }
})

authRouter.post("/logout", checkToken, async (req, res) => {
    const decoded = jwt.decode(req.token!) as DecodeToken
    const user = await User.findOne({ where: { id: decoded.id } });
    if (user) {
        await TokenBlackList.create({ token: req.token });
        res.json("Logged out");
    }
    else {
        res.status(404).json("User not found");
    }
})