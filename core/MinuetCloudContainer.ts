export interface MinuetCloudContainers {
    [containerName : string] : MinuetCloudContainer,
}

export interface MinuetCloudContainer {
    name? : string,
    root? : string,
}
