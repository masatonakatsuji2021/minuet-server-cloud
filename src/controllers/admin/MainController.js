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
exports.MainController = void 0;
const minuet_server_cloud_1 = require("minuet-server-cloud");
class MainController extends minuet_server_cloud_1.AdminController {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                    console.log(this.Goto.url({ controller: "admin/setting", action: "index" }));
                    console.log(this.Goto.url({ container: "sample_1", controller: "main" }));
                    console.log(this.Goto.url({ controller: "admin/account", action: "edit2" , args: [ 111, 222 ]}));
                    console.log(this.Goto.url({ controller: "admin/account", action: "edit2" , args: [ 333 ]}));
                    */
        });
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
exports.MainController = MainController;
