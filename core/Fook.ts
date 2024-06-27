import { MinuetCloudStatics } from "minuet-server-cloud";

export class Fook {

    public static action(fookName : string, fookMethodName? : string, args? : Array<any>) : Array<any> {
        let result = [];
        
        const fookClassName = fookName.substring(0,1).toUpperCase() + fookName.substring(1) + "Fook";
        const containers = MinuetCloudStatics.containers;

        const c = Object.keys(containers);
        for (let n = 0 ; n < c.length ; n++) {
            const containerName = c[n];

            let fookClassPath;
            if (containerName == "_") {
                fookClassPath = MinuetCloudStatics.rootDir + "/fooks/" + fookClassName;
            }
            else {
                const container = containers[containerName];
                fookClassPath = container.cloud.root + "/fooks/" + fookClassName;
            }

            try {
                const fookClass = require(fookClassPath)[fookClassName];
                const fook = new fookClass();

                if (fookMethodName){
                    let buff;
                    if (fook[fookMethodName]){

                        if (args) {
                            buff = fook[fookMethodName](...args);
                        }
                        else {
                            buff = fook[fookMethodName]();
                        }
                        result.push(buff);
                    }
                }
                else {
                    result.push(fook);
                }
            }catch(err){
                console.log(err);
            }
        }

        
        return result;
    }

}