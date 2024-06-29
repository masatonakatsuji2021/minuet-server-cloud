import * as path from "path";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { IncomingMessage, ServerResponse } from "http";
import { Mse } from "minuet-script-engine";
import { MinuetWeb } from "minuet-server-web";
import { Controller } from "minuet-server-cloud";

export class MinuetCloudStatics {
    public static root : string;
    public static srcDir : string;
    public static localDir : string;
    public static tempDir : string;
    public static containerTmpPath : string;
    public static routes : MinuetCloudRoutes;
    public static containers: MinuetCloudContainers = {};
    public static mse : Mse;
    public static web : MinuetWeb;
}

export interface MinuetCloudRoutes {
    [url : string] : MinuetCloudRoute,
}

export interface MinuetCloudRoute {
    url? : string,
    container? : string,
    controller? : string,
    action? : string,
    args? : Array<string>,
    type? : string,
}

export interface MinuetCloudContainers {
    [containerName : string] : MinuetCloudContainer,
}

export interface MinuetCloudContainer {
    name? : string,
    root? : string,
}

export class MinuetCloud {

    public constructor(option?) {
        MinuetCloudStatics.mse = new Mse({
            rootDir : { "/" : MinuetCloudStatics.srcDir + "/renderings" },
            buffering: false,
        });
        MinuetCloudStatics.web = new MinuetWeb({
            rootDir : { "/" : MinuetCloudStatics.srcDir + "/webroot" },
            buffering: false,
            headers: {
                "cache-control": "max-age=3600",
            }
        });
        this.setRoutes();
    }

    private setRoutes(){
        let routes = require(MinuetCloudStatics.srcDir + "/routes").default;

        // get container routing lists
        if (fs.existsSync(MinuetCloudStatics.containerTmpPath)) {
            if (fs.statSync(MinuetCloudStatics.containerTmpPath).isFile()) {
                const getcontainerTmp = fs.readFileSync(MinuetCloudStatics.containerTmpPath).toString();
                const cyaml = yaml.load(getcontainerTmp);

                const c = Object.keys(cyaml);
                for (let n = 0 ; n < c.length ; n++) {
                    const url = c[n];
                    const value = cyaml[url];
                    routes[url] = value;
                }
            }
        }

        MinuetCloudStatics.routes = this.convertRoutes(routes);
    }

    private convertRoutes(routes, container? : string) {
        let result : MinuetCloudRoutes = {};

        const c = Object.keys(routes);
        for (let n = 0 ; n < c.length ; n++) {
            const url = c[n];
            const value = routes[url];

            if (typeof value == "string") {
                const buffer : MinuetCloudRoute = {};
                if (container) {
                    buffer.container = container;
                }
                const values = value.split(",");
                for (let n2 = 0 ; n2 < values.length ; n2++) {
                    const v_ = values[n2].split("=");
                    v_[0] = v_[0].trim();
                    v_[1] = v_[1].trim();
                    if (v_[0] == "controller") {
                        buffer.controller = v_[1];
                    }
                    else if (v_[0] == "action") {
                        buffer.action = v_[1];
                    }
                    else if (v_[0] == "container") {
                        buffer.container = v_[1];
                    }
                    else if (v_[0] == "type") {
                        buffer.type = v_[1];
                    }

                    if (buffer.container) {
                        const buffer2 = this.containerRoutes(buffer.container, buffer.type);
                        const c2 = Object.keys(buffer2);
                        for (let n3 = 0 ; n3 < c2.length ; n3++) {
                            let subUrl = c2[n3];
                            const route = buffer2[subUrl];
                            if (subUrl == "/") subUrl = "";
                            result[url + subUrl] = route;
                        }
                    }
                    else {
                        result[url] = buffer;
                    }
                }
            }
            else {
                const buffers = this.convertRoutes(value, container);

                const c2 = Object.keys(buffers);
                for (let n2 = 0 ; n2 < c2.length ; n2++) {
                    let subUrl = c2[n2];
                    const buffer = buffers[subUrl];
                    if (subUrl == "/") subUrl = "";
                    result[url + subUrl] = buffer;
                }
            }
        }

        return result
    }

    private containerRoutes(container : string, type : string) {
        if(!type){
            type = "default";
        }
        let decisionPath;
        if (!MinuetCloudStatics.containers[container]) {
            const fullContainerPathLists = [
                "minuet-cloud-" + container,
                MinuetCloudStatics.localDir + "/node_modules/minuet-cloud-" + container,
                MinuetCloudStatics.localDir + "/node_modules/" + container,                
                container,
            ];

            try {
                for (let n = 0 ; n < fullContainerPathLists.length ; n++) {
                    const fullpath = fullContainerPathLists[n];
                    decisionPath = path.dirname(require.resolve(fullpath));
                }
            }catch(err){
                // console.log(err);
            }

            if(!decisionPath) return;

            MinuetCloudStatics.containers[container] = {
                name: container,
                root: decisionPath,
            };

            MinuetCloudStatics.mse.addRootDir("/" + container, decisionPath + "/src/renderings");
            MinuetCloudStatics.web.addRootDir("/" + container, decisionPath + "/src/webroot");
        }
        else {
            decisionPath = MinuetCloudStatics.containers[container].root;
        }

        let routes;
        try{
            routes = require(decisionPath + "/src/routes").default;
        }catch(err){}

        if (!routes){
            return;
        }

        if (!routes[type]){
            return;
        }

        const subRoutes = this.convertRoutes(routes[type]);

        let result : MinuetCloudRoutes = {};
        const c = Object.keys(subRoutes);
        for (let n = 0 ; n < c.length ; n++) {
            const url = c[n];
            const route = subRoutes[url];
            route.container = container;
            result[url] = route;
        }

        return result;
    }

    private getRoute(req: IncomingMessage) {
        const url = req.url.split("?")[0];
        let urls = url.split("/");
        if (urls[0] == "") {
            urls.shift();
        }
        const r = Object.keys(MinuetCloudStatics.routes);
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
            const route = MinuetCloudStatics.routes[targetUrl];

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
                decisionRoute = MinuetCloudStatics.routes[targetUrl];
                let decisionUrl = url;
                let turl = targetUrl.split("/*").join("");
                if (decisionRoute.container) {
                    decisionUrl = url.substring(turl.length);
                    if (decisionUrl == "") decisionUrl = "/";
                }
                decisionRoute.url = decisionUrl;
                decisionRoute.args = matrixArgs[targetUrl];
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

    /**
     * listen
     * @param req 
     * @param res 
     * @returns 
     */
    public async listen(req: IncomingMessage, res: ServerResponse<IncomingMessage>) : Promise<boolean> {

        const status = await MinuetCloudStatics.web.listen(req, res);
        if (status) return true;

        res.setHeader("content-type", "text/html");

        try{
            const route = this.getRoute(req);
    
            if (!route) {
                throw new Error("Page Not Found");
            }

            // set controller
            const controllerName = route.controller.substring(0,1).toUpperCase() + route.controller.substring(1) + "Controller";
            const controllerPath = MinuetCloudStatics.srcDir + "/controllers/" + controllerName;
        
            const controllerClass = require(controllerPath)[controllerName];
            let controller : Controller = new controllerClass(req, res, route);
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

            await controller.__rendering();

        }catch(error){
            if (error.toString().indexOf("Page Not Found") > -1) {
                res.statusCode = 404;
                res.write(error.toString());
            }
            else {
                res.statusCode = 500;
                console.log(error.stack);
                res.write(error.stack.toString());
            }
        }

        res.end();
    }

}