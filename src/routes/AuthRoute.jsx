import { useAuth } from "@contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ROOT } from "./routes";

export const AuthRoute = ({ element }) => {
    const { userData } = useAuth();
    if (userData) {
        return <Navigate to={ROOT} />
    }
    return element;
}
