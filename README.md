# Global University Institute (GUI)

## Enterprise-Grade Learning Management System

Global University Institute (GUI) is a sophisticated, scalable, and modern Learning Management System (LMS) designed for top-tier academic institutions. It provides a seamless, role-based experience for students, faculty, and administrators, bridging the gap between traditional education and the digital future.

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
- **Backend:** Node.js Express server with MongoDB Atlas for persistent data storage.
- **Storage:** Supabase Storage for secure media and document hosting.
- **AI Integration:** Powered by Claude 3.5 Sonnet for intelligent content generation and institutional reporting.

### 🛠️ Quick Start

#### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- npm or bun

#### Installation
```bash
# Clone the repository
git clone https://github.com/Davecrytpo/global-university-institute.git

# Install dependencies
npm install

# Start the development environment
# This starts both the Vite frontend and the Node.js API
npm run dev
npm run api:dev
```

#### Environment Configuration
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
VITE_API_URL=http://localhost:8787
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_SENDER_EMAIL=noreply@gui-institute.edu
```

### 📖 Documentation

Detailed feature analysis and quality assurance checklists are available in the `/docs` directory:
- [Moodle Comparison & Feature Breadth](./docs/FEATURES_MOODLE_COMPARISON.md)
- [QA & Launch Checklist](./docs/QA_CHECKLIST.md)

### 🗄️ Database Seeding

To populate the system with professional-looking content for testing, you can use the provided seeding scripts:
```bash
# Run the MongoDB seeding script
node seed_db.mjs
```
This will:
1.  Set up initial administrative and faculty accounts.
2.  Insert several high-quality courses across different academic categories.
3.  Establish initial curricula, modules, and lessons for demonstration.

### ⚖️ License

Copyright © 2026 Global University Institute. All rights reserved.
Internal use only.
