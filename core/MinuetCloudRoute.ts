export interface MinuetCloudRoutes {
    [url : string] : MinuetCloudRoute,
}

export interface MinuetCloudRoute {
    url? : string,
    container? : string,
    controller? : string,
    action? : string,
    args? : Array<string|number>,
    type? : string,
}
