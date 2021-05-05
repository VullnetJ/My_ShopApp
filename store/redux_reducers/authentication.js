import { SIGNOUT, AUTHENTICATE} from '../redux_actions/authentication';


// inital state with token and user Id is null 
const initialState = {
    token: null,
    userId: null
}

// here is done checking if is uathentication of singing out. 
// If the user signs out then initial state is returned which is brings to either sing up or sing in. 
export default (state = initialState, action) => {
    switch(action.type) {
        case AUTHENTICATE: 
            return {
                token: action.token,
                userId: action.userId,
            }
        case SIGNOUT: 
            return initialState;
        default: 
            return state;
    }
}