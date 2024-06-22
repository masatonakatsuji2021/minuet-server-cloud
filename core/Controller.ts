import { IncomingMessage, ServerResponse } from "http";

export class Controller {

    public req : IncomingMessage;
    public res : ServerResponse;
    public layout : string = null;
    public layoutParent : boolean = true;
    public view : string = null;
    public autoRender: boolean = false;
    public viewData : any = {};

    public setData(name : string, value : any) : Controller {
        this.viewData[name] = value;
        return this;
    }

    public constructor(req, res){
        this.req = req;
        this.res = res;
    }

    public filterBefore?() : Promise<string|void>;

    public filterAfter?() : Promise<string|void>;
    
}