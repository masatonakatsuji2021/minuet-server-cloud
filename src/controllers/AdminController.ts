import { Controller } from "minuet-server-cloud/src/controllers/Controller";

export class AdminController extends Controller {

    public autoRender : boolean = true;
    public layout : string = "type1";

    public async index() { }

    public async login() {
        this
            .setData("hideHeader", true)
            .setData("hideSIdemenu", true)
        ;
    }

    public async logout() {
        this.autoRender = false;

        this.res.statusCode = 301;
        this.res.setHeader("location", "/admin/login");
        this.res.end();
    }
}