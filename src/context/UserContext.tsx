import { createContext } from "react";
import { IUser } from "../models/IUser";

export type UserContextType = {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;