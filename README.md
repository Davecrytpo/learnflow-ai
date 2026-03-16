# Global University Institute (GUI)

## Enterprise-Grade Learning Management System

Global University Institute is a sophisticated, scalable, and modern Learning Management System (LMS) designed for top-tier academic institutions. It provides a seamless, role-based experience for students, faculty, and administrators, bridging the gap between traditional education and the digital future.

---

### 🏛️ Institutional Pillars

- **Student Excellence:** Adaptive learning paths, personalized portfolios, and global career connectivity.
- **Faculty Innovation:** AI-assisted curriculum building, advanced proctoring, and comprehensive analytics.
- **Administrative Control:** Multi-campus management, institutional accreditation tracking, and deep system governance.
- **Academic Integrity:** Built-in plagiarism detection, verifiable credentials, and proctored assessment environments.

### 🚀 Technical Excellence

- **Frontend:** React 18 with TypeScript, powered by Vite for lightning-fast development.
- **Styling:** Tailwind CSS with a custom "Civic Brass" professional theme.
- **Components:** High-performance, accessible UI primitives via shadcn-ui.
- **Backend:** Supabase for secure authentication and real-time data orchestration.
- **AI Integration:** Powered by Claude 3.5 Sonnet for intelligent content generation and institutional reporting.

### 🛠️ Quick Start

#### Prerequisites
- Node.js (v18+)
- npm or bun

#### Installation
```bash
# Clone the repository
git clone https://github.com/Davecrytpo/learnflow-ai.git

# Install dependencies
npm install

# Start the development environment
npm run dev
```

#### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_SENDER_EMAIL=noreply@globaluniversityinstitute.com
```

### 📖 Documentation

Detailed feature analysis and quality assurance checklists are available in the `/docs` directory:
- [Moodle Comparison & Feature Breadth](./docs/FEATURES_MOODLE_COMPARISON.md)
- [QA & Launch Checklist](./docs/QA_CHECKLIST.md)

### 🗄️ Database Seeding

To populate the system with professional-looking content for testing, run the contents of `supabase/seed_courses.sql` in your Supabase SQL Editor. This will:
1.  Assign the first registered user as an `instructor`.
2.  Insert several high-quality courses across different academic categories.
3.  Set up initial modules and lessons for demonstration.

### ⚖️ License

Copyright © 2026 Global University Institute. All rights reserved.
Internal use only.
