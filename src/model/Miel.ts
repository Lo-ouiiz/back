import { DataTypes, Sequelize } from "sequelize";

export const MielModel = (sequelize: Sequelize) => {
    return sequelize.define('miel',{
        nom: DataTypes.STRING,
        description: DataTypes.STRING,
        prix: DataTypes.INTEGER
    })
}