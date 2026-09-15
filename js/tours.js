/* ================= TOURS DATA (10 destinations) =================
   available: date ranges [from, to] (YYYY-MM-DD) when the tour departs.
   capacity : max travelers per tour.
=================================================================== */
const TOURS = [
  {
    id:"turkey", flag:"🇹🇷",
    name:{uz:"Turkiya — Istanbul",ru:"Турция — Стамбул",en:"Turkey — Istanbul"},
    country:{uz:"Turkiya",ru:"Турция",en:"Turkey"},
    desc:{uz:"Sharq va G‘arb uchrashgan shahar, tarix va bozorlar.",ru:"Город на стыке Востока и Запада, история и базары.",en:"Where East meets West — history and grand bazaars."},
    img:"assets/turkey.jpg",
    fallback:"https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
    price:499, days:7, capacity:20, // Turkiya — Istanbul
    available:[["2026-09-15","2026-11-30"],["2026-12-20","2027-01-10"]]
  },
  {
    id:"uae", flag:"🇦🇪",
    name:{uz:"BAA — Dubay",ru:"ОАЭ — Дубай",en:"UAE — Dubai"},
    country:{uz:"BAA",ru:"ОАЭ",en:"UAE"},
    desc:{uz:"Zamonaviy shahar, safari va shopping turlar.",ru:"Современный город, сафари и шопинг-туры.",en:"Modern city, desert safari and shopping tours."},
    img:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    price:699, days:6, capacity:18,
    available:[["2026-10-01","2026-12-15"],["2027-02-01","2027-03-31"]]
  },
  {
    id:"egypt", flag:"🇪🇬",
    name:{uz:"Misr — Sharm el-Sheyx",ru:"Египет — Шарм-эль-Шейх",en:"Egypt — Sharm El Sheikh"},
    country:{uz:"Misr",ru:"Египет",en:"Egypt"},
    desc:{uz:"Qizil dengiz, diving va piramidalar.",ru:"Красное море, дайвинг и пирамиды.",en:"Red Sea, diving and the pyramids."},
    img:"https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80",
    price:599, days:8, capacity:22,
    available:[["2026-09-20","2026-12-31"]]
  },
  {
    id:"thailand", flag:"🇹🇭",
    name:{uz:"Tailand — Puket",ru:"Таиланд — Пхукет",en:"Thailand — Phuket"},
    country:{uz:"Tailand",ru:"Таиланд",en:"Thailand"},
    desc:{uz:"Tropik plyajlar, orollar va ekzotika.",ru:"Тропические пляжи, острова и экзотика.",en:"Tropical beaches, islands and exotics."},
    img:"https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    price:899, days:9, capacity:16,
    available:[["2026-11-01","2027-02-28"]]
  },
  {
    id:"maldives", flag:"🇲🇻",
    name:{uz:"Maldiv orollari",ru:"Мальдивы",en:"Maldives"},
    country:{uz:"Maldiv",ru:"Мальдивы",en:"Maldives"},
    desc:{uz:"Suv ustidagi villalar, oq qumli plyaj.",ru:"Виллы на воде, белоснежные пляжи.",en:"Overwater villas, white-sand beaches."},
    img:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    price:1490, days:7, capacity:12,
    available:[["2026-10-10","2027-01-31"]]
  },
  {
    id:"malaysia", flag:"🇲🇾",
    name:{uz:"Malayziya — Kuala-Lumpur",ru:"Малайзия — Куала-Лумпур",en:"Malaysia — Kuala Lumpur"},
    country:{uz:"Malayziya",ru:"Малайзия",en:"Malaysia"},
    desc:{uz:"Petronas minoralari, shahar va tabiat.",ru:"Башни Петронас, город и природа.",en:"Petronas Towers, city and nature."},
    img:"https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
    price:849, days:8, capacity:18,
    available:[["2026-09-25","2026-12-20"]]
  },
  {
    id:"bali", flag:"🇮🇩",
    name:{uz:"Indoneziya — Bali",ru:"Индонезия — Бали",en:"Indonesia — Bali"},
    country:{uz:"Indoneziya",ru:"Индонезия",en:"Indonesia"},
    desc:{uz:"Bali orollari, sholi maydonlari, vulqonlar.",ru:"Остров Бали, рисовые террасы, вулканы.",en:"Bali island, rice terraces, volcanoes."},
    img:"https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    price:990, days:9, capacity:14,
    available:[["2026-09-15","2026-12-31"],["2027-03-01","2027-04-30"]]
  },
  {
    id:"georgia", flag:"🇬🇪",
    name:{uz:"Gruziya — Batumi",ru:"Грузия — Батуми",en:"Georgia — Batumi"},
    country:{uz:"Gruziya",ru:"Грузия",en:"Georgia"},
    desc:{uz:"Tog‘lar, dengiz va mazali oshxona.",ru:"Горы, море и вкусная кухня.",en:"Mountains, sea and delicious cuisine."},
    img:"https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
    price:399, days:5, capacity:24,
    available:[["2026-09-14","2026-10-31"],["2027-05-01","2027-09-30"]]
  }
];

/* ================= REVIEWS (6) ================= */
const REVIEWS = [
  {name:"Jasur A.", loc:{uz:"Toshkent",ru:"Ташкент",en:"Tashkent"}, stars:5,
   text:{uz:"Turkiyaga sayohat a’lo darajada tashkil qilindi. Hammasi o‘z vaqtida!",ru:"Тур в Турцию организован великолепно. Всё вовремя!",en:"The Turkey trip was organized perfectly. Everything on time!"}},
  {name:"Nilufar K.", loc:{uz:"Samarqand",ru:"Самарканд",en:"Samarkand"}, stars:5,
   text:{uz:"Dubaydagi safari va mehmonxona zo‘r edi. Gidlarga rahmat!",ru:"Сафари и отель в Дубае были супер. Спасибо гидам!",en:"The safari and hotel in Dubai were amazing. Thanks to the guides!"}},
  {name:"Bekzod T.", loc:{uz:"Farg‘ona",ru:"Фергана",en:"Fergana"}, stars:5,
   text:{uz:"Umra safari uchun katta rahmat, e’tibor va g‘amxo‘rlik yuqori darajada.",ru:"Огромное спасибо за Умру, внимание и забота на высшем уровне.",en:"Huge thanks for the Umrah trip, care and attention were top-notch."}},
  {name:"Dilnoza R.", loc:{uz:"Buxoro",ru:"Бухара",en:"Bukhara"}, stars:5,
   text:{uz:"Maldivdagi dam olish orzuimdek chiqdi. Yana albatta murojaat qilaman.",ru:"Отдых на Мальдивах — как в мечте. Обязательно обращусь снова.",en:"The Maldives holiday was a dream. I'll definitely book again."}},
  {name:"Sardor M.", loc:{uz:"Andijon",ru:"Андижан",en:"Andijan"}, stars:4,
   text:{uz:"Tailandga oilaviy sayohat qulay va arzon bo‘ldi. Tavsiya qilaman!",ru:"Семейный тур в Таиланд был удобным и недорогим. Рекомендую!",en:"The family trip to Thailand was comfortable and affordable. Recommend!"}},
  {name:"Kamola Y.", loc:{uz:"Namangan",ru:"Наманган",en:"Namangan"}, stars:5,
   text:{uz:"Gruziyaga qisqa sayohat ajoyib taassurot qoldirdi. Rahmat City Trips!",ru:"Короткая поездка в Грузию оставила отличные впечатления. Спасибо City Trips!",en:"A short trip to Georgia left wonderful impressions. Thank you City Trips!"}}
];
