"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const Controller_1 = require("minuet-server-cloud/core/Controller");
class MainController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.autoRender = true;
    }
    index() { }
}
exports.MainController = MainController;
