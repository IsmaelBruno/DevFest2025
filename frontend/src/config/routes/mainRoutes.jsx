import { Routes, Route, Navigate } from "react-router-dom";
import UserRoutes from "./userRoutes/userRoutes";
import ErrorPage from "../../Pages/errorPage/errorPage";
import AuthForm from "../../Pages/auth/authForm";
import AdminRoutes from "./adminRoutes/adminRoutes";

function RoutesApplication () {
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/madascan-app" />} />
            <Route path="/madascan-app/*" element={<UserRoutes/>}/>
            <Route path="/madascan-app/admin/*" element={<AdminRoutes/>}/>
             <Route path="/madascan-app/auth" element={<AuthForm/>}/>
            <Route path="*" element={<ErrorPage/>}/>
        </Routes>
    );
}
export default RoutesApplication;