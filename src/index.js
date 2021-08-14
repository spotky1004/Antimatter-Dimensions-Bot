import Discord from "discord.js";

import { Dimensions } from "./upgrades/_init.js";
import { notation } from "./util/functions.js";
import { NotationLength } from "./data/literal.js";

import * as SaveLoad from "./util/saveload.js";
import SaveData from "./data/saveData.js";
import * as Tick from "./tick/_init.js";
const TickLength = Object.keys(Tick).length;
const tickPriority = [
    "TabManager",
    "InfinityUpgrades",
    "InfinityScreen",
    "Dimensions"
];


/**
 * @returns {Discord.MessageOptions} - Display of the Game
 */
export function tick(id, buttonFunc) {
    /** @type {SaveData} */
    const saveData = SaveLoad.load(id);

    const Time = new Date().getTime();
    const dt = (Time - saveData.LastTick)/1000;
    saveData.LastTick = Time;

    /** @type {Object.<string, {message: string[], components: object[]}>} */
    const TickCache = {};
    for (let i = 0; i < TickLength; i++) {
        const TabName = tickPriority[i];
        TickCache[TabName] = Tick[TabName](dt, saveData, buttonFunc);
    }



    // Add base UI
    let output = [];
    if (saveData.Unlock.Infinity) output.push(`${" ".repeat(35)}You have ${notation(saveData.InfinityPoint).padEnd(NotationLength)} IP`);
    output.push(`You have ${notation(saveData.Antimatter)} Antimatters (+${notation(Dimensions[0].production(saveData))}/s)`);
    
    
    
    output.push(...TickCache[saveData.Tab].message);
    if (output.length < 17) output = output.concat(new Array(17-output.length).fill(""));
    const width = 85; // max char = 2000 -> max 23 lines
    output = output.map(e => {
        const len = e.length;
        const whitespace = (width-len)/2;
        return `│${" ".repeat(Math.floor(whitespace))}${e}${" ".repeat(Math.ceil(whitespace))}│`;
    });
    output.unshift(`┌${"─".repeat(width)}┐\n│ ${id} ${" ".repeat(width-8-id.length)}- □ x │\n├${"─".repeat(width)}┤`);
    output.push(`└${"─".repeat(width)}┘`); // Window display by plat
    output = output.join("\n");



    SaveLoad.save(id, saveData);
    return {
        content: `\`\`\`\n${output}\n\`\`\``,
        components: [...TickCache.TabManager.components, ...TickCache[saveData.Tab].components]
    }
}