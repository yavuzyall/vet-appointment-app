import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebaseConfig";

export class AuthService {
    async signUpWithEmailandPassword(email: string, password: string): Promise<string> {
        let userId: string = ""; 
        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            userId = userCredential.user.uid;
        })
        return userId;
    }    
    async signInWithEmailandPassword(email: string, password: string): Promise<string>{
        let userId: string = "";
        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            userId = userCredential.user.uid;
        })
        return userId;
    }
}
