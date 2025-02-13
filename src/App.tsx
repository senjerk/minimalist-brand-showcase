
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/layout/Layout";
import StaffLayout from "./components/staff/StaffLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Constructor from "./pages/Constructor";
import Catalog from "./pages/Catalog";
import OrderStatus from "./pages/OrderStatus";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import StaffHome from "./pages/staff/StaffHome";
import StaffOrders from "./pages/staff/StaffOrders";
import StaffChats from "./pages/staff/StaffChats";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/constructor" element={<Constructor />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/orders" element={<OrderStatus />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/item/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                </Route>
                <Route element={
                  <ProtectedRoute>
                    <StaffLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/staff" element={<StaffHome />} />
                  <Route path="/staff/orders" element={<StaffOrders />} />
                  <Route path="/staff/chats" element={<StaffChats />} />
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
