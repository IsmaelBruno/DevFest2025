// Routes/adminRoutes/adminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../../Pages/admin/LayoutAdmin";
import Dashboard from "../../../Pages/admin/adminDashboard";
import UsersPage from "../../../Pages/admin/Users/UsersPage";
import AnalysesPage from "../../../Pages/admin/Analyses/AnalysesPage";

function AdminRoutes() {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="analyses" element={<AnalysesPage />} />
                <Route index element={<Dashboard />} /> // Redirection par défaut
            </Route>
        </Routes>
    )
}

export default AdminRoutes;