import { Router } from "express";
import { Tag } from "..";
import { checkToken } from "../middlewares/checkToken";

export const tagRouter = Router();

tagRouter.get("/", checkToken, async (req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

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

tagRouter.get("/:id", checkToken, async (req, res) => {
    const tag = await Tag.findOne({ where: { id: req.params.id } });
    if (tag) {
        res.json(tag);
    }
    else {
        res.status(404).send("Tag not found");
    }
});

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

tagRouter.put("/:id/prix/10", checkToken, async (req, res) => {
    const { tag } = req.body;
    const actual = await Tag.findOne({ where: { id: req.params.id } });
    if (actual) {
        const newTag = await actual.update({ tag });
        res.json(actual);
    }
    else {
        res.status(404).send("Tag not found");
    }
});

tagRouter.delete("/:id", checkToken, async (req, res) => {
    const actual = await Tag.findOne({ where: { id: req.params.id } });
    if (actual) {
        await actual.destroy();
        res.send("deleted");
    }
    else {
        res.status(404).send("Tag not found");
    }
});