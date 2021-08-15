import Discord from "discord.js";
import SaveData from "../data/saveData.js";

/**
 * @param {number} dt 
 * @param {SaveData} saveData 
 * @param {Map<string, (string|number)[]|null>} event
 * @return { {message: string[], components: Discord.MessageActionRow[]} }
 */
export default function TickFunc(dt, saveData, event) {
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
