import React, { useEffect } from 'react';
import { Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

type GoogleSignInButtonProps = {
    onSuccess: (user: any) => void;
    onError?: (error: any) => void;
};

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
    // Define redirect URI using makeRedirectUri
    const redirectUri = AuthSession.makeRedirectUri({
        scheme: Array.isArray(Constants.expoConfig?.scheme)
            ? Constants.expoConfig?.scheme[0]
            : Constants.expoConfig?.scheme,
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '1096017603369-3vs8ptsuq2c7gtpo3b4hqb0u68s1gkps.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        redirectUri,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            if (authentication?.accessToken) {
                fetch('https://www.googleapis.com/userinfo/v2/me', {
                    headers: { Authorization: `Bearer ${authentication.accessToken}` },
                })
                    .then(res => res.json())
                    .then(user => onSuccess(user))
                    .catch(err => onError?.(err));
            }
        } else if (response?.type === 'error') {
            onError?.(response.error);
        }
    }, [response]);

    return (
        <Button
            title="Sign in with Google"
            disabled={!request}
            onPress={() => {
                promptAsync();
            }}
        />
    );
}
