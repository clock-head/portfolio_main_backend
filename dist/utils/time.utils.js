"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTimeZone = isValidTimeZone;
const luxon_1 = require("luxon");
function isValidTimeZone(tz) {
    try {
        return luxon_1.DateTime.now().setZone(tz).isValid;
    }
    catch {
        return false;
    }
}
