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
exports.ErrorHandle = void 0;
const minuet_server_cloud_1 = require("minuet-server-cloud");
class ErrorHandle extends minuet_server_cloud_1.ErrorHandle {
    handle(error) {
        return __awaiter(this, void 0, void 0, function* () {
            this.Render.set("error", error);
            const res = yield this.Render.parentView(this.view);
            this.res.write(res.content);
        });
    }
}
exports.ErrorHandle = ErrorHandle;
