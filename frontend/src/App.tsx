
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import StaffHome from "./pages/staff/StaffHome";
import StaffOrders from "./pages/staff/StaffOrders";
import StaffOrderDetail from "./pages/staff/StaffOrderDetail";
import StaffChats from "./pages/staff/StaffChats";
import Chats from "./pages/Chats";
import ChatDetail from "./pages/ChatDetail";

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
                  <Route path="/orders/:id" element={<OrderStatus />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/item/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/support" element={<Chats />} />
                  <Route path="/support/:id" element={<ChatDetail />} />
                </Route>
                <Route element={
                  <ProtectedRoute>
                    <StaffLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/staff" element={<StaffHome />} />
                  <Route path="/staff/orders" element={<StaffOrders />} />
                  <Route path="/staff/orders/:id" element={<StaffOrderDetail />} />
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
