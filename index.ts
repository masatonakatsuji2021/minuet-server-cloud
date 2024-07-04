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

import { IncomingMessage, ServerResponse } from "http";
import { MinuetServerModuleBase } from "minuet-server";
import { MinuetCloud } from "minuet-server-cloud/core/MinuetCloud";
import { MinuetCloudStatics } from "minuet-server-cloud/core/MinuetCloudStatics";
import { MinuetCloudRoutes, MinuetCloudRoute } from "minuet-server-cloud/core/MinuetCloudRoute";
import { MinuetCloudContainers, MinuetCloudContainer } from "minuet-server-cloud/core/MinuetCloudContainer";
import { Controller } from "minuet-server-cloud/core/Controller";
import { AdminController } from "minuet-server-cloud/src/controllers/admin/AdminController";
import { Fook  } from "minuet-server-cloud/core/Fook";
import { Render } from "minuet-server-cloud/core/Render";
import { Console } from "minuet-server-cloud/core/Console";
import { WebSocket } from "minuet-server-cloud/core/WebSocket";
import { ErrorHandle } from "minuet-server-cloud/core/ErrorHandle";
 
export {
    MinuetCloudStatics,
    MinuetCloudRoutes,
    MinuetCloudRoute,
    MinuetCloudContainers, 
    MinuetCloudContainer,
    Controller,
    AdminController,
    Fook,
    Render,
    Console,
    WebSocket,
    ErrorHandle,
};

export class MinuetServerModuleCloud extends MinuetServerModuleBase {

    private cloud : MinuetCloud;

    public onBegin(): void {
        MinuetCloudStatics.root = __dirname;
        MinuetCloudStatics.src = "src";
        MinuetCloudStatics.localDir = this.sector.root;
        MinuetCloudStatics.tempDir = MinuetCloudStatics.localDir + "/" + this.init.tempDir;
        MinuetCloudStatics.containersInit = this.init.containers;
        MinuetCloudStatics.routeConverts = this.init.routeConverts;
//        MinuetCloudStatics.containerTmpPath = MinuetCloudStatics.localDir + "/.container";
        this.cloud = new MinuetCloud();
    }

    public async onListen(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<boolean> {
        await this.cloud.listen(req, res);
        return true;
    }
}