import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    // ConfirmationResult,
    PhoneAuthProvider,
    RecaptchaVerifier,
    linkWithPhoneNumber,
    signInWithCredential,
    signInWithPhoneNumber,
    updatePhoneNumber,
} from 'firebase/auth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import { LoadingStateTypes } from '../types';
import { AuthInstanceType, AuthContextType } from '@/components/useAuth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// interface CustomWindow extends Window {
//     confirmationResult?: ConfirmationResult;
// }
// declare const window: CustomWindow;

export const signInWithPhone = createAsyncThunk(
    'signInWithPhone',
    async (
        args: {
            // type: 'login' | 'signup';
            phoneNumber: string;
            authInstance: AuthInstanceType;
            recaptchaResolved: boolean;
            recaptcha: RecaptchaVerifier | null;
            callback: (
                args:
                    | { type: 'success'; verificationId: string }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        if (args.authInstance.type !== LoadingStateTypes.LOADED) return;
        if (!args.recaptchaResolved || !args.recaptcha) {
            dispatch(showToast({ message: 'First resolve the Captcha', type: 'info' }));
            return;
        }
        if (args.phoneNumber.slice() === '' || args.phoneNumber.length < 10) {
            dispatch(
                showToast({
                    message: 'Enter the Phone Number and provide the country code',
                    type: 'info',
                })
            );
            return;
        }

        try {
            const result = await signInWithPhoneNumber(
                args.authInstance.auth,
                args.phoneNumber,
                args.recaptcha
            );

            dispatch(
                showToast({
                    message: 'Verification Code has been sent to your Phone',
                    type: 'success',
                })
            );

            if (args.callback)
                args.callback({
                    type: 'success',
                    verificationId: result.verificationId,
                });
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const verifySignInWithPhone = createAsyncThunk(
    'verifySignInWithPhone',
    async (
        args: {
            OTPCode: string;
            auth: AuthContextType;
            authInstance: AuthInstanceType;
            verificationId: string;
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
        if (
            args.OTPCode === null ||
            !args.verificationId ||
            args.authInstance.type !== LoadingStateTypes.LOADED
        )
            return;

        try {
            if (
                args.authInstance.type === LoadingStateTypes.LOADED &&
                args.authInstance.auth !== null
            ) {
                const credential = PhoneAuthProvider.credential(args.verificationId, args.OTPCode);
                await signInWithCredential(args.authInstance.auth, credential);
            }

            firebaseAuth.currentUser?.reload();

            dispatch(
                showToast({
                    message: 'Logged in Successfully',
                    type: 'success',
                })
            );

            args.callback({ type: 'success' });
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const sendVerificationCode = createAsyncThunk(
    'sendVerificationCode',
    async (
        args: {
            phoneNumber: string;
            auth: AuthContextType;
            authInstance: AuthInstanceType;
            recaptchaResolved: boolean;
            recaptcha: RecaptchaVerifier | null;
            callback: (
                args:
                    | { type: 'success'; verificationId: string }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        if (args.authInstance.type !== LoadingStateTypes.LOADED) return;
        if (!args.recaptchaResolved || !args.recaptcha) {
            dispatch(showToast({ message: 'First resolve the Captcha', type: 'info' }));
            return;
        }
        if (args.phoneNumber.slice() === '' || args.phoneNumber.length < 10) {
            dispatch(
                showToast({
                    message: 'Enter the Phone Number and provide the country code',
                    type: 'info',
                })
            );
            return;
        }

        try {
            if (args.auth.type === LoadingStateTypes.LOADED && args.auth.user != null) {
                const sentConfirmationCode = await linkWithPhoneNumber(
                    args.auth.user,
                    args.phoneNumber,
                    args.recaptcha
                );

                dispatch(
                    showToast({
                        message: 'Verification Code has been sent to your Phone',
                        type: 'success',
                    })
                );

                if (args.callback)
                    args.callback({
                        type: 'success',
                        verificationId: sentConfirmationCode.verificationId,
                    });
            }
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const verifyPhoneNumber = createAsyncThunk(
    'verifyPhoneNumber',
    async (
        args: {
            OTPCode: string;
            auth: AuthContextType;
            authInstance: AuthInstanceType;
            verificationId: string;
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
        if (
            args.OTPCode === null ||
            !args.verificationId ||
            args.authInstance.type !== LoadingStateTypes.LOADED
        )
            return;

        try {
            const credential = PhoneAuthProvider.credential(args.verificationId, args.OTPCode);
            if (args.auth.type === LoadingStateTypes.LOADED && args.auth.user !== null) {
                await updatePhoneNumber(args.auth.user, credential);
            }

            firebaseAuth.currentUser?.reload();

            dispatch(
                showToast({
                    message: 'Logged in Successfully',
                    type: 'success',
                })
            );

            args.callback({ type: 'success' });
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const useSendVerificationCodeLoading = () => {
    const loading = useSelector((state: RootState) => state.loading.sendVerificationCode);
    return loading;
};

export const useVerifyPhoneNumberLoading = () => {
    const loading = useSelector((state: RootState) => state.loading.verifyPhoneNumber);
    return loading;
};
