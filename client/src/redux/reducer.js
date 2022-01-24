import {combineReducers} from "redux";
import { friendsAndWannabeesReducer } from "./friends-and-wannabees/slice";
import {chatReducer} from "./chat/slice";

const rootReducer = combineReducers({
    friendsAndWannabees: friendsAndWannabeesReducer,
    chat: chatReducer,
});

export default rootReducer;