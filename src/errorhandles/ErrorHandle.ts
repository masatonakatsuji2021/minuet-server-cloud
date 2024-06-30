import { ErrorHandle as e_ } from "minuet-server-cloud";

export class ErrorHandle extends e_ {

    public async handle(error : Error) {

        const res = await this.Render.parentView(this.view);
        this.res.write(res.content);
    }
}