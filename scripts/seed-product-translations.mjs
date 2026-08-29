// One-off: backfills Arabic + English translations for description/materials
// on the 16 existing products (matched by slug). Names/subtitles stay
// French always — brand identity, not translated.
// Run: node --env-file=.env.local scripts/seed-product-translations.mjs
import { createClient } from "@supabase/supabase-js";

const translations = [
  {
    slug: "rosee-scintillante",
    descriptionEn:
      "A delicate crown set with sparkling crystals, designed for the bride who wants a touch of light without excess. Handmade in our Sfax workshop.",
    materialsEn: ["Fine gold-plated metal", "Austrian crystals", "Pearl beads"],
    descriptionAr:
      "تاج رقيق مرصّع بأحجار كريستال لامعة، صُمم للعروس التي ترغب بلمسة من البريق دون مبالغة. مصنوع يدويًا في مشغلنا بصفاقس.",
    materialsAr: ["معدن مطلي بالذهب الخالص", "كريستال نمساوي", "لآلئ صدفية"],
  },
  {
    slug: "couronne-imperiale-doree",
    descriptionEn:
      "Our most spectacular piece: a tall, richly adorned tiara, for brides who want to make a lasting impression.",
    materialsEn: ["Gold-plated brass", "Zircons", "Freshwater pearls"],
    descriptionAr:
      "قطعتنا الأكثر روعة: تاج عالٍ، مزخرف بغنى، للعرائس اللواتي يرغبن في ترك انطباع لا يُنسى.",
    materialsAr: ["نحاس أصفر مطلي بالذهب", "زركون", "لآلئ المياه العذبة"],
  },
  {
    slug: "halo-de-perles",
    descriptionEn:
      "A discreet halo of pearl beads that frames the forehead without weighing down the hairstyle — ideal for a boho-chic style.",
    materialsEn: ["Gold-tone wire", "Pearl beads"],
    descriptionAr:
      "هالة رقيقة من اللآلئ الصدفية تحيط بالجبين دون أن تُثقل التسريحة — مثالية لأسلوب بوهيمي أنيق.",
    materialsAr: ["سلك ذهبي اللون", "لآلئ صدفية"],
  },
  {
    slug: "couronne-fleurie-ivoire",
    descriptionEn:
      "Delicate ivory fabric flowers mixed with pearls, for a romantic, natural look.",
    materialsEn: ["Fabric flowers", "Ivory pearls", "Flexible metal base"],
    descriptionAr: "أزهار رقيقة من القماش العاجي ممزوجة باللآلئ، لإطلالة رومانسية وطبيعية.",
    materialsAr: ["أزهار قماشية", "لآلئ عاجية", "قاعدة معدنية مرنة"],
  },
  {
    slug: "collier-lecrin-fleuri",
    descriptionEn:
      "A choker necklace adorned with delicate floral motifs, worn alone or paired with our matching crown.",
    materialsEn: ["Gold-tone metal", "Crystals", "Adjustable clasp"],
    descriptionAr:
      "قلادة قصيرة مزينة بزخارف زهرية رقيقة، تُلبس بمفردها أو مع تاجنا المتناسق.",
    materialsAr: ["معدن ذهبي اللون", "كريستال", "إغلاق قابل للتعديل"],
  },
  {
    slug: "collier-goutte-de-lune",
    descriptionEn:
      "A drop-shaped pendant, cut to catch the light — simple, elegant, timeless.",
    materialsEn: ["Fine gold-tone chain", "Cut crystal"],
    descriptionAr: "قلادة على شكل قطرة، مصقولة لتعكس الضوء — بسيطة، أنيقة، خالدة.",
    materialsAr: ["سلسلة ذهبية رفيعة", "كريستال مصقول"],
  },
  {
    slug: "collier-reine-de-saba",
    descriptionEn:
      "A richly adorned multi-strand necklace, inspired by royal regalia — for brides who love statement pieces.",
    materialsEn: ["Gold-plated brass", "Pearl beads", "Crystals"],
    descriptionAr:
      "قلادة متعددة الصفوف مزخرفة بغنى، مستوحاة من حلي الملوك — للعرائس اللواتي يعشقن القطع القوية.",
    materialsAr: ["نحاس أصفر مطلي بالذهب", "لآلئ صدفية", "كريستال"],
  },
  {
    slug: "collier-brume-doree",
    descriptionEn:
      "A light, fine double chain, to add a subtle golden touch to a simple outfit.",
    materialsEn: ["Gold-tone chain", "Crystal charms"],
    descriptionAr: "سلسلة مزدوجة رفيعة وخفيفة، لإضفاء لمسة ذهبية خفية على إطلالة بسيطة.",
    materialsAr: ["سلسلة ذهبية اللون", "تعليقات كريستال"],
  },
  {
    slug: "peigne-reine-de-cristal",
    descriptionEn:
      "A richly crystal-adorned comb, sculpted to slip elegantly into an updo or half-up hairstyle.",
    materialsEn: ["Gold-tone metal", "Austrian crystals", "Stainless steel teeth"],
    descriptionAr:
      "مشط مزخرف بغنى بأحجار الكريستال، منحوت لينزلق بأناقة في تسريحة مرفوعة أو نصف مرفوعة.",
    materialsAr: ["معدن ذهبي اللون", "كريستال نمساوي", "أسنان من الفولاذ المقاوم للصدأ"],
  },
  {
    slug: "peigne-feuille-doree",
    descriptionEn:
      "A comb inspired by golden foliage, light and easy to wear, for a nature-chic touch.",
    materialsEn: ["Gold-tone metal", "Pearl beads"],
    descriptionAr: "مشط مستوحى من أوراق الشجر الذهبية، خفيف وسهل الارتداء، للمسة طبيعية أنيقة.",
    materialsAr: ["معدن ذهبي اللون", "لآلئ صدفية"],
  },
  {
    slug: "peigne-etoile-du-soir",
    descriptionEn:
      "A compact comb set with star-shaped crystals, adding a sparkling touch without excess.",
    materialsEn: ["Gold-tone metal", "Crystals"],
    descriptionAr: "مشط مدمج مرصّع بكريستال على شكل نجمة، لإضافة لمسة براقة دون مبالغة.",
    materialsAr: ["معدن ذهبي اللون", "كريستال"],
  },
  {
    slug: "peigne-jardin-ivoire",
    descriptionEn:
      "Delicate ivory beaded flowers finely arranged on a discreet comb — perfect for a countryside style.",
    materialsEn: ["Gold-tone metal", "Ivory pearls", "Resin flowers"],
    descriptionAr:
      "أزهار عاجية صغيرة مرصّعة باللآلئ، مرتبة بدقة على مشط أنيق — مثالية لأسلوب ريفي.",
    materialsAr: ["معدن ذهبي اللون", "لآلئ عاجية", "أزهار من الراتنج"],
  },
  {
    slug: "hair-vine-fil-de-lumiere",
    descriptionEn:
      "A flexible chain set with crystals and pearls, draped over loose or braided hair for a luminous effect.",
    materialsEn: ["Flexible gold-tone wire", "Crystals", "Pearl beads"],
    descriptionAr:
      "سلسلة مرنة مرصّعة بالكريستال واللآلئ، تُدرج في تسريحة مسدولة أو مجدولة لإضفاء لمعان ساحر.",
    materialsAr: ["سلك ذهبي مرن", "كريستال", "لآلئ صدفية"],
  },
  {
    slug: "hair-vine-cascade-nacree",
    descriptionEn:
      "A long double-row chain that cascades delicately along the hairstyle — a highly photogenic effect.",
    materialsEn: ["Flexible gold-tone wire", "Pearl beads", "Crystals"],
    descriptionAr:
      "سلسلة طويلة مزدوجة الصفوف تنساب برقة على طول التسريحة — بتأثير جذاب أمام الكاميرا.",
    materialsAr: ["سلك ذهبي مرن", "لآلئ صدفية", "كريستال"],
  },
  {
    slug: "hair-vine-murmure-dor",
    descriptionEn:
      "A very fine, discreet chain, for brides who prefer understated elegance with just the right amount of sparkle.",
    materialsEn: ["Fine gold-tone wire"],
    descriptionAr:
      "سلسلة رفيعة جدًا وخفية، للعرائس اللواتي يفضلن البساطة مع القدر المناسب من البريق.",
    materialsAr: ["سلك ذهبي رفيع"],
  },
  {
    slug: "hair-vine-couronne-de-vigne",
    descriptionEn:
      "Inspired by flowering vines, this braided hair vine brings a bohemian, natural touch to the hairstyle.",
    materialsEn: ["Flexible gold-tone wire", "Pearl beads", "Small resin flowers"],
    descriptionAr:
      "مستوحاة من الكروم المزهرة، تضفي سلسلة الشعر المجدولة هذه لمسة بوهيمية وطبيعية على التسريحة.",
    materialsAr: ["سلك ذهبي مرن", "لآلئ صدفية", "أزهار صغيرة من الراتنج"],
  },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

let updated = 0;
for (const t of translations) {
  const { error, count } = await supabase
    .from("products")
    .update(
      {
        description_en: t.descriptionEn,
        materials_en: t.materialsEn,
        description_ar: t.descriptionAr,
        materials_ar: t.materialsAr,
      },
      { count: "exact" }
    )
    .eq("slug", t.slug);

  if (error) {
    console.error(`Failed to update ${t.slug}:`, error.message);
    continue;
  }
  updated += count ?? 0;
}

console.log(`Updated ${updated} products with AR/EN translations.`);
