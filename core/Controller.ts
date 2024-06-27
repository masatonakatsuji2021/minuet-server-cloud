import { IncomingMessage, ServerResponse } from "http";
import { Render } from "minuet-server-cloud/core/Render";

export class Controller {

    public req : IncomingMessage;
    public res : ServerResponse;
    public layout : string = null;
    public layoutParent : boolean = true;
    public view : string = null;
    public autoRender: boolean = false;
    public viewData : any = {};
    public Render : Render
    public container : string;

    public setData(name : string, value : any) : Controller {
        this.viewData[name] = value;
        return this;
    }

    public constructor(req, res, route){
        this.req = req;
        this.res = res;
        this.Render = new Render(route, this);
    }

    public filterBefore?() : Promise<string|void>;

    public filterAfter?() : Promise<string|void>;
    
}