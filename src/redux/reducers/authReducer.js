import * as ACTIONTYPES from '../actionTypes';

export const initialState = {
    isWalletConnected: false,
    WALLET_ADDRESS: '',
};

export default function auth(state = initialState, action) {
    switch (action.type) {
        case ACTIONTYPES.isWalletConnected:
            return {
                ...state,
                isWalletConnected: action.payload
            };    
        case ACTIONTYPES.WALLET_ADDRESS:
            return {
                ...state,
                WALLET_ADDRESS: action.payload
            };
        case ACTIONTYPES.isWalletDisconnected:
            return initialState; 
        default:
            return state;
    }
}
