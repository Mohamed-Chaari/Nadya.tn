// One-off migration: seeds the Phase 1 mock catalog into Supabase's
// products table. Run once: `node --env-file=.env.local scripts/seed-products.mjs`
import { createClient } from "@supabase/supabase-js";

const products = [
  { slug: "rosee-scintillante", nameFr: "Rosée scintillante", subtitleFr: "Couronne fine ornée de cristaux", categorySlug: "couronnes-tiares", price: 320, compareAtPrice: 380, images: [], descriptionFr: "Une couronne délicate sertie de cristaux étincelants, pensée pour la mariée qui souhaite une touche de lumière sans excès. Fait main dans notre atelier de Sfax.", materialsFr: ["Métal doré à l'or fin", "Cristaux autrichiens", "Perles nacrées"], stock: 6, isFeatured: true, isNew: false, isCustomizable: false, rating: 4.9, reviewCount: 47 },
  { slug: "couronne-imperiale-doree", nameFr: "Couronne impériale dorée", subtitleFr: "Pièce maîtresse XL pour un look majestueux", categorySlug: "couronnes-tiares", price: 450, images: [], descriptionFr: "Notre pièce la plus spectaculaire : une tiare haute, richement ornée, pour les mariées qui veulent marquer les esprits.", materialsFr: ["Laiton doré", "Zircons", "Perles d'eau douce"], stock: 3, isFeatured: true, isNew: false, isCustomizable: true, rating: 5, reviewCount: 22 },
  { slug: "halo-de-perles", nameFr: "Halo de perles", subtitleFr: "Couronne basse façon halo", categorySlug: "couronnes-tiares", price: 280, images: [], descriptionFr: "Un halo discret de perles nacrées qui épouse le front sans alourdir la coiffure — idéal pour un style bohème-chic.", materialsFr: ["Fil doré", "Perles nacrées"], stock: 9, isFeatured: false, isNew: true, isCustomizable: false, rating: 4.7, reviewCount: 15 },
  { slug: "couronne-fleurie-ivoire", nameFr: "Couronne fleurie ivoire", subtitleFr: "Fleurs en tissu et perles ivoire", categorySlug: "couronnes-tiares", price: 300, images: [], descriptionFr: "Des fleurs délicates en tissu ivoire mêlées à des perles, pour une allure romantique et naturelle.", materialsFr: ["Fleurs en tissu", "Perles ivoire", "Base en métal souple"], stock: 5, isFeatured: false, isNew: false, isCustomizable: false, rating: 4.8, reviewCount: 31 },
  { slug: "collier-lecrin-fleuri", nameFr: "L'écrin fleuri", subtitleFr: "Collier ras-de-cou floral", categorySlug: "colliers", price: 210, images: [], descriptionFr: "Un collier ras-de-cou orné de motifs floraux délicats, à porter seul ou associé à notre couronne assortie.", materialsFr: ["Métal doré", "Cristaux", "Fermoir ajustable"], stock: 12, isFeatured: true, isNew: false, isCustomizable: false, rating: 4.9, reviewCount: 38 },
  { slug: "collier-goutte-de-lune", nameFr: "Goutte de lune", subtitleFr: "Collier pendentif cristal", categorySlug: "colliers", price: 180, images: [], descriptionFr: "Un pendentif en forme de goutte, taillé pour capter la lumière — simple, élégant, intemporel.", materialsFr: ["Chaîne dorée fine", "Cristal taillé"], stock: 14, isFeatured: false, isNew: true, isCustomizable: false, rating: 4.6, reviewCount: 9 },
  { slug: "collier-reine-de-saba", nameFr: "Reine de Saba", subtitleFr: "Collier statement multi-rangs", categorySlug: "colliers", price: 390, compareAtPrice: 430, images: [], descriptionFr: "Un collier multi-rangs richement orné, inspiré des parures royales — pour les mariées qui aiment les pièces fortes.", materialsFr: ["Laiton doré", "Perles nacrées", "Cristaux"], stock: 4, isFeatured: true, isNew: false, isCustomizable: true, rating: 5, reviewCount: 18 },
  { slug: "collier-brume-doree", nameFr: "Brume dorée", subtitleFr: "Collier fin chaîne double", categorySlug: "colliers", price: 150, images: [], descriptionFr: "Une double chaîne fine et légère, pour twister une tenue simple avec une touche dorée discrète.", materialsFr: ["Chaîne dorée", "Breloques cristal"], stock: 20, isFeatured: false, isNew: false, isCustomizable: false, rating: 4.5, reviewCount: 26 },
  { slug: "peigne-reine-de-cristal", nameFr: "Peigne reine de cristal", subtitleFr: "Peigne orné haute couture", categorySlug: "peignes", price: 240, images: [], descriptionFr: "Un peigne richement orné de cristaux, sculpté pour se glisser élégamment dans un chignon ou une coiffure relevée.", materialsFr: ["Métal doré", "Cristaux autrichiens", "Dents en acier inoxydable"], stock: 7, isFeatured: true, isNew: false, isCustomizable: false, rating: 4.9, reviewCount: 41 },
  { slug: "peigne-feuille-doree", nameFr: "Feuille dorée", subtitleFr: "Peigne motif feuillage", categorySlug: "peignes", price: 160, images: [], descriptionFr: "Un peigne inspiré du feuillage doré, léger et facile à porter, pour une touche nature-chic.", materialsFr: ["Métal doré", "Perles nacrées"], stock: 11, isFeatured: false, isNew: true, isCustomizable: false, rating: 4.7, reviewCount: 6 },
  { slug: "peigne-etoile-du-soir", nameFr: "Étoile du soir", subtitleFr: "Peigne pièce unique cristaux", categorySlug: "peignes", price: 275, images: [], descriptionFr: "Un peigne compact serti de cristaux en forme d'étoile, pour ajouter une touche scintillante sans excès.", materialsFr: ["Métal doré", "Cristaux"], stock: 8, isFeatured: false, isNew: false, isCustomizable: false, rating: 4.8, reviewCount: 19 },
  { slug: "peigne-jardin-ivoire", nameFr: "Jardin ivoire", subtitleFr: "Peigne floral perlé", categorySlug: "peignes", price: 195, images: [], descriptionFr: "Des petites fleurs perlées ivoire disposées avec finesse sur un peigne discret — parfait pour un style champêtre.", materialsFr: ["Métal doré", "Perles ivoire", "Fleurs en résine"], stock: 10, isFeatured: false, isNew: false, isCustomizable: false, rating: 4.6, reviewCount: 13 },
  { slug: "hair-vine-fil-de-lumiere", nameFr: "Fil de lumière", subtitleFr: "Hair vine cristaux et perles", categorySlug: "hair-vines", price: 260, images: [], descriptionFr: "Une chaîne souple sertie de cristaux et perles, à draper sur une coiffure lâchée ou tressée pour un effet lumineux.", materialsFr: ["Fil doré souple", "Cristaux", "Perles nacrées"], stock: 9, isFeatured: true, isNew: false, isCustomizable: false, rating: 4.9, reviewCount: 24 },
  { slug: "hair-vine-cascade-nacree", nameFr: "Cascade nacrée", subtitleFr: "Hair vine longue double rang", categorySlug: "hair-vines", price: 310, compareAtPrice: 350, images: [], descriptionFr: "Une longue chaîne double rang qui cascade délicatement le long de la coiffure — un effet très photogénique.", materialsFr: ["Fil doré souple", "Perles nacrées", "Cristaux"], stock: 5, isFeatured: false, isNew: true, isCustomizable: false, rating: 5, reviewCount: 11 },
  { slug: "hair-vine-murmure-dor", nameFr: "Murmure d'or", subtitleFr: "Hair vine fine minimaliste", categorySlug: "hair-vines", price: 140, images: [], descriptionFr: "Une chaîne très fine et discrète, pour les mariées qui préfèrent la sobriété avec juste ce qu'il faut d'éclat.", materialsFr: ["Fil doré fin"], stock: 16, isFeatured: false, isNew: false, isCustomizable: false, rating: 4.5, reviewCount: 8 },
  { slug: "hair-vine-couronne-de-vigne", nameFr: "Couronne de vigne", subtitleFr: "Hair vine style bohème", categorySlug: "hair-vines", price: 230, images: [], descriptionFr: "Inspirée des vignes fleuries, cette hair vine tressée apporte une touche bohème et naturelle à la coiffure.", materialsFr: ["Fil doré souple", "Perles nacrées", "Petites fleurs en résine"], stock: 7, isFeatured: false, isNew: false, isCustomizable: false, rating: 4.7, reviewCount: 17 },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rows = products.map((p) => ({
  slug: p.slug,
  name_fr: p.nameFr,
  subtitle_fr: p.subtitleFr,
  category_slug: p.categorySlug,
  price: p.price,
  compare_at_price: p.compareAtPrice ?? null,
  images: p.images,
  description_fr: p.descriptionFr,
  materials_fr: p.materialsFr,
  stock: p.stock,
  is_featured: p.isFeatured,
  is_new: p.isNew,
  is_customizable: p.isCustomizable,
  rating: p.rating,
  review_count: p.reviewCount,
}));

const { data, error } = await supabase
  .from("products")
  .upsert(rows, { onConflict: "slug" })
  .select("slug");

if (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}

console.log(`Seeded ${data.length} products.`);
