// @flow

import * as React from 'react';
import { Button, View } from 'react-native';

import EmailLoginForm from './EmailLoginForm';
import GoogleLoginForm from './GoogleLoginForm';

type Props = {
  onLogin: (accessToken: string) => void,
};

type State = {
  loginViaFederatedIdentities: boolean,
};

export default class Login extends React.Component<Props, State> {
  state: State = {
    loginViaFederatedIdentities: true,
  };

  toggleFederatedIdentities = () => {
    this.setState({
      loginViaFederatedIdentities: !this.state.loginViaFederatedIdentities,
    });
  };

  render = () => {
    const toggleButton = title => (
      <Button title={title} onPress={this.toggleFederatedIdentities} />
    );

    return (
      <View>
        {this.state.loginViaFederatedIdentities
          ? [
              <GoogleLoginForm
                key="google"
                onSuccess={accessToken => this.props.onLogin(accessToken)}
              />,
              toggleButton('Login using email'),
            ]
          : [
              <EmailLoginForm
                key="email"
                onSuccess={accessToken => this.props.onLogin(accessToken)}
              />,
              toggleButton('Login using Google'),
            ]}
      </View>
    );
  };
}