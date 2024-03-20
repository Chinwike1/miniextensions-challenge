import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import GoogleGLogo from '@/public/statics/images/google-g-logo.svg';
import {
    EmailAuthProvider,
    GoogleAuthProvider,
    linkWithCredential,
    linkWithPopup,
} from 'firebase/auth';
import { useAuth } from '../useAuth';
import { LoadingStateTypes } from '../redux/types';
import { useRouter } from 'next/navigation';
import Logout from './Logout';
import Input from './Input';
import LoadingButton from './LoadingButton';
import { isEmail } from 'validator';
import { useIsLoginWithEmailLoading } from '../redux/auth/loginWithEmail';
// import { useAppDispatch } from '../redux/store';

function EmailVerification() {
    const auth = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);
    const isLoading = useIsLoginWithEmailLoading();

    // create new Email and Google Providers
    const credential = EmailAuthProvider.credential(email, password);
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        if (isEmail(email) && password.length >= 6) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [email, password]);

    // TODO: convert function to use Redux Thunk
    const linkWithGoogle = async () => {
        try {
            if (auth.type === LoadingStateTypes.LOADED && auth.user !== null) {
                await linkWithPopup(auth.user, provider);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
    };
    // TODO: convert function to use Redux Thunk
    const linkEmailAddress = async () => {
        try {
            if (auth.type === LoadingStateTypes.LOADED && auth.user !== null) {
                await linkWithCredential(auth.user, credential);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <Image
                        className="w-auto h-12 mx-auto"
                        height={48}
                        width={48}
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                        Next, add an email address
                    </h2>
                </div>

                <div className="max-w-xl w-full rounded overflow-hidden shadow-lg py-2 px-4">
                    <div className="mt-2 grid grid-cols-1 gap-3">
                        <button
                            className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                            onClick={linkWithGoogle}
                        >
                            <Image
                                src={GoogleGLogo}
                                alt="Google logo"
                                layout="intrinsic"
                                height={20}
                                width={20}
                            />
                            <div className="ml-2">Google</div>
                        </button>
                    </div>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>
                    <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            name="email"
                            type="text"
                        />
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            name="password"
                            type="password"
                        />
                        <LoadingButton
                            onClick={linkEmailAddress}
                            disabled={disableSubmit}
                            loading={isLoading}
                        >
                            Add Email
                        </LoadingButton>
                    </div>
                    <div className="mt-5 flex w-full flex-col">
                        <Logout />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailVerification;
