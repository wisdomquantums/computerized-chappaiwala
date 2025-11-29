import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./features/auth/authSlice";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
