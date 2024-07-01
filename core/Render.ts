import { Controller, MinuetCloudStatics, MinuetCloudRoute } from "minuet-server-cloud";
import { IMseLoadResult, SandBox } from "minuet-script-engine";

export class Render {

    private route : MinuetCloudRoute;
    private controller : Controller;
    private sandbox : SandBox;
    private data = {};

    public constructor(route, controller){
        this.route = route;
        this.controller = controller;
    }

    public setSandBox() {
        const sandbox = new SandBox();
        sandbox.route = this.route;
        sandbox.controller = this.controller;
            
        if (this.data) {
            const vd = Object.keys(this.data);
            for (let n = 0 ; n < vd.length ; n++) {
                const name = vd[n];
                const value = this.data[name];
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

    /**
     * ***set*** : Passes data to the rendering side, such as View, ViewPart, and Layout.
     * @param {string} name 
     * @param {ayn} value 
     * @returns 
     */
    public set(name : string, value : any) : Render {
        this.data[name] = value;
        return this;
    }

    /**
     * ***view*** - Load the rendering view file with Minute-Script-Engine.  
     * If you do not specify the viewPath argument,   
     * it will automatically load with the path of the View member variable of the Controller or ErrorHandle.
     * @param {string} viewPath - View File Name
     * @returns
     */
    public async view(viewPath? : string)  {
        if (!viewPath) viewPath =  this.controller.view;
        if (this.route.container){
            return await this.containerView(viewPath, this.route.container);
        }
        else {
            return await this.parentView(viewPath);
        }
    };
    
    /**
     * ***parentView*** - Forces the parent screen's View file to be loaded by Minute-Script-Engine.
     * @param {string} viewPath - View File Name
     * @returns 
     */
    public async parentView(viewPath : string)  {
        let directory : string = "views";
        if (this.controller.error) directory = "errors";
        viewPath = directory + "/" + viewPath + MinuetCloudStatics.mse.ext;
        if (!this.sandbox) this.sandbox = this.setSandBox();
        return await MinuetCloudStatics.mse.load(viewPath, this.sandbox);
    }

    /**
     * ***containerView*** - Loads the View file for the specified CloudContainer using Minute-Script-Engine..
     * @param {string} viewPath - View File Name
     * @param {string} container - Cloud COntainer Name
     * @returns 
     */
    public async containerView(viewPath : string, container : string)  {
        let directory : string = "views";
        if (this.controller.error) directory = "errors";
        viewPath = "/" + container + "/" + directory + "/" + viewPath + MinuetCloudStatics.mse.ext;
        if (!this.sandbox) this.sandbox = this.setSandBox();
        return await MinuetCloudStatics.mse.load(viewPath, this.sandbox);
    }

    public async viewPart(viewPartPath : string){
        if (this.route.container){
            return await this.containerViewPart(viewPartPath, this.route.container);
        }
        else {
            return await this.parentViewPart(viewPartPath);
        }
    }

    public async parentViewPart(viewPartPath : string){
        viewPartPath = "viewparts/" + viewPartPath + MinuetCloudStatics.mse.ext;
        if (!this.sandbox) this.sandbox = this.setSandBox();
        return await MinuetCloudStatics.mse.load(viewPartPath, this.sandbox);
    }

    public async containerViewPart(viewPartPath : string, container : string) {
        viewPartPath = "/" + container + "/viewparts/" + viewPartPath + MinuetCloudStatics.mse.ext;
        if (!this.sandbox) this.sandbox = this.setSandBox();
        return await MinuetCloudStatics.mse.load(viewPartPath, this.sandbox);
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