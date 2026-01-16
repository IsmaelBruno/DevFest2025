import { Routes, Route, Navigate } from "react-router-dom";
import UserRoutes from "./userRoutes/userRoutes";
import ErrorPage from "../../Pages/errorPage/errorPage";
import Login from "../../Pages/auth/LoginPage";
import Signup from "../../Pages/auth/SignupPage"
import OTPVerification from "../../Pages/auth/OTPVerification"
import AdminRoutes from "./adminRoutes/adminRoutes";

function RoutesApplication () {
    return(
        <Routes>
            <Route path="/" element={<Navigate to="/madascan-app" />} />
            <Route path="/madascan-app/*" element={<UserRoutes/>}/>
            <Route path="/madascan-app/admin/*" element={<AdminRoutes/>}/>
            <Route path="/madascan-app/auth" element={<Login/>}/>
            <Route path="/madascan-app/signup" element={<Signup />} />
            <Route path="/madascan-app/otp-verification" element={<OTPVerification />} />
             
            <Route path="*" element={<ErrorPage/>}/>
        </Routes>
    );
}
export default RoutesApplication;