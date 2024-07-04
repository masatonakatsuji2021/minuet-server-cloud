"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goto = void 0;
const minuet_server_cloud_1 = require("minuet-server-cloud");
class Goto {
    constructor(res) {
        this.res = res;
    }
    /**
     * ***url***
     * @param {MinuetCloudRoute} route
     * @returns
     */
    url(route) {
        const c = Object.keys(minuet_server_cloud_1.MinuetCloudStatics.routes);
        let decisionUrl = "";
        for (let n = 0; n < c.length; n++) {
            const targetUrl = c[n];
            const targetRoute = minuet_server_cloud_1.MinuetCloudStatics.routes[targetUrl];
            let status = true;
            if (route.controller) {
                if (route.controller != targetRoute.controller)
                    status = false;
            }
            if (route.action) {
                if (route.action != targetRoute.action)
                    status = false;
            }
            if (route.container) {
                if (route.container != targetRoute.container)
                    status = false;
            }
            if (status) {
                decisionUrl = targetUrl;
                break;
            }
        }
        if (!decisionUrl) {
            return "";
        }
        const d = decisionUrl.split("/");
        if (!route.args)
            route.args = [];
        let ind = 0;
        for (let n = 0; n < d.length; n++) {
            let d_ = d[n];
            if (!(d_.indexOf("{") > -1 && d_.indexOf("}") > -1))
                continue;
            let ans = route.args[ind];
            if (ans) {
                d[n] = ans.toString();
            }
            else {
                delete d[n];
            }
            ind++;
        }
        decisionUrl = d.join("/");
        if (decisionUrl[decisionUrl.length - 1] == "/") {
            decisionUrl = decisionUrl.substring(0, decisionUrl.length - 1);
        }
        return decisionUrl;
    }
    /**
     * ***redirect***
     * @param {MinuetCloudRoute | string} route
     * @param {number} statusCode = 302
     * @returns
     */
    redirect(route, statusCode) {
        if (!statusCode)
            statusCode = 302;
        let url;
        if (typeof route == "string") {
            url = route;
        }
        else {
            url = this.url(route);
        }
        if (!url)
            return;
        this.res.statusCode = statusCode;
        this.res.setHeader("location", url);
        this.res.end();
    }
}
exports.Goto = Goto;
