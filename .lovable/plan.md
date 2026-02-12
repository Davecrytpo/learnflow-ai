

# Classroom — Professional LMS Platform

A full-featured Learning Management System with courses, lessons, assignments, progress tracking, certificates, AI-assisted content creation, and Stripe payments — built with React, Supabase, and Lovable AI.

---

## Phase 1: Foundation & Authentication

### Supabase Setup & Database Schema
- Set up Supabase with all core tables: profiles, courses, modules, lessons, assignments, submissions, enrollments, certificates, notifications
- Separate `user_roles` table for role-based access control (Admin, Instructor, Student)
- Row-Level Security policies for all tables based on user roles
- Storage buckets for course covers, lesson files, assignment submissions, and certificates

### Authentication System
- Email/password signup and login
- Google OAuth integration
- Role selection during onboarding (Student or Instructor — Admin assigned manually)
- Protected routes based on authentication and role

---

## Phase 2: Public-Facing Pages

### Professional Homepage
- Hero section with headline: "Teach what you love. Launch courses that work."
- Feature cards: AI course creation, professional dashboards, certificates & monetization
- Testimonials section
- Pricing section (Free, Pro, Enterprise tiers)
- Call-to-action buttons for signup
- Responsive footer with links

### Public Course Catalog
- Browse all published courses with search and filters (category, price, instructor)
- Course cards showing cover image, title, instructor, price, enrollment count
- Individual course landing page with curriculum overview, instructor bio, reviews, and enroll/purchase CTA

### Additional Marketing Pages
- About page
- Features deep-dive page
- Pricing page

---

## Phase 3: Student Dashboard & Experience

### Student Dashboard
- Overview: enrolled courses, progress summary, upcoming assignments
- "Continue Learning" quick-resume button for last active lesson
- Progress visualization with charts (using Recharts)
- Notifications feed

### Course Learning Experience
- Module/lesson navigation sidebar
- Lesson content viewer (markdown-rendered content, embedded videos)
- Lesson completion tracking with progress bar
- Assignment submission (text entry + file upload to Supabase Storage)
- View grades and instructor feedback

### Certificates
- Auto-generated when course is completed
- PDF certificate with student name, course title, date, and certificate ID
- Downloadable from student dashboard

---

## Phase 4: Instructor Dashboard & Course Management

### Instructor Dashboard
- Overview: total students, active courses, pending assignments to grade
- Course analytics (enrollment trends, completion rates) with Recharts charts
- Earnings overview (from paid courses)

### Course Creation Wizard
- Step-by-step: Course details → Modules → Lessons → Pricing → Publish
- Rich text editor for lesson content
- File/video upload for lesson materials
- Course cover image upload
- Draft/publish toggle

### Assignment & Grading
- Create assignments with due dates and max scores
- Grading queue: view submissions, provide scores and feedback
- Student roster per course with progress overview

### AI Content Generation (Lovable AI)
- Generate course outlines from a topic prompt
- Draft lesson content from an outline
- Suggest quiz/assignment questions
- All AI-generated content appears as editable drafts in the editor

---

## Phase 5: Admin Panel

### Admin Dashboard
- Platform metrics: total users, courses, enrollments, revenue
- User management: search, view, promote/demote roles
- Course moderation: review, approve, or flag courses
- Activity feed of recent platform events

---

## Phase 6: Payments (Stripe)

### Course Purchases
- Stripe integration for one-time course purchases
- Checkout flow on course landing page
- Webhook handling for payment confirmation → auto-enroll student
- Purchase history for students

### Instructor Earnings
- Revenue tracking per course for instructors
- Earnings dashboard

---

## Phase 7: Notifications & Polish

### Notification System
- In-app notifications for: enrollment confirmations, assignment grades, new course content, certificate issued
- Notification bell with unread count in navbar
- Mark as read functionality

### UI/UX Polish
- Skeleton loaders for all data-fetching states
- Responsive design across mobile, tablet, desktop
- Consistent design system with professional styling
- Toast notifications for actions (enroll, submit, grade)
- Keyboard accessibility and proper focus management

---

## Design Direction
- Clean, modern, enterprise-grade aesthetic
- Blue primary (#0F62FF) with teal accent (#00BFA6)
- Card-based layouts with soft shadows
- Sidebar navigation for dashboards
- Inter font for UI, clear typography hierarchy

