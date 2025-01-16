import { Router } from "express";
import { Miel } from "..";
import { checkToken } from "../middlewares/checkToken";

export const mielRouter = Router();

mielRouter.get("/", checkToken, async (req, res) => {
    const miels = await Miel.findAll();
    res.json(miels);
});

mielRouter.get("/:id", checkToken, async (req, res) => {
    const miel = await Miel.findOne({ where: { id: req.params.id } });
    if (miel) {
        res.json(miel);
    }
    else {
        res.status(404).send("Game not found");
    }
});

mielRouter.post("/", checkToken, async (req, res) => {
    const { name, number, image } = req.body.data;
    if(!name || !number || !image){
        res.status(400).send("Missing required information");
    }
    else {
        const newMiel = await Miel.create({ name, number, image });
        res.json(newMiel);
    }
});

mielRouter.put("/:id", checkToken, async (req, res) => {
    const { name, number, image } = req.body.data;
    const actual = await Miel.findOne({ where: { id: req.params.id } });
    if (actual) {
        const newMiel = await actual.update({ name, number, image });
        res.json(actual);
    }
    else {
        res.status(404).send("Game not found");
    }
});

mielRouter.delete("/:id", checkToken, async (req, res) => {
    const actual = await Miel.findOne({ where: { id: req.params.id } });
    if (actual) {
        await actual.destroy();
        res.send("deleted");
    }
    else {
        res.status(404).send("Game not found");
    }
});