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
exports.MinuetServerModuleCloud = exports.ErrorHandle = exports.WebSocket = exports.Console = exports.Render = exports.Fook = exports.AdminController = exports.Controller = exports.MinuetCloudStatics = void 0;
const minuet_server_1 = require("minuet-server");
const MinuetCloud_1 = require("minuet-server-cloud/core/MinuetCloud");
const MinuetCloudStatics_1 = require("minuet-server-cloud/core/MinuetCloudStatics");
Object.defineProperty(exports, "MinuetCloudStatics", { enumerable: true, get: function () { return MinuetCloudStatics_1.MinuetCloudStatics; } });
const Controller_1 = require("minuet-server-cloud/core/Controller");
Object.defineProperty(exports, "Controller", { enumerable: true, get: function () { return Controller_1.Controller; } });
const AdminController_1 = require("minuet-server-cloud/src/controllers/AdminController");
Object.defineProperty(exports, "AdminController", { enumerable: true, get: function () { return AdminController_1.AdminController; } });
const Fook_1 = require("minuet-server-cloud/core/Fook");
Object.defineProperty(exports, "Fook", { enumerable: true, get: function () { return Fook_1.Fook; } });
const Render_1 = require("minuet-server-cloud/core/Render");
Object.defineProperty(exports, "Render", { enumerable: true, get: function () { return Render_1.Render; } });
const Console_1 = require("minuet-server-cloud/core/Console");
Object.defineProperty(exports, "Console", { enumerable: true, get: function () { return Console_1.Console; } });
const WebSocket_1 = require("minuet-server-cloud/core/WebSocket");
Object.defineProperty(exports, "WebSocket", { enumerable: true, get: function () { return WebSocket_1.WebSocket; } });
const ErrorHandle_1 = require("minuet-server-cloud/core/ErrorHandle");
Object.defineProperty(exports, "ErrorHandle", { enumerable: true, get: function () { return ErrorHandle_1.ErrorHandle; } });
class MinuetServerModuleCloud extends minuet_server_1.MinuetServerModuleBase {
    onBegin() {
        MinuetCloudStatics_1.MinuetCloudStatics.root = __dirname;
        MinuetCloudStatics_1.MinuetCloudStatics.src = "src";
        MinuetCloudStatics_1.MinuetCloudStatics.localDir = this.sector.root;
        MinuetCloudStatics_1.MinuetCloudStatics.tempDir = MinuetCloudStatics_1.MinuetCloudStatics.localDir + "/" + this.init.tempDir;
        MinuetCloudStatics_1.MinuetCloudStatics.containerTmpPath = this.sector.root + "/.container";
        this.cloud = new MinuetCloud_1.MinuetCloud();
    }
    onListen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cloud.listen(req, res);
            return true;
        });
    }
}
exports.MinuetServerModuleCloud = MinuetServerModuleCloud;
