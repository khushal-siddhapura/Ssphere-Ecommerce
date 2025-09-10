import { Navigate, useLocation } from "react-router-dom";

const protectedRoutes = [
  "/admin/dashboard",
  "/admin/manageadmins",
  "/admin/user",
  "/admin/revenue",
  "/admin/banner",
  "/admin/products",
  "/admin/orders",
  "/admin/complaint",
]

const superAdminRoutes = [
  "/admin/dashboard",
  "/admin/manageadmins",
  "/admin/user",
  "/admin/revenue",
]

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  console.log("location.pathname", location)


  // // Check if user is authenticated and at the home page
  // if (location.pathname === "/") {
  //   if (!isAuthenticated) {
  //     return <Navigate to="/auth/login" />;
  //   } else {
  //     if (user?.role === "admin" || user?.role === "superadmin") {
  //       return <Navigate to="/admin/banner" />;
  //     } else {
  //       return <Navigate to="/shop/home" />;
  //     }
  //   }
  // }

  // // If not authenticated and not on login/register pages, redirect to login
  // if (
  //   !isAuthenticated &&
  //   !(
  //     location.pathname.includes("/login") ||
  //     location.pathname.includes("/register")
  //   )
  // ) {
  //   return <Navigate to="/auth/login" />;
  // }

  // // If authenticated and trying to access login/register pages, redirect based on role
  // if (
  //   isAuthenticated &&
  //   (location.pathname.includes("/login") ||
  //     location.pathname.includes("/register"))
  // ) {
  //   if (user?.role === "admin" || user?.role === "superadmin") {
  //     return <Navigate to="/admin/banner" />;
  //   } else {
  //     return <Navigate to="/shop/home" />;
  //   }
  // }

  // // Redirect to unauthorized page if the user is not an admin or superadmin on admin routes
  // if (
  //   isAuthenticated &&
  //   user?.role !== "admin" &&
  //   user?.role !== "superadmin" &&
  //   location.pathname.includes("admin")
  // ) {
  //   return <Navigate to="/unauth-page" />;
  // }

  // // If the user is admin and tries to access the shop route, redirect to /admin/banner
  // if (
  //   isAuthenticated &&
  //   (user?.role === "admin" || user?.role === "superadmin") &&
  //   location.pathname.includes("shop")
  // ) {
  //   return <Navigate to="/admin/banner" />;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (user?.role === "user" && protectedRoutes.includes(location.pathname)) {
    return <Navigate to="/unauth-page" />;
  }

  if (user?.role === "admin" && superAdminRoutes.includes(location.pathname)){
    return <Navigate to="/unauth-page" />;
  }
  return <>{children}</>;
}

export default CheckAuth;
