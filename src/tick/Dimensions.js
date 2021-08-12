import Decimal from "decimal.js";
import { notation } from "../util/functions.js";
import SaveData from "../data/saveData.js"

import {
    Dimensions,
    Tickspeed,
    DimensionBoost,
    DimensionSacrifice,
    AntimatterGalaxy
} from "../upgrades/_init.js";

/**
 * @param {number} dt 
 * @param {SaveData} saveData 
 * @param {string[]} buttonFunc 
 * @returns { {message: string[], components: object[]} }
 */
export default function(dt, saveData, buttonFunc) {
    const MaxDimensionTier = DimensionBoost.costDimTier(saveData.DimBoost)+1;
    let UnlockedDims = [1];

    for (let Tier = 7-1; Tier >= 0; Tier--) {
        if (
            saveData.Dimensions[Tier].bought.gte(1) &&
            Tier+2 <= MaxDimensionTier
        ) UnlockedDims.push(Tier+2);
    }
    UnlockedDims.sort((a, b) => a-b);

    // Compute buttonFunc
    for (let i = 0; i < buttonFunc.length; i++) {
        /** @type {string[]} */
        const rawFunc = buttonFunc[i].split("_");

        const funcName = rawFunc.shift();
        const funcParam = rawFunc;
        switch (funcName) {
            case "BuyMax":
                for (let i = 0; i < MaxDimensionTier; i++) Dimensions[i].buy(saveData, true);
                if (UnlockedDims.includes(3)) Tickspeed.buy(saveData, true);
                break;
            case "BuyDimension":
                Dimensions[+funcParam[0] - 1].buy(saveData, false);
                break;
            case "BuyTickspeed":
                Tickspeed.buy(saveData, false);
                break;
            case "BuyDimBoost":
                DimensionBoost.buy(saveData);
                break;
            case "BuyDimensionSacrifice":
                DimensionSacrifice.buy(saveData);
                break;
            case "BuyAntimatterGalaxy":
                AntimatterGalaxy.buy(saveData);
                break;
        }
    }

    // ComputeTick
    for (let Tier = 7-1; Tier >= 0; Tier--) {
        const _DimData = saveData.Dimensions[Tier];
        _DimData.have = _DimData.have.add(
            Dimensions[Tier+1].production(saveData).mul(dt)
        );
    }
    const AntimatterProduction = Dimensions[0].production(saveData);
    saveData.Antimatter = saveData.Antimatter.add(AntimatterProduction.mul(dt));

    // Display
    let output = [];
    output.push(`You have ${notation(saveData.Antimatter)} Antimatters (+${notation(AntimatterProduction)}/s)`);
    if (UnlockedDims.includes(3)) output.push(Tickspeed.toString(saveData));
    else output.push("");
    if (saveData.DimBoost.gte(5)) output.push(DimensionSacrifice.toString(saveData));
    else output.push("");
    output.push("");
    for (let i = 0; i < 8; i++) {
        if (UnlockedDims.includes(i+1)) output.push(Dimensions[i].toString(saveData, Dimensions));
        else output.push("");
    }
    output.push("");
    output.push(DimensionBoost.toString(saveData));
    output.push(AntimatterGalaxy.toString(saveData));
    output.push("");
    const progress = Decimal.max(0, saveData.Antimatter.log(10)).div(new Decimal(2).pow(1024).log(10)).toNumber();
    const progressBarLength = 60;
    let progressBar = ("=".repeat(Math.min(progressBarLength, Math.floor(progress*progressBarLength))) + "-".repeat(Math.max(0, Math.ceil((1-progress)*progressBarLength))));
    progressBar = progressBar.substr(0, progressBarLength/2-3) + (progress*100).toFixed(2).padStart(5, "-") + "%" + progressBar.substr(progressBarLength/2+3);
    output.push(progressBar);

    // Compnents
    let components = [];

    if (UnlockedDims.includes(3) || saveData.DimBoost.gte(5) || saveData.AntimatterGalaxy.gte(1)) {
        const canAffordTick = Tickspeed.canBuy(saveData);

        components.push({
            type: "ACTION_ROW",
            components: [
                {
                    type: "BUTTON",
                    custom_id: "BuyTickspeed",
                    label: "Tick",
                    disabled: !canAffordTick,
                    style: canAffordTick ? "SUCCESS" : "DANGER"
                },
                {
                    type: "BUTTON",
                    custom_id: "BuyMax",
                    label: "Max",
                    style: "PRIMARY"
                }
            ]
        });
    }
    const DimensionsBtn = (saveData.DimBoost.gte(5) || saveData.AntimatterGalaxy.gte(1) ? Array.from({ length: 8 }, (_, i) => i+1) : UnlockedDims).map(e => {
        const canAfford = Dimensions[e-1].canBuy(saveData);
        return {
            type: "BUTTON",
            custom_id: "BuyDimension_"+e,
            label: "D"+e,
            disabled: !canAfford,
            style: canAfford ? "SUCCESS" : "DANGER"
        }
    });
    components.push({
        type: "ACTION_ROW",
        components: DimensionsBtn.slice(0, 5)
    });
    if (DimensionsBtn.length > 5) components.push({
        type: "ACTION_ROW",
        components: DimensionsBtn.slice(5, 10)
    });
    let bottomBtns = [];
    bottomBtns.push({
        type: "BUTTON",
        custom_id: "BuyDimBoost",
        label: "DShift",
        disabled: !DimensionBoost.canBuy(saveData),
        style: DimensionBoost.canBuy(saveData) ? "SUCCESS" : "DANGER"
    });
    bottomBtns.push({
        type: "BUTTON",
        custom_id: "BuyAntimatterGalaxy",
        label: "Galaxy",
        disabled: !AntimatterGalaxy.canBuy(saveData),
        style: AntimatterGalaxy.canBuy(saveData) ? "SUCCESS" : "DANGER"
    });
    if (saveData.DimBoost.gte(4)) bottomBtns.push({
        type: "BUTTON",
        custom_id: "BuyDimensionSacrifice",
        label: "DSacrifice",
        disabled: !DimensionSacrifice.canBuy(saveData),
        style: DimensionSacrifice.canBuy(saveData) ? "SUCCESS" : "DANGER"
    });
    components.push({
        type: "ACTION_ROW",
        components: bottomBtns
    });

    return {
        message: output,
        components
    }
}