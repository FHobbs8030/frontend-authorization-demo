import { signin, signup, getMe as fetchMe } from "./api";

export const authorize = (identifier, password) => signin(identifier, password);
export const register = (username, email, password) => signup(username, email, password);
export const getMe = (jwt) => fetchMe(jwt);
