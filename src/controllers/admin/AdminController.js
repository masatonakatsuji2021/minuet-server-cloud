"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const minuet_server_cloud_1 = require("minuet-server-cloud");
class AdminController extends minuet_server_cloud_1.Controller {
    constructor() {
        super(...arguments);
        this.autoRender = true;
        this.layout = "type1";
    }
}
exports.AdminController = AdminController;
