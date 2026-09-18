import { ReceivingApprovalRepository } from "./receiving_approval.repository";
import type { Update } from "./receiving_approval.types";

export class ReceivingApprovalService {
    private repository = new ReceivingApprovalRepository();

    async getStores() {
        const result = this.repository.getStores();
        return result;
    }

    async updateStore(payload: Update) {
        const isEnable = payload.isEnable ? 'Y' : 'N';
        const type = payload.type;

        const result = await this.repository.updateStore({isEnable, type});

        if (result === 0 || result === undefined) {
            throw new Error('Store not found or no row was updated');
        }

        return {
            success: true,
        };
    }
}