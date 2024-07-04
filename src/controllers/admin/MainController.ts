import { AdminController, Goto } from "minuet-server-cloud";

export class MainController extends AdminController {

    public async index() { 

/*
        console.log(this.Goto.url({ controller: "admin/setting", action: "index" }));
        console.log(this.Goto.url({ container: "sample_1", controller: "main" }));
        console.log(this.Goto.url({ controller: "admin/account", action: "edit2" , args: [ 111, 222 ]}));
        console.log(this.Goto.url({ controller: "admin/account", action: "edit2" , args: [ 333 ]}));
        */
    }

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