// One-off: creates the initial owner admin accounts via Supabase Auth
// Admin API and links them in admin_users. Prints generated passwords to
// stdout ONCE — nothing here is persisted to disk or committed.
// Run: node --env-file=.env.local scripts/seed-admins.mjs
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const owners = [
  { email: "chaarimohamedd@gmail.com", displayName: "Mohamed Chaari" },
  { email: "nadyacraft.tn@gmail.com", displayName: "Nadya" },
];

function generatePassword() {
  return crypto.randomBytes(12).toString("base64url");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

for (const owner of owners) {
  const password = generatePassword();

  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: owner.email,
    password,
    email_confirm: true,
  });

  if (userError) {
    console.error(`Failed to create ${owner.email}:`, userError.message);
    continue;
  }

  const { error: adminError } = await supabase.from("admin_users").insert({
    id: userData.user.id,
    email: owner.email,
    display_name: owner.displayName,
    role: "owner",
  });

  if (adminError) {
    console.error(`Failed to link admin_users row for ${owner.email}:`, adminError.message);
    continue;
  }

  console.log(`${owner.email} → ${password}`);
}
