"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const minuet_server_cloud_1 = require("minuet-server-cloud");
class Controller {
    constructor(req, res, route) {
        this.error = false;
        this.layout = null;
        this.layoutParent = true;
        this.view = null;
        this.autoRender = false;
        this.req = req;
        this.res = res;
        this.route = route;
        this.Render = new minuet_server_cloud_1.Render(route, this);
        this.Goto = new minuet_server_cloud_1.Goto(res);
    }
    __rendering() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.autoRender)
                return;
            let result;
            if (this.layout) {
                result = yield this.Render.layout();
            }
            else {
                result = yield this.Render.view();
            }
            this.res.write(result.content);
        });
    }
}
exports.Controller = Controller;
