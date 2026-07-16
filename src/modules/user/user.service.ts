import { UserRepository } from "./user.repository";
import { type CreateUserSchemaType, type UpdateUserSchemaType } from "./user.schema";

export class UserService {
    private repository = new UserRepository();

    async getUsers() {
        return this.repository.findAll();
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
                message: 'Username already exists.',
            }
        }

        const user = await this.repository.create(payload);

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
}