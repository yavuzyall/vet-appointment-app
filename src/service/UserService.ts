import axios from 'axios';
import { IUser } from '../models/IUser';

const BASE_URL = 'http://localhost:3000';

export class UserService{
    static async register(user: IUser): Promise<IUser> {
        const response = await axios.post(`${BASE_URL}/users`, user);
        return response.data;
    }

    static async getUserById(userId: string): Promise<IUser | null> {
        const response = await axios.get(`${BASE_URL}/users/${userId}`);
        return response.data || null;
    }
    
}