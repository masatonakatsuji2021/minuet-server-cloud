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
exports.AdminController = void 0;
const Controller_1 = require("minuet-server-cloud/src/controllers/Controller");
class AdminController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.autoRender = true;
        this.layout = "type1";
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Render
                .set("hideHeader", true)
                .set("hideSIdemenu", true);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.autoRender = false;
            this.res.statusCode = 301;
            this.res.setHeader("location", "/admin/login");
            this.res.end();
        });
    }
}
exports.AdminController = AdminController;
