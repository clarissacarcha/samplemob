"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOrderPrice = void 0;
const baseDistance = 10.0;
const flatRate = 60.0;
const perKm = 6.0;
exports.calculateOrderPrice = ({ distance }) => {
    // If distance is below baseDistance, return flat rate
    if (distance < baseDistance) {
        return flatRate;
    }
    // Computer for price, deduct baseDistance from distance to use as final distance
    const finalDistance = distance - baseDistance;
    return Math.floor(flatRate + finalDistance * perKm);
};
