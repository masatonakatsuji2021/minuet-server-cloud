"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
class Controller {
    constructor(req, res) {
        this.layout = null;
        this.layoutParent = true;
        this.view = null;
        this.autoRender = false;
        this.req = req;
        this.res = res;
    }
}
exports.Controller = Controller;
