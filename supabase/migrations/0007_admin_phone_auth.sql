-- NADYA — Art & Handcraft
-- Switch admin login from email to phone number.
--
-- admin_users.email is replaced with phone (E.164, e.g. +21627663444).
-- Existing admin rows are dropped along with their auth.users records —
-- they were email-based and can no longer sign in once the login form only
-- accepts a phone number, so there's nothing to migrate forward for them.

delete from auth.users
where id in (select id from public.admin_users);
-- (admin_users rows cascade-delete via the id -> auth.users FK)

alter table public.admin_users drop column if exists email;
-- Table is empty at this point (all prior rows deleted above), so a NOT
-- NULL column can be added directly with no backfill/default needed.
alter table public.admin_users add column if not exists phone text not null;
