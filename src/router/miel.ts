import { Router } from "express";
import { Miel } from "..";
import { checkToken } from "../middlewares/checkToken";

export const mielRouter = Router();

mielRouter.get("/", checkToken, async (req, res) => {
    // const tagList = req.query['tags'];
    // if (tagList) {
    //     const miels = await Miel.findAll( where: {});
    // } else {
    //     const miels = await Miel.findAll();
    //     res.json(miels);
    // }

    const miels = await Miel.findAll();
    res.json(miels);
});

mielRouter.get("/:id", checkToken, async (req, res) => {
    const miel = await Miel.findOne({ where: { id: req.params.id } });
    if (miel) {
        res.json(miel);
    }
    else {
        res.status(404).send("Honey not found");
    }
});

mielRouter.post("/", checkToken, async (req, res) => {
    const { nom, description, prix } = req.body;
    if(!nom || !description || !prix){
        res.status(400).send("Missing required information");
    }
    else {
        const newMiel = await Miel.create({ nom, description, prix });
        res.json(newMiel);
    }
});

mielRouter.put("/:id/prix/10", checkToken, async (req, res) => {
    const { nom, description, prix } = req.body;
    const actual = await Miel.findOne({ where: { id: req.params.id } });
    if (actual) {
        const newMiel = await actual.update({ nom, description, prix });
        res.json(actual);
    }
    else {
        res.status(404).send("Honey not found");
    }
});

mielRouter.delete("/:id", checkToken, async (req, res) => {
    const actual = await Miel.findOne({ where: { id: req.params.id } });
    if (actual) {
        await actual.destroy();
        res.send("deleted");
    }
    else {
        res.status(404).send("Honey not found");
    }
});