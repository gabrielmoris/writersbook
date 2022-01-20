import {combineReducers} from "redux";
import { friendsAndWannabeesReducer } from "./friends-and-wannabees/slice";

const rootReducer = combineReducers({
    friendsAndWannabees: friendsAndWannabeesReducer,
});

export default rootReducer;