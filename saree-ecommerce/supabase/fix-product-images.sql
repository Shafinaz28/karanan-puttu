-- Run in Supabase SQL Editor to fix shop images (legacy .jpg paths / empty / bucket filenames)
-- Safe to run multiple times.

UPDATE public.products
SET
  image = regexp_replace(image, '\.jpe?g$', '.avif', 'i'),
  updated_at = now()
WHERE image ~* '\.jpe?g$';

UPDATE public.products AS p
SET image = v.image, updated_at = now()
FROM (
  VALUES
    ('Royal Purple', '/sarees/worn/worn-purple.avif'),
    ('Temple Crimson', '/sarees/worn/worn-crimson.avif'),
    ('Fuchsia Gold', '/sarees/worn/worn-fuchsia.avif'),
    ('Magenta Check', '/sarees/worn/worn-magenta-check.avif'),
    ('Mustard Coral', '/sarees/worn/worn-mustard-coral.avif'),
    ('Parrot Pink', '/sarees/worn/worn-lime-pink.avif'),
    ('Mustard Rose', '/sarees/worn/worn-mustard-rose.avif'),
    ('Plum Leaf', '/sarees/worn/worn-plum-leaf.avif'),
    ('Emerald Plum', '/sarees/worn/worn-green-plum.avif'),
    ('Gold Butta', '/sarees/worn/worn-mustard-teal.avif'),
    ('Champagne Tissue', '/sarees/soft/soft-03.avif'),
    ('Rose Tissue', '/sarees/soft/soft-06.avif'),
    ('Mint Tissue', '/sarees/soft/soft-08.avif')
) AS v(name, image)
WHERE lower(trim(p.name)) = lower(trim(v.name));

INSERT INTO public.products
  (name, category, price, badge, sale_group, line, featured, party, fabric, length, color, description, image, active)
SELECT v.name, v.category, v.price, v.badge, v.sale_group, v.line, v.featured, v.party, v.fabric, v.length, v.color, v.description, v.image, true
FROM (
  VALUES
    (
      'Champagne Tissue',
      'Tissue Sarees',
      7999,
      '50% off',
      'tissue',
      'Champagne tissue with gold jaal and zari border',
      true,
      false,
      'Tissue silk',
      '6.3 metres',
      'Champagne and gold',
      'A lightweight tissue silk saree with all-over gold jaal and a broad zari border. Blouse piece included.',
      '/sarees/soft/soft-03.avif'
    ),
    (
      'Rose Tissue',
      'Tissue Sarees',
      7999,
      '50% off',
      'tissue',
      'Blush tissue with motif pallu and gold border',
      false,
      false,
      'Tissue silk',
      '6.3 metres',
      'Rose and gold',
      'A rose tissue silk with delicate motifs on the pallu and fine gold zari. Blouse piece included.',
      '/sarees/soft/soft-06.avif'
    ),
    (
      'Mint Tissue',
      'Tissue Sarees',
      7999,
      '50% off',
      'tissue',
      'Mint green tissue with traditional zari work',
      false,
      false,
      'Tissue silk',
      '6.3 metres',
      'Mint and gold',
      'A mint green tissue saree with classic zari borders and a sheer drape. Blouse piece included.',
      '/sarees/soft/soft-08.avif'
    )
) AS v(name, category, price, badge, sale_group, line, featured, party, fabric, length, color, description, image)
WHERE NOT EXISTS (
  SELECT 1 FROM public.products p WHERE lower(trim(p.name)) = lower(trim(v.name))
);
