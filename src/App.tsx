import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("Uncaught error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
          <h1 className="text-2xl font-bold">Something went wrong.</h1>
          <button className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Index = lazy(() => import("./pages/Index"));
const SetupPassword = lazy(() => import("./pages/SetupPassword"));
const Academy = lazy(() => import("./pages/Academy"));
const News = lazy(() => import("./pages/News"));
const Webinars = lazy(() => import("./pages/Webinars"));
const Verification = lazy(() => import("./pages/Verification"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CourseCatalog = lazy(() => import("./pages/CourseCatalog"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));

// Student
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const CourseLearning = lazy(() => import("./pages/student/CourseLearning"));
const StudentCalendar = lazy(() => import("./pages/student/Calendar"));
const Profile = lazy(() => import("./pages/student/Profile"));
const StudentGrades = lazy(() => import("./pages/student/Grades"));
const StudentAssignments = lazy(() => import("./pages/student/Assignments"));
const StudentQuizzes = lazy(() => import("./pages/student/Quizzes"));
const StudentDiscussions = lazy(() => import("./pages/student/Discussions"));
const StudentProgress = lazy(() => import("./pages/student/Progress"));
const StudentCertificates = lazy(() => import("./pages/student/Certificates"));
const AdaptiveLearning = lazy(() => import("./pages/student/AdaptiveLearning"));
const AlumniNetwork = lazy(() => import("./pages/student/AlumniNetwork"));
const Announcements = lazy(() => import("./pages/student/Announcements"));
const Bookmarks = lazy(() => import("./pages/student/Bookmarks"));
const CapstoneTracker = lazy(() => import("./pages/student/CapstoneTracker"));
const CareerCenter = lazy(() => import("./pages/student/CareerCenter"));
const Competencies = lazy(() => import("./pages/student/Competencies"));
const EmployerConnections = lazy(() => import("./pages/student/EmployerConnections"));
const Groups = lazy(() => import("./pages/student/Groups"));
const Internships = lazy(() => import("./pages/student/Internships"));
const JobBoard = lazy(() => import("./pages/student/JobBoard"));
const LearningPlan = lazy(() => import("./pages/student/LearningPlan"));
const Mentorship = lazy(() => import("./pages/student/Mentorship"));
const Messages = lazy(() => import("./pages/student/Messages"));
const Notifications = lazy(() => import("./pages/student/Notifications"));
const Portfolio = lazy(() => import("./pages/student/Portfolio"));
const ProctoredExams = lazy(() => import("./pages/student/ProctoredExams"));
const Purchases = lazy(() => import("./pages/student/Purchases"));
const Resources = lazy(() => import("./pages/student/Resources"));

// Instructor
const InstructorDashboard = lazy(() => import("./pages/instructor/InstructorDashboard"));
const CreateCourse = lazy(() => import("./pages/instructor/CreateCourse"));
const EditCourse = lazy(() => import("./pages/instructor/EditCourse"));
const Grading = lazy(() => import("./pages/instructor/Grading"));
const Attendance = lazy(() => import("./pages/instructor/Attendance"));
const InstructorAnalytics = lazy(() => import("./pages/instructor/Analytics"));
const InstructorQuizzes = lazy(() => import("./pages/instructor/Quizzes"));
const InstructorAssignments = lazy(() => import("./pages/instructor/Assignments"));
const InstructorDiscussions = lazy(() => import("./pages/instructor/Discussions"));
const AccreditationEvidence = lazy(() => import("./pages/instructor/AccreditationEvidence"));
const InstructorAnnouncements = lazy(() => import("./pages/instructor/Announcements"));
const Assessments = lazy(() => import("./pages/instructor/Assessments"));
const Coaching = lazy(() => import("./pages/instructor/Coaching"));
const CohortHeatmap = lazy(() => import("./pages/instructor/CohortHeatmap"));
const CompetencyFrameworks = lazy(() => import("./pages/instructor/CompetencyFrameworks"));
const ContentLibrary = lazy(() => import("./pages/instructor/ContentLibrary"));
const Gradebook = lazy(() => import("./pages/instructor/Gradebook"));
const InstructorGroups = lazy(() => import("./pages/instructor/Groups"));
const Integrity = lazy(() => import("./pages/instructor/Integrity"));
const LiveSessions = lazy(() => import("./pages/instructor/LiveSessions"));
const InstructorMessages = lazy(() => import("./pages/instructor/Messages"));
const OfficeHours = lazy(() => import("./pages/instructor/OfficeHours"));
const OutcomeAnalytics = lazy(() => import("./pages/instructor/OutcomeAnalytics"));
const PortfolioReviews = lazy(() => import("./pages/instructor/PortfolioReviews"));
const InstructorProctoring = lazy(() => import("./pages/instructor/Proctoring"));
const QuestionBank = lazy(() => import("./pages/instructor/QuestionBank"));
const InstructorResources = lazy(() => import("./pages/instructor/Resources"));
const Rubrics = lazy(() => import("./pages/instructor/Rubrics"));
const ScormImport = lazy(() => import("./pages/instructor/ScormImport"));
const Surveys = lazy(() => import("./pages/instructor/Surveys"));
const InstructorLogin = lazy(() => import("./pages/instructor/InstructorLogin"));
const InstructorRegister = lazy(() => import("./pages/instructor/InstructorRegister"));

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminCourses = lazy(() => import("./pages/admin/Courses"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminAccreditation = lazy(() => import("./pages/admin/Accreditation"));
const AdminAccreditationEvidence = lazy(() => import("./pages/admin/AccreditationEvidence"));
const AdminInit = lazy(() => import("./pages/admin/AdminInit"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdvancedAnalytics = lazy(() => import("./pages/admin/AdvancedAnalytics"));
const AIGovernance = lazy(() => import("./pages/admin/AIGovernance"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const Billing = lazy(() => import("./pages/admin/Billing"));
const Branding = lazy(() => import("./pages/admin/Branding"));
const BulkEnrollment = lazy(() => import("./pages/admin/BulkEnrollment"));
const CatalogSegmentation = lazy(() => import("./pages/admin/CatalogSegmentation"));
const CohortInsights = lazy(() => import("./pages/admin/CohortInsights"));
const Commerce = lazy(() => import("./pages/admin/Commerce"));
const Compliance = lazy(() => import("./pages/admin/Compliance"));
const CourseCategories = lazy(() => import("./pages/admin/CourseCategories"));
const DataExports = lazy(() => import("./pages/admin/DataExports"));
const DataPipelines = lazy(() => import("./pages/admin/DataPipelines"));
const DirectorySync = lazy(() => import("./pages/admin/DirectorySync"));
const AdminIntegrations = lazy(() => import("./pages/admin/Integrations"));
const Marketplace = lazy(() => import("./pages/admin/Marketplace"));
const MarketplaceOrders = lazy(() => import("./pages/admin/MarketplaceOrders"));
const MultiCampus = lazy(() => import("./pages/admin/MultiCampus"));
const Permissions = lazy(() => import("./pages/admin/Permissions"));
const Plagiarism = lazy(() => import("./pages/admin/Plagiarism"));
const AdminProctoring = lazy(() => import("./pages/admin/Proctoring"));
const Security = lazy(() => import("./pages/admin/Security"));
const SSOProvisioning = lazy(() => import("./pages/admin/SSOProvisioning"));
const SupportCenter = lazy(() => import("./pages/admin/SupportCenter"));
const Tenants = lazy(() => import("./pages/admin/Tenants"));

// Academics
const Undergraduate = lazy(() => import("./pages/academics/Undergraduate"));
const Graduate = lazy(() => import("./pages/academics/Graduate"));
const Doctoral = lazy(() => import("./pages/academics/Doctoral"));
const OnlineLearning = lazy(() => import("./pages/academics/OnlineLearning"));
const AcademicCalendar = lazy(() => import("./pages/academics/AcademicCalendar"));

// Research
const ResearchCenters = lazy(() => import("./pages/research/ResearchCenters"));
const Publications = lazy(() => import("./pages/research/Publications"));
const Labs = lazy(() => import("./pages/research/Labs"));
const Grants = lazy(() => import("./pages/research/Grants"));

// Admissions
const Apply = lazy(() => import("./pages/admissions/Apply"));
const Tuition = lazy(() => import("./pages/admissions/Tuition"));
const Visit = lazy(() => import("./pages/admissions/Visit"));
const AdmissionsContact = lazy(() => import("./pages/admissions/Contact"));
const ApplyForm = lazy(() => import("./pages/admissions/ApplyForm"));

// Campus
const Events = lazy(() => import("./pages/campus/Events"));
const StudentLife = lazy(() => import("./pages/campus/StudentLife"));
const Housing = lazy(() => import("./pages/campus/Housing"));
const Athletics = lazy(() => import("./pages/campus/Athletics"));
const Health = lazy(() => import("./pages/campus/Health"));
const Discover = lazy(() => import("./pages/campus/Discover"));

// General
const Contact = lazy(() => import("./pages/Contact"));
const Careers = lazy(() => import("./pages/Careers"));
const Giving = lazy(() => import("./pages/Giving"));
const TeachAtGui = lazy(() => import("./pages/TeachAtGui"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ErrorBoundary>
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
                  
                  {/* Academics */}
                  <Route path="/academics/undergraduate" element={<Undergraduate />} />
                  <Route path="/academics/graduate" element={<Graduate />} />
                  <Route path="/academics/doctoral" element={<Doctoral />} />
                  <Route path="/academics/online" element={<OnlineLearning />} />
                  <Route path="/academics/catalog" element={<CourseCatalog />} />
                  <Route path="/academics/calendar" element={<AcademicCalendar />} />

                  {/* Research */}
                  <Route path="/research/centers" element={<ResearchCenters />} />
                  <Route path="/research/publications" element={<Publications />} />
                  <Route path="/research/labs" element={<Labs />} />
                  <Route path="/research/grants" element={<Grants />} />

                  {/* Admissions */}
                  <Route path="/admissions/apply" element={<Apply />} />
                  <Route path="/admissions/tuition" element={<Tuition />} />
                  <Route path="/admissions/visit" element={<Visit />} />
                  <Route path="/admissions/contact" element={<AdmissionsContact />} />
                  <Route path="/admissions/apply-form" element={<ApplyForm />} />

                  {/* Campus */}
                  <Route path="/campus/news" element={<News />} />
                  <Route path="/campus/events" element={<Events />} />
                  <Route path="/campus/student-life" element={<StudentLife />} />
                  <Route path="/campus/housing" element={<Housing />} />
                  <Route path="/campus/athletics" element={<Athletics />} />
                  <Route path="/campus/health" element={<Health />} />
                  <Route path="/campus/discover" element={<Discover />} />

                  {/* General */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/giving" element={<Giving />} />
                  <Route path="/teach" element={<TeachAtGui />} />

                  {/* Shared Auth */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/setup-password" element={<SetupPassword />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/verify" element={<Verification />} />

                  {/* Student Routes */}
                  <Route path="/dashboard/student" element={<StudentDashboard />} />
                  <Route path="/dashboard/calendar" element={<StudentCalendar />} />
                  <Route path="/dashboard/grades" element={<StudentGrades />} />
                  <Route path="/dashboard/assignments" element={<StudentAssignments />} />
                  <Route path="/dashboard/quizzes" element={<StudentQuizzes />} />
                  <Route path="/dashboard/discussions" element={<StudentDiscussions />} />
                  <Route path="/dashboard/progress" element={<StudentProgress />} />
                  <Route path="/dashboard/certificates" element={<StudentCertificates />} />
                  <Route path="/dashboard/profile" element={<Profile />} />
                  <Route path="/dashboard/adaptive-learning" element={<AdaptiveLearning />} />
                  <Route path="/dashboard/alumni" element={<AlumniNetwork />} />
                  <Route path="/dashboard/announcements" element={<Announcements />} />
                  <Route path="/dashboard/bookmarks" element={<Bookmarks />} />
                  <Route path="/dashboard/capstone" element={<CapstoneTracker />} />
                  <Route path="/dashboard/career" element={<CareerCenter />} />
                  <Route path="/dashboard/competencies" element={<Competencies />} />
                  <Route path="/dashboard/employer-connections" element={<EmployerConnections />} />
                  <Route path="/dashboard/groups" element={<Groups />} />
                  <Route path="/dashboard/internships" element={<Internships />} />
                  <Route path="/dashboard/jobs" element={<JobBoard />} />
                  <Route path="/dashboard/learning-plan" element={<LearningPlan />} />
                  <Route path="/dashboard/mentorship" element={<Mentorship />} />
                  <Route path="/dashboard/messages" element={<Messages />} />
                  <Route path="/dashboard/notifications" element={<Notifications />} />
                  <Route path="/dashboard/portfolio" element={<Portfolio />} />
                  <Route path="/dashboard/proctored-exams" element={<ProctoredExams />} />
                  <Route path="/dashboard/purchases" element={<Purchases />} />
                  <Route path="/dashboard/resources" element={<Resources />} />
                  
                  {/* Courses */}
                  <Route path="/courses" element={<CourseCatalog />} />
                  <Route path="/course/:courseId" element={<CourseDetail />} />
                  <Route path="/course/:courseId/learn" element={<CourseLearning />} />

                  {/* Instructor Routes */}
                  <Route path="/instructor" element={<InstructorDashboard />} />
                  <Route path="/instructor/courses" element={<InstructorDashboard />} />
                  <Route path="/instructor/courses/new" element={<CreateCourse />} />
                  <Route path="/instructor/courses/:courseId" element={<EditCourse />} />
                  <Route path="/instructor/grading" element={<Grading />} />
                  <Route path="/instructor/attendance" element={<Attendance />} />
                  <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
                  <Route path="/instructor/assignments" element={<InstructorAssignments />} />
                  <Route path="/instructor/quizzes" element={<InstructorQuizzes />} />
                  <Route path="/instructor/discussions" element={<InstructorDiscussions />} />
                  <Route path="/instructor/accreditation-evidence" element={<AccreditationEvidence />} />
                  <Route path="/instructor/announcements" element={<InstructorAnnouncements />} />
                  <Route path="/instructor/assessments" element={<Assessments />} />
                  <Route path="/instructor/coaching" element={<Coaching />} />
                  <Route path="/instructor/cohort-heatmap" element={<CohortHeatmap />} />
                  <Route path="/instructor/competency-frameworks" element={<CompetencyFrameworks />} />
                  <Route path="/instructor/content-library" element={<ContentLibrary />} />
                  <Route path="/instructor/gradebook" element={<Gradebook />} />
                  <Route path="/instructor/groups" element={<InstructorGroups />} />
                  <Route path="/instructor/integrity" element={<Integrity />} />
                  <Route path="/instructor/live-sessions" element={<LiveSessions />} />
                  <Route path="/instructor/messages" element={<InstructorMessages />} />
                  <Route path="/instructor/office-hours" element={<OfficeHours />} />
                  <Route path="/instructor/outcome-analytics" element={<OutcomeAnalytics />} />
                  <Route path="/instructor/portfolio-reviews" element={<PortfolioReviews />} />
                  <Route path="/instructor/proctoring" element={<InstructorProctoring />} />
                  <Route path="/instructor/question-bank" element={<QuestionBank />} />
                  <Route path="/instructor/resources" element={<InstructorResources />} />
                  <Route path="/instructor/rubrics" element={<Rubrics />} />
                  <Route path="/instructor/scorm-import" element={<ScormImport />} />
                  <Route path="/instructor/surveys" element={<Surveys />} />
                  <Route path="/instructor/login" element={<InstructorLogin />} />
                  <Route path="/instructor/register" element={<InstructorRegister />} />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/courses" element={<AdminCourses />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/accreditation" element={<AdminAccreditation />} />
                  <Route path="/admin/accreditation-evidence" element={<AdminAccreditationEvidence />} />
                  <Route path="/admin/init" element={<AdminInit />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/advanced-analytics" element={<AdvancedAnalytics />} />
                  <Route path="/admin/ai-governance" element={<AIGovernance />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/audit-logs" element={<AuditLogs />} />
                  <Route path="/admin/billing" element={<Billing />} />
                  <Route path="/admin/branding" element={<Branding />} />
                  <Route path="/admin/bulk-enrollment" element={<BulkEnrollment />} />
                  <Route path="/admin/catalog-segmentation" element={<CatalogSegmentation />} />
                  <Route path="/admin/cohort-insights" element={<CohortInsights />} />
                  <Route path="/admin/commerce" element={<Commerce />} />
                  <Route path="/admin/compliance" element={<Compliance />} />
                  <Route path="/admin/categories" element={<CourseCategories />} />
                  <Route path="/admin/data-exports" element={<DataExports />} />
                  <Route path="/admin/data-pipelines" element={<DataPipelines />} />
                  <Route path="/admin/directory-sync" element={<DirectorySync />} />
                  <Route path="/admin/integrations" element={<AdminIntegrations />} />
                  <Route path="/admin/marketplace" element={<Marketplace />} />
                  <Route path="/admin/marketplace-orders" element={<MarketplaceOrders />} />
                  <Route path="/admin/multi-campus" element={<MultiCampus />} />
                  <Route path="/admin/permissions" element={<Permissions />} />
                  <Route path="/admin/plagiarism" element={<Plagiarism />} />
                  <Route path="/admin/proctoring" element={<AdminProctoring />} />
                  <Route path="/admin/security" element={<Security />} />
                  <Route path="/admin/sso" element={<SSOProvisioning />} />
                  <Route path="/admin/support" element={<SupportCenter />} />
                  <Route path="/admin/tenants" element={<Tenants />} />

                  {/* Global Catch */}
                  <Route path="/academy" element={<Academy />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/webinars" element={<Webinars />} />
                  <Route path="/about" element={<About />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
