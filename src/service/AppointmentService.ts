import axios from 'axios';
import { IAppointment } from '../models/IAppointment';

const BASE_URL = 'http://localhost:3000';

const API_URL = 'http://localhost:3000/appointments';

const APPOINTMENT_API_URL = "http://localhost:3000/appointments";

export class AppointmentService{
    static async getAppointmentByUserId(userId: string){
        const response = await axios.get(`${BASE_URL}/appointments?ownerUserId=${userId}`);
        return response.data
    };
};

export const createAppointment = async (appointment: IAppointment): Promise<IAppointment> => {
    const response = await axios.post(API_URL, appointment);
    return response.data;
};

export const getAppointments = async (): Promise<IAppointment[]> => {
    const response = await axios.get(APPOINTMENT_API_URL);
    return response.data;
};

export const deleteAppointment = async (appointmentId: number): Promise<void> => {
    await axios.delete(`${APPOINTMENT_API_URL}/${appointmentId}`);
}