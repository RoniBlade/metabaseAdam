import { useMemo } from "react";
import { t } from "ttag";
import * as Yup from "yup";
import { Form, FormProvider } from "metabase/forms";
import FormCheckBox from "metabase/core/components/FormCheckBox";
import FormErrorMessage from "metabase/core/components/FormErrorMessage";
import FormInput from "metabase/core/components/FormInput";
import FormSubmitButton from "metabase/core/components/FormSubmitButton";
import * as Errors from "metabase/lib/errors";
import type { LoginData } from "../../types";
import { OktaAuth } from '@okta/okta-auth-js';
import { SessionApi} from "metabase/services";


const LOGIN_SCHEMA = Yup.object().shape({
  username: Yup.string()
    .required(Errors.required)
    .when("$isLdapEnabled", {
      is: false,
      then: schema => schema.email(Errors.email),
    }),
  password: Yup.string().required(Errors.required),
  remember: Yup.boolean(),
});

interface LoginFormProps {
  isLdapEnabled: boolean;
  hasSessionCookies: boolean;
  onSubmit: (data: LoginData) => void;
}

  // Инициализация OktaAuth
  const oktaAuth = new OktaAuth({
    issuer: 'https://dev-91515140.okta.com/oauth2/default',
    clientId: '0oadjayev40xqxwQB5d7',
    redirectUri: 'http://90.156.227.253:3000/auth/forgot_password/',

    responseType: 'code',
    pkce: false
  });

    // Функция отправки запроса
  const sendRequest = () => {
    fetch('/api/session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'adamlatyrov279@gmail.com',
        password: 'b4v-CFA-hGM-j9w'
      })
    })
    .then(response => {
      if (response.ok) {
        window.location.href = 'http://90.156.227.253:3000/';
      } else {
        console.error('Request failed', response);
      }
    })
    .catch(error => console.error('Error:', error));
  };

export const LoginForm = ({
  isLdapEnabled,
  hasSessionCookies,
  onSubmit,
}: LoginFormProps): JSX.Element => {
  const initialValues = useMemo(
    () => ({
      username: "",
      password: "",
      remember: !hasSessionCookies,
    }),
    [hasSessionCookies],
  );

  const validationContext = useMemo(
    () => ({
      isLdapEnabled,
    }),
    [isLdapEnabled],
  ); 

  // Функция для обработки входа через Okta
  const handleOktaLogin1 = async () => {
    try {
      // Здесь происходит вызов метода для входа через Okta
      oktaAuth.signInWithRedirect();
    } catch (error) {
      console.error('Ошибка при входе через Okta', error);
    }
  };

    // Функция для обработки входа через Okta
    const handleOktaLogin = async () => {
      try {
        const credential = "Adamtedo";
        await SessionApi.createWithGoogleAuth({ token: credential });
        } catch (error) {
        console.error('Ошибка при входе через Okta', error);
      }
    };
  

  return (
    <FormProvider
      initialValues={initialValues}
      validationSchema={LOGIN_SCHEMA}
      validationContext={validationContext}
      onSubmit={onSubmit}
    >
      <Form>
        <FormInput
          name="username"
          title={
            isLdapEnabled ? t`Username or email address` : t`Email address`
          }
          type={isLdapEnabled ? "input" : "email"}
          placeholder="nicetoseeyou@email.com"
          autoFocus
        />
        <FormInput
          name="password"
          title={t`Password`}
          type="password"
          placeholder={t`Shhh...`}
        />
        {!hasSessionCookies && (
          <FormCheckBox name="remember" title={t`Remember me`} />
        )}
        <FormSubmitButton title={t`Sign in`} primary fullWidth />
        <FormErrorMessage />

        <div><button onClick={handleOktaLogin}>Создать тестового пользователя и зайти</button></div>
        <button onClick={handleOktaLogin1}>Войти через Okta</button>

        
      </Form>
    </FormProvider>
  );
};
