const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log("🚀 Starting database seed...");

  // 1. Create Admin User
  const adminEmail = 'admin@globaluniversityinstitute.com';
  const { data: adminUser, error: adminError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: 'AdminPassword123!',
    email_confirm: true,
    user_metadata: { full_name: 'System Administrator', role: 'admin' }
  });

  if (adminError && adminError.message !== 'User already exists') {
    console.error("Error creating admin:", adminError.message);
  } else {
    console.log("✅ Admin user ensured:", adminEmail);
    const uid = adminUser?.user?.id || (await supabase.from('profiles').select('user_id').eq('display_name', 'System Administrator').maybeSingle()).data?.user_id;
    
    if (uid) {
      await supabase.from('user_roles').upsert({ user_id: uid, role: 'admin' }, { onConflict: ['user_id', 'role'] });
      console.log("✅ Admin role assigned.");
    }
  }

  // 2. Create Sample Instructor
  const instructorEmail = 'instructor@globaluniversityinstitute.com';
  const { data: instUser, error: instError } = await supabase.auth.admin.createUser({
    email: instructorEmail,
    password: 'InstructorPassword123!',
    email_confirm: true,
    user_metadata: { full_name: 'Dr. Sarah Jenkins', role: 'instructor' }
  });

  let instructorId;
  if (instError && instError.message !== 'User already exists') {
    console.error("Error creating instructor:", instError.message);
  } else {
    instructorId = instUser?.user?.id;
    if (!instructorId) {
        const { data } = await supabase.from('profiles').select('user_id').ilike('display_name', '%Sarah%').maybeSingle();
        instructorId = data?.user_id;
    }
    console.log("✅ Instructor ensured:", instructorEmail);
    if (instructorId) {
        await supabase.from('user_roles').upsert({ user_id: instructorId, role: 'instructor' }, { onConflict: ['user_id', 'role'] });
    }
  }

  // 3. Seed Courses if instructor exists
  if (instructorId) {
    const courses = [
      {
        author_id: instructorId,
        slug: 'quantum-computing-101',
        title: 'Quantum Computing Fundamentals',
        summary: 'An introduction to quantum bits, gates, and algorithms.',
        description: '<p>Learn about qubits, superposition, and entanglement.</p>',
        category: 'Technology',
        published: true,
        price_cents: 49900
      },
      {
        author_id: instructorId,
        slug: 'ai-ethics-modern-world',
        title: 'AI Ethics in the Modern World',
        summary: 'Exploring the moral boundaries of artificial intelligence.',
        description: '<p>Discussion on bias, transparency, and safety.</p>',
        category: 'Science',
        published: true,
        price_cents: 0
      }
    ];

    const { error: courseError } = await supabase.from('courses').upsert(courses, { onConflict: 'slug' });
    if (courseError) console.error("Error seeding courses:", courseError.message);
    else console.log("✅ Courses seeded.");
  }

  console.log("🏁 Seeding complete!");
}

seed().catch(err => console.error("Unhandled seed error:", err));
