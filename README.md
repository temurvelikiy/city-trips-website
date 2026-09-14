# City Trips — Travel Agency Website

**Travel. Trusted. Together.**

Sharq va Turkiya bo'ylab unutilmas sayohatlar tashkil qiluvchi **City Trips** tur firmasi uchun ko'p tilli (UZ / RU / EN) veb-sayt.

## ✨ Imkoniyatlar

- 🌐 **3 til** — o'zbek, rus, ingliz (tanlov saqlanadi)
- 🌙 **Kun / tun rejimi** (dark / light)
- 🏝️ Animatsion (ken-burns) hero rasm
- ✈️ **9 ta mashhur yo'nalish** — Turkiya, BAA, Misr, Saudiya, Tailand, Maldiv, Malayziya, Bali, Gruziya
- 📅 Har bir tourda **Batafsil** va **Bron qilish** tugmalari
- 💬 Bron / so'rovni to'g'ridan-to'g'ri **Telegram**ga yuborish (@akbarov0909)
- ⭐ Bir vaqtda 3 ta ko'rinadigan mijoz sharhlari karuseli
- 👤 Asoschi (Otabek Adxamovich) haqida blok
- 📜 Davlat ro'yxatidan o'tganlik guvohnomasi
- 📞 Kontaktlar va ijtimoiy tarmoqlar
- 📱 To'liq moslashuvchan (responsive) dizayn

## 🗂️ Tuzilma

```
city-trips/
├── index.html          # asosiy sahifa
├── css/
│   └── styles.css      # barcha uslublar (light + dark)
├── js/
│   ├── translations.js # UZ / RU / EN tarjimalar
│   ├── tours.js        # tourlar va sharhlar ma'lumotlari
│   └── main.js         # logika (til, tema, bron, karusel)
└── assets/
    ├── logo.svg        # zaxira logo (logo.png ustuvor)
    ├── certificate.svg # zaxira guvohnoma (certificate.jpg ustuvor)
    ├── hero.jpg        # hero rasm (ixtiyoriy — yo'q bo'lsa onlayn zaxira)
    ├── logo.png        # brend logosi (ixtiyoriy)
    └── certificate.jpg # guvohnoma originali (ixtiyoriy)
```

> `assets/` ichidagi `hero.jpg`, `logo.png`, `certificate.jpg` fayllarini qo'shsangiz — sayt avtomatik asl rasmlarni ishlatadi. Bo'lmasa, `.svg` / onlayn zaxira ko'rsatiladi.

## 🚀 Ishga tushirish

Statik sayt — hech qanday build kerak emas. Lokalda:

```bash
python -m http.server 8080
```

so'ng brauzerda `http://localhost:8080` oching.

## 🌍 GitHub Pages

Settings → Pages → Branch: `main` / root tanlab, saytni bepul joylashtirish mumkin.
