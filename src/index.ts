import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes} from "sequelize";

import { UserModel} from "./model/User";
import { MielModel} from "./model/Miel";
import { TokenBlackListModel } from "./model/TokenBlackList";

import { authRouter } from "./router/auth";
import { mielRouter } from "./router/miel";

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/database.sqlite'
});

export const User = UserModel(sequelize);
export const Miel = MielModel(sequelize);
export const TokenBlackList = TokenBlackListModel(sequelize);

// sequelize.sync({ force: true });
sequelize.sync();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();
app.use('/', authRouter, mielRouter);

//app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
