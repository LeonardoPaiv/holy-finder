import { User } from '@/types';

export class UserService {
    static async getUserByEmail(email: string): Promise<User | null> {
        try {
            const response = await fetch(`/api/users/${email}`);
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }
}
