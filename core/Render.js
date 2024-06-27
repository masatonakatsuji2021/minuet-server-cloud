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
exports.Render = void 0;
const minuet_server_cloud_1 = require("minuet-server-cloud");
class Render {
    constructor(route, controller) {
        this.route = route;
        this.controller = controller;
    }
    view(viewPath) {
        return __awaiter(this, void 0, void 0, function* () {
            let containerName = this.route.container;
            if (!this.route.container) {
                containerName = "_";
            }
            const container = minuet_server_cloud_1.MinuetCloudStatics.containers[containerName];
            if (!viewPath) {
                viewPath = "views/" + this.controller.view + container.cloud.mse.ext;
            }
            else {
                viewPath = "views/" + viewPath + container.cloud.mse.ext;
            }
            return yield container.cloud.mse.load(viewPath);
        });
    }
    ;
}
exports.Render = Render;
