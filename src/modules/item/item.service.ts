import { ItemRepository } from "./item.repository"
import type { Item, ItemCsvExport, ItemExcelExport } from './item.types';

export class ItemService {
    private repository = new ItemRepository();

    async fetch({env, page, pageSize, search, filterModel, sortModel}: {env: any, page: any, pageSize: any, search: any, filterModel: any, sortModel: any}) {
        const result = this.repository.fetchItems({env, page, pageSize, search, filterModel, sortModel});
        return result;
    }

    async getItems({
        user_name, 
        env, 
        page, 
        pageSize, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: Item) {
        const response = await this.repository.items({
            user_name, 
            env, 
            page, 
            pageSize, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
    }); 
        return response;
    }

    async csvExport({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ItemCsvExport) {
        const response = await this.repository.csvExport({
            user_name, 
            env, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async excelExport({
        user_name, 
        env, 
        search, 
        sortColum, 
        sortOrder,
        filterModel
    }: ItemExcelExport) {
        const response = await this.repository.excelExport({
            user_name, 
            env, 
            search, 
            sortColum, 
            sortOrder,
            filterModel
        });

        return response;
    }

    async itemRowsUpdate(payload:  any) {
        const response = await this.repository.itemRowsUpdate(payload);
        return response;
    }

}