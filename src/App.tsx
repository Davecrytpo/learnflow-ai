import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const StudentPortal = lazy(() => import("./pages/StudentPortal"));
const InstructorPortal = lazy(() => import("./pages/InstructorPortal"));
const AdminPortal = lazy(() => import("./pages/AdminPortal"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const CourseLearning = lazy(() => import("./pages/student/CourseLearning"));
const StudentCalendar = lazy(() => import("./pages/student/Calendar"));
const Profile = lazy(() => import("./pages/student/Profile"));
const InstructorDashboard = lazy(() => import("./pages/instructor/InstructorDashboard"));
const CreateCourse = lazy(() => import("./pages/instructor/CreateCourse"));
const EditCourse = lazy(() => import("./pages/instructor/EditCourse"));
const Grading = lazy(() => import("./pages/instructor/Grading"));
const Gradebook = lazy(() => import("./pages/instructor/Gradebook"));
const Attendance = lazy(() => import("./pages/instructor/Attendance"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/student" element={<StudentPortal />} />
              <Route path="/instructor-portal" element={<InstructorPortal />} />
              <Route path="/admin-portal" element={<AdminPortal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/calendar" element={<StudentCalendar />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/*" element={<StudentDashboard />} />
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/course/:courseId" element={<CourseDetail />} />
              <Route path="/course/:courseId/learn" element={<CourseLearning />} />
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/instructor/courses/new" element={<CreateCourse />} />
              <Route path="/instructor/courses/:courseId" element={<EditCourse />} />
              <Route path="/instructor/courses/:courseId/gradebook" element={<Gradebook />} />
              <Route path="/instructor/grading" element={<Grading />} />
              <Route path="/instructor/attendance" element={<Attendance />} />
              <Route path="/instructor/*" element={<InstructorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
