import Decimal from "decimal.js";

const _SaveData = {
    // Game Status
    LastTick: new Number,
    Tab: "Dimensions",
    Unlock: {
        Infinity: new Boolean
    },

    // Game Resources
    Antimatter: new Decimal(0),
    Dimensions: [{
        have: new Decimal(0),
        bought: new Decimal(0)
    }],
    TickSpeed: new Decimal(0),
    DimSacrifice: new Decimal(0),
    DimBoost: new Decimal(0),
    AntiGalaxy: new Decimal(0),
    InfinityPoint: new Decimal(0),
};
const SaveData = _SaveData;

export default SaveData;