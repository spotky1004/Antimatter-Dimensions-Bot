import Discord from "discord.js";

import * as SaveLoad from "./util/saveload.js";
import SaveData from "./data/saveData.js";
import * as Tick from "./tick/_init.js";

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
    for (const tab in Tick) {
        TickCache[tab] = Tick[tab](dt, saveData, buttonFunc);
    }

    let output = TickCache[saveData.Tab].message;
    const width = 80; // max char = 2000 -> max 25 lines
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
        components: TickCache[saveData.Tab].components
    }
}