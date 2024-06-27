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
const Controller_1 = require("minuet-server-cloud/core/Controller");
const Fook_1 = require("minuet-server-cloud/core/Fook");
class MainController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.autoRender = true;
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const target = Fook_1.Fook.action("test1", "run");
            this.res.write(target.join("<br>"));
            const res = yield this.Render.view("index");
            this.res.write(res.content);
        });
    }
}
exports.MainController = MainController;
