import { Controller } from "minuet-server-cloud/core/Controller";

export class ErrorHandle extends Controller {
    public error : boolean = true;

    public filterBefore?(error : Error) : Promise<string|void>;

    public handle?(error : Error) : Promise<string|void>;

    public filterAfter?(error : Error) : Promise<string|void>;
}