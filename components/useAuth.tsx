import { User, Auth, getAuth } from 'firebase/auth';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Spinner from './Spinner';
import { firebaseAuth } from './firebase/firebaseAuth';
import { LoadingStateTypes } from './redux/types';
import Header from './ui/Header';

export type AuthContextType =
    | {
          type: LoadingStateTypes.LOADING;
      }
    | {
          type: LoadingStateTypes.NOT_LOADED;
      }
    | {
          type: LoadingStateTypes.LOADED;
          user: User;
      };

export type AuthInstanceType =
    | {
          type: LoadingStateTypes.LOADING;
      }
    | {
          type: LoadingStateTypes.NOT_LOADED;
      }
    | {
          type: LoadingStateTypes.LOADED;
          auth: Auth;
      };

export const useAuth = (): AuthContextType => {
    const [user, loading] = useAuthState(firebaseAuth);

    return loading
        ? {
              type: LoadingStateTypes.LOADING,
          }
        : user == null
        ? {
              type: LoadingStateTypes.NOT_LOADED,
          }
        : {
              type: LoadingStateTypes.LOADED,
              user: user,
          };
};

export const useGetAuth = (): AuthInstanceType => {
    const auth = getAuth();

    return auth == null
        ? {
              type: LoadingStateTypes.NOT_LOADED,
          }
        : {
              type: LoadingStateTypes.LOADED,
              auth: auth,
          };
};

export const AuthGuard = (props: { children: React.ReactElement }): React.ReactElement => {
    const authResult = useAuth();

    if (authResult.type === LoadingStateTypes.LOADING) {
        return <Spinner />;
    } else if (authResult.type === LoadingStateTypes.NOT_LOADED) {
        window.location.href = '/login';
        return <Spinner />;
    } else {
        return (
            <>
                <Header />
                {props.children}
            </>
        );
    }
};
