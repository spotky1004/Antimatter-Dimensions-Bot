/**
 * Apply notation to the number.
 * @param {Decimal|number} x 
 * @returns {string}
 */
 function notation(x) {
    x = new Decimal(x);

    if (x.eq(0)) {
        return "0";
    } else if (x.lt("1e-1000")) {
        return "e" + x.log(10).floor()
    } else if (x.lt(1e-3)) {
        return x.div(new Decimal(10).pow(x.log(10).floor())).toFixed(2-x.log(10).abs().log(10).floor().toNumber()) + "e" + x.log(10).floor().toString();
    } else if (x.lt(1e3)) {
        if (x.isInt()) return x.toString();
        return x.toFixed(3-x.log(10).floor().toNumber()).toString();
    } else if (x.lt(new Decimal(2).pow(1024))) {
        return x.div(new Decimal(10).pow(x.log(10).floor())).toFixed(3-x.log(10).log(10).floor().toNumber()) + "e" + x.log(10).floor().toString();
    } else {
        return "Inf";
    }
}