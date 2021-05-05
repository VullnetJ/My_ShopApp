import AsyncStorage from '@react-native-async-storage/async-storage';
export const SIGNOUT = 'SIGNOUT';
export const AUTHENTICATE = 'AUTHENTICATE';

// handling authentication and singing out which brings the user to inital state of authentication. 

let timeChecker;

// after the user is authenticated then the time limit comes from timeChecker. 
// token will expire in 3600 seconds. 

export const authenticate = (userId, token, timeLimit) => {
    return dispatch => {
        dispatch(setSignoutTimer(timeLimit));
        dispatch({type: AUTHENTICATE, userId: userId, token: token});
    }
   
}
// fetching Web API key and sing upt the user. 
export const signup = (email, password) => {
    return async dispatch => {
      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDQT1eaD-Vlo8zkxm_n-p3XP2G60tUi7Hc'
        ,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password, 
                returnSecureToken: true,
            })
        }
        );
        // here we check if response is not ok and we display error messages. 
        if(!response.ok) {
            const eResponse = await response.json();
           const wrongId = eResponse.error.message;
           let message = 'Something went wrong!, you can not sign up.'
            if (wrongId === 'EMAIL_EXISTS') {
                message =' You are registered with email already';
            } else if (wrongId === 'INVALID_PASSWORD') {
                message = 'This password is not valid!'
            }
            throw new Error(message);
        }
        const responseData = await response.json();
        console.log(responseData);
        dispatch(
            authenticate(
                responseData.localId, 
                responseData.idToken, 
                parseInt(responseData.expiresIn) * 1000 
                )
        );
        const ExpiringDate = new Date(
            new Date().getTime() +  + parseInt(responseData.expiresIn) * 1000
        );
        storeData(responseData.idToken, responseData.localId, ExpiringDate);
    };
};

// sing in the user 
export const signin = (email, password) => {
    return async dispatch => {
      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQT1eaD-Vlo8zkxm_n-p3XP2G60tUi7Hc'
        ,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: password,
              returnSecureToken: true
            })
          }
        );
          // if response is not ok, dispaly error messages. 
        if (!response.ok) {
          const eResponse = await response.json();
          const wrongId = eResponse.error.message;
          let message = 'You can not sign in, something went wrong';
          if (wrongId === 'EMAIL_NOT_FOUND') {
            message = 'Your email is not found';
          } else if (wrongId === 'INVALID_PASSWORD') {
            message = 'Password is invalid';
          }
          throw new Error(message);
        }
    
        const responseData = await response.json();
        //console.log(responseData);
        dispatch(
            authenticate(
                responseData.localId, 
                responseData.idToken, 
                parseInt(responseData.expiresIn) * 1000 
            )
        );
        const ExpiringDate = new Date(
            new Date().getTime() +  + parseInt(responseData.expiresIn) * 1000
        );
        storeData(responseData.idToken, responseData.localId, ExpiringDate);
    };
    };
    // if user decises to sing out singing out need to be cleared and return SIGNOUT
   export const logout = () => {
        clearSingoutTimer();
        AsyncStorage.removeItem('userData');
        return { type: SIGNOUT};
   };

   const clearSingoutTimer = () => {
       if (timeChecker) {
           clearTimeout(timeChecker);
       }
        
   };
   const setSignoutTimer = expTime => {
       return dispatch => {
         timeChecker =  setTimeout(() => {
            dispatch(logout());
       }, expTime );  // for testing can divide by 900 to see how fast it logs out. and it will log out in 4 secons. 
       };
       
   };
   
// StoreData locally. 

const storeData = (token, userId, ExpiringDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: ExpiringDate.toISOString()
    }));
}