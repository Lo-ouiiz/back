import { Router } from "express";
import { Miel, TokenBlackList, User } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { DecodeToken, checkToken } from "../middlewares/checkToken";

export const authRouter = Router();

authRouter.post("/creer", async (req, res) => {
    const { nom_utilisateur, mdp } = req.body;
    
    const userWithEmail = await User.findOne({ where: { username: nom_utilisateur } });
    if (userWithEmail) {
        res.status(400).json("User already exists");
    }
    else {
        const hashedPassword = await bcrypt.hash(mdp, parseInt(process.env.SALT_ROUNDS!));
        const newUser = await User.create({ username: nom_utilisateur, password: hashedPassword });
        delete newUser.dataValues.password;
        res.json(newUser);
    }
});

authRouter.post("/me-connecter", async (req, res) => {
    const { nom_utilisateur, mdp } = req.body;
    const userWithLogin = await User.findOne({ where: { username: nom_utilisateur } });
    if (!userWithLogin) {
        res.status(400).json("Email or Password is incorrect");
    }
    else {
        const isPasswordCorrect = await bcrypt.compare(mdp, userWithLogin.dataValues.password);
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