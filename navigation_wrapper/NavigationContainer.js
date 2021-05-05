import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import { NavigationActions} from 'react-navigation';
import NavigationToShop from './NavigationToShop';


// NavigationContainer manages the app state and links top-level navigator to the app environment.
// Deep link integration is done with the linking 'props'. 
// userRef is attached to the container so we get access to methods, for example, dispatch nagivation actions. 

const NavigationContainer = props => {
    const navRef = useRef();
    const isAuth = useSelector(state => !!state.auth.token);

    useEffect(() => {
        if (!isAuth) {
            navRef.current.dispatch(NavigationActions.navigate({
                routeName: 'Authentication'
        }));
       }
    }, [isAuth]);

    return <NavigationToShop ref={navRef} />;
}
export default NavigationContainer; 