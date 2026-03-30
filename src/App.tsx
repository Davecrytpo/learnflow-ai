import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <p className="mt-2 text-muted-foreground">The application encountered an unexpected error. Please refresh the page.</p>
          <button className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground" onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Index = lazy(() => import("./pages/Index"));
const StudentPortal = lazy(() => import("./pages/StudentPortal"));
const InstructorPortal = lazy(() => import("./pages/InstructorPortal"));
const AdminPortal = lazy(() => import("./pages/AdminPortal"));
const SetupPassword = lazy(() => import("./pages/SetupPassword"));
const InstructorAnnouncements = lazy(() => import("./pages/instructor/Announcements"));
const InstructorGroups = lazy(() => import("./pages/instructor/Groups"));
const InstructorAnalytics = lazy(() => import("./pages/instructor/Analytics"));
const InstructorQuestionBank = lazy(() => import("./pages/instructor/QuestionBank"));
const InstructorScormImport = lazy(() => import("./pages/instructor/ScormImport"));
const InstructorResources = lazy(() => import("./pages/instructor/Resources"));
const InstructorAssignments = lazy(() => import("./pages/instructor/Assignments"));
const InstructorQuizzes = lazy(() => import("./pages/instructor/Quizzes"));
const InstructorDiscussions = lazy(() => import("./pages/instructor/Discussions"));
const InstructorMessages = lazy(() => import("./pages/instructor/Messages"));
const InstructorRubrics = lazy(() => import("./pages/instructor/Rubrics"));
const InstructorLiveSessions = lazy(() => import("./pages/instructor/LiveSessions"));
const InstructorSurveys = lazy(() => import("./pages/instructor/Surveys"));
const InstructorCompetencies = lazy(() => import("./pages/instructor/CompetencyFrameworks"));
const InstructorContentLibrary = lazy(() => import("./pages/instructor/ContentLibrary"));
const InstructorAssessments = lazy(() => import("./pages/instructor/Assessments"));
const InstructorProctoring = lazy(() => import("./pages/instructor/Proctoring"));
const InstructorIntegrity = lazy(() => import("./pages/instructor/Integrity"));
const InstructorPortfolioReviews = lazy(() => import("./pages/instructor/PortfolioReviews"));
const InstructorCoaching = lazy(() => import("./pages/instructor/Coaching"));
const InstructorOfficeHours = lazy(() => import("./pages/instructor/OfficeHours"));
const InstructorCohortHeatmap = lazy(() => import("./pages/instructor/CohortHeatmap"));
const InstructorOutcomeAnalytics = lazy(() => import("./pages/instructor/OutcomeAnalytics"));
const InstructorAccreditationEvidence = lazy(() => import("./pages/instructor/AccreditationEvidence"));
const StudentAnnouncements = lazy(() => import("./pages/student/Announcements"));
const StudentCertificates = lazy(() => import("./pages/student/Certificates"));
const StudentNotifications = lazy(() => import("./pages/student/Notifications"));
const StudentGroups = lazy(() => import("./pages/student/Groups"));
const StudentResources = lazy(() => import("./pages/student/Resources"));
const StudentGrades = lazy(() => import("./pages/student/Grades"));
const StudentAssignments = lazy(() => import("./pages/student/Assignments"));
const StudentQuizzes = lazy(() => import("./pages/student/Quizzes"));
const StudentDiscussions = lazy(() => import("./pages/student/Discussions"));
const StudentMessages = lazy(() => import("./pages/student/Messages"));
const StudentLearningPlan = lazy(() => import("./pages/student/LearningPlan"));
const StudentProgress = lazy(() => import("./pages/student/Progress"));
const StudentBookmarks = lazy(() => import("./pages/student/Bookmarks"));
const StudentCompetencies = lazy(() => import("./pages/student/Competencies"));
const StudentPortfolio = lazy(() => import("./pages/student/Portfolio"));
const StudentAdaptive = lazy(() => import("./pages/student/AdaptiveLearning"));
const StudentProctoredExams = lazy(() => import("./pages/student/ProctoredExams"));
const StudentPurchases = lazy(() => import("./pages/student/Purchases"));
const StudentCareerCenter = lazy(() => import("./pages/student/CareerCenter"));
const StudentMentorship = lazy(() => import("./pages/student/Mentorship"));
const StudentInternships = lazy(() => import("./pages/student/Internships"));
const StudentJobBoard = lazy(() => import("./pages/student/JobBoard"));
const StudentCapstoneTracker = lazy(() => import("./pages/student/CapstoneTracker"));
const StudentEmployerConnections = lazy(() => import("./pages/student/EmployerConnections"));
const StudentAlumniNetwork = lazy(() => import("./pages/student/AlumniNetwork"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminInit = lazy(() => import("./pages/admin/AdminInit"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminCourses = lazy(() => import("./pages/admin/Courses"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSecurity = lazy(() => import("./pages/admin/Security"));
const AdminAuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const AdminBulkEnrollment = lazy(() => import("./pages/admin/BulkEnrollment"));
const AdminCourseCategories = lazy(() => import("./pages/admin/CourseCategories"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminIntegrations = lazy(() => import("./pages/admin/Integrations"));
const AdminTenants = lazy(() => import("./pages/admin/Tenants"));
const AdminPermissions = lazy(() => import("./pages/admin/Permissions"));
const AdminBilling = lazy(() => import("./pages/admin/Billing"));
const AdminAccreditation = lazy(() => import("./pages/admin/Accreditation"));
const AdminCompliance = lazy(() => import("./pages/admin/Compliance"));
const AdminMarketplace = lazy(() => import("./pages/admin/Marketplace"));
const AdminAIGovernance = lazy(() => import("./pages/admin/AIGovernance"));
const AdminDataExports = lazy(() => import("./pages/admin/DataExports"));
const AdminProctoring = lazy(() => import("./pages/admin/Proctoring"));
const AdminPlagiarism = lazy(() => import("./pages/admin/Plagiarism"));
const AdminPipelines = lazy(() => import("./pages/admin/DataPipelines"));
const AdminCommerce = lazy(() => import("./pages/admin/Commerce"));
const AdminMarketplaceOrders = lazy(() => import("./pages/admin/MarketplaceOrders"));
const AdminSSO = lazy(() => import("./pages/admin/SSOProvisioning"));
const AdminDirectorySync = lazy(() => import("./pages/admin/DirectorySync"));
const AdminBranding = lazy(() => import("./pages/admin/Branding"));
const AdminSupport = lazy(() => import("./pages/admin/SupportCenter"));
const AdminAdvancedAnalytics = lazy(() => import("./pages/admin/AdvancedAnalytics"));
const AdminAccreditationEvidence = lazy(() => import("./pages/admin/AccreditationEvidence"));
const AdminCohortInsights = lazy(() => import("./pages/admin/CohortInsights"));
const AdminMultiCampus = lazy(() => import("./pages/admin/MultiCampus"));
const AdminCatalogSegmentation = lazy(() => import("./pages/admin/CatalogSegmentation"));
const Academy = lazy(() => import("./pages/Academy"));
const News = lazy(() => import("./pages/News"));
const Webinars = lazy(() => import("./pages/Webinars"));
const Verification = lazy(() => import("./pages/Verification"));
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
const InstructorRegister = lazy(() => import("./pages/instructor/InstructorRegister"));
const InstructorLogin = lazy(() => import("./pages/instructor/InstructorLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

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

                  <Route path="/student" element={<StudentPortal />} />
                  <Route path="/instructor-portal" element={<InstructorPortal />} />
                  <Route path="/admin-portal" element={<AdminPortal />} />
                  <Route path="/setup-password" element={<SetupPassword />} />
                  <Route path="/auth/init-admin" element={<AdminInit />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/instructor/login" element={<InstructorLogin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/instructor/register" element={<InstructorRegister />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/student" element={<StudentDashboard />} />
                  <Route path="/dashboard/calendar" element={<StudentCalendar />} />
                  <Route path="/dashboard/announcements" element={<StudentAnnouncements />} />
                  <Route path="/dashboard/resources" element={<StudentResources />} />
                  <Route path="/dashboard/grades" element={<StudentGrades />} />
                  <Route path="/dashboard/assignments" element={<StudentAssignments />} />
                  <Route path="/dashboard/quizzes" element={<StudentQuizzes />} />
                  <Route path="/dashboard/discussions" element={<StudentDiscussions />} />
                  <Route path="/dashboard/messages" element={<StudentMessages />} />
                  <Route path="/dashboard/learning-plan" element={<StudentLearningPlan />} />
                  <Route path="/dashboard/progress" element={<StudentProgress />} />
                  <Route path="/dashboard/bookmarks" element={<StudentBookmarks />} />
                  <Route path="/dashboard/competencies" element={<StudentCompetencies />} />
                  <Route path="/dashboard/portfolio" element={<StudentPortfolio />} />
                  <Route path="/dashboard/adaptive" element={<StudentAdaptive />} />
                  <Route path="/dashboard/proctored-exams" element={<StudentProctoredExams />} />
                  <Route path="/dashboard/purchases" element={<StudentPurchases />} />
                  <Route path="/dashboard/career" element={<StudentCareerCenter />} />
                  <Route path="/dashboard/mentorship" element={<StudentMentorship />} />
                  <Route path="/dashboard/internships" element={<StudentInternships />} />
                  <Route path="/dashboard/job-board" element={<StudentJobBoard />} />
                  <Route path="/dashboard/capstone" element={<StudentCapstoneTracker />} />
                  <Route path="/dashboard/employers" element={<StudentEmployerConnections />} />
                  <Route path="/dashboard/alumni" element={<StudentAlumniNetwork />} />
                  <Route path="/dashboard/certificates" element={<StudentCertificates />} />
                  <Route path="/dashboard/groups" element={<StudentGroups />} />
                  <Route path="/dashboard/notifications" element={<StudentNotifications />} />
                  <Route path="/dashboard/profile" element={<Profile />} />
                  <Route path="/dashboard/*" element={<StudentDashboard />} />
                  <Route path="/courses" element={<CourseCatalog />} />
                  <Route path="/course/:courseId" element={<CourseDetail />} />
                  <Route path="/course/:courseId/learn" element={<CourseLearning />} />
                  <Route path="/instructor" element={<InstructorDashboard />} />
                  <Route path="/instructor/courses" element={<InstructorDashboard />} />
                  <Route path="/instructor/courses/new" element={<CreateCourse />} />
                  <Route path="/instructor/courses/:courseId" element={<EditCourse />} />
                  <Route path="/instructor/courses/:courseId/gradebook" element={<Gradebook />} />
                  <Route path="/instructor/grading" element={<Grading />} />
                  <Route path="/instructor/attendance" element={<Attendance />} />
                  <Route path="/instructor/announcements" element={<InstructorAnnouncements />} />
                  <Route path="/instructor/groups" element={<InstructorGroups />} />
                  <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
                  <Route path="/instructor/resources" element={<InstructorResources />} />
                  <Route path="/instructor/assignments" element={<InstructorAssignments />} />
                  <Route path="/instructor/quizzes" element={<InstructorQuizzes />} />
                  <Route path="/instructor/discussions" element={<InstructorDiscussions />} />
                  <Route path="/instructor/messages" element={<InstructorMessages />} />
                  <Route path="/instructor/rubrics" element={<InstructorRubrics />} />
                  <Route path="/instructor/live-sessions" element={<InstructorLiveSessions />} />
                  <Route path="/instructor/surveys" element={<InstructorSurveys />} />
                  <Route path="/instructor/competencies" element={<InstructorCompetencies />} />
                  <Route path="/instructor/content-library" element={<InstructorContentLibrary />} />
                  <Route path="/instructor/assessments" element={<InstructorAssessments />} />
                  <Route path="/instructor/proctoring" element={<InstructorProctoring />} />
                  <Route path="/instructor/integrity" element={<InstructorIntegrity />} />
                  <Route path="/instructor/portfolio-reviews" element={<InstructorPortfolioReviews />} />
                  <Route path="/instructor/coaching" element={<InstructorCoaching />} />
                  <Route path="/instructor/office-hours" element={<InstructorOfficeHours />} />
                  <Route path="/instructor/cohort-heatmap" element={<InstructorCohortHeatmap />} />
                  <Route path="/instructor/outcome-analytics" element={<InstructorOutcomeAnalytics />} />
                  <Route path="/instructor/accreditation-evidence" element={<InstructorAccreditationEvidence />} />
                  <Route path="/instructor/question-bank" element={<InstructorQuestionBank />} />
                  <Route path="/instructor/scorm" element={<InstructorScormImport />} />
                  <Route path="/instructor/*" element={<InstructorDashboard />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/courses" element={<AdminCourses />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/security" element={<AdminSecurity />} />
                  <Route path="/admin/audit" element={<AdminAuditLogs />} />
                  <Route path="/admin/bulk-enrollment" element={<AdminBulkEnrollment />} />
                  <Route path="/admin/categories" element={<AdminCourseCategories />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/integrations" element={<AdminIntegrations />} />
                  <Route path="/admin/tenants" element={<AdminTenants />} />
                  <Route path="/admin/permissions" element={<AdminPermissions />} />
                  <Route path="/admin/billing" element={<AdminBilling />} />
                  <Route path="/admin/accreditation" element={<AdminAccreditation />} />
                  <Route path="/admin/compliance" element={<AdminCompliance />} />
                  <Route path="/admin/marketplace" element={<AdminMarketplace />} />
                  <Route path="/admin/ai-governance" element={<AdminAIGovernance />} />
                  <Route path="/admin/data-exports" element={<AdminDataExports />} />
                  <Route path="/admin/proctoring" element={<AdminProctoring />} />
                  <Route path="/admin/plagiarism" element={<AdminPlagiarism />} />
                  <Route path="/admin/data-pipelines" element={<AdminPipelines />} />
                  <Route path="/admin/commerce" element={<AdminCommerce />} />
                  <Route path="/admin/marketplace-orders" element={<AdminMarketplaceOrders />} />
                  <Route path="/admin/sso" element={<AdminSSO />} />
                  <Route path="/admin/directory-sync" element={<AdminDirectorySync />} />
                  <Route path="/admin/branding" element={<AdminBranding />} />
                  <Route path="/admin/support" element={<AdminSupport />} />
                  <Route path="/admin/advanced-analytics" element={<AdminAdvancedAnalytics />} />
                  <Route path="/admin/accreditation-evidence" element={<AdminAccreditationEvidence />} />
                  <Route path="/admin/cohort-insights" element={<AdminCohortInsights />} />
                  <Route path="/admin/multi-campus" element={<AdminMultiCampus />} />
                  <Route path="/admin/catalog-segmentation" element={<AdminCatalogSegmentation />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  <Route path="/academy" element={<Academy />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/webinars" element={<Webinars />} />
                  <Route path="/verify" element={<Verification />} />
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
