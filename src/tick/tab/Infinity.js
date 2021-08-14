import SaveData from "../../data/saveData.js";

/**
 * @param {number} dt 
 * @param {SaveData} saveData 
 * @param {string[]} buttonFunc 
 * @returns { {message: string[], components: object[]} }
 */
export default function(dt, saveData, buttonFunc) {
    return {
        message: [
            "",
            "This is Infinity tab",
            "",
            "Tickrate: " + dt + "s",
            "Events: " + buttonFunc.join(", ")
        ],
        components: [{
            type: "ACTION_ROW",
            components: [
                {
                    type: "BUTTON",
                    custom_id: "test",
                    label: "테스트",
                    style: "PRIMARY"
                }
            ]
        }]
    }
}
