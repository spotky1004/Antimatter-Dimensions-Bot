import Discord from "discord.js";
import Decimal from "decimal.js";

import * as SaveLoad from "./util/saveload.js";
import SaveData from "./data/saveData.js";

/**
 * @returns {Discord.MessageOptions} - Display of the Game
 */
export function tick(id, buttonFunc) {
    /** @type {SaveData} */
    const saveData = SaveLoad.load(id);

    const Time = new Date().getTime();
    const dt = (Time - saveData.LastTick)/1000;
    saveData.LastTick = Time;

    const Cache = {
        maxDimensionTier: DimensionBoost.costDimTier(saveData.DimBoost)+1,
        UnlockedDims: [1]
    };

    // Check Unlocked
    for (let Tier = 7-1; Tier >= 0; Tier--) {
        if (
            saveData.Dimensions[Tier].bought.gte(1) &&
            Tier+2 <= Cache.maxDimensionTier
        ) Cache.UnlockedDims.push(Tier+2);
    }
    Cache.UnlockedDims.sort((a, b) => a-b);

    // Compute buttonFunc
    for (let i = 0; i < buttonFunc.length; i++) {
        /** @type {string[]} */
        const rawFunc = buttonFunc[i].split("_");

        const funcName = rawFunc.shift();
        const funcParam = rawFunc;
        switch (funcName) {
            case "BuyMax":
                for (let i = 0; i < Cache.maxDimensionTier; i++) Dimensions[i].buy(saveData, true);
                if (Cache.UnlockedDims.includes(3)) TickSpeedUpgrade.buy(saveData, true);
                break;
            case "BuyDimension":
                Dimensions[+funcParam[0] - 1].buy(saveData, false);
                break;
            case "BuyTickspeed":
                TickSpeedUpgrade.buy(saveData, false);
                break;
            case "BuyDimBoost":
                DimensionBoost.buy(saveData);
                break;
            case "BuyDimSacrifice":
                DimSacrifice.buy(saveData);
                break;
            case "BuyAntiGalaxy":
                AntiGalaxy.buy(saveData);
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
    if (Cache.UnlockedDims.includes(3)) output.push(TickSpeedUpgrade.toString(saveData));
    else output.push("");
    if (saveData.DimBoost.gte(5)) output.push(DimSacrifice.toString(saveData));
    else output.push("");
    output.push("");
    for (let i = 0; i < 8; i++) {
        if (Cache.UnlockedDims.includes(i+1)) output.push(Dimensions[i].toString(saveData, Dimensions));
        else output.push("");
    }
    output.push("");
    output.push(DimensionBoost.toString(saveData));
    output.push(AntiGalaxy.toString(saveData));
    output.push("");
    const progress = Decimal.max(0, saveData.Antimatter.log(10)).div(new Decimal(2).pow(1024).log(10)).toNumber();
    const progressBarLength = 60;
    let progressBar = ("=".repeat(Math.min(progressBarLength, Math.floor(progress*progressBarLength))) + "-".repeat(Math.max(0, Math.ceil((1-progress)*progressBarLength))));
    progressBar = progressBar.substr(0, progressBarLength/2-3) + (progress*100).toFixed(2).padStart(5, "-") + "%" + progressBar.substr(progressBarLength/2+3);
    output.push(progressBar);

    const width = 80; // max char = 2000 -> max 25 lines
    output = output.map(e => {
        const len = e.length;
        const whitespace = (width-len)/2;
        return `│${" ".repeat(Math.floor(whitespace))}${e}${" ".repeat(Math.ceil(whitespace))}│`;
    });
    output.unshift(`┌${"─".repeat(width)}┐\n│ ${id} ${" ".repeat(width-8-id.length)}- □ x │\n├${"─".repeat(width)}┤`);
    output.push(`└${"─".repeat(width)}┘`); // Window display by plat
    output = output.join("\n");

    // Compnents
    let components = [];

    if (Cache.UnlockedDims.includes(3) || saveData.DimBoost.gte(5) || saveData.AntiGalaxy.gte(1)) {
        const canAffordTick = TickSpeedUpgrade.canBuy(saveData);

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
    const DimensionsBtn = (saveData.DimBoost.gte(5) || saveData.AntiGalaxy.gte(1) ? Array.from({ length: 8 }, (_, i) => i+1) : Cache.UnlockedDims).map(e => {
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
        custom_id: "BuyAntiGalaxy",
        label: "Galaxy",
        disabled: !AntiGalaxy.canBuy(saveData),
        style: AntiGalaxy.canBuy(saveData) ? "SUCCESS" : "DANGER"
    });
    if (saveData.DimBoost.gte(4)) bottomBtns.push({
        type: "BUTTON",
        custom_id: "BuyDimSacrifice",
        label: "DSacrifice",
        disabled: !DimSacrifice.canBuy(saveData),
        style: DimSacrifice.canBuy(saveData) ? "SUCCESS" : "DANGER"
    });
    components.push({
        type: "ACTION_ROW",
        components: bottomBtns
    });


    SaveLoad.save(id, saveData);
    return {
        content: `\`\`\`\n${output}\n\`\`\``,
        components
    }
}