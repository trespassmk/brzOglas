INSERT INTO public.categories (slug, name) VALUES
  ('cars', 'Cars'),
  ('mobiles', 'Mobiles'),
  ('property', 'Property'),
  ('jobs', 'Jobs'),
  ('furniture', 'Furniture'),
  ('fashion', 'Fashion'),
  ('electronics', 'Electronics'),
  ('bikes', 'Bikes'),
  ('more', 'More')
ON CONFLICT (slug) DO NOTHING;