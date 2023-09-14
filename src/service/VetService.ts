import axios from 'axios';
import { IVet } from '../models/IVets';

const API_URL = "http://localhost:3000/vets";

export const getVets = async (): Promise<IVet[]> => {
    const response = await axios.get(API_URL);
    return response.data;
}

export const getVetById = async (vetId: number): Promise<IVet> => {
    const response = await axios.get(`${API_URL}/?id=${vetId}`);
    return response.data;
}