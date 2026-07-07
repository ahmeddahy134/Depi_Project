export const categories = [
  { id: 1, name: "سيروم", slug: "serums", description: "عناية مركزة لبشرة مشرقة" },
  { id: 2, name: "كريمات", slug: "creams", description: "ترطيب عميق ونعومة تدوم" },
  { id: 3, name: "غسول ومنظفات", slug: "cleansers", description: "تنظيف لطيف وفعال" },
  { id: 4, name: "تونر وماء الورد", slug: "toners", description: "انتعاش وتوازن مسام البشرة" },
  { id: 5, name: "واقي شمس", slug: "sunscreen", description: "حماية مثالية من الأشعة" },
  { id: 6, name: "مقشرات", slug: "exfoliators", description: "تجديد خلايا البشرة بفعالية" },
  { id: 7, name: "اقنعة وماسكات", slug: "masks", description: "تغذية مكثفة واسترخاء" }
];

export const products = [
  {
    id: 1,
    name: "سيروم النضارة الفائق",
    category: "سيروم",
    slug: "serums",
    price: 250,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "سيروم غني بفيتامين سي وحمض الهيالورونيك لنضارة وتفتيح البشرة بشكل ملحوظ من أول استخدام.",
    ingredients: ["فيتامين سي 15%", "حمض الهيالورونيك", "خلاصة الصبار", "فيتامين E"],
    features: ["مكونات طبيعية 100%", "خال من المواد الضارة", "مجرب طبيا"]
  },
  {
    id: 2,
    name: "كريم الترطيب العميق",
    category: "كريمات",
    slug: "creams",
    price: 180,
    image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "كريم غني بالزبدة الطبيعية لترطيب عميق يدوم 48 ساعة ويحمي من الجفاف.",
    ingredients: ["زبدة الشيا", "زيت الأرغان", "سيراميد", "جلسرين"],
    features: ["مكونات طبيعية 100%", "مجرب طبيا"]
  },
  {
    id: 3,
    name: "غسول الوجه اللطيف",
    category: "غسول ومنظفات",
    slug: "cleansers",
    price: 120,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "غسول يومي ينظف بلطف ويزيل الشوائب دون تجريد البشرة من زيوتها الطبيعية.",
    ingredients: ["مستخلص البابونج", "ماء الورد", "فيتامين B5"],
    features: ["خال من المواد الضارة", "مجرب طبيا"]
  },
  {
    id: 4,
    name: "واقي شمس يومي",
    category: "واقي شمس",
    slug: "sunscreen",
    price: 190,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "حماية فائقة SPF 50 بدون أي لمعان او ملمس دهني.",
    ingredients: ["أكسيد الزنك", "مستخلص الشاي الأخضر"],
    features: ["خال من المواد الضارة", "مجرب طبيا"]
  },
  {
    id: 5,
    name: "تونر ماء الورد النقي",
    category: "تونر وماء الورد",
    slug: "toners",
    price: 95,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "تونر منعش يعيد توازن مسام البشرة ويجهزها لخطوات العناية التالية.",
    ingredients: ["ماء الورد الطبيعي", "فيتامين B3", "مستخلص الخيار"],
    features: ["مكونات طبيعية 100%", "خال من المواد الضارة"]
  },
  {
    id: 6,
    name: "ماسك الطين المنقي",
    category: "اقنعة وماسكات",
    slug: "masks",
    price: 140,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "ينظف المسام بعمق ويزيل الرؤوس السوداء دون تجفيف البشرة.",
    ingredients: ["طين بحري", "فحم نشط", "مستخلص النعناع"],
    features: ["طبيعي 100%", "خال من المواد الضارة"]
  }
];
