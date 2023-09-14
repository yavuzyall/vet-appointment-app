import axios from "axios";
import { IPet } from "../models/IPet";

const BASE_URL = 'http://localhost:3000';

export class PetService {
    static async getPetsByUserId(userId: string) {
        try {
            const response = await axios.get(`${BASE_URL}/pets?ownerUserId=${userId}`);
            return response.data
        } catch (error) {
            console.error("Hayvanlar alınırken bir hata oluştu:", error);
            throw error;
        }
    }

    static async getAllPetsOfUser(userId: string): Promise<IPet[]> {
        try {
            const response = await axios.get(`${BASE_URL}/users/${userId}`);
            if (response.data && response.data.pets) {
                return response.data.pets;
            }
            return [];
        } catch (error) {
            console.error("Kullanıcının hayvanları alınırken bir hata oluştu:", error);
            throw error;
        }
    }

}