import Decimal from "decimal.js";
import { notation } from "../../util/functions.js";
import { NotationLength } from "../../data/literal.js";
import Upgrade from "../../class/Upgrade.js";

export default new Upgrade({
    name: "DimSacrifice",
    cost(bought){
        return bought.add(1);
    },
    effect(bought) {
        return Decimal.max(1, bought.log(10).floor().div(10)).pow(2);
    },
    canBuy(saveData) {
        return saveData.Dimensions[6].have.gte(1) && saveData.DimBoost.gte(5) && saveData.Dimensions[0].have.gte(saveData.DimSacrifice);
    },
    toString(saveData) {
        return `[ Dimensional Sacrifice (x${notation(this.effect(saveData.Dimensions[0].have).div(this.effect(saveData.DimSacrifice)))}) ]`;
    },
    buy(saveData) {
        if (!this.canBuy(saveData)) return;
        saveData.DimSacrifice = Decimal.max(saveData.DimSacrifice, saveData.Dimensions[0].have);
        for (let i = 0; i < 7; i++) saveData.Dimensions[i].have = new Decimal(0);
    }
});