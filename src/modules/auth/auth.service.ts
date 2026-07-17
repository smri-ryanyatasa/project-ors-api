
import { comparePassword } from "../../lib/password";
import { generateToken } from "../../lib/jwt";
import { hashPassword } from "../../lib/password";
import type { LoginResponse } from "./auth.types";
import { type LoginSchemaType, type ChangePasswordSchemaType } from "./auth.schema";
import { AuthRepository } from "./auth.repository";

export class AuthService {
    private repository = new AuthRepository();

    async login(payload: LoginSchemaType) {
        const user = await this.repository.findByUsername(
            payload.username
        );

        if (!user) {
            return {
                success: false,
                message: 'Invalid username or password.'
            }
        }

        const isValidPassword = await comparePassword(
            payload.password,
            user.password
        );

        if (!isValidPassword) {
             return {
                success: false,
                message:  'Invalid username or password.'
            }
        }

        const accessToken = generateToken(user);

        return {
            accessToken: accessToken,
            success: true,
            user: {
                user_id: user.user_id,
                user_name: user.user_name,
            },
        };
    }

    async changePassword(userId: number, payload: ChangePasswordSchemaType) {
        const currentPassword = await this.repository.findPasswordById(userId);
        
        if (!currentPassword) {
            return {
                message: 'User not found.',
            }
        }

        const isValid = await comparePassword(
            payload.current_password,
            currentPassword
        );

        if (!isValid) {
            return {
                message: 'Current password is incorrect.',
            }
        }

        const hashedPassword = await hashPassword(
            payload.new_password
        );

        const result = await this.repository.updatePassword(
            userId,
            hashedPassword
        );

        return {
            status: 'success',
            message: 'Change password successfully.',
        } 
    }

    async getCurrentUser(userId: number) {
        const user = await this.repository.findUserById(userId);

         if (!user) {
            return {
                message: 'User not found.',
            }
        }

        return {
            "user": user
        };
    }
}