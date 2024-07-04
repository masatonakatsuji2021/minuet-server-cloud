import { IncomingMessage, ServerResponse } from "http";
import { IMseLoadResult } from "minuet-script-engine";
import { Render, MinuetCloudRoute, Goto } from "minuet-server-cloud";

export class Controller {

    public req : IncomingMessage;
    public res : ServerResponse;
    public error : boolean = false;
    public layout : string = null;
    public layoutParent : boolean = true;
    public view : string = null;
    public autoRender: boolean = false;
    public Render : Render
    public Goto : Goto;
    public route : MinuetCloudRoute;

    public constructor(req : IncomingMessage, res : ServerResponse, route : MinuetCloudRoute){
        this.req = req;
        this.res = res;
        this.route = route;
        this.Render = new Render(route, this);
        this.Goto = new Goto(res);
    }

    public filterBefore?(any?) : Promise<string|void>;

    public filterAfter?(any?) : Promise<string|void>;
    
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