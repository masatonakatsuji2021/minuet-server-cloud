"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandle = void 0;
const Controller_1 = require("minuet-server-cloud/core/Controller");
class ErrorHandle extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.error = true;
    }
}
exports.ErrorHandle = ErrorHandle;
