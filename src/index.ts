import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes} from "sequelize";

import { UserModel} from "./model/User";
import { MielModel} from "./model/Miel";
import { TagModel } from "./model/Tag";
import { TokenBlackListModel } from "./model/TokenBlackList";

import { authRouter } from "./router/auth";
import { mielRouter } from "./router/miel";
import { tagRouter } from "./router/tag";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

export const User = UserModel(sequelize);
export const Miel = MielModel(sequelize);
export const Tag = TagModel(sequelize);
export const TokenBlackList = TokenBlackListModel(sequelize);

Miel.belongsToMany(Tag, { through: 'tagMiel' });
Tag.belongsToMany(Miel, { through: 'tagMiel' });

// sequelize.sync({ force: true });
sequelize.sync();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
app.use('/', authRouter);
app.use('/miels', mielRouter);
app.use('/tags', tagRouter);

//app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
