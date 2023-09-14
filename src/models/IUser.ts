import { Timestamp } from "firebase/firestore";
import { IPet } from "./IPet";

export interface IUser{
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    pets?: IPet[];
}