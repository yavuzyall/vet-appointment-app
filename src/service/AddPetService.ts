import { IPet } from "../models/IPet";
import axios from 'axios';

const API_URL = "http://localhost:3000/users";

export const addPetToUser = async (userId: string, pet: IPet) => {
    const userResponse = await axios.get(`${API_URL}/${userId}`);
    const user = userResponse.data;

    const updatedPets = user.pets ? [...user.pets, pet] : [pet];

    const updateResponse = await axios.put(`${API_URL}/${userId}`, {
        ...user,
        pets: updatedPets,
    });

    return updateResponse.data;
}