import React from 'react';
import { SessionApi} from "metabase/services";


  // Функция для обработки входа через Okta
  const handleOktaLogin = async () => {
    try {
      // Извлечение параметров 'code' и 'state' из URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
  
      if (!code || !state) {
        throw new Error("Отсутствуют необходимые параметры для аутентификации через Okta");
      }
  
      // Передача параметров в API для аутентификации через Okta
      await SessionApi.createWithOktaAuth({ code, state });
      // Дополнительные действия после успешной аутентификации (например, перенаправление пользователя)
    } catch (error) {
      console.error('Ошибка при входе через Okta', error);
    }
  };
  

export const ForgotPassword = ({

}: ForgotPasswors): JSX.Element => {

  return (
   
    <button onClick={handleOktaLogin}>Войти через Okta</button>
    
    );
};