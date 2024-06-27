"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const Render_1 = require("minuet-server-cloud/core/Render");
class Controller {
    setData(name, value) {
        this.viewData[name] = value;
        return this;
    }
    constructor(req, res, route) {
        this.layout = null;
        this.layoutParent = true;
        this.view = null;
        this.autoRender = false;
        this.viewData = {};
        this.req = req;
        this.res = res;
        this.Render = new Render_1.Render(route, this);
    }
}
exports.Controller = Controller;
