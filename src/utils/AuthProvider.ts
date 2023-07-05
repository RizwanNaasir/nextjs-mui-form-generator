import {createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential} from "@firebase/auth";
import {auth} from "@/utils/Firebase";

export const login = async ({user, password}) => {
    let result: UserCredential = null, error = null;
    try {
        result = await signInWithEmailAndPassword(auth, user, password);
    } catch (e) {
        error = e;
    }

    return {result, error};
}

export const register = async ({email, password}) => {
    let result: UserCredential = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return {result, error};
}
