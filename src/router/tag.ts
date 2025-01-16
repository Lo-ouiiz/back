import { Router } from "express";
import { Tag } from "..";
import { checkToken } from "../middlewares/checkToken";

export const tagRouter = Router();

tagRouter.post("/", checkToken, async (req, res) => {
    const { tag } = req.body;
    if(!tag){
        res.status(400).send("Missing required information");
    }
    else {
        const newTag = await Tag.create({ tag });
        res.json(newTag);
    }
});