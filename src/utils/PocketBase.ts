import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://rizwan-portfolio.fly.dev');

export const login = async ({user, password}) => {
    return await pb.collection('users').authWithPassword(user, password);
}

export const register = async ({name, email, password}) => {
    return await pb.collection('users').create({name, email, password, passwordConfirm: password});
}


// after the above you can also access the auth data from the authStore
// console.log(pb.authStore.isValid);
// console.log(pb.authStore.token);
// console.log(pb.authStore.model.id);

// "logout" the last authenticated account
pb.authStore.clear();