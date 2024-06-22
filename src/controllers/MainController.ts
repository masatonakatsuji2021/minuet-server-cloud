import { Controller } from "minuet-server-cloud/src/controllers/Controller";

export class MainController extends Controller {

    public autoRender : boolean = true;
    public layout : string = "type1";

    public async index() {

    }

    public async login() {
        this
            .setData("hideHeader", true)
            .setData("hideSIdemenu", true)
        ;
    }
}