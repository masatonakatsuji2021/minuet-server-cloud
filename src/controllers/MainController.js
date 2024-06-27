"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainController = void 0;
const Controller_1 = require("minuet-server-cloud/core/Controller");
const Fook_1 = require("minuet-server-cloud/core/Fook");
class MainController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.autoRender = true;
    }
    index() {
        const target = Fook_1.Fook.action("test1", "run");
        this.res.write(target.join("<br>"));
    }
}
exports.MainController = MainController;
