import { Controller } from "minuet-server-cloud/core/Controller";
import { Fook } from "minuet-server-cloud/core/Fook";

export class MainController extends Controller {

    public autoRender : boolean = true;

    public index() { 

        const target = Fook.action("test1", "run");
        this.res.write(target.join("<br>"));

    }
}