import { IncomingMessage, ServerResponse } from "http";
import { IMseLoadResult } from "minuet-script-engine";
import { Render } from "minuet-server-cloud";
import { MinuetCloudStatics, MinuetCloudRoute } from "minuet-server-cloud";

export class Controller {

    public req : IncomingMessage;
    public res : ServerResponse;

    public layout : string = null;
    public layoutParent : boolean = true;
    public view : string = null;
    public autoRender: boolean = false;
    public viewData : any = {};
    public Render : Render
    public route : MinuetCloudRoute;

    public setData(name : string, value : any) : Controller {
        this.viewData[name] = value;
        return this;
    }

    public constructor(req, res, route){
        this.req = req;
        this.res = res;
        this.route = route;
        this.Render = new Render(route, this);
    }

    public filterBefore?() : Promise<string|void>;

    public filterAfter?() : Promise<string|void>;
    
    public async __rendering() {

        if (!this.autoRender) return;

        let result : IMseLoadResult;
        if (this.layout) {
            result = await this.Render.layout();
        }   
        else {
            result = await this.Render.view();   
        }

        this.res.write(result.content);
    }
}