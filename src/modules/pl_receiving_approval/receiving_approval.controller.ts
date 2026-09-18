import { Context } from "hono";

import { ReceivingApprovalService } from "./receiving_approval.service";

export class ReceivingApprovalController {
    private service = new ReceivingApprovalService();

    async getStores(c: Context): Promise<Response> {
        const result = await this.service.getStores();
        return c.json(result);
    }

    async update(c: Context): Promise<Response> {
        const body = await c.req.json();

        const result = await this.service.updateStore(body);
        return c.json(result);
    }
}