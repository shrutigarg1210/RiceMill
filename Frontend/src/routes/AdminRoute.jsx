import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {

    const { token, role } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;