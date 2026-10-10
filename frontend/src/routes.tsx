import { createBrowserRouter } from "react-router-dom";
import Root from "./layout/Root";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import TeamPage from "./pages/TeamPage";
import TeamMemberPage from "./pages/TeamMemberPage";
import ProcessPage from "./pages/ProcessPage";
import SolutionsPage from "./pages/SolutionsPage";
import SolutionDetailPage from "./pages/SolutionDetailPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyDetailPage from "./pages/CaseStudyDetailPage";
import InsightsPage from "./pages/InsightsPage";
import InsightDetailPage from "./pages/InsightDetailPage";
import ContactPage from "./pages/ContactPage";
import LegalPage from "./pages/LegalPage";
import LegalDocPage from "./pages/LegalDocPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "story", element: <StoryPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "team/:slug", element: <TeamMemberPage /> },
      { path: "process", element: <ProcessPage /> },
      { path: "solutions", element: <SolutionsPage /> },
      { path: "solution/:slug", element: <SolutionDetailPage /> },
      { path: "case-studies", element: <CaseStudiesPage /> },
      { path: "case-study/:slug", element: <CaseStudyDetailPage /> },
      { path: "insights", element: <InsightsPage /> },
      { path: "insight/:slug", element: <InsightDetailPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "legal", element: <LegalPage /> },
      { path: "legal/:slug", element: <LegalDocPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
