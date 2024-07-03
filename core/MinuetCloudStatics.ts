import { Mse } from "minuet-script-engine";
import { MinuetWeb } from "minuet-server-web";
import { MinuetCloudRoutes, MinuetCloudContainers } from "minuet-server-cloud";

export class MinuetCloudStatics {
    public static root : string;
    public static src : string;
    public static localDir : string;
    public static tempDir : string;
    public static containersInit : {[containerName: string] : MinuetCloudContainerRoute };
    public static routeConverts : {[url: string] : string};
    public static routes : MinuetCloudRoutes;
    public static containers: MinuetCloudContainers = {};
    public static mse : Mse;
    public static web : MinuetWeb;
}

interface MinuetCloudContainerRoute {
    [url: string] : string,
}