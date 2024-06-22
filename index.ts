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

import * as path from "path";
import { IncomingMessage, ServerResponse } from "http";
import { MinuetServerModuleBase } from "minuet-server";
import { Mse, SandBox } from "minuet-script-engine";
import { MinuetWeb } from "minuet-server-web";
import { Controller } from "minuet-server-cloud/core/Controller";

interface MinuetCloudRoute {
    url: string,
    parentUrl: string,
    container: string,
    controller: string,
    action: string,
    argv? : Array<string|number>,
}

interface MinuetCloudContainers {
    [x: string] : MinuetCloudContainer,
}

interface MinuetCloudOption {
    url: string, 
    root : string, 
    container? : string, 
    parentCloud? : MinuetCloud, 
    tempDir? : string,
}

export class MinuetCloud {
    private root : string;
    private parentCloud : MinuetCloud;
    private container : string;
    private containers : MinuetCloudContainers;
    public tempDir : string;
    public mse : Mse;
    public web : MinuetWeb;

    public constructor(options : MinuetCloudOption) {
        this.root = options.root;
        this.container = options.container;
        this.parentCloud = options.parentCloud;
        this.containers = {};
        this.mse = new Mse({
            rootDir: this.root + "/renderings",
        });
        this.web = new MinuetWeb({
            url: options.url,
            rootDir: this.root + "/webroot",
        });
    }

    public async listen (req : IncomingMessage, res : ServerResponse, beforeRoute? : MinuetCloudRoute) {

        const status = await this.web.listen(req, res);
        if (status) return true;

        if (beforeRoute){
            req.url = beforeRoute.url;
        }

        try{
            let routes = require(this.root + "/routes").default;
            routes = this.setRouteConvert(routes);
            const route = this.setRoute(req, routes);
    
            if (!route) {
                let errStr = "Page Not Found.";
                if (this.container) {
                    errStr += " (Container = " + this.container + ")";
                }
                throw new Error(errStr);
            }

            if (route.container) {
                await this.routeContainer(route, req, res);
            }
            else {
                await this.routeController(route, req, res);
            }

        }catch(error){
            if (error.toString().indexOf("Page Not Found") > -1) {
                res.statusCode = 404;
                res.write(error);
            }
            else {
                res.statusCode = 500;
                console.log(error.stack);
                res.write(error.stack);
            }
        }

        res.end();
    }

    private async routeController(route, req : IncomingMessage, res : ServerResponse) {
    
        const controllerName = route.controller.substring(0,1).toUpperCase() + route.controller.substring(1) + "Controller";
        const controllerPath = this.root + "/controllers/" + controllerName;
    
        const controllerClass = require(controllerPath)[controllerName];
        let controller : Controller = new controllerClass(req, res);
        controller.view = route.controller + "/" + route.action;
                
        if (controller.filterBefore) {
            const result = await controller.filterBefore();
            if (result) {
                res.write(result);
            }
        }
    
        if (!controller[route.action]) {
            throw Error("Page Not Found");
        }
            
        const result = await controller[route.action]();
        if (result) {
            res.write(result);
        }
    
        if (controller.filterAfter) {
            const result = await controller.filterAfter();
            if (result) {
                res.write(result);
            }
        }
    
        if (controller.autoRender) {
                if (controller.layout) {
                    const sandbox = new SandBox();
                    sandbox.container = this.container;
                    sandbox.view = async (viewPath? : string) => {
                        if (!viewPath) {
                            viewPath = "views/" + controller.view + this.mse.ext;
                        }
                        else {
                            viewPath = "views/" + viewPath + this.mse.ext;
                        }

                        return await this.mse.load(viewPath, sandbox);
                    };
                    sandbox.viewPart = async (partPath : string) => {
                        return await this.mse.load("viewparts/" + partPath + this.mse.ext, sandbox);
                    };
                    sandbox.parentViewPart = async (partPath : string) => {
                        partPath = "viewparts/" + partPath + this.mse.ext;
                        if (sandbox.container) {
                            const rawData = this.parentCloud.mse.getRaw(partPath);
                            return await this.mse.rawExec(rawData, sandbox);
                        }
                        else {
                            return await this.mse.load(partPath, sandbox);
                        }
                    };

                    const layoutPath = "layouts/" + controller.layout + this.mse.ext;
                    let result;

                    if (this.container && controller.layoutParent) {
                        const rawData = this.parentCloud.mse.getRaw(layoutPath);
                        result = await this.mse.rawExec(rawData, sandbox);
                    }
                    else {
                        result = await this.mse.load(layoutPath, sandbox);
                    }

                    res.write(result.content);
                }
                else {
                    const result = await this.mse.load("views/" + controller.view + this.mse.ext);
                    res.write(result.content);    
                }
            }
    
            if (!res.getHeader("content-type")) {
                res.setHeader("content-type", "text/html");
            }
    }

    private async routeContainer(route, req : IncomingMessage, res : ServerResponse) {

        let container : MinuetCloudContainer;
        if (this.containers[route.container]) {
            container = this.containers[route.container];
        }
        else {
            const containerNpnName = "minuet-cloud-" + route.container;
            const containerName = "MinuetCloudContainer" + route.container.substring(0,1).toUpperCase() + route.container.substring(1);
            
            const containerClass = require(containerNpnName)[containerName];
    
            container = new containerClass(route, this);

            this.containers[route.container] = container;    
        }

        await container.listen(req, res, route);
    }

    private setRouteConvert(routes) {
        const c = Object.keys(routes);
        let res = {};
        for (let n = 0 ; n < c.length ; n++) {
            let url = c[n];
            let route = routes[url];
            if (typeof route == "string") {
                const route_ = route.split(",");
                let buffer : any = {};
                for (let n2 = 0 ; n2 < route_.length ; n2++){
                    const r_ = route_[n2].split("=");
                    const ra = r_[0].trim();
                    const rb = r_[1].trim();
                    if (ra.indexOf("controller") === 0) {
                        buffer.controller = rb;
                    }
                    else if (ra.indexOf("action") === 0) {
                        buffer.action = rb;
                    }
                    else if (ra.indexOf("container") === 0) {
                        buffer.container = rb;
                    }
                }
                res[url] = buffer;
            }
            else {
                const buffers = this.setRouteConvert(route);
                const bc = Object.keys(buffers);
                for (let n2 = 0 ; n2 < bc.length ; n2++){
                    let subUrl = bc[n2];
                    const route = buffers[subUrl];
                    if (subUrl == "/") subUrl = "";
                    const url2 = (url + subUrl).split("//").join("/");
                    res[url2] = route;
                }
            }
        }

        return res;
    }

    private setRoute(req: IncomingMessage, routes) {
        const url = req.url.split("?")[0];
        let urls = url.split("/");
        if (urls[0] == "") {
            urls.shift();
        }
        const r = Object.keys(routes);
        let decisionRoute : MinuetCloudRoute;
        let matrixA = {};
        let matrixB = {};
        let matrixArgs = {};
        for (let n = 0 ; n < r.length ; n++) {
            const targetUrl = r[n];
            let targetUrls = targetUrl.split("/");           
            if (targetUrls[0] == "") {
                targetUrls.shift();
            }
            const route = routes[targetUrl];

            let argAny = false;
            for (let n2 = 0 ; n2 < targetUrls.length ; n2++ ) {
                const a1 = urls[n2];
                const a2 = targetUrls[n2];
                if (!matrixArgs[targetUrl]) matrixArgs[targetUrl] = [];

                let juge = false;
                if (a1 == a2) juge = true;

                if (a2){
                    if (a2.indexOf("{") > -1 && a2.indexOf("}") > -1) {
                        if (a2.indexOf("{?") > -1) {
                            juge = true;
                            matrixArgs[targetUrl].push(a1);
                        }
                        else {
                            if (a1){
                                juge = true;
                                matrixArgs[targetUrl].push(a1);
                            }
                        }
                    }
                    if (a2 == "*") {
                        juge = true;
                        argAny = true;
                        matrixArgs[targetUrl].push(a1);
                    } 
                }

                if (!matrixA[targetUrl]) matrixA[targetUrl] = [];
                matrixA[targetUrl].push(juge);
            }

            for (let n2 = 0 ; n2 < urls.length ; n2++ ) {
                const b1 = urls[n2];
                const b2 = targetUrls[n2];
                let juge = false;

                if (argAny) juge = true;

                if (b1 == b2) juge = true;
  
                if (b2){
                    if (b2.indexOf("{") > -1 && b2.indexOf("}") > -1) {
                        if (b2.indexOf("{?") > -1) {
                            juge = true;
                        }
                        else {
                            if (b2) juge = true
                        }
                    }
                    if (b2 == "*") {
                        juge = true;
                    } 
                }

                if (!matrixB[targetUrl]) matrixB[targetUrl] = [];
                matrixB[targetUrl].push(juge);
            }

            if (url == targetUrl) {
                decisionRoute = route;
                decisionRoute.url = targetUrl;
            }
            
        }
        const ma1 = Object.keys(matrixA);
        for (let n = 0 ; n < ma1.length ; n++) {
            let juge = true;
            const targetUrl = ma1[n];
            for (let n2 = 0 ; n2 < matrixA[targetUrl].length ; n2++) {
                const check = matrixA[targetUrl][n2];
                if (!check) {
                    juge = false;
                    break;
                }
            }
            for (let n2 = 0 ; n2 < matrixB[targetUrl].length ; n2++) {
                const check = matrixB[targetUrl][n2];
                if (!check) {
                    juge = false;
                    break;
                }
            }

            if (juge){
                decisionRoute = routes[targetUrl];
                let decisionUrl = url;
                let turl = targetUrl.split("/*").join("");
                if (decisionRoute.container) {
                    decisionUrl = url.substring(turl.length);
                    if (decisionUrl == "") decisionUrl = "/";
                }
                decisionRoute.url = decisionUrl;
                decisionRoute.parentUrl = turl;
                decisionRoute.argv = matrixArgs[targetUrl];
            }
        }
        /*
        console.log("url = " + url);
        console.log(matrixA);
        console.log(matrixB);
        console.log(decisionRoute);
        */
        return decisionRoute;
    }
}

export class MinuetServerModuleCloud extends MinuetServerModuleBase {

    private cloud : MinuetCloud;

    public onBegin(): void {
        this.cloud = new MinuetCloud({
            url: "/",
            root:  __dirname + "/src",
            tempDir: this.sector.root + "/" + this.init.tempDir,
        });
    }

    public async onRequest(req: IncomingMessage, res: ServerResponse<IncomingMessage>): Promise<boolean> {
        await this.cloud.listen(req, res);
        return true;
    }
}

export class MinuetCloudContainer {

    private cloud : MinuetCloud;

    public constructor(route : MinuetCloudRoute, context : MinuetCloud){
        const containerPath = require.resolve("minuet-cloud-" + route.container);
        this.cloud = new MinuetCloud({
            url: route.parentUrl, 
            root: path.dirname(containerPath) + "/src", 
            container: route.container, 
            parentCloud: context,
            tempDir: context.tempDir,
        });
    }

    public async listen(req: IncomingMessage, res: ServerResponse<IncomingMessage>, route? : MinuetCloudRoute): Promise<boolean> { 
        await this.cloud.listen(req, res, route);
        return true;
    }
}
