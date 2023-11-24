import { Route, Routes as RouterRoutes } from "react-router-dom";
import { Index } from "@pages/Index";
import { SetUsername } from "@pages/SetUsername";

export const ROOT = "/";
export const USERNAME = "/google-provider/requires/username";

export const Routes = () => {
    return (
        <RouterRoutes>
            <Route path={ROOT} element={<Index />} />
            <Route path={USERNAME} element={<SetUsername />} />
        </RouterRoutes>
    )
}