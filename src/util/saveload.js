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
        data.LastTick = new Date().getTime();
    }
    
    data = mergeObject(data, defaultSave);

    return data;
}
/**
 * @param {string} id 
 * @param {SaveData} data 
 * @returns 
 */
export function save(id, data) {
    const path = `./SaveDatas/${id}.json`;

    return fs.writeFileSync(path, JSON.stringify(data));
}

export const defaultSave = {
    LastTick: null,

    Antimatter: new Decimal(10),
    Dimensions: Array.from({ length: 8 }, () => {return {have: new Decimal(0), bought: new Decimal(0)}}),
    TickSpeed: new Decimal(0),
    DimSacrifice: new Decimal(0),
    DimBoost: new Decimal(0),
    AntiGalaxy: new Decimal(0),
};



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