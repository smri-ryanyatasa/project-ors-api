import { UserRepository } from "./user.repository";
import { type CreateUserSchemaType, type UpdateUserSchemaType, type AdminChangePasswordSchemaType, type BulkUserUploadSchemaType } from "./user.schema";
import type { UserFilter } from "./user.types";
import { hashPassword } from "../../lib/password";

export class UserService {
    private repository = new UserRepository();
    private DEFAULT_PASSWORD = 'password';
    private CHUNK_SIZE = 100;

    async getUsers({
        page,
        pageSize,
        search,
        filterModel,
        sortModel
    }: {
        page: number;
        pageSize: number;
        search: string;
        filterModel: UserFilter[];
        sortModel: any
    }) {
        return this.repository.findAll({
            page,
            pageSize,
            search,
            filterModel,
            sortModel
        });
    }

    async getUser(userId: number) {
        const user = await this.repository.findById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        return user;
    }
    
    async createUser(payload: CreateUserSchemaType) {
        const existing = await this.repository.findByUsername(payload.user_name);

        if (existing) {
            return {
                status: 'error',
                message: 'Username already exists.',
            }
        }

        const hashedPassword = await hashPassword(payload.password);

        const user = await this.repository.create({
            ...payload,
            password: hashedPassword,
        });

        return {
            status: 'success',
            data: user
        }
    }

    async updateUser(userId: number, payload: UpdateUserSchemaType) {
        const existingUser = await this.repository.findById(userId);

        if (!existingUser) {
            return {
                message: 'Username not found.',
            }
        }

        const user = await this.repository.update(userId, payload);

        return {
            status: 'success',
            data: user
        }
    }

    async deleteUser(userId: number) {
        const existingUser = await this.repository.findById(userId);

        if (!existingUser) {
            return {
                message: 'Username not found.',
            }
        }

        const user = await this.repository.delete(userId);

        return {
            status: 'success',
            message: 'User successfully deleted.',
        }
    }

    async changeUserPassword(userId: number, payload: AdminChangePasswordSchemaType) {
        const user = await this.repository.findById(userId);

        if (!user) {
            return {
                message: 'Username not found.',
            }
        }
        
        const hashedPassword = await hashPassword(
            payload.new_password
        );

        await this.repository.updatePassword(userId, hashedPassword, payload.last_update_by);

        return {
            status: 'success',
            message: 'Password change successfully.',
        }
    }

    async userHistory(userId: number) {
        const user = await this.repository.history(userId);

        return user;
    }

    async bulkUpload(payload: BulkUserUploadSchemaType) {
        const usernames = new Set<string>();
        const duplicates = new Set<string>();
        
        for (const user of payload) {
            if (usernames.has(user.user_name)) {
            duplicates.add(user.user_name);
            }

            usernames.add(user.user_name);
        }

        if (duplicates.size > 0) {
            return {
                success: false,
                message: `Duplicate username(s): ${[...duplicates].join(', ')}`
            }
        }

        const arrayUsernames = payload.map((user) => user.user_name);
        
        const existing = await this.repository.findByUsernames(arrayUsernames);
        
        if (existing.length > 0) {
            return {
                success: false,
                message: 'Usernames already exist',
                usernames: existing,
            };

        }

        const hashedPassword = await hashPassword(this.DEFAULT_PASSWORD);

        const hashedPayload = await Promise.all(
            payload.map(async (user) => ({
                ...user,
                password: hashedPassword,
                mms: 'Y', // change for the future
                env: "SCP" // change for the future
            }))
        );

        for (let i = 0; i < hashedPayload.length; i += this.CHUNK_SIZE) {
            const chunk = hashedPayload.slice(i, i + this.CHUNK_SIZE);

            await this.repository.bulkCreate(chunk); 
        }
        
        return {
            success: true,
            message: `${payload.length} users has successfully created`
        };
    }

    async csvExport({
        search,
        filterModel,
        sortModel
    }: {
        search: string;
        filterModel: UserFilter[];
        sortModel: any
    }) {
        return this.repository.csvExport({
            search,
            filterModel,
            sortModel
        });
    }
    
    async excelExport({
        search,
        filterModel,
        sortModel
    }: {
        search: string;
        filterModel: UserFilter[];
        sortModel: any
    }) {
        return this.repository.excelExport({
            search,
            filterModel,
            sortModel
        });
    }
    
}