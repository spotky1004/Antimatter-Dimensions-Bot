import Decimal from "decimal.js";

export default {
    // Game Status
    LastTick: new Number,

    // Game Resources
    Antimatter: new Decimal(0),
    Dimensions: [{
        have: new Decimal(0),
        bought: new Decimal(0)
    }],
    TickSpeed: new Decimal(0),
};