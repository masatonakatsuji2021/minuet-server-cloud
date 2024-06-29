import { Controller, MinuetCloudStatics, MinuetCloudRoute } from "minuet-server-cloud";
import { IMseLoadResult, SandBox } from "minuet-script-engine";

export class Render {

    private route : MinuetCloudRoute;
    private controller : Controller;
    private sandbox : SandBox;

    public constructor(route, controller){
        this.route = route;
        this.controller = controller;
    }

    public setSandBox() {
        const sandbox = new SandBox();
        sandbox.route = this.route;
        sandbox.controller = this.controller;
            
        if (this.controller.viewData) {
            const vd = Object.keys(this.controller.viewData);
            for (let n = 0 ; n < vd.length ; n++) {
                const name = vd[n];
                const value = this.controller.viewData[name];
                sandbox[name] = value;
            }
        }

        sandbox.view = async (viewPath? : string) => {
            return await this.view(viewPath);
        }
        sandbox.parentView = async (viewPath : string)=> {
            return await this.parentView(viewPath);
        };
        sandbox.containerView = async (viewPath : string, container? : string)=> {
            return await this.containerView(viewPath, container);
        };
        sandbox.viewPart = async(viewPartPath : string)=> {
            return await this.viewPart(viewPartPath);
        };
        sandbox.parentViewPart = async(viewPartPath : string)=> {
            return await this.parentViewPart(viewPartPath);
        };
        sandbox.containerViewPart = async (viewPartPath : string, container? : string)=> {
            return await this.containerViewPart(viewPartPath, container);
        };
        sandbox.layout = async(layoutPath?: string)=> {
            return await this.layout(layoutPath);
        };
        sandbox.parentLayout = async (layoutPath: string)=>{
            return await this.parentLayout(layoutPath);
        };
        sandbox.containerLayout = async (layoutPath : string, container? : string)=> {
            return await this.containerLayout(layoutPath, container);
        };
        sandbox.sandbox = this.sandbox;
        sandbox.setSandBox = this.setSandBox;

        return sandbox;
    }

    public async view(viewPath? : string)  {

        if (!viewPath) viewPath =  this.controller.view;

        if (this.route.container){
            viewPath = "/" + this.route.container + "/views/" + viewPath + MinuetCloudStatics.mse.ext;
        }
        else {
            viewPath = "views/" + viewPath + MinuetCloudStatics.mse.ext;
        }
        if (!this.sandbox) {
             this.sandbox = this.setSandBox();
        }
        return await MinuetCloudStatics.mse.load(viewPath, this.sandbox);
    };
    
    public async parentView(viewPath : string)  {

    }

    public async containerView(viewPath : string, container : string)  {

    }

    public async viewPart(viewPartPath : string){
        if (this.route.container){
            viewPartPath = "/" + this.route.container + "/viewparts/" + viewPartPath + MinuetCloudStatics.mse.ext;
        }
        else {
            viewPartPath = "viewparts/" + viewPartPath + MinuetCloudStatics.mse.ext;
        }
        if (!this.sandbox) {
            this.sandbox = this.setSandBox();
       }
        return await MinuetCloudStatics.mse.load(viewPartPath, this.sandbox);
    }

    public async parentViewPart(viewPartPath : string){
        viewPartPath = "viewparts/" + viewPartPath + MinuetCloudStatics.mse.ext;
        if (!this.sandbox) {
            this.sandbox = this.setSandBox();
       }
       return await MinuetCloudStatics.mse.load(viewPartPath, this.sandbox);
    }

    public async containerViewPart(viewpartPath : string, container : string) {


    }

    public async layout(layoutPath? : string) : Promise<IMseLoadResult> {
        if (!layoutPath) {
            layoutPath = this.controller.layout;
        }
        layoutPath = "layouts/" + layoutPath + MinuetCloudStatics.mse.ext;
        if (!this.sandbox){
            this.sandbox = this.setSandBox();
        }
        return await MinuetCloudStatics.mse.load(layoutPath, this.sandbox);
    }

    public async parentLayout(layoutPath : string) {


    }

    public async containerLayout(layoutPath : string, container : string) {


    }

}