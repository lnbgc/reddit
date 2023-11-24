import { Route, Routes as RouterRoutes } from "react-router-dom";
import { Index } from "@pages/Index";
import { SetUsername } from "@pages/auth/SetUsername";
import { Login } from "@pages/auth/Login";
import { Register } from "@pages/auth/Register";

export const ROOT = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const USERNAME = "/google-provider/requires/username";

export const Routes = () => {
    return (
        <RouterRoutes>
            <Route path={ROOT} element={<Index />} />
            <Route path={LOGIN} element={<Login />} />
            <Route path={REGISTER} element={<Register />} />
            <Route path={USERNAME} element={<SetUsername />} />
        </RouterRoutes>
    )
}