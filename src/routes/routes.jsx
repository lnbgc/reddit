import { Route, Routes as RouterRoutes } from "react-router-dom";
import { Index } from "@pages/Index";
import { SetUsername } from "@pages/auth/SetUsername";
import { Login } from "@pages/auth/Login";
import { Register } from "@pages/auth/Register";
import { CreateCommunity } from "@pages/communities/CreateCommunity";
import { Community } from "@pages/communities/Community";
import { EditCommunity } from "@pages/communities/edit/EditCommunity";
import { CreatePost } from "@pages/posts/CreatePost";
import { FullPost } from "@pages/posts/FullPost";
import { Profile } from "@pages/profile/Profile";
import { Settings } from "@pages/auth/Settings";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthRoute } from "./AuthRoute";

export const ROOT = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const USERNAME = "/google-provider/requires/username";
export const CREATECOMMUNITY = "/create";
export const COMMUNITY = "/r/:communityURL";
export const EDITCOMMUNITY = "/r/:communityURL/edit";
export const CREATEPOST = "/submit";
export const POST = "/r/:communityURL/:postID";
export const PROFILE = "/u/:username";
export const SETTINGS = "/settings";

export const Routes = () => {
    return (
        <RouterRoutes>
            {/* PUBLIC ROUTES */}
            <Route path={ROOT} element={<Index />} />
            <Route path={COMMUNITY} element={<Community />} />
            <Route path={POST} element={<FullPost />} />
            <Route path={PROFILE} element={<Profile />} />

            {/* AUTH ROUTES */}
            <Route
                path={LOGIN}
                element={<AuthRoute element={<Login />} />}
            />
            <Route
                path={REGISTER}
                element={<AuthRoute element={<Register />} />}
            />
            <Route
                path={USERNAME}
                element={<AuthRoute element={<SetUsername />} />}
            />

            {/* PROTECTED ROUTES */}
            <Route
                path={CREATECOMMUNITY}
                element={<ProtectedRoute element={<CreateCommunity />} />}
            />
            <Route
                path={CREATEPOST}
                element={<ProtectedRoute element={<CreatePost />} />}
            />
            <Route
                path={SETTINGS}
                element={<ProtectedRoute element={<Settings />} />}
            />

            {/* PROTECTED ROUTE IN COMPONENT */}
            <Route path={EDITCOMMUNITY} element={<EditCommunity />} />
            
        </RouterRoutes>
    )
}