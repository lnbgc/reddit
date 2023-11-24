import { Route, Routes as RouterRoutes } from "react-router-dom";
import { Index } from "@pages/Index";

export const ROOT = "/";

export const Routes = () => {
    return (
        <RouterRoutes>
            <Route path={ROOT} element={<Index />} />
        </RouterRoutes>
    )
}