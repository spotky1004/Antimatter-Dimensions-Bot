import fs from "fs";
import Decimal from "decimal.js";
import SaveData from "../data/saveData.js";

/**
 * @param {string} id
 * @returns {SaveData}
 */
export function load(id) {
    const path = `./SaveDatas/${id}.json`;

    /** @type {SaveData} */
    let data;
    if (fs.existsSync(path)) {
        data = JSON.parse(fs.readFileSync(path));
    } else {
        data = {};
    }

    data = mergeObject(data, SaveData);

    if (!Number.isFinite(data.StartTime)) data.StartTime = new Date().getTime();
    if (!Number.isFinite(data.LastTick)) data.LastTick = new Date().getTime();
    if (!Number.isFinite(data.PrestigeTime.Infinity)) data.PrestigeTime.Infinity = new Date().getTime();

    return data;
}
/**
 * @param {string} id 
 * @param {SaveData} data 
 */
export function save(id, data) {
    const path = `./SaveDatas/${id}.json`;
    fs.writeFileSync(path, JSON.stringify(data));
}



function mergeObject(target, source) {
    target = target ?? {};
    for (const i in source) {
        if (source[i] instanceof Decimal) {
            target[i] = new Decimal(target[i] ?? source[i]);
        } else if (Array.isArray(source[i])) {
            target[i] = target[i] ?? [];
            mergeArray(target[i], source[i])
        } else if (typeof source[i] === "object") {
            target[i] = mergeObject(target[i], source[i]);
        } else {
            target[i] = source[i].constructor(target[i] ?? source[i]);
        }
    }
    return target;
}
function mergeArray(target, source) {
    for (let i = 0, l = source.length; i < l; i++) {
        if (source[i] instanceof Decimal) {
            target[i] = new Decimal(target[i] ?? source[i]);
        } else if (Array.isArray(source[i])) {
            mergeArray(target[i], source[i]);
        } else if (typeof source[i] === "object") {
            target[i] = mergeObject(target[i], source[i]);
        } else {
            target[i] = source[i].constructor(target[i] ?? source[i]);
        }
    }
    return target;
}