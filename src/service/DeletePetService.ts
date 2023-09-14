import axios from "axios";
import {IPet} from '../models/IPet';

const API_URL = 'http://localhost:3000';

export const deletePetFromUser = async (userId: string, petId: number): Promise<void> => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        const user = response.data;

        const updatedPets = user.pets.filter((pet: IPet) => pet.petId !== petId);

        await axios.put(`${API_URL}/users/${userId}`, {...user, pets: updatedPets});

        const key = `user_${userId}_pet_${petId}_photo`;
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Hayvan silinirken bir hata oluştur: ", error);
        
    };
};