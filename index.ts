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
import { 
    MinuetCloud, 
    MinuetCloudStatics as mcs,
    MinuetCloudRoute as mcr
} from "minuet-server-cloud/core/MinuetCloud";
import { Controller as c_ } from "minuet-server-cloud/core/Controller";
import { AdminController as admc_ } from "minuet-server-cloud/src/controllers/AdminController";
import { Fook as f_ } from "minuet-server-cloud/core/Fook";
import { Render as r_ } from "minuet-server-cloud/core/Render";
import { Console as co_ } from "minuet-server-cloud/core/Console";
import { WebSocket as ws_ } from "minuet-server-cloud/core/WebSocket";
import { ErrorHandle as eh_ } from "minuet-server-cloud/core/ErrorHandle";
 
// MinuetCloudStatics
export const MinuetCloudStatics = mcs;
export type  MinuetCloudStatics = mcs;

// MinuetCloudRoute
export type MinuetCloudRoute = mcr;

// Controller
export const Controller = c_;
export type  Controller = c_;

// Fook
export const Fook = f_;
export type  Fook = f_;

// Render
export const Render = r_;
export type  Render = r_;

// Console
export const Console = co_;
export type  Console = co_;

// WebSocket
export const WebSocket = ws_;
export type  WebSocket = ws_;

// ErrorHandle
export const ErrorHandle = eh_;
export type  ErrorHandle = eh_;

// AdminController
export const AdminController = admc_;
export type  AdminController = admc_;

export class MinuetServerModuleCloud extends MinuetServerModuleBase {

    private cloud : MinuetCloud;

    public onBegin(): void {
        MinuetCloudStatics.root = __dirname;
        MinuetCloudStatics.src = "src";
        MinuetCloudStatics.localDir = this.sector.root;
        MinuetCloudStatics.tempDir = MinuetCloudStatics.localDir + "/" + this.init.tempDir;
        MinuetCloudStatics.containerTmpPath = this.sector.root + "/.container";
        this.cloud = new MinuetCloud();
    }

    public async onRequest(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<boolean> {
        await this.cloud.listen(req, res);
        return true;
    }
}