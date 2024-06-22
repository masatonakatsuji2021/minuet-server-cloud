"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
class Controller {
    setData(name, value) {
        this.viewData[name] = value;
        return this;
    }
    constructor(req, res) {
        this.layout = null;
        this.layoutParent = true;
        this.view = null;
        this.autoRender = false;
        this.viewData = {};
        this.req = req;
        this.res = res;
    }
}
exports.Controller = Controller;
