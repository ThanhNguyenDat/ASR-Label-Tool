import ASRAnnotaionPage from "../pages/ASRAnnotaionPage/ASRAnnotaionPage";
import HomePage from "../pages/HomePage";

const routes = {
  home: "/",

  label: "/ui/asr",
};

// Public routes
const publicRoutes = [
  {
    path: routes.home,
    component: HomePage,
    layout: null,
  },
  {
    path: routes.label,
    component: ASRAnnotaionPage,
    layout: null,
  },
];

const privateRoutes = [];

export { routes, publicRoutes, privateRoutes };
