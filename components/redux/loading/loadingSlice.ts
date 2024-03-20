import { createSlice } from '@reduxjs/toolkit';
import { linkWithEmailProvider, loginWithEmail } from '../auth/loginWithEmail';
import {
    sendVerificationCode,
    signInWithPhone,
    verifyPhoneNumber,
    verifySignInWithPhone,
} from '../auth/verifyPhoneNumber';

export interface LoadingStates {
    [key: string]: boolean;
}

const initialState: LoadingStates = {
    loginWithEmail: false,
    sendVerificationCode: false,
    verifyPhoneNumber: false,
    signInWithPhone: false,
    verifySignInWithPhone: false,
    linkWithEmailProvider: false,
};

export const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginWithEmail.pending, (state) => {
            state.loginWithEmail = true;
        });
        builder.addCase(loginWithEmail.fulfilled, (state) => {
            state.loginWithEmail = false;
        });
        builder.addCase(loginWithEmail.rejected, (state) => {
            state.loginWithEmail = false;
        });
        // Send Verify Phone Number
        builder.addCase(sendVerificationCode.pending, (state) => {
            state.sendVerificationCode = true;
        });
        builder.addCase(sendVerificationCode.fulfilled, (state) => {
            state.sendVerificationCode = false;
        });
        builder.addCase(sendVerificationCode.rejected, (state) => {
            state.sendVerificationCode = false;
        });
        // Verify Phone Number
        builder.addCase(verifyPhoneNumber.pending, (state) => {
            state.verifyPhoneNumber = true;
        });
        builder.addCase(verifyPhoneNumber.fulfilled, (state) => {
            state.verifyPhoneNumber = false;
        });
        builder.addCase(verifyPhoneNumber.rejected, (state) => {
            state.verifyPhoneNumber = false;
        });
        // Sign in with phone number
        builder.addCase(signInWithPhone.pending, (state) => {
            state.signInWithPhone = true;
        });
        builder.addCase(signInWithPhone.fulfilled, (state) => {
            state.signInWithPhone = false;
        });
        builder.addCase(signInWithPhone.rejected, (state) => {
            state.signInWithPhone = false;
        });
        // Verify sign in with phone
        builder.addCase(verifySignInWithPhone.pending, (state) => {
            state.verifySignInWithPhone = true;
        });
        builder.addCase(verifySignInWithPhone.fulfilled, (state) => {
            state.verifySignInWithPhone = false;
        });
        builder.addCase(verifySignInWithPhone.rejected, (state) => {
            state.verifySignInWithPhone = false;
        });
        // Link account with Google
        builder.addCase(linkWithEmailProvider.pending, (state) => {
            state.linkWithEmailProvider = true;
        });
        builder.addCase(linkWithEmailProvider.fulfilled, (state) => {
            state.linkWithEmailProvider = false;
        });
        builder.addCase(linkWithEmailProvider.rejected, (state) => {
            state.linkWithEmailProvider = false;
        });
    },
});

export const loadingReducer = loadingSlice.reducer;
