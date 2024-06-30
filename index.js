"use strict";
/**
 * MIT License
 *
 * Copyright (c) 2024 Masato Nakatsuji
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
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
exports.MinuetServerModuleCloud = exports.AdminController = exports.ErrorHandle = exports.WebSocket = exports.Console = exports.Render = exports.Fook = exports.Controller = exports.MinuetCloudStatics = void 0;
const minuet_server_1 = require("minuet-server");
const MinuetCloud_1 = require("minuet-server-cloud/core/MinuetCloud");
const Controller_1 = require("minuet-server-cloud/core/Controller");
const AdminController_1 = require("minuet-server-cloud/src/controllers/AdminController");
const Fook_1 = require("minuet-server-cloud/core/Fook");
const Render_1 = require("minuet-server-cloud/core/Render");
const Console_1 = require("minuet-server-cloud/core/Console");
const WebSocket_1 = require("minuet-server-cloud/core/WebSocket");
const ErrorHandle_1 = require("minuet-server-cloud/core/ErrorHandle");
// MinuetCloudStatics
exports.MinuetCloudStatics = MinuetCloud_1.MinuetCloudStatics;
// Controller
exports.Controller = Controller_1.Controller;
// Fook
exports.Fook = Fook_1.Fook;
// Render
exports.Render = Render_1.Render;
// Console
exports.Console = Console_1.Console;
// WebSocket
exports.WebSocket = WebSocket_1.WebSocket;
// ErrorHandle
exports.ErrorHandle = ErrorHandle_1.ErrorHandle;
// AdminController
exports.AdminController = AdminController_1.AdminController;
class MinuetServerModuleCloud extends minuet_server_1.MinuetServerModuleBase {
    onBegin() {
        exports.MinuetCloudStatics.root = __dirname;
        exports.MinuetCloudStatics.src = "src";
        exports.MinuetCloudStatics.localDir = this.sector.root;
        exports.MinuetCloudStatics.tempDir = exports.MinuetCloudStatics.localDir + "/" + this.init.tempDir;
        exports.MinuetCloudStatics.containerTmpPath = this.sector.root + "/.container";
        this.cloud = new MinuetCloud_1.MinuetCloud();
    }
    onRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cloud.listen(req, res);
            return true;
        });
    }
}
exports.MinuetServerModuleCloud = MinuetServerModuleCloud;
