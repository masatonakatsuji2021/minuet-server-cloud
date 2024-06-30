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
exports.MinuetCloud = exports.MinuetCloudStatics = void 0;
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const minuet_script_engine_1 = require("minuet-script-engine");
const minuet_server_web_1 = require("minuet-server-web");
class MinuetCloudStatics {
}
exports.MinuetCloudStatics = MinuetCloudStatics;
MinuetCloudStatics.containers = {};
class MinuetCloud {
    constructor(option) {
        MinuetCloudStatics.mse = new minuet_script_engine_1.Mse({
            rootDir: { "/": MinuetCloudStatics.root + "/" + MinuetCloudStatics.src + "/renderings" },
            buffering: false,
        });
        MinuetCloudStatics.web = new minuet_server_web_1.MinuetWeb({
            rootDir: { "/": MinuetCloudStatics.root + "/" + MinuetCloudStatics.src + "/webroot" },
            buffering: false,
            headers: {
                "cache-control": "max-age=3600",
            }
        });
        this.setRoutes();
    }
    setRoutes() {
        let routes = require(MinuetCloudStatics.root + "/" + MinuetCloudStatics.src + "/routes/access").default;
        // get container routing lists
        if (fs.existsSync(MinuetCloudStatics.containerTmpPath)) {
            if (fs.statSync(MinuetCloudStatics.containerTmpPath).isFile()) {
                const getcontainerTmp = fs.readFileSync(MinuetCloudStatics.containerTmpPath).toString();
                const cyaml = yaml.load(getcontainerTmp);
                const c = Object.keys(cyaml);
                for (let n = 0; n < c.length; n++) {
                    const url = c[n];
                    const value = cyaml[url];
                    routes[url] = value;
                }
            }
        }
        MinuetCloudStatics.routes = this.convertRoutes(routes);
    }
    convertRoutes(routes, container) {
        let result = {};
        const c = Object.keys(routes);
        for (let n = 0; n < c.length; n++) {
            const url = c[n];
            const value = routes[url];
            if (typeof value == "string") {
                const buffer = {};
                if (container) {
                    buffer.container = container;
                }
                const values = value.split(",");
                for (let n2 = 0; n2 < values.length; n2++) {
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
                        for (let n3 = 0; n3 < c2.length; n3++) {
                            let subUrl = c2[n3];
                            const route = buffer2[subUrl];
                            if (subUrl == "/")
                                subUrl = "";
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
                for (let n2 = 0; n2 < c2.length; n2++) {
                    let subUrl = c2[n2];
                    const buffer = buffers[subUrl];
                    if (subUrl == "/")
                        subUrl = "";
                    result[url + subUrl] = buffer;
                }
            }
        }
        return result;
    }
    containerRoutes(container, type) {
        if (!type) {
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
                for (let n = 0; n < fullContainerPathLists.length; n++) {
                    const fullpath = fullContainerPathLists[n];
                    decisionPath = path.dirname(require.resolve(fullpath));
                }
            }
            catch (err) {
                // console.log(err);
            }
            if (!decisionPath)
                return;
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
        try {
            routes = require(decisionPath + "/" + MinuetCloudStatics.src + "/routes/access").default;
        }
        catch (err) { }
        if (!routes) {
            return;
        }
        if (!routes[type]) {
            return;
        }
        const subRoutes = this.convertRoutes(routes[type]);
        let result = {};
        const c = Object.keys(subRoutes);
        for (let n = 0; n < c.length; n++) {
            const url = c[n];
            const route = subRoutes[url];
            route.container = container;
            result[url] = route;
        }
        return result;
    }
    getRoute(req) {
        const url = req.url.split("?")[0];
        let urls = url.split("/");
        if (urls[0] == "") {
            urls.shift();
        }
        const r = Object.keys(MinuetCloudStatics.routes);
        let decisionRoute;
        let matrixA = {};
        let matrixB = {};
        let matrixArgs = {};
        for (let n = 0; n < r.length; n++) {
            const targetUrl = r[n];
            let targetUrls = targetUrl.split("/");
            if (targetUrls[0] == "") {
                targetUrls.shift();
            }
            const route = MinuetCloudStatics.routes[targetUrl];
            let argAny = false;
            for (let n2 = 0; n2 < targetUrls.length; n2++) {
                const a1 = urls[n2];
                const a2 = targetUrls[n2];
                if (!matrixArgs[targetUrl])
                    matrixArgs[targetUrl] = [];
                let juge = false;
                if (a1 == a2)
                    juge = true;
                if (a2) {
                    if (a2.indexOf("{") > -1 && a2.indexOf("}") > -1) {
                        if (a2.indexOf("{?") > -1) {
                            juge = true;
                            matrixArgs[targetUrl].push(a1);
                        }
                        else {
                            if (a1) {
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
                if (!matrixA[targetUrl])
                    matrixA[targetUrl] = [];
                matrixA[targetUrl].push(juge);
            }
            for (let n2 = 0; n2 < urls.length; n2++) {
                const b1 = urls[n2];
                const b2 = targetUrls[n2];
                let juge = false;
                if (argAny)
                    juge = true;
                if (b1 == b2)
                    juge = true;
                if (b2) {
                    if (b2.indexOf("{") > -1 && b2.indexOf("}") > -1) {
                        if (b2.indexOf("{?") > -1) {
                            juge = true;
                        }
                        else {
                            if (b2)
                                juge = true;
                        }
                    }
                    if (b2 == "*") {
                        juge = true;
                    }
                }
                if (!matrixB[targetUrl])
                    matrixB[targetUrl] = [];
                matrixB[targetUrl].push(juge);
            }
            if (url == targetUrl) {
                decisionRoute = route;
                decisionRoute.url = targetUrl;
            }
        }
        const ma1 = Object.keys(matrixA);
        for (let n = 0; n < ma1.length; n++) {
            let juge = true;
            const targetUrl = ma1[n];
            for (let n2 = 0; n2 < matrixA[targetUrl].length; n2++) {
                const check = matrixA[targetUrl][n2];
                if (!check) {
                    juge = false;
                    break;
                }
            }
            for (let n2 = 0; n2 < matrixB[targetUrl].length; n2++) {
                const check = matrixB[targetUrl][n2];
                if (!check) {
                    juge = false;
                    break;
                }
            }
            if (juge) {
                decisionRoute = MinuetCloudStatics.routes[targetUrl];
                let decisionUrl = url;
                let turl = targetUrl.split("/*").join("");
                if (decisionRoute.container) {
                    decisionUrl = url.substring(turl.length);
                    if (decisionUrl == "")
                        decisionUrl = "/";
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
    listen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield MinuetCloudStatics.web.listen(req, res);
            if (status)
                return true;
            let route;
            try {
                res.setHeader("content-type", "text/html");
                route = this.getRoute(req);
                if (!route)
                    this.notFound(res);
                // set controller
                const controllerName = route.controller.substring(0, 1).toUpperCase() + route.controller.substring(1) + "Controller";
                let controllerPath;
                if (route.container) {
                    const container = MinuetCloudStatics.containers[route.container];
                    controllerPath = container.root + "/" + MinuetCloudStatics.src + "/controllers/" + controllerName;
                }
                else {
                    controllerPath = MinuetCloudStatics.root + "/" + MinuetCloudStatics.src + "/controllers/" + controllerName;
                }
                const controllerClass = require(controllerPath)[controllerName];
                let controller = new controllerClass(req, res, route);
                controller.view = route.controller + "/" + route.action;
                if (controller.filterBefore) {
                    const result = yield controller.filterBefore();
                    if (result) {
                        res.write(result);
                    }
                }
                if (!controller[route.action])
                    this.notFound(res);
                const result = yield controller[route.action]();
                if (result) {
                    res.write(result);
                }
                if (controller.filterAfter) {
                    const result = yield controller.filterAfter();
                    if (result) {
                        res.write(result);
                    }
                }
                yield controller.__rendering();
            }
            catch (error) {
                yield this.error(req, res, route, error);
            }
            res.end();
        });
    }
    notFound(res) {
        res.statusCode = 404;
        throw Error("Page Not Found");
    }
    error(req, res, route, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!res.statusCode)
                res.statusCode = 500;
            const errorRoutes = require(MinuetCloudStatics.root + "/" + MinuetCloudStatics.src + "/routes/error").default;
            const firstClass = "ErrorHandle";
            let errorhandlePaths = [
                "minuet-server-cloud/src/errorhandles/" + firstClass,
            ];
            if (errorRoutes[res.statusCode]) {
                const secondClass = errorRoutes[res.statusCode];
                errorhandlePaths.unshift("minuet-server-cloud/src/errorhandles/" + secondClass);
            }
            if (route) {
                if (route.container && MinuetCloudStatics.containers[route.container]) {
                    const containerPath = MinuetCloudStatics.containers[route.container].root;
                    errorhandlePaths.unshift(containerPath + "/src/errorhandles/" + firstClass);
                    let errorRoutes;
                    try {
                        errorRoutes = require(containerPath + "/" + MinuetCloudStatics.src + "/routes/error").default;
                        if (errorRoutes[res.statusCode]) {
                            errorhandlePaths.unshift(containerPath + "/src/errorhandles/" + errorRoutes[res.statusCode]);
                        }
                    }
                    catch (err) { }
                }
            }
            let ehFlg = false;
            let errorHandle;
            for (let n = 0; n < errorhandlePaths.length; n++) {
                const handlePath = errorhandlePaths[n];
                try {
                    let handleClass;
                    try {
                        handleClass = require(handlePath)[path.basename(handlePath)];
                    }
                    catch (err) {
                        continue;
                    }
                    errorHandle = new handleClass(req, res, route);
                    errorHandle.view = path.basename(handlePath);
                    ehFlg = true;
                    if (errorHandle.filterBefore) {
                        const result = yield errorHandle.filterBefore(error);
                        if (result) {
                            res.write(result);
                        }
                    }
                    if (errorHandle.handle) {
                        const result = yield errorHandle.handle(error);
                        if (result) {
                            res.write(result);
                        }
                    }
                    if (errorHandle.filterAfter) {
                        const result = yield errorHandle.filterAfter(error);
                        if (result) {
                            res.write(result);
                        }
                    }
                    break;
                }
                catch (err) {
                    res.write(err.stack.toString());
                    break;
                }
            }
            if (!ehFlg) {
                res.write(error.stack.toString());
            }
            console.log(error.stack);
        });
    }
}
exports.MinuetCloud = MinuetCloud;
