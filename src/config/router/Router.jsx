import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLoader from "../../components/PageLoader";
import { AuthProvider } from "../../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import PrivateLayout from "../../components/Layout/PrivateLayout";

const LandingPage = lazy(() => import("../../pages/LandingPage/LandingPage"));
const Login = lazy(() => import("../../pages/Login/Login"));
const Register = lazy(() => import("../../pages/Register/Register"));
const MapView = lazy(() => import("../../pages/MapView/MapView"));
const Contact = lazy(() => import("../../pages/Contact"));
const Terms = lazy(() => import("../../pages/Terms"));
const BookmarkDetails = lazy(() =>
  import("../../pages/BookmarkDetails/BookmarkDetails")
);
const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const MyBookmark = lazy(() => import("../../pages/MyBookmark/MyBookmark"));
const AddBookmark = lazy(() => import("../../pages/AddBookmark/AddBookmark"));
const EditBookmark = lazy(() => import("../../pages/EditBookmark/EditBookmark"));

export default function Router() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/MapView" element={<MapView />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Terms" element={<Terms />} />
            <Route path="/BookmarkDetails/:id" element={<BookmarkDetails />} />
            <Route element={<ProtectedRoute />}>
              <Route
                path="/HomePage"
                element={
                  <PrivateLayout>
                    <HomePage />
                  </PrivateLayout>
                }
              />
              <Route
                path="/MyBookmark"
                element={
                  <PrivateLayout>
                    <MyBookmark />
                  </PrivateLayout>
                }
              />
              <Route
                path="/AddBookmark"
                element={
                  <PrivateLayout>
                    <AddBookmark />
                  </PrivateLayout>
                }
              />
              <Route
                path="/EditBookmark/:id"
                element={
                  <PrivateLayout>
                    <EditBookmark />
                  </PrivateLayout>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
