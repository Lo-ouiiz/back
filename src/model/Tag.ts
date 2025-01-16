import { DataTypes, Sequelize } from "sequelize";

export const TagModel = (sequelize: Sequelize) => {
    return sequelize.define('tag',{
        tag: DataTypes.STRING,
    })
}