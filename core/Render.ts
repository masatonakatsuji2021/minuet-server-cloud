import { Controller } from "minuet-server-cloud/core/Controller";
import { MinuetCloudStatics, MinuetCloudRoute } from "minuet-server-cloud";
import { IMseLoadResult } from "minuet-script-engine";

export class Render {

    private route : MinuetCloudRoute;
    private controller : Controller;

    public constructor(route, controller){
        this.route = route;
        this.controller = controller;
    }

    public async view(viewPath? : string) : Promise<IMseLoadResult> {

        const container = MinuetCloudStatics.containers[this.route.container];

        if (!viewPath) {
            viewPath = "views/" + this.controller.view + container.cloud.mse.ext;
        }
        else {
            viewPath = "views/" + viewPath + container.cloud.mse.ext;
        }

        return await container.cloud.mse.load(viewPath);
    };



}