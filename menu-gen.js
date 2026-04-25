if (typeof module !== 'undefined' && module.exports) {
  const fs = require('fs');
  const path = require('path');
  const CWD = __dirname;

  function buildMenu() {
    let raw = fs.readFileSync(path.join(CWD, 'menu_api.json'), 'utf8');
    if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
    const data = JSON.parse(raw);
    const cats = (data.result && data.result.itemCategories) ? data.result.itemCategories : [];
    const slugMap = {
      'ЗАВТРАК': 'zavtrak', 'БУРГЕР': 'burger', 'ПИЦЦА': 'pizza', 'САЛАТЫ': 'salaty',
      'СУПЫ': 'supy', 'ПАСТА': 'pasta', 'СУШИ': 'sushi', 'ЧАЙНАЯ КАРТА': 'tea',
      'СМУЗИ': 'smoothie', 'МИЛКШЕЙК': 'milkshake', 'ФРЕШ НАПИТКИ': 'fresh',
      'СОУС': 'sauce', 'ГИЛАТТО МОРОЖНИ': 'gelato', 'ФИРМЕННЫЕ ЧАЙ': 'firmTea',
      'ГОРЯЧИЕ БЛЮДА': 'hot', 'КОФЕ БАР': 'coffee', 'ЛЕПЁШКА': 'lepeshka',
      'БАР НАПИТКИ': 'bar', 'МОХИТО БАР': 'mojito', 'ДЕТСКИЙ МЕНЮ': 'kids',
      'ГИЛАТТО ВАФЛИ': 'waffles'
    };
    const MENU = {};
    const bgs = [
      'linear-gradient(160deg,#2C1A0E,#1A0A04)', 'linear-gradient(160deg,#3D1A08,#5A2A12)',
      'linear-gradient(160deg,#4A2010,#6B3018)', 'linear-gradient(160deg,#1E0A04,#2C1208)',
      'linear-gradient(160deg,#1A2A10,#2C4A1A)', 'linear-gradient(160deg,#2A1A0A,#3D2810)',
      'linear-gradient(160deg,#1A2A08,#243D10)', 'linear-gradient(160deg,#3D2010,#5A3018)',
      'linear-gradient(160deg,#2A1608,#3D2010)', 'linear-gradient(160deg,#1A1206,#2C1E0A)'
    ];
    cats.forEach((c, ci) => {
      const slug = slugMap[c.name.trim()] || ('cat' + ci);
      MENU[slug] = (c.items || []).map((i, ii) => {
        const size = i.itemSizes && i.itemSizes[0];
        const price = (size && size.prices && size.prices[0]) ? Math.round(size.prices[0].price) : 0;
        const grams = (size && size.portionWeightGrams) ? size.portionWeightGrams : null;
        const weight = grams ? Math.round(grams) + ' г' : '';
        return { name: i.name.trim(), desc: (i.description || '').trim() || '', weight, price, badge: null, bg: bgs[(ci + ii) % bgs.length] };
      });
    });
    fs.writeFileSync(path.join(CWD, 'menu_data.json'), JSON.stringify(MENU, null, 2));
    console.log('[menu] Categories:', Object.keys(MENU).length, '| Items:', Object.values(MENU).reduce((s, arr) => s + arr.length, 0));
  }

  const FULL_TRANSLATIONS = {
    "BONAQUA 0.5": { uz: "Bonaqua 0.5", en: "Bonaqua 0.5" }, "COCA COLA 0.5": { uz: "Coca Cola 0.5", en: "Coca Cola 0.5" },
    "COCA COLA 1": { uz: "Coca Cola 1", en: "Coca Cola 1" }, "FANTA 0.5": { uz: "Fanta 0.5", en: "Fanta 0.5" },
    "FANTA 1": { uz: "Fanta 1", en: "Fanta 1" }, "NESTLE SANTAL 0.5": { uz: "Nestle Santal 0.5", en: "Nestle Santal 0.5" },
    "NESTLE SANTAL 1.5": { uz: "Nestle Santal 1.5", en: "Nestle Santal 1.5" }, "SPRITE 0.5": { uz: "Sprite 0.5", en: "Sprite 0.5" },
    "SPRITE 1": { uz: "Sprite 1", en: "Sprite 1" },
    "СОК СОЧНАЯ ДОЛИНА 200гр": { uz: "Sochnaya dolina sharbat 200gr", en: "Juicy Valley juice 200g" },
    "G АПЕЛЬСИН": { uz: "G Apelsin", en: "G Orange" }, "G БАНАН": { uz: "G Banan", en: "G Banana" },
    "G БАУНТИ": { uz: "G Bounty", en: "G Bounty" },
    "G ВАНИЛЬ ТОФИПЕКАН": { uz: "G Vanil toffee pecan", en: "G Vanilla toffee pecan" },
    "G ГОРЬКИЙ ШОКОЛАД": { uz: "G Achchiq shokolad", en: "G Dark chocolate" },
    "G ЙОГУРТ С ВИШНЕЙ": { uz: "G Olcha yog'urt", en: "G Cherry yogurt" },
    "G КИВИ": { uz: "G Kivi", en: "G Kiwi" }, "G КЛУБНИКА": { uz: "G Qulupnay", en: "G Strawberry" },
    "G ЛЕСНЫЕ ЯГОДЫ": { uz: "G O'rmon mevalari", en: "G Forest berries" },
    "G МАНГО": { uz: "G Mango", en: "G Mango" },
    "G МОЛОЧНЫЙ ШОКОЛАД": { uz: "G Sutli shokolad", en: "G Milk chocolate" },
    "G ОРЕО": { uz: "G Oreo", en: "G Oreo" },
    "G ПЕЧЕНЬЕ НУТЕЛЛА": { uz: "G Nutella pechenye", en: "G Nutella cookie" },
    "G ПЛОМБИР": { uz: "G Plombir", en: "G Plombir" },
    "G РАФАЕЛЛО": { uz: "G Raffaello", en: "G Raffaello" },
    "G ТИРАМИСУ": { uz: "G Tiramisu", en: "G Tiramisu" },
    "G ФЕРРЕРО РОШЕ": { uz: "G Ferrero Rocher", en: "G Ferrero Rocher" },
    "G ФИСТАШКА": { uz: "G Pista", en: "G Pistachio" }, "G ФУНДУК": { uz: "G Findiq", en: "G Hazelnut" },
    "ЗАВТРАК ПО-ТУРЕЦКИ": { uz: "Turkcha nonushta", en: "Turkish breakfast" },
    "ЯИЧНИЦА С КОЛБАСОЙ": { uz: "Kolbasa bilan tuxum qovurma", en: "Scrambled eggs with sausage" },
    "ШАКУШКА": { uz: "Shakshuka", en: "Shakshuka" }, "ОМЛЕТ": { uz: "Omlet", en: "Omelette" },
    "БИГБУРГЕР": { uz: "Big burger", en: "Big burger" },
    "ЧИКЕН БУРГЕР": { uz: "Tovuq burger", en: "Chicken burger" },
    "СТРИПСЫ 5ШТ": { uz: "Striplar 5 dona", en: "Strips 5 pcs" },
    "СТРИПСЫ 7ШТ": { uz: "Striplar 7 dona", en: "Strips 7 pcs" },
    "КЛАБ СЭНДВИЧ": { uz: "Klub sendvich", en: "Club sandwich" },
    "ХАМБУРГЕР": { uz: "Gamburger", en: "Hamburger" }, "ТВИСТЕР": { uz: "Twister", en: "Twister" },
    "КФС БУРГЕР": { uz: "KFC burger", en: "KFC burger" },
    "ЧИЗБУРГЕР": { uz: "Chizburger", en: "Cheeseburger" },
    "ДУРУМ ШАВЕРМА": { uz: "Durum shawarma", en: "Durum shawarma" },
    "ХАГГИ": { uz: "Haggi", en: "Haggi" },
    "КУРИНЫЕ КРЫЛЬЯ 5ШТ": { uz: "Tovuq qanotlari 5 dona", en: "Chicken wings 5 pcs" },
    "КУРИНЫЕ КРЫЛЬЯ 7ШТ": { uz: "Tovuq qanotlari 7 dona", en: "Chicken wings 7 pcs" },
    "ПИДЕ С МЯСОМ": { uz: "Go'shtli pide", en: "Pide with meat" },
    "АССОРТИ ПИЦЦА": { uz: "Assorti pitsa", en: "Assorted pizza" },
    "ВЕТЧИНА С ГРИБАМИ": { uz: "Go'sht va qo'ziqorinli pitsa", en: "Pizza with ham and mushrooms" },
    "МИНИ ПИЦЦА МЯСНОЙ": { uz: "Mini go'shtli pitsa", en: "Mini meat pizza" },
    "МИНИ ПИЦЦА МАРГАРИТА": { uz: "Mini Margarita pitsa", en: "Mini Margherita pizza" },
    "МИНИ ПИЦЦА ПЕППЕРОНИ": { uz: "Mini Pepperoni pitsa", en: "Mini Pepperoni pizza" },
    "ЦЕЗАРЬ ПИЦЦА": { uz: "Sezar pitsa", en: "Caesar pizza" },
    "МАРГАРИТА ПИЦЦА": { uz: "Margarita pitsa", en: "Margherita pizza" },
    "ПИЦЦА ФРУКТОВЫЙ": { uz: "Mevali pitsa", en: "Fruit pizza" },
    "С ГОВЯЖИМ ФАРШЕМ ПИЦЦА": { uz: "Mol go'shti qiymali pitsa", en: "Beef pizza" },
    "ПЕППЕРОНЫ ПИЦЦА": { uz: "Pepperoni pitsa", en: "Pepperoni pizza" },
    "МИНИ ПИЦЦА АССОРТИ": { uz: "Mini assorti pitsa", en: "Mini assorted pizza" },
    "ПИЦЦА КЛУБНИКА БАНАН": { uz: "Qulupnay-banan pitsa", en: "Strawberry banana pizza" },
    "МИНИ ПИЦЦА ВЕТЧИНА С ГРИБАМИ": { uz: "Mini go'sht va qo'ziqorinli pitsa", en: "Mini ham and mushroom pizza" },
    "МЯСНОЙ ПЕППЕРОНИ ПИЦЦА": { uz: "Go'shtli Pepperoni pitsa", en: "Meat Pepperoni pizza" },
    "МЯСНОЙ ПИЦЦА": { uz: "Go'shtli pitsa", en: "Meat pizza" },
    "ПИДЕ С СЫРОМ": { uz: "Pishloqli pide", en: "Pide with cheese" },
    "МЕКСИКАНСКАЯ": { uz: "Meksika pitsa", en: "Mexican pizza" },
    "ПИДЕ С МЯСОМ И СЫРОМ": { uz: "Go'sht va pishloqli pide", en: "Pide with meat and cheese" },
    "МИНИ ПИЦЦА ЦЕЗАРЬ": { uz: "Mini Sezar pitsa", en: "Mini Caesar pizza" },
    "МУЖСКОЙ КАПРИЗ САЛАТ": { uz: "Erkaklar kaprizi salat", en: "Men's caprice salad" },
    "ВИНЕГРЕТ САЛАТ": { uz: "Vinegret salat", en: "Vinegret salad" },
    "ФРАНЦУЗКИЙ САЛАТ": { uz: "Fransuz salati", en: "French salad" },
    "ЦЕЗАРЬ САЛАТ": { uz: "Sezar salati", en: "Caesar salad" },
    "ЛОБИО САЛАТ": { uz: "Lobio salati", en: "Lobio salad" },
    "ЯПОНСКИЙ САЛАТ": { uz: "Yapon salati", en: "Japanese salad" },
    "БАКЛАЖАН САЛАТ": { uz: "Baqlajon salati", en: "Eggplant salad" },
    "ГРЕЧЕСКИЙ САЛАТ": { uz: "Yunon salati", en: "Greek salad" },
    "ПТИЧЬЕ ГНЕЗДО САЛАТ": { uz: "Qush uyasi salati", en: "Bird's nest salad" },
    "ОВОЩНОЙ САЛАТ": { uz: "Sabzavot salati", en: "Vegetable salad" },
    "БАКЛАЖАН С КУРИЦЕЙ САЛАТ": { uz: "Baqlajon va tovuq salati", en: "Eggplant and chicken salad" },
    "ТОМ ЯМ СУПЫ": { uz: "Tom yam shorva", en: "Tom yum soup" },
    "ФРИКАДЕЛЬКАМИ СУПЫ": { uz: "Frikadelkali shorva", en: "Soup with meatballs" },
    "ЧЕЧЕВИЧНЫЙ СУПЫ": { uz: "Yasmiq shorvasi", en: "Lentil soup" },
    "СПАГЕТТИ БОЛОНЬЕЗ": { uz: "Spagetti bolonez", en: "Spaghetti bolognese" },
    "ПЕННЕ АЛЬ АРАБЬЯТА": { uz: "Penne all'arrabbiata", en: "Penne all'arrabbiata" },
    "ФЕТТУЧИНИ АЛФРЕДО": { uz: "Fettuccine Alfredo", en: "Fettuccine Alfredo" },
    "СЕТУН": { uz: "Setun", en: "Setun" },
    "МИНИ АССОРТИ РОЛЛ": { uz: "Mini assorti roll", en: "Mini assorted roll" },
    "МИНИ РОЛЛ С ТУНЦОМ": { uz: "Tuna bilan mini roll", en: "Mini roll with tuna" },
    "ЗАПЕЧЕННЫЙ ТУНЕЦ": { uz: "Pishirilgan tuna", en: "Baked tuna" },
    "ПОМИ ТОРИ": { uz: "Pomi tori", en: "Pomi tori" }, "ТАКЕШИ": { uz: "Takeshi", en: "Takeshi" },
    "МОНОЛОГ": { uz: "Monolog", en: "Monologue" },
    "ФИЛАДЕЛЬФИЯ": { uz: "Filadelfiya", en: "Philadelphia" },
    "МИНИ РОЛЛ С УГРЕМ": { uz: "Murakkabalik bilan mini roll", en: "Mini roll with eel" },
    "МИХ РОЛЛ": { uz: "Mix roll", en: "Mix roll" },
    "АЙС ЧИКЕН": { uz: "Ice chicken", en: "Ice chicken" },
    "ЖЕРЕННЫЙ МАКС": { uz: "Jarelangan max", en: "Fried max" },
    "МИНИ РОЛЛ С ОГУРЦАМИ": { uz: "Bodring bilan mini roll", en: "Mini roll with cucumber" },
    "ЗАПЕЧЕНАЯ КУРИЦА": { uz: "Pishirilgan tovuq", en: "Baked chicken" },
    "ЗАПЕЧЕННЫЙ УГОРЬ": { uz: "Pishirilgan murakkabalik", en: "Baked eel" },
    "ЗАПЕЧЕННЫЙ ЛОСОСЬ": { uz: "Pishirilgan losos", en: "Baked salmon" },
    "ЧИЛИ ЧИКЕН РОЛЛ": { uz: "Chili tovuq roll", en: "Chili chicken roll" },
    "КАНАДСКИЙ РОЛЛ": { uz: "Kanada roll", en: "Canadian roll" },
    "ФРУКТОВЫЙ РОЛЛ": { uz: "Mevali roll", en: "Fruit roll" },
    "МИНИ РОЛЛ С ЛОСОСЕМ": { uz: "Losos bilan mini roll", en: "Mini roll with salmon" },
    "ЧАЙ ЖАСМИН": { uz: "Yasmin choy", en: "Jasmine tea" },
    "ЧАЙ С ЛИМОНОМ ЧЁРНЫМ 0,5": { uz: "Limonli qora choy 0,5", en: "Black tea with lemon 0.5" },
    "ЧАЙ ЧЁРНЫЙ": { uz: "Qora choy", en: "Black tea" },
    "ДОБАВКА К ЧАЙ": { uz: "Choy qo'shimchasi", en: "Tea extra" },
    "ЧАЙ БАРДАК 1 СТ": { uz: "Choy bardak 1 stakan", en: "Tea cup 1 glass" },
    "ЧАЙ БАРДАК ЧАЙНИК": { uz: "Choynak choy", en: "Teapot tea" },
    "ЧАЙ ЗЕЛЁНЫЙ": { uz: "Yashil choy", en: "Green tea" },
    "ЧАЙ ЧЁРНЫЙ 0,5": { uz: "Qora choy 0,5", en: "Black tea 0.5" },
    "ЧАЙ С ЛИМОНОМ ЧЁРНЫМ": { uz: "Limonli qora choy", en: "Black tea with lemon" },
    "ЧАЙ С ЛИМОНОМ ЗЕЛЁНЫЙ 0,5": { uz: "Limonli yashil choy 0,5", en: "Green tea with lemon 0.5" },
    "ЧАЙ ЗЕЛЁНЫЙ 0,5": { uz: "Yashil choy 0,5", en: "Green tea 0.5" },
    "ЧАЙ С ЛИМОНОМ ЗЕЛЁНЫЙ": { uz: "Limonli yashil choy", en: "Green tea with lemon" },
    "ЯГОДНЫЙ СМУЗИ": { uz: "Rezavorli smuzi", en: "Berry smoothie" },
    "АПЕЛЬСИН СМУЗИ": { uz: "Apelsin smuzi", en: "Orange smoothie" },
    "АНАНАСОВЫЙ СМУЗИ": { uz: "Ananas smuzi", en: "Pineapple smoothie" },
    "КИВИ СМУЗИ": { uz: "Kivi smuzi", en: "Kiwi smoothie" },
    "БАНАНОВЫЙ СМУЗИ": { uz: "Banan smuzi", en: "Banana smoothie" },
    "ТИРАМИСУ ШЕЙК": { uz: "Tiramisu sheyk", en: "Tiramisu shake" },
    "БАНАНОВЫЙ ШЕЙК": { uz: "Banan sheyk", en: "Banana shake" },
    "ШОКОЛАДНЫЙ ШЕЙК": { uz: "Shokolad sheyk", en: "Chocolate shake" },
    "ЯГОДНЫЙ ШЕЙК": { uz: "Rezavorli sheyk", en: "Berry shake" },
    "КЛУБНИКА БАНАН ШЕЙК": { uz: "Qulupnay-banan sheyk", en: "Strawberry banana shake" },
    "БАНАН ШОКОЛАД ШЕЙК": { uz: "Banan-shokolad sheyk", en: "Banana chocolate shake" },
    "ВАНИЛЬНЫЙ ШЕЙК": { uz: "Vanil sheyk", en: "Vanilla shake" },
    "КЛУБНИКА ШЕЙК": { uz: "Qulupnay sheyk", en: "Strawberry shake" },
    "ОРЕО ШЕЙК": { uz: "Oreo sheyk", en: "Oreo shake" },
    "ЯБЛОЧНЫЙ ФРЕШ": { uz: "Olma fresh", en: "Apple fresh" },
    "АПЕЛЬСИНОВЫЙ ФРЕШ": { uz: "Apelsin fresh", en: "Orange fresh" },
    "СОУС СЫРНИЙ": { uz: "Pishloqli sous", en: "Cheese sauce" },
    "ЧЕСНОЧНЫЙ СОУС": { uz: "Sarimsokli sous", en: "Garlic sauce" },
    "КЕТЧУП": { uz: "Ketchup", en: "Ketchup" }, "МАЙОНЕЗ": { uz: "Mayonez", en: "Mayonnaise" },
    "СОУС ТОМАТНЫЙ": { uz: "Pomidor sousi", en: "Tomato sauce" },
    "СОУС ЧИЛИ АЧЧИК": { uz: "Chili achchiq sous", en: "Chili hot sauce" },
    "ЛЕПЁШКА": { uz: "Non", en: "Flatbread" },
    "ТОСТ ДЛЯ САНДВИЧ": { uz: "Sendvich tosti", en: "Sandwich toast" },
    "ЯПОНСКИЙ ХЛЕБ": { uz: "Yapon noni", en: "Japanese bread" },
    "ПЕРСИК-МАНГО": { uz: "Shaftoli-mango", en: "Peach-mango" },
    "ЯГОДНЫЙ ЧАЙ": { uz: "Rezavorli choy", en: "Berry tea" },
    "ИМБИРНЫЙ": { uz: "Zanjabil choy", en: "Ginger tea" },
    "ФРУКТОВЫЙ": { uz: "Mevali choy", en: "Fruit tea" },
    "ОБЛЕПИХОВЫЙ": { uz: "Chakalak choy", en: "Sea buckthorn tea" },
    "АНГЛИЙСКИЙ": { uz: "Ingliz choy", en: "English tea" },
    "ЧАЙ С КИВИ": { uz: "Kivi choy", en: "Kiwi tea" },
    "МАРОККАНСКИЙ": { uz: "Marokash choy", en: "Moroccan tea" },
    "КЕБАБЧИКИ ИЗ КУРИЦЫ ИГОВЯДИНЫ": { uz: "Tovuq va mol go'shti kabobchilari", en: "Chicken and beef kebabs" },
    "КОЗОН КЕБАБ": { uz: "Qo'zichoq kabob", en: "Lamb kebab" },
    "ТЕФТЕЛИ С КАРТОФЕЛЬНЫМ ПЮРЕ": { uz: "Kartoshka pyuresi bilan tefteli", en: "Meatballs with mashed potatoes" },
    "САЙ С БАРАНИНОЙ": { uz: "Qo'zichoq go'shti bilan say", en: "Say with lamb" },
    "КОФТЕ С СЫРОМ": { uz: "Pishloqli kofta", en: "Meatballs with cheese" },
    "ФРИ": { uz: "Fri", en: "French fries" },
    "ТУШЕНКА ИЗ ГОВЯДИНЫ": { uz: "Mol go'shti gushtlisi", en: "Beef stew" },
    "САЙ С ГОВЯДИНОЙ": { uz: "Mol go'shti bilan say", en: "Say with beef" },
    "КОФТЕ": { uz: "Kofta", en: "Meatballs" }, "АЙДАХО": { uz: "Aydaho", en: "Idaho" },
    "САЙ С КУРИЦЕЙ": { uz: "Tovuq bilan say", en: "Say with chicken" },
    "САЙ С КУРИЦОЙ": { uz: "Tovuq bilan say", en: "Say with chicken" },
    "КАРТОФЕЛЬНОЕ ПЮРЕ": { uz: "Kartoshka pyuresi", en: "Mashed potatoes" },
    "АЙС АМЕРИКАНО": { uz: "Ice americano", en: "Iced americano" },
    "АЙС КАПУЧИНО": { uz: "Ice kapuchino", en: "Iced cappuccino" },
    "АЙС ЛАТТЕ": { uz: "Ice latte", en: "Iced latte" },
    "АЙС ТИ МАНГО МАРАКУЯ 0,5": { uz: "Mango-marakuya ice tea 0,5", en: "Mango passion fruit iced tea 0.5" },
    "АЙС ТИ ЯГОДНЫЙ 0,5": { uz: "Rezavorli ice tea 0,5", en: "Berry iced tea 0.5" },
    "АМЕРИКАНО": { uz: "Americano", en: "Americano" },
    "АМЕРИКАНО ДАБЛ": { uz: "Double americano", en: "Double americano" },
    "АПЕЛЬСИНОВЫЙ ВАНИЛ": { uz: "Apelsin vanil", en: "Orange vanilla" },
    "АПЕЛЬСИНОВЫЙ МОХИТО 0,5": { uz: "Apelsin mojito 0,5", en: "Orange mojito 0.5" },
    "АПЕЛЬСИНОВЫЙ МОХИТО 1": { uz: "Apelsin mojito 1", en: "Orange mojito 1" },
    "АПЕЛСИН МУС ПИРОГ": { uz: "Apelsin musli pirog", en: "Orange mousse pie" },
    "АФГАНСКИЙ НАПОЛЁН": { uz: "Afg'on napoleon", en: "Afghan Napoleon" },
    "АФГАНСКОЕ ПИРОЖНОЕ": { uz: "Afg'on pirojnoe", en: "Afghan pastry" },
    "БАНАНЗА": { uz: "Bananza", en: "Bananza" }, "БАУНТИ": { uz: "Bounty", en: "Bounty" },
    "БЕЗЕ КОНТЕЙНЕР": { uz: "Beze konteyner", en: "Meringue container" },
    "БЕЗЕ ПАКЕТЛИ": { uz: "Paketli beze", en: "Meringue pack" },
    "БЕНТО ТОРТ Клуб конф- 3 кат": { uz: "Bento tort klub konfeti 3 qism", en: "Bento cake club candy 3 pcs" },
    "БОН ФИЛЕ 100ГР": { uz: "Bon file 100gr", en: "Bon fillet 100g" },
    "БУМЕР": { uz: "Bumer", en: "Boomer" }, "БУМЕР2 КАТ": { uz: "Bumer 2 qism", en: "Boomer 2 pcs" },
    "ВАФЛИ БАНАН": { uz: "Bananli vafli", en: "Banana waffle" },
    "ВАФЛИ КЛУБНИКА БАНАН": { uz: "Qulupnay-banan vafli", en: "Strawberry banana waffle" },
    "ВАФЛИ КЛУБНИКА": { uz: "Qulupnay vafli", en: "Strawberry waffle" },
    "ВАФЛИ НУТЕЛЛА": { uz: "Nutella vafli", en: "Nutella waffle" },
    "ВИШНЁВОЕ ПИРОЖНОЕ": { uz: "Olcha pirojnoe", en: "Cherry pastry" },
    "ВИШНЕВАЯ МИЛКА": { uz: "Olcha Milka", en: "Cherry Milka" },
    "ВИШНОВИЙ ПИРОЖНИЙ 2 КАТЛИ": { uz: "Olcha pirojnoe 2 qism", en: "Cherry pastry 2 pcs" },
    "ВИШНЯ ШОКОЛАД": { uz: "Olcha shokolad", en: "Cherry chocolate" },
    "ГЕНЕРАЛ": { uz: "General", en: "General" },
    "ГЕНЕРАЛ 2 КАТЛИ": { uz: "General 2 qism", en: "General 2 pcs" },
    "ГЕНЕРАЛ ПРЯМОУГОЛНЫЕ": { uz: "General to'g'ri burchakli", en: "General rectangular" },
    "ГЛЯСЕ": { uz: "Glyase", en: "Affogato" },
    "ГОРЯЧИЙ ШОКОЛАД": { uz: "Issiq shokolad", en: "Hot chocolate" },
    "ДОЛЛАР": { uz: "Dollar", en: "Dollar" },
    "ДОП СИРОПЫ НА ВЫБОР": { uz: "Qo'shimcha sirop tanlash", en: "Extra syrup to choose" },
    "ДУБАЙСКИЙ НАПАЛЕОН": { uz: "Dubay napoleon", en: "Dubai Napoleon" },
    "ЖАСМИН": { uz: "Yasmin", en: "Jasmine" }, "ЖАСМИН 2 КАТ": { uz: "Yasmin 2 qism", en: "Jasmine 2 pcs" },
    "ЗАВАРНОЙ КИЧИК": { uz: "Zavarnoy kichik", en: "Small custard" },
    "ЗАВАРНОЙ МИНИ КОНТ": { uz: "Zavarnoy mini konteyner", en: "Custard mini container" },
    "КАКАО": { uz: "Kakao", en: "Cocoa" }, "КАПУЧИНО": { uz: "Kapuchino", en: "Cappuccino" },
    "КАПУЧИНО ДАБЛ": { uz: "Double kapuchino", en: "Double cappuccino" },
    "КАРАМЕЛЬНЫЙ МЕДАВИК": { uz: "Karamelli medovik", en: "Caramel honey cake" },
    "КЛАССИЧЕСКИЙ МОХИТО  0,5": { uz: "Klassik mojito 0,5", en: "Classic mojito 0.5" },
    "КЛАССИЧЕСКИЙ МОХИТО 1": { uz: "Klassik mojito 1", en: "Classic mojito 1" },
    "КЛУБНИЧНАЯ СИМФОНИЯ": { uz: "Qulupnay simfoniyasi", en: "Strawberry symphony" },
    "КЛУБНИЧНЫЙ МОХИТО 0,5": { uz: "Qulupnay mojito 0,5", en: "Strawberry mojito 0.5" },
    "КЛУБНИЧНЫЙ МОХИТО 1": { uz: "Qulupnay mojito 1", en: "Strawberry mojito 1" },
    "КЛУБНИЧНЫЙ СЛАЙС": { uz: "Qulupnay slays", en: "Strawberry slice" },
    "КОМБО РУЛЕТ": { uz: "Kombo rulet", en: "Combo roll" },
    "КОРА МЕДОВИК": { uz: "Qora medovik", en: "Chocolate honey cake" },
    "КОРА ПРИЧУДА": { uz: "Qora Pritchuda", en: "Chocolate Caprice" },
    "КОРА ПРИЧУДА 4 КАТ": { uz: "Qora Pritchuda 4 qism", en: "Chocolate Caprice 4 pcs" },
    "КОРОЛЕВСКИЙ ГУЗЛИ": { uz: "Qirol guzli", en: "Royal guzli" },
    "КОФЕ ЧИЯ ДУМАЛОК": { uz: "Kofe chiy dumaloq", en: "Coffee chia round" },
    "КОФЕ ЧИЯ ДУМАЛОК 3 КАТ": { uz: "Kofe chiy dumaloq 3 qism", en: "Coffee chia round 3 pcs" },
    "КОФЕ ЧИЯ КВАДРАТ": { uz: "Kofe chiy kvadrat", en: "Coffee chia square" },
    "КРАСНИЙ БАРХАТ 3 КАТ": { uz: "Qizil baxmat 3 qism", en: "Red velvet 3 pcs" },
    "КРАСНЫЙ БАРХАТ 2 КАТ": { uz: "Qizil baxmat 2 qism", en: "Red velvet 2 pcs" },
    "КРУАССАН ОБИЧНЫЙ": { uz: "Oddiy kruassan", en: "Plain croissant" },
    "КУШ ТИЛИ": { uz: "Qush tili", en: "Bird tongue" },
    "ЛАСТОЧКА": { uz: "Qaldirg'och", en: "Swallow" },
    "ЛАСТОЧКА ШАРИК": { uz: "Qaldirg'och sharcha", en: "Swallow ball" },
    "ЛАТТЕ МАКИЯТО": { uz: "Latte makkiato", en: "Latte macchiato" },
    "ЛИМОНЛИ ПИРОЖНОЕ": { uz: "Limonli pirojnoe", en: "Lemon pastry" },
    "ЛИМОНЛИ ПИРОЖНОЕ 2 КАТ": { uz: "Limonli pirojnoe 2 qism", en: "Lemon pastry 2 pcs" },
    "ЛИМОНЛИ ПИРОЖНОЕ 3 КАТ": { uz: "Limonli pirojnoe 3 qism", en: "Lemon pastry 3 pcs" },
    "ЛОТУС МУСЛИ": { uz: "Lotus musli", en: "Lotus mousse" },
    "МАКЛИ РУЛЕТ": { uz: "Makli rulet", en: "Poppy roll" },
    "МАЛИНА МУС": { uz: "Malina mus", en: "Raspberry mousse" },
    "МАЛИНАЛИ ТРУФЕЛ": { uz: "Malinali trufel", en: "Raspberry truffle" },
    "МАТИЛДА КУСОК": { uz: "Matilda bo'lak", en: "Matilda slice" },
    "МАТИЛДА МИНИ": { uz: "Matilda mini", en: "Matilda mini" },
    "МАТИЛДА СРЕДНИЙ": { uz: "Matilda o'rta", en: "Matilda medium" },
    "МЕВАЛИ ПИРОЖНОЕ КАКАО": { uz: "Mevali pirojnoe kakao", en: "Fruit pastry cocoa" },
    "МЕВАЛИ ПИРОЖНОЕ ОК": { uz: "Mevali pirojnoe OK", en: "Fruit pastry OK" },
    "МЕДОВИК": { uz: "Medovik", en: "Honey cake" },
    "МЕДОВИК 4 КАТ": { uz: "Medovik 4 qism", en: "Honey cake 4 pcs" },
    "МЕДОВИК АПЕЛСИНОВЫЙ": { uz: "Apelsin medovik", en: "Orange honey cake" },
    "МЕДОВИК КОФЕЙНЫЙ": { uz: "Kofe medovik", en: "Coffee honey cake" },
    "МЕДОВИК ОРЕХОВЫЙ": { uz: "Yong'oq medovik", en: "Walnut honey cake" },
    "МЕДОВИК ОРЕХОВЫЙ 4 КАТ": { uz: "Yong'oq medovik 4 qism", en: "Walnut honey cake 4 pcs" },
    "МЕДОВИК Ф": { uz: "Medovik F", en: "Honey cake F" },
    "МЕРЕНГА БЕЛЫЙ КЛУБНИЧНЫЙ": { uz: "Oq qulupnayli meringa", en: "White strawberry meringue" },
    "МЕРЕНГА РУЛЕТ МИНИ": { uz: "Meringa rulet mini", en: "Meringue roll mini" },
    "МЕРЕНГАЛИ РУЛЕТ": { uz: "Meringali rulet", en: "Meringue roll" },
    "МЕРЕНГАЛИ ТВОРОГ ПИРОЖНИ": { uz: "Meringali tvorog pirojnoe", en: "Meringue cottage cheese pastry" },
    "МИЛКА": { uz: "Milka", en: "Milka" },
    "МИНДАЛЬ КРУГ": { uz: "Bodom doira", en: "Almond round" },
    "МИНДАЛЬ КРУГ ФИСТАШКОВЫЙ": { uz: "Pistali bodom doira", en: "Pistachio almond round" },
    "МИНИ БУРГЕР": { uz: "Mini burger", en: "Mini burger" },
    "МИНИ ЛАВАШ": { uz: "Mini lavash", en: "Mini lavash" },
    "МИНИ РАФАЕЛЛО": { uz: "Mini Raffaello", en: "Mini Raffaello" },
    "МИНИ ТВОРОГ": { uz: "Mini tvorog", en: "Mini cottage cheese" },
    "МИНИ ТВОРОГ 3 КАТ": { uz: "Mini tvorog 3 qism", en: "Mini cottage cheese 3 pcs" },
    "МИШКА": { uz: "Ayiqcha", en: "Teddy bear" },
    "МОККО": { uz: "Mokko", en: "Mocha" },
    "МОККО НАПАЛЁН": { uz: "Mokko napoleon", en: "Mocha Napoleon" },
    "МОРКОВНОЕ ПИРОЖНОЕ": { uz: "Sabzi pirojnoe", en: "Carrot pastry" },
    "НАГГЕТСЫ": { uz: "Naggets", en: "Nuggets" },
    "НАПАЛЁН ПРЕЗИДЕНТ": { uz: "Prezident napoleon", en: "President Napoleon" },
    "НАПАЛЕОН ФЕРРЕРО РОШЕ": { uz: "Ferrero Rocher napoleon", en: "Ferrero Rocher Napoleon" },
    "НЕЖНЫЙ КУСОК": { uz: "Nafis bo'lak", en: "Tender slice" },
    "НУТЕЛЛА (РОМАШКА)": { uz: "Nutella (rayhon)", en: "Nutella (chamomile)" },
    "НУТЕЛЛА ДОП": { uz: "Nutella dop", en: "Nutella extra" },
    "НУТЕЛЛА ОК 2 КАТ": { uz: "Nutella OK 2 qism", en: "Nutella OK 2 pcs" },
    "НУТЕЛЛА ОКИ": { uz: "Nutella OK", en: "Nutella OK" },
    "ОДДИЙ РУЛЕТ": { uz: "Oddiy rulet", en: "Plain roll" },
    "ОК МЕДОВИК": { uz: "OK medovik", en: "OK honey cake" },
    "ОПЕРА": { uz: "Opera", en: "Opera" },
    "ОРЕХИВЫЙ ШОКОЛАД МИНИ": { uz: "Yong'oqli shokolad mini", en: "Nut chocolate mini" },
    "ОРЕХОВЫЙ ВУЛКАН": { uz: "Yong'oqli vulqon", en: "Nut volcano" },
    "ОСЬМИНОЖКИ": { uz: "Sakkizoyoq", en: "Octopus" },
    "ПАХЛАВА": { uz: "Paxlava", en: "Baklava" },
    "ПАХЛАВА БЕЗЕЛИ": { uz: "Bezeli paxlava", en: "Meringue baklava" },
    "Пахлава АЗЕРБАЙЖАН": { uz: "Ozarbayjon paxlavasi", en: "Azerbaijani baklava" },
    "ПЕСОЧНЫЙ БАНАН": { uz: "Qumli banan", en: "Sandy banana" },
    "ПЕСОЧНЫЙ ШАКАРЛИ": { uz: "Qumli shakarlik", en: "Sandy sugar" },
    "ПИРАМИДА": { uz: "Piramida", en: "Pyramid" },
    "ПИРОЖНОЕ БАНАН": { uz: "Banan pirojnoe", en: "Banana pastry" },
    "ПИРОЖНОЕ ЧИЯ": { uz: "Chiy pirojnoe", en: "Chia pastry" },
    "ПИЦЦА ЛЕВ": { uz: "Arslon pitsa", en: "Lion pizza" },
    "ПОНЧИК": { uz: "Ponchik", en: "Donut" },
    "ПРАГА ШОКОЛАДНОЕ": { uz: "Shokoladli Praga", en: "Chocolate Prague" },
    "ПРЕЛЕСТЬ": { uz: "Chiroy", en: "Charm" },
    "РАФ": { uz: "Raf", en: "Raf" },
    "РАФ МЕДОВЫЙ": { uz: "Asal Raf", en: "Honey Raf" },
    "РАФ С СВЕЖИЙ КЛУБНИКАМИ": { uz: "Yang'i qulupnayli Raf", en: "Raf with fresh strawberries" },
    "РАФАЕЛЛО": { uz: "Raffaello", en: "Raffaello" },
    "РОБИЯ": { uz: "Robiya", en: "Robiya" },
    "РУЛЕТ МОЛОЧНЫЙ": { uz: "Sutli rulet", en: "Milk roll" },
    "РУЛЕТ СКАЗКА": { uz: "Ertaq rulet", en: "Fairy tale roll" },
    "РУЛЕТ ФИСТАШКОВЫЙ": { uz: "Pistali rulet", en: "Pistachio roll" },
    "РУЛЕТ ШОКОЛАДНЫЙ": { uz: "Shokolad rulet", en: "Chocolate roll" },
    "РУЛЕТ ЯГОДНЫЙ": { uz: "Rezavorli rulet", en: "Berry roll" },
    "САЛАТ ЗАЙЧИК": { uz: "Quyon salat", en: "Bunny salad" },
    "САЛАТ МОЗАИКА": { uz: "Mozaika salat", en: "Mosaic salad" },
    "САЛАТ РАТАТУЙ": { uz: "Ratatuy salat", en: "Ratatouille salad" },
    "СЕТ 139": { uz: "Set 139", en: "Set 139" },
    "СЕТ 156": { uz: "Set 156", en: "Set 156" },
    "СЕТ 222": { uz: "Set 222", en: "Set 222" },
    "СЛ.ДУБАЙСКИЙ КРУАССАН": { uz: "Dubay kruassan", en: "Dubai croissant" },
    "СЛ.КРУАССАН БЕЗ НАЧИНКИ": { uz: "To'ldirilmagan kruassan", en: "Plain croissant" },
    "СЛ.КРУАССАН КЛУБ.ИЛИ ШОК.": { uz: "Qulupnay yoki shokolad kruassan", en: "Strawberry or chocolate croissant" },
    "СМАЙЛИКИ": { uz: "Smayliklar", en: "Smileys" },
    "СНИКЕРС КВАДРАТ": { uz: "Snickers kvadrat", en: "Snickers square" },
    "СНИКЕРС ПИРОЖНОЕ": { uz: "Snickers pirojnoe", en: "Snickers pastry" },
    "СНИКЕРС РУЛЕТ": { uz: "Snickers rulet", en: "Snickers roll" },
    "СНИКЕРС ТОЗА ПИСТА": { uz: "Snickers toza pista", en: "Snickers pure pistachio" },
    "СНИКЕРСЛИ МУС": { uz: "Snickersli mus", en: "Snickers mousse" },
    "СОСИСКАЛИ БУЛОЧКА": { uz: "Kolbasa bulochka", en: "Sausage bun" },
    "СПАРТАК": { uz: "Spartak", en: "Spartak" },
    "СТАКАН ПАНЧО": { uz: "Pancho stakan", en: "Pancho glass" },
    "СТАКАН ТРАЙФЛЕ": { uz: "Traifle stakan", en: "Trifle glass" },
    "СТАКАН ЧИЯ": { uz: "Chiy stakan", en: "Chia glass" },
    "СЫРНЫЕ ПАДУШКИ": { uz: "Pishloqli padushka", en: "Cheese pillows" },
    "ТАРХУН ЯБЛОКО": { uz: "Tarxun olma", en: "Tarragon apple" },
    "ТВОРОГЛИ ВАРТУШКА БУЛОЧКА": { uz: "Tvorogli vatrushka bulochka", en: "Cottage cheese vatrushka bun" },
    "ТВОРОГЛИ ПИРОГ": { uz: "Tvorogli pirog", en: "Cottage cheese pie" },
    "ТВОРОЖНИК": { uz: "Tvorojnik", en: "Cottage cheese cake" },
    "ТВОРОЖНИК 2 КАТ": { uz: "Tvorojnik 2 qism", en: "Cottage cheese cake 2 pcs" },
    "ТВОРОЖНОЕ ПИРОГ БИЗЕЛИ": { uz: "Tvorogli pirog bezeli", en: "Cottage cheese pie with meringue" },
    "ТЕРАМИСУ КРУГ": { uz: "Tiramisu doira", en: "Tiramisu round" },
    "ТОРТ МИНИ 3 КАТ": { uz: "Mini tort 3 qism", en: "Mini cake 3 pcs" },
    "ТОРТ СРЕДНИ 3 КАТ": { uz: "O'rta tort 3 qism", en: "Medium cake 3 pcs" },
    "ТРИ ШОКОЛАДА": { uz: "Uch shokolad", en: "Three chocolates" },
    "ТРУБОЧКАЛИ КОНТЕЙНЕР 400 ГР": { uz: "Trubochkali konteyner 400gr", en: "Tube container 400g" },
    "ТРУФЕЛ": { uz: "Trufel", en: "Truffle" },
    "ТРУФЕЛ 2 КАТ": { uz: "Trufel 2 qism", en: "Truffle 2 pcs" },
    "ТРУФЕЛ КИЧИК": { uz: "Trufel kichik", en: "Small truffle" },
    "БАНАНОВЫЙ ТРУФЕЛЬ": { uz: "Banan trufel", en: "Banana truffle" },
    "ТУРЕЦКИЙ ЧАК ЧАК": { uz: "Turkcha chak-chak", en: "Turkish chak-chak" },
    "УЛИТКА": { uz: "Chayon", en: "Snail" },
    "ФИЛЕ КУРИНОЕ ВСЛИВКАХ": { uz: "Tovuq file sousda", en: "Chicken fillet in sauce" },
    "ФИСТАШКОВЫЙ ВАНИЛ": { uz: "Pistali vanil", en: "Pistachio vanilla" },
    "ФИСТАШКОВЫЙ МЕРЕНГА": { uz: "Pistali meringa", en: "Pistachio meringue" },
    "ФИСТАШКОВЫЙ САН СЕБАСТИАН": { uz: "Pistali San Sebastian", en: "Pistachio San Sebastian" },
    "ФЛЭТ УАЙТ": { uz: "Flat white", en: "Flat white" },
    "ФОНДЮ КЛУБ БАНАН": { uz: "Qulupnay-banan fondyu", en: "Strawberry banana fondue" },
    "ФОНДЮ КЛУБНИКА": { uz: "Qulupnay fondyu", en: "Strawberry fondue" },
    "ФОНДЮ МИКС": { uz: "Fondyu mix", en: "Fondue mix" },
    "ФРАПУЧИНО": { uz: "Frappuchino", en: "Frappuccino" },
    "ЦИТРУСОВЫЙС ЛИМОНАД 0,5": { uz: "Sitrus limonad 0,5", en: "Citrus lemonade 0.5" },
    "ЧАЙ БАРДАК 1 СТ": { uz: "Choy bardak 1 stakan", en: "Tea cup 1 glass" },
    "ЧАЙ БАРДАК ЧАЙНИК": { uz: "Choynak choy", en: "Teapot tea" },
    "ЧЕРНЫЙ ПРИНЦ": { uz: "Qora shahzoda", en: "Black Prince" },
    "ЧИЗ КЕЙК КЛАССИЧЕСКИЙ": { uz: "Klassik chizkeyk", en: "Classic cheesecake" },
    "ЧИЗ КЕЙК ЛОТУС": { uz: "Lotus chizkeyk", en: "Lotus cheesecake" },
    "ЧИЗ КЕЙК МАЛИНА": { uz: "Malina chizkeyk", en: "Raspberry cheesecake" },
    "ЧИЗ КЕЙК МАНГО МАРАКУЯ": { uz: "Mango-marakuya chizkeyk", en: "Mango passion fruit cheesecake" },
    "ЧИЗ КЕЙК МУС ЛИСТЛИ": { uz: "Musli chizkeyk", en: "Mousse cheesecake" },
    "ЧИЗ КЕЙК ОРЕО": { uz: "Oreo chizkeyk", en: "Oreo cheesecake" },
    "ЧИЗ КЕЙК САН СЕБАСТИАН": { uz: "San Sebastian chizkeyk", en: "San Sebastian cheesecake" },
    "ЧИЗ КЕЙК ШОКОЛАД": { uz: "Shokolad chizkeyk", en: "Chocolate cheesecake" },
    "ЧИЗ КЕЙК ШОКОЛАД ДУБАЙСКИЙ": { uz: "Dubay shokolad chizkeyk", en: "Dubai chocolate cheesecake" },
    "ЧИЗ КЕЙК ЯГОДНЫЙ": { uz: "Rezavorli chizkeyk", en: "Berry cheesecake" },
    "ЧОККО НАПАЛЁН": { uz: "Chokko napoleon", en: "Choco Napoleon" },
    "ЭСПРЕССО": { uz: "Espresso", en: "Espresso" },
    "ЭСПРЕССО ДАБЛ": { uz: "Double espresso", en: "Double espresso" },
    "ЯГОДНЫЙ ЛИМОНАДЫ 0,5": { uz: "Rezavorli limonad 0,5", en: "Berry lemonade 0.5" },
    "ЯГОДНЫЙ ЛИМОНАДЫ 1": { uz: "Rezavorli limonad 1", en: "Berry lemonade 1" },
    "желейка": { uz: "Jele", en: "Jelly" },
  };

  function buildTranslations() {
    const menu = JSON.parse(fs.readFileSync(path.join(CWD, 'menu_data.json'), 'utf8'));
    const names = new Set();
    Object.values(menu).forEach(arr => arr.forEach(i => names.add(i.name)));
    const missing = [...names].filter(n => !FULL_TRANSLATIONS[n.trim()]);
    if (missing.length) { console.log('[translations] Missing:', missing.length); missing.slice(0, 10).forEach(m => console.log('  -', m)); }
    const out = {};
    [...names].forEach(name => { const key = name.trim(); const t = FULL_TRANSLATIONS[key]; out[key] = { uz: t ? t.uz : key, en: t ? t.en : key }; });
    try {
      let menuJs = fs.readFileSync(path.join(CWD, 'menu.js'), 'utf8');
      const dtStr = JSON.stringify(out);
      const start = menuJs.indexOf('const DISH_TRANSLATIONS = ');
      const end = menuJs.indexOf('function getDishName');
      if (start >= 0 && end > start) {
        menuJs = menuJs.slice(0, start) + 'const DISH_TRANSLATIONS = ' + dtStr + ';\n\n  ' + menuJs.slice(end);
        fs.writeFileSync(path.join(CWD, 'menu.js'), menuJs);
      }
    } catch (_) { }
    console.log('[translations] Total:', Object.keys(out).length, '| menu.js');
  }

  function injectMenu() {
    const menuData = JSON.parse(fs.readFileSync(path.join(CWD, 'menu_data.json'), 'utf8'));
    function esc(s) { return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' '); }
    const tabs = Object.keys(menuData);
    let menuStr = 'const MENU = {\n';
    tabs.forEach(tab => {
      menuStr += `      ${tab}: [\n`;
      menuData[tab].forEach(item => {
        const imgPart = item.img ? `, img: '${esc(item.img)}'` : '';
        menuStr += `        { name: '${esc(item.name)}', desc: '${esc(item.desc)}', weight: '${esc(item.weight)}', price: ${item.price}, badge: null, bg: '${item.bg}'${imgPart} },\n`;
      });
      menuStr += `      ],\n`;
    });
    menuStr += '    };';
    let html = fs.readFileSync(path.join(CWD, 'menu.html'), 'utf8');
    const startMarker = '    const MENU = {';
    const endPatternCRLF = '    };\r\n\r\n    const ICONS = {';
    const endPatternLF = '    };\n\n    const ICONS = {';
    const startIdx = html.indexOf(startMarker);
    let endIdx = html.indexOf(endPatternCRLF);
    if (endIdx < 0) endIdx = html.indexOf(endPatternLF);
    if (startIdx >= 0 && endIdx > startIdx) {
      const before = html.slice(0, startIdx);
      const after = html.slice(endIdx + '    };'.length);
      html = before + '    ' + menuStr + after;
    }
    fs.writeFileSync(path.join(CWD, 'menu.html'), html);
    console.log('[inject] menu.html updated');
  }

  const cmd = (process.argv[2] || 'help').toLowerCase();
  if (cmd === 'menu' || cmd === 'm') buildMenu();
  else if (cmd === 'translations' || cmd === 't' || cmd === 'trans') buildTranslations();
  else if (cmd === 'inject' || cmd === 'i') injectMenu();
  else if (cmd === 'all' || cmd === 'a') { buildMenu(); buildTranslations(); injectMenu(); console.log('\n[build] All done.'); }
  else {
    console.log(`
Jasmin House — сборка меню (node menu.js)
  menu        — menu_api.json → menu_data.json
  translations — переводы → menu.js
  inject      — menu_data → menu.html
  all         — всё по порядку
`);
  }
}
