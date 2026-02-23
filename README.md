# Learnflow AI

Enterprise LMS for modern education. Learnflow AI helps institutions design courses, assess learners, and certify outcomes with a clean, fast, and scalable frontend experience.

**Highlights**
- Role-based experiences for students, instructors, and administrators
- Course catalog, curriculum builder, assessments, gradebook, and attendance
- Analytics, certificates, and verifiable credentials
- Modern UI with accessible components, responsive layouts, and clear hierarchy

**Tech Stack**
- React + TypeScript + Vite
- Tailwind CSS + shadcn-ui
- TanStack Query
- Supabase (auth and data)

**Getting Started**
```bash
npm install
npm run dev
```

**Scripts**
- `npm run dev` Start the development server
- `npm run build` Create a production build
- `npm run preview` Preview the production build
- `npm run lint` Run ESLint
- `npm run test` Run unit tests

**Environment Variables**
Create a `.env` file with the following values.
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Project Structure**
- `src/components` UI components and landing sections
- `src/pages` Route-based pages (student, instructor, admin)
- `src/contexts` Global state and providers
- `src/lib` Utilities and helper modules
- `src/integrations` External integrations

**Design Direction**
Civic Brass theme with deep teal primary and copper accents. Typography uses `Fraunces` for display and `Sora` for body text.

**Deployment**
Build the project and deploy the `dist` directory to your hosting provider.

```bash
npm run build
```
