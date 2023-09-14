export interface IAppointment{
    id?: number;
    date: string;
    time: string;
    description: string;
    petId: number;
    ownerUserId: string;
    veterinarianId: number;
}