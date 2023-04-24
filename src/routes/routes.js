import ASRAnnotaionPage from "../pages/ASRAnnotaionPage/ASRAnnotaionPage";
import HomePage from "../pages/HomePage";
import { HeaderOnly } from "../layouts";
import ASRTranscriptPage from "../pages/ASRTranscriptPage/ASRTranscriptPage";
import ASRAnnotationReviewPage from "../pages/ASRAnnotationReviewPage/ASRAnnotationReviewPage";

const routes = {
  home: "/react_label_ui",

  label: "/react_label_ui/ui/asr_review",

  asr_transcript: '/react_label_ui/ui/asr_transcript',

  asr_review: "/react_label_ui/ui/asr"
};

// Public routes
const publicRoutes = [
  {
    path: routes.home,
    component: HomePage,
    // layout: HeaderOnly,
  },
  {
    path: routes.label,
    component: ASRAnnotaionPage,
    layout: null,
  },
  {
    path: routes.asr_review,
    component: ASRAnnotationReviewPage,
    layout: null,
  },
  {
    path: routes.asr_transcript,
    component: ASRTranscriptPage,
    layout: null,
  }
];

const privateRoutes = [];

export { routes, publicRoutes, privateRoutes };
