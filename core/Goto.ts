import { ServerResponse } from "http";
import { MinuetCloudStatics, MinuetCloudRoute } from "minuet-server-cloud";

export class Goto{

    private res : ServerResponse;

    public constructor(res : ServerResponse) {
        this.res = res;
    }
    
    /**
     * ***url*** 
     * @param {MinuetCloudRoute} route 
     * @returns 
     */
    public url (route : MinuetCloudRoute) : string {
        const c = Object.keys(MinuetCloudStatics.routes);
        let decisionUrl : string = "";
        for (let n = 0 ; n < c.length ; n++) {
            const targetUrl = c[n];
            const targetRoute = MinuetCloudStatics.routes[targetUrl];
            let status : boolean = true;

            if (route.controller) {
                if (route.controller != targetRoute.controller) status = false;
            }
            if (route.action) {
                if (route.action != targetRoute.action) status = false;
            }
            if (route.container) {
                if (route.container != targetRoute.container) status = false;
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
        if (!route.args) route.args = [];
        let ind = 0;
        for (let n = 0 ; n < d.length ; n++) {
            let d_ = d[n];
            if (!(d_.indexOf("{") > -1 && d_.indexOf("}") > -1))  continue;
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
            decisionUrl = decisionUrl.substring(0, decisionUrl.length -1);
         }

        return decisionUrl;
    }

    /**
     * ***redirect***
     * @param {MinuetCloudRoute | string} route 
     * @param {number} statusCode = 302
     * @returns 
     */
    public redirect(route : MinuetCloudRoute | string, statusCode? : number) : void {
        if (!statusCode) statusCode = 302;
        let url : string;
        if (typeof route == "string") {
            url = route;
        }
        else 
        {
            url = this.url(route);
        }
         if (!url) return;
        this.res.statusCode = statusCode;
        this.res.setHeader("location", url);
        this.res.end();
    }

}