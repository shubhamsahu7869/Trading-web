import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Toast from "./components/Toast.jsx";
import Admin from "./pages/Admin.jsx";
import Auth from "./pages/Auth.jsx";
import History from "./pages/History.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Splash from "./pages/Splash.jsx";
import StockDetails from "./pages/StockDetails.jsx";
import Stocks from "./pages/Stocks.jsx";

function Shell({ children }) {
  const location = useLocation();
  const hideChrome = location.pathname === "/" || location.pathname === "/auth";
  return (
    <>
      {!hideChrome && <Navbar />}
      <main className={hideChrome ? "" : "pb-24 pt-20 md:pb-10"}>{children}</main>
      {!hideChrome && <BottomNav />}
      <Toast />
    </>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <Shell>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Splash />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stocks/:id" element={<StockDetails />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Shell>
  );
}
