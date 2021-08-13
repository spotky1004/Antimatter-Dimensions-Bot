import Decimal from "decimal.js";

const _SaveData = {
    // Game Status
    StartTime: 0,
    LastTick: 0,
    Tab: "Dimensions",
    Unlock: {
        Infinity: false,
    },

    // Game Resources
    Antimatter: new Decimal(10),
    /** @type { { have: Decimal, bought: Decimal }[] } */
    Dimensions: Array.from({ length: 8 }, () => {return {have: new Decimal(0), bought: new Decimal(0)}}),
    TickSpeed: new Decimal(0),
    DimSacrifice: new Decimal(0),
    DimBoost: new Decimal(0),
    AntiGalaxy: new Decimal(0),
    InfinityPoint: new Decimal(0),

    // Upgrades
    /** @type {number[]} */
    InfinityUpgrade: []
};
const SaveData = _SaveData;

export default SaveData;