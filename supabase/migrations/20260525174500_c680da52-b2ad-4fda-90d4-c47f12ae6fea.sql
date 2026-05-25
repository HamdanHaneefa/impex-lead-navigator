drop policy if exists "Anyone can submit a lead" on public.leads;

create policy "Anyone can submit a valid lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (
    length(full_name) between 2 and 100
    and length(email) between 5 and 255
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(phone) between 6 and 20
    and length(organization) between 1 and 150
    and length(environment) between 1 and 40
    and length(display_size) between 1 and 20
    and length(quantity) between 1 and 20
    and length(timeline) between 1 and 40
    and (notes is null or length(notes) <= 1000)
    and (city is null or length(city) <= 80)
    and (role is null or length(role) <= 80)
    and (source is null or length(source) <= 80)
  );