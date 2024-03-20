/**
 * @description This hook checks for the existence of an email addresss or phone number in the user's Auth profile.
 * These values are then used to protect the home route.
 * @returns See ReturnType interface below
 */

import { LoadingStateTypes } from '@/components/redux/types';
import { useAuth } from '@/components/useAuth';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

// checks if 'phone' property exists in auth.user object
export function doesPhoneExist(user: User): boolean {
    const exists = user.providerData.some((data) => data.providerId === 'phone');
    return exists;
}

// checks if 'google.com' OR 'password' property exists in auth.user object
export function doesEmailExist(user: User): boolean {
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
        // if phone number exists in auth object, update state
        if (auth.type === LoadingStateTypes.LOADED && auth.user != null) {
            const boolean = doesPhoneExist(auth.user);
            setPhoneExists(boolean);
        }
        // if email address exists in auth object, update state
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
