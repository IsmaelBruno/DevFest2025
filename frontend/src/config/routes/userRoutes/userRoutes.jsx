import { Routes, Route } from "react-router-dom";
import Layout from "../../../Pages/user/Home/layout/userLayout";
import Live from "../../../Pages/user/Live/Live"; // Communauté
import Prediction from "../../../Pages/user/Prediction/Prediction";
import Shop from "../../../Pages/user/Shop/Shop";
import ProductDetails from "../../../Pages/user/Shop/ProductDetails";
import LandingPage from "../../../Pages/user/Home/LandingPage/LandingPage";
import Scanner from "../../../Pages/user/Scanner/Scanner";
import Analyse from "../../../Pages/user/Analyse/Analyse";
import Historique from "../../../Pages/user/Historique/Historique";
import Help from "../../../Pages/user/Help/Help";

function UserRoutes() {
    return (
        <Routes>
            {/* 🔥 Toutes les routes de MadaScan commencent ici */}
            <Route path="/" element={<Layout />}>

                {/* Page d'accueil */}
                <Route index element={<LandingPage />} />

                {/* Fonctionnalités MadaScan */}
                <Route path="scanner" element={<Scanner />} />
                <Route path="analyse" element={<Analyse />} />
                <Route path="historique" element={<Historique />} />
                <Route path="help" element={<Help />} />

                {/* Ancien Live → Communauté */}
                <Route path="communaute" element={<Live />} />

                {/* Shop */}
                <Route path="premium" element={<Shop />} />
                <Route path="premium/product/:id" element={<ProductDetails />} />

                {/* Prédiction */}
                <Route path="prediction" element={<Prediction />} />

            </Route>
        </Routes>
    );
}

export default UserRoutes;
