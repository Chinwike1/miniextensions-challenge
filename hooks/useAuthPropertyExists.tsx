import { LoadingStateTypes } from '@/components/redux/types';
import { useAuth } from '@/components/useAuth';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

export function doesPhoneExist(user: User): boolean {
    // check if 'phone' property exists in auth.user object
    const exists = user.providerData.some((data) => data.providerId === 'phone');
    return exists;
}

export function doesEmailExist(user: User): boolean {
    // check if 'google.com' OR 'password' property exists in auth.user object
    const email = user.providerData.some((data) => data.providerId === 'google.com');
    const password = user.providerData.some((data) => data.providerId === 'password');
    return email || password;
}

interface ReturnType {
    emailExists: boolean;
    phoneExists: boolean;
}

export default function useAuthPropertyExists(): ReturnType {
    const auth = useAuth();
    const authInstance = getAuth();
    const [emailExists, setEmailExists] = useState<boolean>(false);
    const [phoneExists, setPhoneExists] = useState<boolean>(false);

    useEffect(() => {
        // check if 'phone' property exists in auth.user object
        if (auth.type === LoadingStateTypes.LOADED && auth.user != null) {
            const boolean = doesPhoneExist(auth.user);
            setPhoneExists(boolean);
        }
        // check if 'google.com' OR 'password' property exists in auth.user object
        if (auth.type === LoadingStateTypes.LOADED && auth.user != null) {
            const boolean = doesEmailExist(auth.user);
            setEmailExists(boolean);
        }

        onAuthStateChanged(authInstance, (user) => {
            if (user) {
                const email = doesEmailExist(user);
                const phone = doesPhoneExist(user);
                setEmailExists(email);
                setPhoneExists(phone);
                console.log(user);
            } else {
                setEmailExists(false);
                setPhoneExists(false);
                console.log('User not found');
            }
        });

        /* eslint-disable-next-line */
    }, []);

    return { emailExists, phoneExists };
}
