import { Router } from "express";
import { TokenBlackList, User } from "..";
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

authRouter.post("/change-password", checkToken, async (req, res) => {
    const { currentPassword, passwordConfirmation, password } = req.body;
    if (passwordConfirmation !== password) {
        res.status(400).json("New passwords do not match");
    }
    else if(passwordConfirmation.length < 6){
        res.status(400).json("New password must be at least 6 characters long")
    }
    else {
        const decoded = jwt.decode(req.token!) as DecodeToken
        const user = await User.findOne({ where: { id: decoded.id } });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.dataValues.password);
            if (isPasswordCorrect) {
                const hashedPassword = await bcrypt.hash(passwordConfirmation, parseInt(process.env.SALT_ROUNDS!));
                await user.update({ password: hashedPassword });
                res.json("Password changed");
            }
            else {
                res.status(400).json("Current password is incorrect");
            }
        }
        else {
            res.status(404).json("User not found");
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