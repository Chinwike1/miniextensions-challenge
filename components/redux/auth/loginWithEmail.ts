import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    EmailAuthCredential,
    createUserWithEmailAndPassword,
    linkWithCredential,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import isEmail from 'validator/lib/isEmail';
import { useAppSelector } from '../store';
import { AuthContextType } from '@/components/useAuth';
import { LoadingStateTypes } from '../types';

export const loginWithEmail = createAsyncThunk(
    'login',
    async (args: { type: 'login' | 'sign-up'; email: string; password: string }, { dispatch }) => {
        try {
            if (!isEmail(args.email)) {
                dispatch(
                    showToast({
                        message: 'Enter a valid email',
                        type: 'info',
                    })
                );
                return;
            }
            if (args.password.length < 6) {
                dispatch(
                    showToast({
                        message: 'Password should be atleast 6 characters',
                        type: 'info',
                    })
                );
                return;
            }

            if (args.type === 'sign-up') {
                await createUserWithEmailAndPassword(firebaseAuth, args.email, args.password);
            }

            await signInWithEmailAndPassword(firebaseAuth, args.email, args.password);
        } catch (e: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                    type: 'error',
                })
            );
        }
    }
);

export const linkWithEmailProvider = createAsyncThunk(
    'linkWithEmailProvider',
    async (
        args: {
            auth: AuthContextType;
            credential: EmailAuthCredential;
            callback: (
                args:
                    | { type: 'success' }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        if (args.auth.type !== LoadingStateTypes.LOADED) return;

        try {
            if (args.auth.type === LoadingStateTypes.LOADED && args.auth.user !== null) {
                await linkWithCredential(args.auth.user, args.credential);
            }

            firebaseAuth.currentUser?.reload();

            // dispatch(
            //     showToast({
            //         message: 'Your email address has been linked successfully!',
            //         type: 'success',
            //     })
            // );

            args.callback({ type: 'success' });
        } catch (e: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                });
        }
    }
);

export const useIsLoginWithEmailLoading = () => {
    const loading = useAppSelector((state) => state.loading.loginWithEmail);
    return loading;
};

export const useLinkWithEmailProviderLoading = () => {
    const loading = useAppSelector((state) => state.loading.linkWithEmailProvider);
    return loading;
};
