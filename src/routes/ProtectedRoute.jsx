import { useAuth } from "@contexts/AuthContext"
import { Navigate } from "react-router-dom";
import { LOGIN } from "./routes";

export const ProtectedRoute = ({ element }) => {
    const { userData } = useAuth();
    if (userData === null) {
        return <Navigate to={LOGIN} />
    }
    return element;
}
