import { AdminController } from "minuet-server-cloud";

export class MainController extends AdminController {

    public async index() { }

    public async login() {
        this.Render
            .set("hideHeader", true)
            .set("hideSIdemenu", true)
        ;
    }

    public async logout() {
        this.autoRender = false;

        this.res.statusCode = 301;
        this.res.setHeader("location", "/admin/login");
        this.res.end();
    }
}