import Discord from "discord.js";
import SaveData from "../data/saveData.js";

/**
 * @param {number} dt 
 * @param {SaveData} saveData 
 * @param {string[]} buttonFunc 
 * @return { {message: string[], components: Discord.MessageActionRow[]} }
 */
export default function TickFunc(dt, saveData, buttonFunc) {
    return {
        message: ["string"],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        custom_id: "asdf",
                        label: "Asdf",
                        style: "PRIMARY"
                    }
                ]
            }
        ]
    }
};
