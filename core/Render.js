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
const minuet_script_engine_1 = require("minuet-script-engine");
class Render {
    constructor(route, controller) {
        this.route = route;
        this.controller = controller;
    }
    setSandBox() {
        const sandbox = new minuet_script_engine_1.SandBox();
        sandbox.route = this.route;
        sandbox.controller = this.controller;
        if (this.controller.viewData) {
            const vd = Object.keys(this.controller.viewData);
            for (let n = 0; n < vd.length; n++) {
                const name = vd[n];
                const value = this.controller.viewData[name];
                sandbox[name] = value;
            }
        }
        sandbox.view = (viewPath) => __awaiter(this, void 0, void 0, function* () {
            return yield this.view(viewPath);
        });
        sandbox.parentView = (viewPath) => __awaiter(this, void 0, void 0, function* () {
            return yield this.parentView(viewPath);
        });
        sandbox.containerView = (viewPath, container) => __awaiter(this, void 0, void 0, function* () {
            return yield this.containerView(viewPath, container);
        });
        sandbox.viewPart = (viewPartPath) => __awaiter(this, void 0, void 0, function* () {
            return yield this.viewPart(viewPartPath);
        });
        sandbox.parentViewPart = (viewPartPath) => __awaiter(this, void 0, void 0, function* () {
            return yield this.parentViewPart(viewPartPath);
        });
        sandbox.containerViewPart = (viewPartPath, container) => __awaiter(this, void 0, void 0, function* () {
            return yield this.containerViewPart(viewPartPath, container);
        });
        sandbox.layout = (layoutPath) => __awaiter(this, void 0, void 0, function* () {
            return yield this.layout(layoutPath);
        });
        sandbox.parentLayout = (layoutPath) => __awaiter(this, void 0, void 0, function* () {
            return yield this.parentLayout(layoutPath);
        });
        sandbox.containerLayout = (layoutPath, container) => __awaiter(this, void 0, void 0, function* () {
            return yield this.containerLayout(layoutPath, container);
        });
        sandbox.sandbox = this.sandbox;
        sandbox.setSandBox = this.setSandBox;
        return sandbox;
    }
    view(viewPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!viewPath)
                viewPath = this.controller.view;
            if (this.route.container) {
                viewPath = "/" + this.route.container + "/views/" + viewPath + minuet_server_cloud_1.MinuetCloudStatics.mse.ext;
            }
            else {
                viewPath = "views/" + viewPath + minuet_server_cloud_1.MinuetCloudStatics.mse.ext;
            }
            if (!this.sandbox) {
                this.sandbox = this.setSandBox();
            }
            return yield minuet_server_cloud_1.MinuetCloudStatics.mse.load(viewPath, this.sandbox);
        });
    }
    ;
    parentView(viewPath) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    containerView(viewPath, container) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    viewPart(viewPartPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.route.container) {
                viewPartPath = "/" + this.route.container + "/viewparts/" + viewPartPath + minuet_server_cloud_1.MinuetCloudStatics.mse.ext;
            }
            else {
                viewPartPath = "viewparts/" + viewPartPath + minuet_server_cloud_1.MinuetCloudStatics.mse.ext;
            }
            if (!this.sandbox) {
                this.sandbox = this.setSandBox();
            }
            return yield minuet_server_cloud_1.MinuetCloudStatics.mse.load(viewPartPath, this.sandbox);
        });
    }
    parentViewPart(viewPartPath) {
        return __awaiter(this, void 0, void 0, function* () {
            viewPartPath = "viewparts/" + viewPartPath + minuet_server_cloud_1.MinuetCloudStatics.mse.ext;
            if (!this.sandbox) {
                this.sandbox = this.setSandBox();
            }
            return yield minuet_server_cloud_1.MinuetCloudStatics.mse.load(viewPartPath, this.sandbox);
        });
    }
    containerViewPart(viewpartPath, container) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    layout(layoutPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!layoutPath) {
                layoutPath = this.controller.layout;
            }
            layoutPath = "layouts/" + layoutPath + minuet_server_cloud_1.MinuetCloudStatics.mse.ext;
            if (!this.sandbox) {
                this.sandbox = this.setSandBox();
            }
            return yield minuet_server_cloud_1.MinuetCloudStatics.mse.load(layoutPath, this.sandbox);
        });
    }
    parentLayout(layoutPath) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    containerLayout(layoutPath, container) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.Render = Render;
