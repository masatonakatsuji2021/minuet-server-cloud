"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const Controller_1 = require("minuet-server-cloud/core/Controller");
class HomeController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.autoRender = true;
    }
    index() {
    }
}
exports.HomeController = HomeController;
