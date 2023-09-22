import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from '@firebase/auth';
import { auth, user } from '@/utils/Firebase';

export const login = async ({ user, password }) => {
  let result: UserCredential = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, user, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export const register = async ({ name, email, password }) => {
  let result: UserCredential = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
    auth
      .updateCurrentUser({
        ...user,
        displayName: name
      })
      .then(function () {
        // Update successful.
        console.log('User Profile Updated Successfully');
      })
      .catch(function (error) {
        // An error happened.
        console.log('User Profile Update Failed', error);
      });
  } catch (e) {
    error = e;
  }

  return { result, error };
};
