const IMG_BACK = "assets/card-back.png";
// Every card image follows one template: a 617x1024 file whose cut line (70x120 mm when printed) is the
// rectangle below; outside it is bleed. On screen a card is only what lies inside the cut line.
const CUT={fileW:617, fileH:1024, left:23, top:22.5, w:570, h:977.5};
const CARD_ASPECT=CUT.w/CUT.h, CARD_RADIUS=40/CUT.w; // corner radius as a share of the card width
// style.css crops every card image to the cut line and rounds the corners from these
(s=>{
  s.setProperty('--img-w', CUT.fileW/CUT.w*100+'%'); s.setProperty('--img-h', CUT.fileH/CUT.h*100+'%');
  s.setProperty('--img-x', -CUT.left/CUT.w*100+'%'); s.setProperty('--img-y', -CUT.top/CUT.h*100+'%');
  s.setProperty('--card-r', CARD_RADIUS);
  const pc=v=>(v*100).toFixed(3)+'%';
  s.setProperty('--img-clip', `inset(${pc(CUT.top/CUT.fileH)} ${pc((CUT.fileW-CUT.left-CUT.w)/CUT.fileW)} `+
    `${pc((CUT.fileH-CUT.top-CUT.h)/CUT.fileH)} ${pc(CUT.left/CUT.fileW)} round ${pc(40/CUT.fileW)} / ${pc(40/CUT.fileH)})`);
  s.setProperty('--img-clip-rev', `inset(${pc((CUT.fileH-CUT.top-CUT.h)/CUT.fileH)} ${pc(CUT.left/CUT.fileW)} `+
    `${pc(CUT.top/CUT.fileH)} ${pc((CUT.fileW-CUT.left-CUT.w)/CUT.fileW)} round ${pc(40/CUT.fileW)} / ${pc(40/CUT.fileH)})`);
  s.setProperty('--card-clip', `inset(0 round ${pc(40/CUT.w)} / ${pc(40/CUT.h)})`);
})(document.documentElement.style);
// every GSAP animation runs a quarter slower than its written duration, for a calmer, smoother feel
gsap.globalTimeline.timeScale(.8);
// every card face is its own picture, named after the card's place in the deck (00 The Fool ... 77 King of Pentacles)
const artSrc=i=>`assets/cards/${String(i).padStart(2,'0')}.webp`;
/* ---------- deck data ---------- */
// the deck in both languages; a card's name and meanings follow the current language (see "language" below)
// every card as [name, upright, reversed, title]; titles (from the guidebook) only for the Minor Arcana
const DATA={
ru:{
SUITS:{w:["Жезлов","энергию и действие"],c:["Кубков","чувства и отношения"],s:["Мечей","мысли и конфликты"],p:["Пентаклей","материю и стабильность"]},
CARDS:[
["Шут", "Новый путь, свобода, дерзкий шаг в неизвестность.", "Манипуляция, роль жертвы, самообман.", ""],
["Маг", "Воля, находчивость, умелое обращение с инструментами.", "Ложь, обман, эксплуатация.", ""],
["Верховная Жрица", "Интуиция, тайное знание, духовное прозрение.", "Утаённые секреты, отрицание, слепота к правде.", ""],
["Императрица", "Плодородие, созидание, изобилие.", "Потеря контроля, зависимость, мученичество.", ""],
["Император", "Власть, структура, дисциплина, стабильность. Сила устанавливать контроль, строить системы и навязывать правила. Император требует уважения и повиновения, даруя защиту через подчинение.", "Тирания, жёсткость, жестокость под маской порядка. Злоупотребление властью, одержимость контролем или рабство у собственных правил. То, что строилось ради стабильности, может стать тюрьмой.", ""],
["Иерофант", "Вера, общность, упорядоченные убеждения.", "Фанатизм, слепое повиновение, насилие догмы.", ""],
["Влюблённые", "Партнёрство, доверие, глубокая связь.", "Токсичность, одержимость, разрушительная страсть.", ""],
["Колесница", "Безжалостная воля, решительное движение, цель, доведённая до конца. Миссия выполнена любой ценой.", "Слепая сила, потеря контроля, цель без направления. То, что гнало тебя вперёд, теперь тянет на дно.", ""],
["Сила", "Власть воли, неумолимый контроль, сила под маской спокойствия. Способность действовать решительно, когда чувства дрогнули бы.", "Ярость под видом силы, жестокость под видом заботы, насилие, берущее верх над разумом. Контроль ускользает, когда побеждает желание причинить боль.", ""],
["Отшельник", "Уединение, беспощадный поиск истины, откровение во тьме. Смелость взглянуть на то, что другие закапывают.", "Изоляция, одержимость, погружение в безумие. Мудрость, потерянная в эхе собственной тени.", ""],
["Колесо Фортуны", "Поворотный момент, неизбежные перемены, судьба в движении. Колесо вращается — вверх или вниз, но двигаться придётся.", "Невезение, хаос, сопротивление переменам. Колесо давит сильнее, когда отказываешься вращаться вместе с ним.", ""],
["Справедливость", "Правда восстановлена, последствия наступили, порядок оплачен. Справедливость режет глубоко, но не промахивается.", "Несправедливость, злоупотребление властью, искажённая правда. Когда клинок служит предвзятости, кровь льётся напрасно.", ""],
["Повешенный", "Смирение, иной взгляд, жертва ради глубокого понимания. Отпустив, увидишь то, что скрывал контроль.", "Сопротивление, отрицание, бессмысленное страдание. Отказ отпустить лишь туже затягивает верёвку.", ""],
["Смерть", "Конец, необратимые перемены, переход в новую фазу. Прежнее должно умереть, чтобы будущее могло восстать.", "Страх перемен, цепляние за ушедшее, распад без обновления. Отказ отпустить лишь продлевает гниение.", ""],
["Умеренность", "Равновесие, терпение, осознанная трансформация. Искусство смешивать противоположности в единое целое.", "Разлад, излишества, дисбаланс. Когда контроль ускользает, то, что должно исцелять, начинает разрушать.", ""],
["Дьявол", "Искушение, одержимость, капитуляция перед желанием. Власть, полученная через то, что управляет тобой.", "Освобождение, пробуждение, ослабление хватки порока. Цепи падают, когда перестаёшь их кормить.", ""],
["Башня", "Внезапный крах, откровение, насильственные перемены. Падение, срывающее иллюзии.", "Отрицание, страх потрясений, цепляние за руины. Сопротивление падению лишь делает приземление жёстче.", ""],
["Звезда", "Обновление, хрупкая надежда, свет после тьмы. Исцеление, найденное через страдание.", "Отчаяние, пустота, утраченная вера. Раны звучат громче света.", ""],
["Луна", "Иллюзия, инстинкт, зов бессознательного. Доверься тому, что не объяснить разумом.", "Заблуждение, страх, скольжение в хаос. Когда разум распадается, любой путь становится лабиринтом.", ""],
["Солнце", "Ясность, успех, сияющая правда. Радость, прорезающая любую тень.", "Наивность, ложное счастье, опасность под маской оптимизма. То, что кажется безобидным, может ранить глубже всего.", ""],
["Суд", "Пробуждение, ответственность, окончательно открытая правда. Прошлое требует приговора.", "Вина, отрицание, нежелание отвечать за последствия. Прятаться бесполезно, когда раздаётся зов.", ""],
["Мир", "Завершение, целостность, исполнение. Круг замыкается, и начинается новый.", "Застой, незавершённые дела. История не продолжится, пока не перевёрнута последняя страница.", ""],
["Туз Жезлов", "Созидание, воспламенение, сила воли. Рана становится дверью.", "Заблокированная энергия, фальстарты, растраченная страсть. Спичка шипит, но не вспыхивает.", "Искра"],
["Двойка Жезлов", "Решение, амбиции, исследование. Мир ждёт твоего надреза.", "Колебания, страх неизвестности, отсутствие направления. Рука дрожит перед разрезом.", "Выбор"],
["Тройка Жезлов", "Рост, продвижение, дальновидность. Сцена готова — действуй.", "Задержки, промахи, недальновидность. Клинок готов, а план — нет.", "Подготовка"],
["Четвёрка Жезлов", "Гармония, празднование, завершение. Работа приносит плоды, и это великолепно.", "Разобщённость, нестабильность, незавершённые дела. Ложный триумф рушится.", "Витрина трофеев"],
["Пятёрка Жезлов", "Соперничество, напряжение, проверка сил. Битва оттачивает мастерство.", "Избегание, внутренний конфликт, рассеянная энергия. Бой без цели тупит клинок.", "Схватка"],
["Шестёрка Жезлов", "Достижение, признание, лидерство. Триумф неоспорим.", "Эго, пустая похвала, отложенный успех. Корона, врезающаяся в кожу.", "Триумф"],
["Семёрка Жезлов", "Упорство, стойкость, умение стоять на своём. Сопротивление становится сутью.", "Перегрузка, капитуляция, изнеможение. Даже самые сильные руки устают.", "Оборона"],
["Восьмёрка Жезлов", "Быстрые действия, стремительные перемены, общение. Стрелы судьбы уже в полёте.", "Задержки, хаос, неверное направление. Брошенный клинок не вернуть.", "Бросок"],
["Девятка Жезлов", "Настойчивость, защита, стойкость. Рана — доказательство, что ты ещё жив.", "Поражение, паранойя, отказ от борьбы. Дух, натянутый до предела.", "Израненный"],
["Десятка Жезлов", "Бремя, долг, обязательства. Успех требует жертв.", "Крах, освобождение, делегирование. Сложи то, что больше не тебе нести.", "Перегрузка"],
["Паж Жезлов", "Вдохновение, энтузиазм, начинания. Послание должно быть доставлено любой ценой.", "Незрелость, рассеянность, неуверенность в себе. Голос срывается, не дойдя до толпы.", "Искра голоса"],
["Рыцарь Жезлов", "Страсть, смелость, погоня. Бей раньше, чем мир узнает о твоём приближении.", "Безрассудство, спешка, выгорание. Слишком дикий взмах ранит и того, кто держит клинок.", "Дикий удар"],
["Королева Жезлов", "Харизма, лидерство, решимость. Сила, которая притягивает и разрушает.", "Ревность, неуверенность, манипуляция. Пламя, пожирающее своего носителя.", "Пылающее сердце"],
["Король Жезлов", "Лидерство, влияние, смелое видение. Архитектор хаоса и созидания.", "Тирания, высокомерие, вспыльчивость. Корона раздавливает череп, на котором сидит.", "Последнее слово"],
["Туз Кубков", "Новые чувства, отношения, сострадание, вдохновение. Чаша переполнена возможностями.", "Заблокированные чувства, эмоциональное онемение, подавленная любовь. Сердце запечатано — но давление растёт.", "Первая капля"],
["Двойка Кубков", "Партнёрство, влечение, примирение, гармония. Сердца бьются в унисон.", "Дисбаланс, подорванное доверие, разлука. Одно сердце отдаёт больше другого.", "Договор"],
["Тройка Кубков", "Праздник, дружба, сотрудничество. Разделённое счастье умножается.", "Излишества, сплетни, предательство. То, что объединяло, начинает гнить.", "Тост"],
["Четвёрка Кубков", "Апатия, скука, эмоциональная отстранённость. Возможности проходят мимо, пока ты сидишь в собственной пустоте.", "Новое осознание, возвращение к жизни, умение взять упущенное. Онемение начинает проходить.", "Горький отвар"],
["Пятёрка Кубков", "Печаль, разочарование, зацикленность на потере. Тяжесть утраченного заслоняет то, что ещё возможно.", "Принятие, прощение, обновление. Прошлое не переписать — но будущее можно.", "Разлитое"],
["Шестёрка Кубков", "Воспоминания, детство, щедрость, воссоединение. Возвращение к простым временам и сердечным связям.", "Цепляние за прошлое, нездоровая сентиментальность, нежелание взрослеть. То, что утешало, теперь сковывает.", "От мёртвых"],
["Семёрка Кубков", "Возможности, воображение, мечты. Мир полон дверей, но не все ведут к спасению.", "Заблуждение, растерянность, неверные решения. Мечта сворачивается в ловушку, и каждая чаша становится гробом.", "Бред"],
["Восьмёрка Кубков", "Умение отпустить, духовный поиск, отказ от того, что больше не служит. Путь вперёд требует жертвы.", "Страх перемен, избегание, застой. Ты знаешь, что пора уходить, — но всё равно остаёшься.", "Уход"],
["Девятка Кубков", "Исполнение желаний, комфорт, успех. Всё в пределах досягаемости.", "Поверхностное счастье, жадность, потакание себе. Удовлетворение сворачивается в излишество.", "Радость коллекционера"],
["Десятка Кубков", "Прочное счастье, полнота, семья, эмоциональная целостность. История подходит к прекрасному финалу.", "Разочарование, разбитые мечты, разорванные связи. Сказка распадается.", "Переполнение"],
["Паж Кубков", "Новые эмоциональные начала, интуиция, открытость. Вдохновение приходит оттуда, откуда не ждёшь.", "Незрелость, бегство от реальности, творческий блок. Эмоции захлёстывают, а не ведут.", "Шут чувств"],
["Рыцарь Кубков", "Предложение, творчество, следование зову сердца. Мечта становится миссией.", "Переменчивость, разочарование, пустые обещания. Мечтатель дрейфует и нигде не причаливает.", "Преследователь"],
["Королева Кубков", "Эмпатия, забота, эмоциональная мудрость. Чувствуй глубоко, но сохраняй равновесие.", "Перегрузка, созависимость, эмоциональная манипуляция. Прилив поднимается слишком высоко.", "Сосуд"],
["Король Кубков", "Равновесие, контроль, мудрый совет, сострадание с позиции силы. Чувства подчиняются трону.", "Подавление, вспыльчивость, эмоциональная отстранённость. Сердце короля заперто в собственной темнице.", "Спокойствие"],
["Туз Мечей", "Прорыв, новая идея, решительная ясность. Острый ум видит сквозь туман.", "Растерянность, злоупотребление силой, затуманенное суждение. Клинок тупится, а с ним и правда.", "Надрез"],
["Двойка Мечей", "Нерешительность, тупик, трудный выбор. Ни один путь не обойдётся без боли.", "Эмоциональная перегрузка, избегание, скрытая правда. Отказ выбирать сам становится выбором.", "Повязка"],
["Тройка Мечей", "Разбитое сердце, горе, болезненная правда. Любовь кровоточит, но исцеление начинается с разреза.", "Освобождение, прощение, эмоциональное восстановление. Рана ещё ноет, но больше не правит тобой.", "Вскрытие"],
["Четвёрка Мечей", "Отдых, медитация, восстановление. Отступление — это сила, а не слабость.", "Выгорание, застой, вынужденная изоляция. Непролеченная рана становится гниением.", "Бдение"],
["Пятёрка Мечей", "Поражение, конфликт, предательство. Трофеи войны запятнаны кровью.", "Примирение, компромисс, усвоенные уроки. Иногда милосердие — самое острое оружие.", "После бойни"],
["Шестёрка Мечей", "Переход, путешествие, восстановление. Спасение возможно, хотя шрамы останутся.", "Сопротивление переменам, эмоциональный груз, затянувшееся исцеление. Реку не перейти, если отказываешься войти в воду.", "Переправа"],
["Семёрка Мечей", "Стратегия, скрытность, расчётливые действия. Хитрый план режет глубже грубой силы.", "Разоблачение, раскрытое предательство, самообман. Ложь оборачивается внутрь и режет своего творца.", "Кража"],
["Восьмёрка Мечей", "Ограничения, страх, оцепенение. Свобода рядом, но её не видно.", "Освобождение, новый взгляд, избавление. Разум разжимает хватку, и путь открывается.", "Клетка"],
["Девятка Мечей", "Страх, вина, отчаяние. Разум пожирает сам себя.", "Исцеление, принятие, встреча со страхами. Тени съёживаются в свете осознанности.", "Бессонница"],
["Десятка Мечей", "Поражение, крах, болезненная развязка. История заканчивается, но страница перевернётся.", "Восстановление, стойкость, возрождение. Даже из смерти что-то поднимается.", "Конец"],
["Паж Мечей", "Новые идеи, любопытство, наблюдательность, бдительность. Вопросы оттачивают ум.", "Обман, сплетни, поспешные действия. Любопытство становится навязчивым и безрассудным.", "Наблюдатель"],
["Рыцарь Мечей", "Быстрые действия, амбиции, решимость. Слова становятся оружием, и битвы выиграны.", "Импульсивность, безрассудство, агрессия. Правда превращается в жестокость, если обращаться с ней небрежно.", "Атака"],
["Королева Мечей", "Ясность, честность, независимость, проницательная мудрость. Разум властвует над чувствами.", "Холодность, горечь, манипуляция. Правда становится оружием, чтобы ранить.", "Казнь"],
["Король Мечей", "Власть, структура, интеллект, стратегическое мышление. Ясность правит королевством.", "Тирания, злоупотребление властью, жестокость. Закон служит только тому, кто его пишет.", "Приговор"],
["Туз Пентаклей", "Новая финансовая или материальная возможность, воплощение, первый шаг к процветанию. Земля плодородна — если осмелишься посеять.", "Упущенные шансы, фальстарты, растраченный потенциал. Семя гниёт, если его не трогать.", "Подношение"],
["Двойка Пентаклей", "Баланс, гибкость, умение распределять время, лавирование между противоположностями. Способность жонглировать, не теряя опоры.", "Перегрузка, нестабильность, крах под давлением. Слишком много груза — и тело под тобой ломается.", "Равновесие"],
["Тройка Пентаклей", "Сотрудничество, командная работа, создание долговечного. Сила группы превосходит силу одного.", "Разобщённость, корыстные мотивы, крах под давлением. Без доверия конструкция рушится — и кровоточить будут все.", "Архитектура боли"],
["Четвёрка Пентаклей", "Контроль, стабильность, осторожное накопление. Защита того, что твоё.", "Жадность, застой, накопительство из страха. Чем крепче хватка, тем больше жизни утекает.", "Коллекционер"],
["Пятёрка Пентаклей", "Лишения, утрата, бедность — но и стойкость, выносливость. Помощь может быть ближе, чем кажется.", "Восстановление после краха, медленное возвращение к стабильности. Осознание ценности общности после изгнания.", "Изгнанник"],
["Шестёрка Пентаклей", "Щедрость, умение делиться, помощь нуждающимся. Напоминание, что дарение меняет обе стороны.", "Эксплуатация, манипуляция через благотворительность. Дары, к которым прикованы цепи.", "Дар мясника"],
["Семёрка Пентаклей", "Терпение, оценка, отложенное вознаграждение. Прогресс, который приходит капля за каплей.", "Нетерпение, досада, слишком ранний отказ от усилий. Урожай гибнет, не успев созреть.", "Урожай"],
["Восьмёрка Пентаклей", "Развитие навыков, усердие, сосредоточенность. Цена совершенства платится каплями крови.", "Перфекционизм, выгорание, механическая работа без страсти. Ремесло становится клеткой.", "Мастер"],
["Девятка Пентаклей", "Самодостаточность, роскошь, заслуженный успех. Награда за долгий труд наконец твоя.", "Пустота за богатством, изоляция, ложная защищённость. У тебя есть всё — и всё же ничто не ощущается целым.", "Маска довольства"],
["Десятка Пентаклей", "Процветание, семья, традиции, стабильность, которая переживёт тебя.", "Прерванный род, семейный конфликт, богатство без смысла. Наследие, отравленное у корней.", "Наследие"],
["Паж Пентаклей", "Новые начинания в работе или учёбе, энтузиазм, потенциал. Идея, готовая к взращиванию.", "Прокрастинация, незрелость, рассеянность. Копать, не зная, что ищешь.", "Раскопанная тайна"],
["Рыцарь Пентаклей", "Упорный труд, рутина, ответственность, настойчивость. Долгая дорога, пройденная честно.", "Застой, монотонность, упрямство. Движение без смысла — путь, ведущий в никуда.", "Неумолимый путь"],
["Королева Пентаклей", "Забота, находчивость, материальная защищённость. Надёжная гавань для роста.", "Удушающая опека, зависимость, бесхозяйственность. Забота, которая контролирует, любовь, которая пожирает.", "Хранительница могил"],
["Король Пентаклей", "Богатство, стабильность, лидерство, наследие, созданное усердием. Королевство процветает, потому что почва напитана.", "Коррупция, жадность, страх потери. Правитель, который копит вместо того, чтобы взращивать, забыв, что сделало землю плодородной.", "Кровь земли"]
]
},
en:{
SUITS:{w:["Wands","energy and action"],c:["Cups","feelings and relationships"],s:["Swords","thoughts and conflicts"],p:["Pentacles","material matters and stability"]},
CARDS:[
["The Fool", "New journey, freedom, daring step into the unknown.", "Manipulation, victimhood, self-delusion.", ""],
["The Magician", "Willpower, resourcefulness, clever use of tools.", "Lies, trickery, exploitation.", ""],
["The High Priestess", "Intuition, hidden knowledge, spiritual insight.", "Secrets withheld, denial, blindness to the truth.", ""],
["The Empress", "Fertility, creation, abundance.", "Loss of control, dependence, martyrdom.", ""],
["The Emperor", "Authority, structure, discipline, stability. The power to establish control, build systems, and impose rules. The Emperor demands respect and obedience, offering protection through domination.", "Tyranny, rigidity, cruelty masked as order. Abuse of authority, obsession with control, or becoming enslaved to one’s own rules. What was built for stability may turn into a prison.", ""],
["The Hierophant", "Faith, community, structured belief.", "Fanaticism, blind obedience, violence of dogma.", ""],
["The Lovers", "Partnership, trust, meaningful bond.", "Toxicity, obsession, destructive passion.", ""],
["The Chariot", "Ruthless will, decisive movement, purpose carried through. A mission completed, no matter the cost.", "Misguided force, collapse of control, aim without direction. What once drove you forward now drags you down.", ""],
["Strength", "Dominance through will, relentless control, power hidden beneath calm. The capacity to act decisively when emotion would falter.", "Rage disguised as strength, cruelty masked as care, violence that overpowers reason. Control slips when the will to harm takes over.", ""],
["The Hermit", "Solitude, ruthless search for truth, revelation in darkness. The courage to confront what others bury.", "Isolation, obsession, descent into madness. Wisdom lost in the echo of one’s own shadow.", ""],
["Wheel of Fortune", "Turning point, inevitable change, destiny unfolding. The cycle moves — rise or fall, but move you must.", "Misfortune, chaos, resistance to change. The wheel grinds harder when you refuse to turn with it.", ""],
["Justice", "Truth enforced, consequences delivered, order at a cost. Justice cuts deep but does not miss.", "Injustice, abuse of power, truth distorted. When the blade serves bias, blood is shed for nothing.", ""],
["The Hanged Man", "Surrender, altered perspective, sacrifice for deeper understanding. Letting go reveals what control concealed.", "Resistance, denial, pointless suffering. Refusal to release only tightens the rope.", ""],
["Death", "Ending, irreversible change, passage into the next phase. What was must die for what will be to rise.", "Fear of change, clinging to what’s gone, decay without renewal. Refusal to release only prolongs the rot.", ""],
["Temperance", "Balance, patience, deliberate transformation. The art of mixing opposites into something whole.", "Discord, excess, imbalance. When control slips, what should heal begins to destroy.", ""],
["The Devil", "Temptation, obsession, surrender to desire. Power gained through what controls you.", "Breaking free, awakening, loosening the grip of vice. The chains fall when you stop feeding them.", ""],
["The Tower", "Sudden collapse, revelation, violent change. The fall that strips away illusion.", "Denial, fear of upheaval, clinging to ruins. Refusing the fall only makes the landing harder.", ""],
["The Star", "Renewal, fragile hope, light after darkness. Healing found through suffering.", "Despair, emptiness, lost faith. The wounds speak louder than the light.", ""],
["The Moon", "Illusion, instinct, the pull of the unconscious. Trust what reason cannot explain.", "Delusion, fear, slipping into chaos. When the mind unravels, every path becomes a maze.", ""],
["The Sun", "Clarity, success, radiant truth. Joy that cuts through every shadow.", "Naivety, false happiness, danger beneath optimism. What seems harmless may wound the deepest.", ""],
["Judgement", "Awakening, accountability, final truth revealed. The past demands its sentence.", "Guilt, denial, refusal to face consequences. Hiding changes nothing when the call comes.", ""],
["The World", "Completion, wholeness, fulfillment. The circle closes, and a new one begins.", "Stagnation, unfinished business. The story cannot progress until the last page is turned.", ""],
["Ace of Wands", "Creation, ignition, willpower. The wound becomes the doorway.", "Blocked energy, false starts, wasted passion. The match sputters before the flame.", "The Spark"],
["Two of Wands", "Decision, ambition, exploration. The world is waiting for your incision.", "Hesitation, fear of the unknown, lack of direction. The hand trembles before the cut.", "The Choice"],
["Three of Wands", "Growth, progress, long-term vision. The stage is set — now act.", "Delays, missteps, lack of foresight. The blade is ready, but the plan is not.", "The Preparation"],
["Four of Wands", "Harmony, celebration, completion. The work bears fruit, and it is glorious.", "Disconnection, instability, unfinished business. A false triumph collapses.", "The Trophy Case"],
["Five of Wands", "Competition, tension, testing strength. Battle sharpens skill.", "Avoidance, internal conflict, scattered energy. Fighting without purpose dulls the blade.", "The Clash"],
["Six of Wands", "Achievement, recognition, leadership. Triumph is undeniable.", "Ego, hollow praise, delayed success. A crown that cuts into the scalp.", "The Triumph"],
["Seven of Wands", "Perseverance, resilience, standing your ground. Resistance becomes identity.", "Overwhelm, surrender, exhaustion. Even the strongest arms grow heavy.", "The Stand"],
["Eight of Wands", "Swift action, rapid change, communication. The arrows of fate are already in flight.", "Delays, chaos, misdirection. A thrown blade cannot be recalled.", "The Release"],
["Nine of Wands", "Persistence, defense, grit. The wound is proof you’re still alive.", "Defeat, paranoia, giving up. A spirit stretched to breaking.", "The Scarred"],
["Ten of Wands", "Burden, duty, obligation. Success demands sacrifice.", "Collapse, release, delegation. Lay down what is no longer yours to carry.", "The Overload"],
["Page of Wands", "Inspiration, enthusiasm, beginnings. The message must be delivered, no matter the cost.", "Immaturity, scattered energy, self-doubt. The voice falters before it reaches the crowd.", "The Spark of Voice"],
["Knight of Wands", "Passion, courage, pursuit. Strike before the world knows you’re coming.", "Recklessness, haste, burnout. A blade swung too wildly cuts the wielder too.", "The Wild Strike"],
["Queen of Wands", "Charisma, leadership, determination. Power that draws and destroys.", "Jealousy, insecurity, manipulation. Flame that consumes its bearer.", "The Burning Heart"],
["King of Wands", "Leadership, influence, bold vision. The architect of chaos and creation.", "Tyranny, arrogance, volatility. The crown crushes the skull that wears it.", "The Final Word"],
["Ace of Cups", "New emotions, relationships, compassion, inspiration. The cup overflows with potential.", "Blocked feelings, emotional numbness, suppressed love. The heart stays sealed — but pressure builds.", "First Drop"],
["Two of Cups", "Partnership, attraction, reconciliation, harmony. Hearts beat in unison.", "Imbalance, broken trust, separation. One heart gives more than the other.", "The Pact"],
["Three of Cups", "Celebration, friendship, collaboration. Shared happiness multiplies.", "Overindulgence, gossip, betrayal. What united begins to decay.", "The Toast"],
["Four of Cups", "Apathy, boredom, emotional withdrawal. Opportunities go unnoticed while you sit in your own emptiness.", "New awareness, reengagement, seizing what was once overlooked. The numbness begins to fade.", "The Bitter Brew"],
["Five of Cups", "Sorrow, disappointment, fixation on loss. The weight of what’s gone overshadows what’s still possible.", "Acceptance, forgiveness, renewal. The past cannot be rewritten — but the future can.", "The Spill"],
["Six of Cups", "Memories, childhood, generosity, reconnection. A return to simpler times or heartfelt bonds.", "Clinging to the past, unhealthy sentimentality, refusal to grow. What once comforted now confines.", "From The Dead"],
["Seven of Cups", "Possibilities, imagination, wishful thinking. The world is full of doors, but not all of them lead to salvation.", "Delusion, confusion, poor decisions. The dream curdles into a trap, and every cup becomes a coffin.", "The Delirium"],
["Eight of Cups", "Letting go, spiritual search, leaving behind what no longer serves. The path forward demands sacrifice.", "Fear of change, avoidance, stagnation. You know it’s time to go — but you stay anyway.", "The Abandonment"],
["Nine of Cups", "Wishes granted, comfort, success. Everything is within reach.", "Superficial happiness, greed, indulgence. Satisfaction curdles into excess.", "The Collector’s Delight"],
["Ten of Cups", "Lasting happiness, fulfillment, family, emotional wholeness. A story reaches its beautiful end.", "Disillusionment, broken dreams, fractured bonds. The fairy tale unravels.", "The Overflow"],
["Page of Cups", "New emotional beginnings, intuition, openness. Inspiration arrives from unexpected places.", "Immaturity, escapism, blocked creativity. Emotions overwhelm rather than guide.", "The Fool of Feelings"],
["Knight of Cups", "Proposal, creativity, following your heart. The dream becomes a mission.", "Moodiness, disappointment, fickle promises. The dreamer drifts, never landing.", "The Pursuer"],
["Queen of Cups", "Empathy, nurturing, emotional wisdom. Feel deeply, but stay balanced.", "Overwhelm, co-dependence, emotional manipulation. The tides rise too high.", "The Vessel"],
["King of Cups", "Balance, control, wise counsel, compassion with authority. Feelings obey the throne.", "Suppression, volatility, emotional detachment. The king’s heart is locked in its own dungeon.", "The Calm"],
["Ace of Swords", "Breakthrough, new idea, decisive clarity. A sharp mind sees through the fog.", "Confusion, misuse of power, clouded judgment. The blade dulls, and so does the truth.", "The Incision"],
["Two of Swords", "Indecision, impasse, difficult choices. Neither path is painless.", "Emotional overwhelm, avoidance, hidden truths. The refusal to choose becomes the choice itself.", "The Blindfold"],
["Three of Swords", "Heartbreak, grief, painful truth. Love bleeds, but healing begins with the cut.", "Release, forgiveness, emotional recovery. The wound still aches, but it no longer rules you.", "The Dissection"],
["Four of Swords", "Rest, meditation, recuperation. Withdrawal is strength, not weakness.", "Burnout, stagnation, forced isolation. Healing ignored becomes decay.", "The Vigil"],
["Five of Swords", "Defeat, conflict, betrayal. The spoils of war are stained in blood.", "Reconciliation, compromise, lessons learned. Sometimes, mercy is the sharpest weapon.", "The Aftermath"],
["Six of Swords", "Transition, journey, recovery. Escape is possible, though scars remain.", "Resistance to change, emotional baggage, delayed healing. You cannot cross the river if you refuse to step in.", "The Crossing"],
["Seven of Swords", "Strategy, stealth, calculated action. A clever plan cuts deeper than brute force.", "Exposure, betrayal revealed, self-deception. Lies turn inward and slice their maker.", "The Theft"],
["Eight of Swords", "Restriction, fear, paralysis. Freedom is near, but unseen.", "Liberation, perspective, release. The mind unbinds, and the way forward appears.", "The Cage"],
["Nine of Swords", "Fear, guilt, despair. The mind devours itself.", "Healing, acceptance, facing fears. Shadows shrink in the light of awareness.", "The Wake"],
["Ten of Swords", "Defeat, ruin, painful conclusion. The story ends, but the page will turn.", "Recovery, resilience, regeneration. Even from death, something rises.", "The End"],
["Page of Swords", "New ideas, curiosity, observation, vigilance. Questions sharpen the mind.", "Deception, gossip, premature action. Curiosity turns invasive and reckless.", "The Observer"],
["Knight of Swords", "Swift action, ambition, determination. Words become weapons, and battles are won.", "Impulsiveness, recklessness, aggression. Truth turns into cruelty when wielded without care.", "The Charge"],
["Queen of Swords", "Clarity, honesty, independence, perceptive wisdom. The mind reigns above emotion.", "Coldness, bitterness, manipulation. Truth is weaponized and wielded to wound.", "The Execution"],
["King of Swords", "Authority, structure, intellect, strategic thinking. Clarity rules the kingdom.", "Tyranny, misuse of power, cruelty. The law serves only the one who writes it.", "The Judgement"],
["Ace of Pentacles", "New financial or material opportunity, manifestation, the first step toward prosperity. The ground is fertile — if you dare to plant.", "Missed chances, false starts, squandered potential. The seed rots when left untouched.", "The Offering"],
["Two of Pentacles", "Balance, adaptability, time management, navigating opposing forces. The ability to juggle without losing footing.", "Overwhelm, instability, collapse under pressure. Too many weights — and the body beneath you breaks.", "The Balance"],
["Three of Pentacles", "Cooperation, teamwork, building something lasting. The strength of the group surpasses the individual.", "Disunity, selfish motives, collapse under pressure. Without trust, the structure fails — and all involved will bleed.", "The Architecture of Pain"],
["Four of Pentacles", "Control, stability, cautious accumulation. Protecting what’s yours.", "Greed, stagnation, hoarding out of fear. The tighter the grip, the more life drains away.", "The Collector"],
["Five of Pentacles", "Hardship, loss, poverty — but also resilience and endurance. Help may be closer than it seems.", "Recovery from ruin, slow return to stability. Learning the value of community after exile.", "The Exile"],
["Six of Pentacles", "Generosity, sharing wealth, helping those in need. A reminder that giving transforms both sides.", "Exploitation, manipulation through charity. Gifts that come with chains attached.", "The Butcher’s Gift"],
["Seven of Pentacles", "Patience, assessment, delayed gratification. Progress that comes drop by drop.", "Impatience, frustration, abandoning effort too soon. The harvest dies before it’s ripe.", "The Harvest"],
["Eight of Pentacles", "Skill development, diligence, focus. The price of excellence is paid in drops of blood.", "Perfectionism, burnout, mechanical work without passion. Craft becomes cage.", "The Craftsman"],
["Nine of Pentacles", "Self-sufficiency, luxury, earned success. The rewards of long labor are finally yours.", "Emptiness beneath the wealth, isolation, false security. You have everything — and yet nothing feels whole.", "The Mask of Satisfaction"],
["Ten of Pentacles", "Prosperity, family, tradition, stability that endures beyond a lifetime.", "Broken lineage, family conflict, wealth without meaning. A legacy poisoned at its roots.", "The Legacy"],
["Page of Pentacles", "New beginnings in work or study, enthusiasm, potential. An idea ready to be cultivated.", "Procrastination, immaturity, lack of focus. Digging without knowing what you seek.", "The Unearthed Secret"],
["Knight of Pentacles", "Hard work, routine, responsibility, persistence. A long road faithfully walked.", "Stagnation, monotony, stubbornness. Movement without meaning — motion that leads nowhere.", "The Relentless Path"],
["Queen of Pentacles", "Nurturing, resourcefulness, material security. A safe harbor for growth.", "Smothering, dependence, mismanagement. Care that controls, love that consumes.", "The Gravekeeper"],
["King of Pentacles", "Wealth, stability, leadership, legacy built through diligence. The kingdom thrives because the soil is fed.", "Corruption, greed, fear of loss. A ruler who hoards instead of nurturing, forgetting what made the ground fertile.", "The Blood of the Soil"]
]
}};

let DECK = [];
let id=0;
const ROMAN=["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];
const SUIT_KEYS=['w','c','s','p'];
function cardText(l, i){ return DATA[l].CARDS[i]; } // [name, up, rev, title] of card i in language l
const textOf=c=>cardText(lang, c.id);
for(let i=0;i<78;i++){
  const major=i<22, c={id:id++, art:artSrc(i), major};
  if(major) c.num=ROMAN[i]; else c.suit=SUIT_KEYS[Math.floor((i-22)/14)];
  Object.defineProperties(c,{name:{get(){return textOf(c)[0];}}, up:{get(){return textOf(c)[1];}}, rev:{get(){return textOf(c)[2];}},
    title:{get(){return textOf(c)[3];}}});
  DECK.push(c);
}

/* ---------- language ---------- */
const UI={
ru:{title:'Таро Лидии Хаит', comeBack:'возвращайся через', whisper:'ты хочешь знать?',
  optDay:'Карта дня', optThree:'Три карты', positions:['Прошлое','Настоящее','Будущее'],
  upright:'Прямое положение', reversed:'Перевёрнутое положение', pickHint:'выбери три карты', reveal:'Узнать',
  next:'Далее', finish:'Завершить', nowYouKnow:'Теперь ты знаешь',
  deckOne:'Эта карта — из колоды <b>Bloody Feast Tarot</b>: все 78 карт с авторской графикой в файле для печати на Etsy.',
  deckMany:'Эти карты — из колоды <b>Bloody Feast Tarot</b>: все 78 карт с авторской графикой в файле для печати на Etsy.',
  etsy:'Купить колоду', etsyPrint:'Колода для печати · купить на Etsy', rotate:'Поверни телефон вертикально', touchDeck:'коснись колоды', heading:'Таро «Кровавый пир» от Лидии Хаит', share:'Поделиться', gather:'Собрать колоду', onceMore:'<span class="ic">↺</span> Ещё раз',
  again:'↺ Новое гадание', saved:'Картинка сохранена — её можно выложить в сторис',
  storyDay:'КАРТА ДНЯ', storyThree:'ТРИ КАРТЫ', storyAsk:'А ЧТО ВЫПАДЕТ ТЕБЕ?',
  shareDay:name=>`Моя карта дня — ${name}.`, shareSpreadText:list=>`Мой расклад: ${list}.`,
  q:n=>`«${n}»`,
  majors:['Старших арканов нет — всё решается в повседневном, и многое в твоих руках.',
    n=>`${n} — единственный Старший аркан и главная точка расклада.`,
    'Два Старших аркана — за вопросом стоят большие перемены.',
    'Все три карты — Старшие арканы: это важный этап жизни, а не случайность.'],
  suit:(three,k)=>`${three ? 'Все три карты' : 'Две карты'} — масти ${DATA.ru.SUITS[k][0]}: в центре вопроса ${{w:'энергия и действие', c:'чувства и отношения', s:'мысли и конфликты', p:'материя и стабильность'}[k]}.`,
  sameCard:'Эта же карта',
  revs:['Все карты прямые — ничто не мешает движению.',
    n=>`${n} легла перевёрнутой — здесь энергия застревает.`,
    'Две карты перевёрнуты — сначала стоит разобраться с тем, что мешает.',
    'Все карты перевёрнуты — время посмотреть внутрь себя, прежде чем действовать.']},
en:{title:'Tarot by Lidiia Khait', comeBack:'come back in', whisper:'do you want to know?',
  optDay:'Card of the day', optThree:'Three cards', positions:['Past','Present','Future'],
  upright:'Upright', reversed:'Reversed', pickHint:'choose three cards', reveal:'Reveal',
  next:'Next', finish:'Finish', nowYouKnow:'Now you know',
  deckOne:'This card comes from the <b>Bloody Feast Tarot</b> deck: all 78 cards with original artwork in a printable file on Etsy.',
  deckMany:'These cards come from the <b>Bloody Feast Tarot</b> deck: all 78 cards with original artwork in a printable file on Etsy.',
  etsy:'Buy the deck', etsyPrint:'Printable deck · buy on Etsy', rotate:'Turn your phone upright', touchDeck:'touch the deck', heading:'Bloody Feast Tarot deck by Lidiia Khait', share:'Share', gather:'Gather the deck', onceMore:'<span class="ic">↺</span> Once more',
  again:'↺ New reading', saved:'Image saved — you can post it to your story',
  storyDay:'CARD OF THE DAY', storyThree:'THREE CARDS', storyAsk:'WHAT WILL YOU DRAW?',
  shareDay:name=>`My card of the day: ${name}.`, shareSpreadText:list=>`My spread: ${list}.`,
  q:n=>`“${n}”`,
  majors:['No Major Arcana — it all comes down to everyday matters, and much is in your hands.',
    n=>`${n} is the only Major Arcana card and the key point of the spread.`,
    'Two Major Arcana — big changes stand behind the question.',
    'All three cards are Major Arcana: this is an important stage of life, not a coincidence.'],
  suit:(three,k)=>`${three ? 'All three cards are' : 'Two cards are'} ${DATA.en.SUITS[k][0]}: the question centres on ${DATA.en.SUITS[k][1]}.`,
  sameCard:'The same card',
  revs:['All cards are upright — nothing stands in the way.',
    n=>`${n} fell reversed — this is where the energy gets stuck.`,
    'Two cards are reversed — first deal with what is holding you back.',
    'All cards are reversed — time to look within before you act.']}
};
// Line breaks: short prepositions, conjunctions and particles go to the next line with their word
// ("в доме", "и мы"), "же / ли / бы" stay with the word before, a dash never starts a line and a number
// stays with what it counts - all through non-breaking spaces, so every text (and the story picture) obeys
const NBSP='\u00A0';
function nb(s){
  if(typeof s!=='string') return s;
  const short=/(?<=^|[\s(«„“"—])(?!(?:же|ли|ль|бы)\s)([а-яёa-z]{1,2}|без|для|над|под|при|про|или|что|как|the|and|for|but)\s+/gi;
  return s.replace(short, '$1'+NBSP).replace(/\s+(же|ли|ль|бы|ж|б)(?=[\s.,!?…:;)»]|$)/gi, NBSP+'$1')
    .replace(/\s+—/g, NBSP+'—')
    .replace(/(\d)\s+(?=\S)/g, '$1'+NBSP);
}
const nbDeep=v=>typeof v==='string' ? nb(v) : typeof v==='function' ? (...a)=>nb(v(...a)) : Array.isArray(v) ? v.map(nbDeep) : v;
for(const l of Object.keys(UI)){
  DATA[l].CARDS=DATA[l].CARDS.map(row=>row.map(nb));
  for(const k in UI[l]) UI[l][k]=nbDeep(UI[l][k]);
}
let lang=(()=>{ try{ const l=localStorage.getItem('lang'); if(UI[l]) return l; }catch(e){}
  return /^ru|^uk|^be/i.test(navigator.language||'') ? 'ru' : 'en'; })();
const tr=k=>UI[lang][k];
const POSITIONS=[...UI[lang].positions];

document.fonts.ready.then(()=>document.body.classList.add('fonts-ready'));

/* ---------- particles ---------- */
const canvas=document.getElementById('dust'), ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth; canvas.height=innerHeight;}
resize(); addEventListener('resize',resize);
const P = Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.6+.3,
  vy:-(Math.random()*.25+.05), vx:(Math.random()-.5)*.15, a:Math.random()*.5+.2,
  mix:Math.random(), flash:0}));
// dust: each speck sits somewhere between grey and burgundy and now and then flares the red of the card backs
const ASH=[150,138,142], BURGUNDY=[150,38,54], FLARE=[228,36,35], FLASH_FRAMES=70;
const lerp=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  P.forEach(p=>{
    p.y+=p.vy; p.x+=p.vx+Math.sin(p.y*.01)*.1;
    if(p.y<-5){p.y=innerHeight+5; p.x=Math.random()*innerWidth;}
    if(!p.flash && Math.random()<.0003) p.flash=FLASH_FRAMES;
    const f = p.flash ? Math.sin(Math.PI*p.flash/FLASH_FRAMES) : 0; // 0 -> 1 -> 0
    if(p.flash) p.flash--;
    ctx.fillStyle=`rgb(${lerp(lerp(ASH,BURGUNDY,p.mix),FLARE,f)})`;
    ctx.globalAlpha=p.a*.8+(1-p.a*.8)*f;
    ctx.shadowColor='#e42423'; ctx.shadowBlur=6*f;
    const r=p.r*(1+.5*f);
    ctx.beginPath(); ctx.arc(p.x,p.y,r,0,7); ctx.fill();
  });
  requestAnimationFrame(tick);
}
tick();

/* ---------- flow control (GSAP-driven) ---------- */
const openingEl=document.getElementById('opening'), fanScreen=document.getElementById('fanScreen'),
  fan=document.getElementById('fan'), toast=document.getElementById('toast'),
  deckStack=document.getElementById('deckStack'), dimOverlay=document.getElementById('dimOverlay'),
  meaningPanel=document.getElementById('meaningPanel'), spreadOpts=document.getElementById('spreadOpts');
let mode='day', deckOrder=[], activeCard=null, busy=false, cardH=118, cardW=cardH*CARD_ASPECT;
// the card of the day can be drawn once a local day; the day it was drawn is kept in localStorage.
// ?test in the address lifts the lock
const DAY_LOCK=!/[?&]test\b/.test(location.search);
const dayKey=()=>{ const d=new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };
let dayDrawn=null; try{ dayDrawn=localStorage.getItem('dayDrawn'); }catch(e){}
let dayDone=DAY_LOCK && dayDrawn===dayKey();
// the date in file names: 2026-09-30
const isoDay=()=>{ const d=new Date(), p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`; };
// three-card readings are numbered afresh each day, for the names of their pictures
let spreadNo=0;
function countSpread(){
  let k={}; try{ k=JSON.parse(localStorage.getItem('spreadNo'))||{}; }catch(e){}
  spreadNo=k.day===isoDay() ? k.n+1 : 1;
  try{ localStorage.setItem('spreadNo', JSON.stringify({day:isoDay(), n:spreadNo})); }catch(e){}
}
function markDayDrawn(){ dayDrawn=dayKey(); if(DAY_LOCK) try{ localStorage.setItem('dayDrawn', dayDrawn); }catch(e){} }

// Card sounds, synthesised from filtered noise: a short tick for a card laid on cards, a swish for a card
// sliding over the deck. Browsers only let sound start after the first tap / click.
// SOUND=false switches them all off (with the sound button commented out in index.html)
const SOUND=false;
const sfx=(()=>{
  let ctx=null, noise=null, last=0;
  let on=SOUND; try{ on=localStorage.getItem('sound')!=='off'; }catch(e){}
  const init=()=>{
    if(ctx) return ctx.state==='suspended' && ctx.resume();
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
    ctx=new AC();
    noise=ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d=noise.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  };
  if(SOUND){ addEventListener('pointerdown', init, true); addEventListener('keydown', init, true); }
  const burst=({dur, freq, to=freq, q=1, gain, attack=.002, at=0})=>{
    const t=ctx.currentTime+at, src=ctx.createBufferSource(), f=ctx.createBiquadFilter(), g=ctx.createGain();
    src.buffer=noise; f.type='bandpass'; f.Q.value=q;
    f.frequency.setValueAtTime(freq, t); f.frequency.exponentialRampToValueAtTime(to, t+dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t+attack); g.gain.exponentialRampToValueAtTime(.0001, t+dur);
    src.connect(f).connect(g).connect(ctx.destination);
    src.start(t, Math.random()*(1-dur-.01)); src.stop(t+dur+.02);
  };
  const ready=()=>SOUND && on && ctx && ctx.state==='running';
  const vary=v=>v*(.85+Math.random()*.3);
  return {
    get on(){ return on; },
    set on(v){ on=v; try{ localStorage.setItem('sound', v ? 'on' : 'off'); }catch(e){} },
    tick(level=1){
      const now=performance.now(); if(!ready() || now-last<22) return; last=now;
      burst({dur:vary(.05), freq:vary(2600), q:1.1, gain:.28*level});
      burst({dur:.035, freq:vary(420), q:1.5, gain:.22*level});
    },
    slide(level=1, dur=.4){
      if(!ready()) return;
      burst({dur:vary(dur), freq:vary(2200), to:900, q:.6, gain:.1*level, attack:dur*.3});
    },
  };
})();
const soundBtn=document.getElementById('soundBtn');
if(soundBtn){
  soundBtn.classList.toggle('muted', !sfx.on);
  soundBtn.addEventListener('click', ()=>{ sfx.on=!sfx.on; soundBtn.classList.toggle('muted', !sfx.on); if(sfx.on) setTimeout(()=>sfx.tick(), 30); });
}

function showToast(msg){toast.textContent=msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1600);}

// Each spread option starts its own reading: the deck goes into the fan (once a shuffling card, if any,
// is back in the deck); portrait phones get no fan - the cards are drawn straight from the deck.
const langSwitch=document.getElementById('langSwitch'), askSub=document.getElementById('askSub'), whisper=document.getElementById('whisper');
let shufflePhase='idle'; // idle -> dealing (-> idle once the fan is dealt / the card is back on the deck)
function showStart(on){
  if(on) spreadOpts.querySelectorAll('.opt').forEach(o=>o.classList.remove('tap'));
  [askSub, spreadOpts, langSwitch, soundBtn, whisper].forEach(e=>e?.classList.toggle('gone', !on));
}
spreadOpts.querySelectorAll('.opt').forEach(o=>o.addEventListener('click', ()=>{
  if(shufflePhase!=='idle' || busy || !deckAtRest()) return;
  if(o.dataset.mode==='day' && dayDone && DAY_LOCK) return;
  mode=o.dataset.mode;
  o.classList.add('tap'); // phones: the chosen word stays red as the options fade away
  if(mode==='day') markDayDrawn(); else countSpread();
  busy=true; shufflePhase='dealing';
  askTiltPermission(); tiltDeck(0, 0, .4); deckStack.classList.remove('lit');
  showStart(false);
  afterShufflePass(()=> isPortraitMobile() ? (mode==='three' ? drawSpreadCard(0) : drawFromDeck(0))
    : (shufflePhase='idle', flyToFan()));
}));

// Shuffle: pointing at the resting deck (or holding a finger on it) shuffles it - again and again the
// top card slides out sideways until it is fully clear of the deck, and only then slides back in under
// it, so no card ever passes through another.
const DECK_REST=[{rotation:-1, x:-1, y:1}, {rotation:2, x:2, y:-1}, {rotation:0, x:0, y:0}]; // by DOM order, as in style.css
let deckHovered=false, passing=false, passSide=1, afterPass=null;
function shufflePass(){
  if(!deckHovered || !deckAtRest()){
    passing=false;
    if(afterPass){ const f=afterPass; afterPass=null; f(); }
    return;
  }
  passing=true; passSide=-passSide;
  const card=deckStack.lastElementChild, w=deckStack.offsetWidth, h=deckStack.offsetHeight;
  // far enough out that even the tilted card's corners clear the deck and the cards peeking from under it
  const rot=passSide*6, out=passSide*((w*Math.cos(.105)+h*Math.sin(.105))/2+w/2+10);
  sfx.slide(.8, .5);
  gsap.timeline({onComplete:()=>gsap.delayedCall(.15, shufflePass)})
    .to(card,{x:out, y:-4, rotation:rot, duration:.55, ease:'power2.inOut'})
    .call(()=>{
      // it is clear of the deck now, so it can go under the whole of it (below ::before) with no jump
      deckStack.prepend(card);
      [...deckStack.children].forEach((c,i)=>c.style.zIndex=i ? 2 : 0);
      [...deckStack.children].slice(1).forEach((c,i)=>gsap.to(c,{...DECK_REST[i+1], duration:.55, ease:'power2.inOut'}));
    })
    .call(()=>sfx.slide(.5, .45))
    .to(card,{...DECK_REST[0], duration:.55, ease:'power2.inOut', onComplete:()=>sfx.tick(.5)});
}
// runs `then` once the deck is whole again: at once, or when the card now out of the deck is back in
function afterShufflePass(then){ passing ? afterPass=then : then(); }
// phones: until the deck is touched in this visit, the whisper now and then gives way to "коснись колоды"
let deckTouched=false, hintShown=false;
setInterval(()=>{
  if(isDesktop() || whisper.classList.contains('gone') || (deckTouched && !hintShown)) return;
  whisper.classList.add('swap');
  setTimeout(()=>{
    hintShown=!hintShown && !deckTouched;
    whisper.textContent=tr(hintShown ? 'touchDeck' : 'whisper'); whisper.classList.remove('swap');
  }, 800);
}, 4000);
deckStack.addEventListener('pointerenter', e=>{
  deckHovered=true;
  if(e.pointerType==='touch') deckTouched=true;
  if(deckAtRest()){ deckStack.classList.add('lit'); if(!passing) shufflePass(); }
});
deckStack.addEventListener('pointerleave', ()=>{ deckHovered=false; deckStack.classList.remove('lit'); });

// the deck shrinks back from the shuffle zoom, rises by the dip and its cards fall back into their loose pose
function settleDeck(dip, onDone){
  const tl=gsap.timeline({onComplete:()=>{ shufflePhase='idle'; onDone(); }});
  tl.to(deckStack,{scale:1, y:`-=${dip}`, duration:.5, ease:'sine.inOut'}, 0);
  [...deckStack.children].forEach((img,i)=>tl.to(img,{...DECK_REST[i], duration:.5, ease:'sine.inOut'}, 0));
}

const deckAtRest=()=>shufflePhase==='idle' && !busy && !openingEl.hidden;
// The opening deck tilts after the cursor / a finger / the phone, like an opened card; the edge of
// its stacked cards shows on the sides tilted towards the viewer (--ex/--ey feed style.css)
const DECK_TILT_X=8, DECK_TILT_Y=10, deckTilt={tx:0, ty:0};
function renderDeckTilt(){
  const T=deckStack.offsetWidth*.1, {tx, ty}=deckTilt;
  deckStack.style.setProperty('--ex', (-ty/DECK_TILT_Y*T).toFixed(2)+'px');
  deckStack.style.setProperty('--ey', (T*.5+tx/DECK_TILT_X*T*.8).toFixed(2)+'px');
  gsap.set(deckStack,{rotationX:tx, rotationY:ty, transformPerspective:900});
}
// the edge of a single card lying in the upper arc (.face.back in style.css), in screen px
const FAN_EDGE={x:-1.8, y:.9};
const deckEdge=()=>({x:parseFloat(deckStack.style.getPropertyValue('--ex'))||0, y:parseFloat(deckStack.style.getPropertyValue('--ey'))||0});
function tweenDeckEdge(x, y, vars){
  const e=deckEdge();
  return gsap.to(e,{x, y, ...vars, onUpdate:()=>{
    deckStack.style.setProperty('--ex', e.x.toFixed(2)+'px'); deckStack.style.setProperty('--ey', e.y.toFixed(2)+'px');
  }});
}
function tiltDeck(nx, ny, dur=.6){
  gsap.to(deckTilt,{ty:nx*DECK_TILT_Y, tx:-ny*DECK_TILT_X, duration:dur, ease:'power2.out', overwrite:'auto', onUpdate:renderDeckTilt});
}
gsap.set(deckStack,{x:0, y:0, xPercent:-50, yPercent:-50}); // centred in % so it stays centred at any size
renderDeckTilt();

const isPortraitMobile=()=>matchMedia('(orientation: portrait)').matches &&
  (matchMedia('(pointer: coarse)').matches || innerWidth<600);

// Portrait phones: the deck stays where it is; its top card slowly slides up, then
// grows and flips face up around its vertical axis into the same pose as a card drawn from the fan.
// A real card element takes the place of the top image of the deck for this.
function drawFromDeck(dip){
  fanScreen.hidden=false;
  fan.innerHTML=''; fan.appendChild(dimOverlay); resetTable();
  const topImg=deckStack.lastElementChild, r=topImg.getBoundingClientRect();
  const card=DECK[Math.floor(Math.random()*DECK.length)];
  const el=makeCard(card, 0, 0); el.style.zIndex=1000;
  el._fromDeck={topImg, dip, rest:{x:r.left+r.width/2, y:r.top+r.height/2, rot:0, w:r.width, h:r.height, ry:0, tx:0, ty:0}};
  const s=el._state={...el._fromDeck.rest};
  const render=()=>renderCard(el,s);
  render(); fan.appendChild(el); topImg.style.visibility='hidden';
  busy=true; activeCard=el;
  const pose=openedPose(el, card);
  sfx.slide(.8, .8);
  gsap.timeline()
    .to(s,{y:s.y-s.h*.45, duration:.9, ease:'sine.in', onUpdate:render})
    // the deck would end up under the description, so it is cleared away
    .call(()=>setDim(2, el))
    .to(s,{...pose, duration:1.3, ease:'power2.out', onUpdate:render, onComplete:()=>onCardOpened(el)});
}
// the reverse; the deck then settles and the ask button comes back for the next reading (or `onBack` runs)
function returnToDeck(el, onBack){
  const {topImg, dip, rest}=el._fromDeck, s=el._state, render=()=>renderCard(el,s);
  gsap.killTweensOf(s);
  setDim(0); gsap.to(deckStack,{opacity:1, duration:.8});
  gsap.timeline()
    .to(s,{...rest, y:rest.y-rest.h*.45, duration:1.1, ease:'power2.inOut', onUpdate:render})
    .to(s,{y:rest.y, duration:.5, ease:'sine.out', onUpdate:render})
    .call(()=>{
      sfx.tick(.6); topImg.style.visibility=''; el.remove(); fanScreen.hidden=true; activeCard=null;
      settleDeck(dip, ()=>{
        if(onBack) onBack(); else endReading();
        busy=false;
      });
    });
}

// The deck flies from the velvet to the first slot of the upper arc; dealing starts from there.
function flyToFan(){
  fanScreen.hidden=false;
  const L=layoutFan(), a=L.angleStart*Math.PI/180;
  const tx=L.pivotX+L.rOuter*Math.sin(a), ty=L.pivotY-L.rOuter*Math.cos(a);
  const r=deckStack.getBoundingClientRect();
  // squeeze the loose stack into one card of exactly the fan's size so the hand-off is invisible
  const sx=cardW/deckStack.offsetWidth, sy=cardH/deckStack.offsetHeight;
  const rad=cardW*CARD_RADIUS; // the fan card's corner, in the squeezed stack's own units
  deckStack.style.willChange='transform';
  // the short delay lets the frame that laid out the fan screen pass, so the flight starts without a hitch
  const DUR=1.1, EASE='power3.inOut', DELAY=.08;
  // the stack squeezes into one fan card: its edge thins all the way to that card's own thin edge
  tweenDeckEdge(FAN_EDGE.x/sx, FAN_EDGE.y/sy, {duration:DUR, ease:EASE, delay:DELAY});
  gsap.to(deckStack.children,{rotation:0, x:0, y:0, borderRadius:`${rad/sx}px / ${rad/sy}px`,
    duration:DUR, ease:EASE, delay:DELAY});
  gsap.to(deckStack,{x:`+=${tx-(r.left+r.width/2)}`, y:`+=${ty-(r.top+r.height/2)}`,
    rotation:L.angleStart, rotationX:0, rotationY:0, scaleX:sx, scaleY:sy,
    duration:DUR, ease:EASE, delay:DELAY,
    onComplete:()=>{ deckStack.style.willChange=''; buildFan(()=>{ openingEl.hidden=true; busy=false; }); }});
}
/* Cards deal out from the common centre of two concentric arcs (a downward-opening rainbow):
   the outer band first, then the inner band. */
let fanLayout=null, dealTl=null;
function layoutFan(){
  const n=DECK.length, nOuter=Math.ceil(n/2)+10, nInner=n-nOuter;

  // Rainbow layout: two concentric arcs opening downward around one centre (pivotX,pivotY);
  // each card's centre sits on its arc. The radial distance between the arcs is one card
  // height plus the required gap of 2/3 card height, so the arcs never touch.
  const ASPECT=CARD_ASPECT, GAP=2/3, MIN_STEP=0.28; // MIN_STEP: neighbour spacing on the inner arc, in card widths
  const topMargin = document.querySelector('h1.title').getBoundingClientRect().bottom + 40;
  const bottomMargin = 24 + (parseFloat(getComputedStyle(document.documentElement).paddingBottom)||0);
  const sideMargin = 16;
  const availW=innerWidth-sideMargin*2, availH=innerHeight-topMargin-bottomMargin;
  const rad=d=>d*Math.PI/180;

  // Bounding box of both arcs for card height = 1, relative to the centre.
  const layoutFor=A=>{
    const rIn=MIN_STEP*ASPECT*(nInner-1)/rad(2*A), rOut=rIn+1+GAP;
    let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity;
    [[rIn,nInner],[rOut,nOuter]].forEach(([r,count])=>{
      for(let i=0;i<count;i++){
        const a=rad(-A+2*A*i/(count-1)), s=Math.sin(a), c=Math.cos(a);
        const x=r*s, y=-r*c;
        const ex=Math.abs(ASPECT/2*c)+Math.abs(.5*s), ey=Math.abs(ASPECT/2*s)+Math.abs(.5*c);
        minX=Math.min(minX,x-ex); maxX=Math.max(maxX,x+ex);
        minY=Math.min(minY,y-ey); maxY=Math.max(maxY,y+ey);
      }
    });
    return {A, rIn, rOut, minX, maxX, minY, maxY};
  };
  let best=null;
  for(let A=55;A<=85;A+=5){
    const L=layoutFor(A);
    L.ch=Math.min(availW/(L.maxX-L.minX), availH/(L.maxY-L.minY));
    if(!best || L.ch>best.ch) best=L;
  }
  cardH=Math.max(50, Math.min(best.ch, 200)); cardW=cardH*ASPECT;
  document.documentElement.style.setProperty('--cw', cardW+'px');
  document.documentElement.style.setProperty('--ch', cardH+'px');

  const angleStart=-best.A, angleEnd=best.A;
  const rOuter=best.rOut*cardH, rInner=best.rIn*cardH;
  const pivotX=sideMargin+(availW-(best.maxX-best.minX)*cardH)/2-best.minX*cardH;
  const pivotY=topMargin-best.minY*cardH;
  return fanLayout={nOuter, angleStart, angleEnd, rOuter, rInner, pivotX, pivotY};
}

// A card element (back + face) placed at (pivotX, pivotY); in the fan that is the arcs' centre.
function makeCard(card, pivotX, pivotY){
  const el=document.createElement('div'); el.className='fcard';
  el.style.left=pivotX+'px'; el.style.top=pivotY+'px';
  el.dataset.pivotX=pivotX; el.dataset.pivotY=pivotY;
  const inner=document.createElement('div'); inner.className='fcard-inner';
  inner.innerHTML=`<div class="face back"><img src="${IMG_BACK}"><div class="paper"></div></div><div class="face front"></div>`;
  const front=inner.querySelector('.face.front');
  if(card.art!==null){
    front.innerHTML='<img class="fart" alt=""><div class="paper"></div>';
    front.querySelector('.fart').dataset.src=card.art;
  } else {
    front.innerHTML='<div class="tface fart"><div class="tframe"></div><div class="fnum"></div><div class="ftext"></div></div>';
    front.querySelector('.fnum').textContent=card.num||'';
    front.querySelector('.ftext').textContent=card.name;
  }
  front.insertAdjacentHTML('beforeend','<div class="gloss"></div>');
  el.appendChild(inner);
  el._card=card;
  return el;
}

// a card's face is loaded only once it may be seen - pointed at, picked, drawn or opened - so dealing
// the fan does not fetch the whole deck
function loadFace(el){
  const img=el && el.querySelector('img.fart');
  // decoded right away, so the picture is ready the moment the card turns over
  if(img && !img.getAttribute('src')){ img.onload=()=>img.classList.add('loaded'); img.src=img.dataset.src; img.decode?.().catch(()=>{}); }
}

function buildFan(onReady){
  hoverCard=null; fan.innerHTML=''; fan.appendChild(dimOverlay); resetTable();
  meaningPanel.classList.remove('show'); finale.classList.remove('show');
  deckOrder=[...DECK.keys()];
  for(let i=deckOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deckOrder[i],deckOrder[j]]=[deckOrder[j],deckOrder[i]];}
  const {nOuter, angleStart, angleEnd, rOuter, rInner, pivotX, pivotY} = fanLayout || layoutFan();

  // A single "mover" (the deck itself) glides along the upper arc, then on to the lower one;
  // every card it passes is left behind exactly where the mover was at that instant.
  const mover=document.createElement('div'); mover.className='fcard mover';
  mover.style.left=pivotX+'px'; mover.style.top=pivotY+'px'; mover.style.zIndex=999;
  mover.innerHTML=`<div class="fcard-inner"><div class="face back"><img src="${IMG_BACK}"><div class="paper"></div></div></div>`;
  fan.appendChild(mover);
  // the deck landed on the first slot of the upper arc
  const pop={a:angleStart,r:rOuter};
  const setMover=()=>{ mover.style.transform=`rotate(${pop.a}deg) translateY(-${pop.r}px)`; };
  setMover();

  // cards are dropped when the mover actually passes their slot, so an eased sweep stays in sync
  // the whole upper arc stacks above the lower one, so a card leaving the upper arc passes over it
  // mirrored: dealt right to left, so each card lies on its right-hand neighbour
  const dropper=(indices, radius, zBase, mirrored=false)=>{
    const n=indices.length; let next=0;
    const slotAngle=i=>{ const f=n>1 ? i/(n-1) : 0; return mirrored ? angleEnd-(angleEnd-angleStart)*f : angleStart+(angleEnd-angleStart)*f; };
    const passed=i=> mirrored ? slotAngle(i)>=pop.a-1e-6 : slotAngle(i)<=pop.a+1e-6;
    return ()=>{
      while(next<n && passed(next)){
        const slot=next++, angle=slotAngle(slot);
        const el=makeCard(DECK[indices[slot]], pivotX, pivotY);
        if(mirrored) el.classList.add('mirrored');
        el.dataset.z=zBase+slot; el.style.zIndex=el.dataset.z;
        el.dataset.angle=angle; el.dataset.radius=radius;
        el.style.transform=`rotate(${angle}deg) translateY(-${radius}px)`;
        fan.insertBefore(el, mover);
        sfx.tick(.7);
      }
    };
  };
  const outerIdx = deckOrder.slice(0, nOuter);
  const innerIdx = deckOrder.slice(nOuter);
  const dropOuter=dropper(outerIdx, rOuter, 100), dropInner=dropper(innerIdx, rInner, 0, true);
  const sweepDur=count=>Math.max(.45, count*.025);

  // wait until the mover's image is decoded, otherwise it blinks for a frame on appear
  const img=mover.querySelector('img');
  (img.decode ? img.decode().catch(()=>{}) : Promise.resolve()).then(()=>{
    onReady&&onReady();
    if(mode==='three') startSpread(true);
    const tl=dealTl=gsap.timeline({onComplete:()=>{
      dealTl=null;
      gsap.to(mover,{opacity:0,duration:.2,onComplete:()=>mover.remove()});
      if(spread) updatePickList();
    }});
    tl.to(pop,{a:angleEnd,duration:sweepDur(outerIdx.length),ease:'sine.inOut',
      onStart:dropOuter, onUpdate:()=>{ setMover(); dropOuter(); }, onComplete:dropOuter});
    // the rest of the deck steps down to the lower arc's right end and deals it back, mirroring the upper one
    tl.to(pop,{r:rInner,duration:.5,ease:'power2.inOut',onUpdate:setMover});
    tl.to(pop,{a:angleStart,duration:sweepDur(innerIdx.length),ease:'sine.inOut',
      onStart:dropInner, onUpdate:()=>{ setMover(); dropInner(); }, onComplete:dropInner});
  });
}

/* "Card of the day" interaction:
   hover - the card under the cursor slides half its length out of the arc towards the arc's
   centre, staying between its neighbours; it slides back when the cursor moves on;
   click - the card slides fully out of the arc and, right as it clears the arc, grows to fit
   the viewport minus FIT_MARGIN and flips face up around its own vertical axis. */
const FIT_MARGIN=50;
let hoverCard=null;

// While a card is animated its geometry lives in el._state = {x,y (centre), rot, w, h, ry}.
// tx, ty: the tilt of an opened card following the cursor / the phone, in degrees
function arcState(el, lift=0){
  const a=+el.dataset.angle, r=+el.dataset.radius-lift, rad=a*Math.PI/180;
  return {x:+el.dataset.pivotX+r*Math.sin(rad), y:+el.dataset.pivotY-r*Math.cos(rad),
    rot:a, w:cardW, h:cardH, ry:0, tx:0, ty:0};
}
const EDGE=.005, EDGE_PAPER='#d6cfc6', EDGE_DARK='#6f675f'; // card thickness, as a share of its width
function renderCard(el, s){
  // positioned by a transform, not left/top: those snap to whole pixels, and slow motion turns jerky
  el.style.left='0px'; el.style.top='0px';
  // a card changing size is laid out in steps (each a quarter larger than the last) and scaled in between:
  // laying out and repainting its artwork at a new size every frame is what made the motion stutter
  const lw=Math.max(8, Math.pow(1.25, Math.ceil(Math.log(s.w)/Math.log(1.25)))), k=s.w/lw;
  if(el._lw!==lw){ el._lw=lw; el.style.setProperty('--cw', lw+'px'); el.style.setProperty('--ch', lw*s.h/s.w+'px'); }
  const up=s.ry>1; if(el._up!==up){ el._up=up; el.classList.toggle('up', up); }
  const tilted=s.tx||s.ty;
  el.style.transform=`translate3d(${s.x}px,${s.y}px,0) rotate(${s.rot}deg)`+(tilted ? ` perspective(${s.h*3}px) rotateX(${s.tx}deg) rotateY(${s.ty}deg)` : '')+
    (k!==1 ? ` scale(${k.toFixed(5)})` : '');
  el.firstElementChild.style.transform=`perspective(${s.h*4}px) rotateY(${s.ry}deg)`;
  // the thickness of a face-up card: its paper edge shows on the sides tilted towards the viewer,
  // and a little along the bottom even when it lies flat, as if seen from slightly above
  const front=el.querySelector('.face.front');
  if(s.ry>90){
    // in the card's own (unscaled) pixels, so the shadow stays put while only the scale changes
    const T=lw*EDGE, dx=-(s.ty||0)/TILT_Y*T, dy=T*.45+(s.tx||0)/TILT_X*T*.8, n=Math.max(2, Math.ceil(Math.hypot(dx,dy)));
    const layers=[];
    for(let i=1;i<=n;i++) layers.push(`${(dx*i/n).toFixed(1)}px ${(dy*i/n).toFixed(1)}px 0 ${i===n?EDGE_DARK:EDGE_PAPER}`);
    const bs=layers.join(',')+`, ${dx.toFixed(1)}px ${(9+dy).toFixed(1)}px 22px rgba(20,2,2,.88)`;
    if(front._bs!==bs){ front._bs=bs; front.style.boxShadow=bs; }
  } else if(front._bs){ front._bs=''; front.style.boxShadow=''; }
  // the sheen slides across the face against the tilt and brightens with it, like light on glossy paper
  const gloss=el.querySelector('.gloss');
  if(gloss){
    gloss.style.opacity=tilted ? Math.min(1, Math.hypot(s.tx,s.ty)/6) : 0;
    gloss.style.backgroundPosition=`${50-(s.ty||0)*5}% ${50+(s.tx||0)*5}%`;
  }
}
function animateCard(el, to, vars){
  const s=el._state || (el._state=arcState(el));
  return gsap.to(s,{...to, ...vars, overwrite:true, onUpdate:()=>renderCard(el,s)});
}
function restoreInArc(el){
  delete el._state;
  el.style.left=el.dataset.pivotX+'px'; el.style.top=el.dataset.pivotY+'px';
  el.style.removeProperty('--cw'); el.style.removeProperty('--ch'); el._lw=0; el._up=false; el.classList.remove('up');
  el.style.transform=`rotate(${el.dataset.angle}deg) translateY(-${el.dataset.radius}px)`;
  el.firstElementChild.style.transform=''; el.style.zIndex=el.dataset.z;
  const front=el.querySelector('.face.front'); front.style.boxShadow=''; front._bs=''; el.classList.remove('lit');
}

// Hit-testing uses the cards' fixed slots in the arcs, not their animated positions: otherwise a
// card sliding out from under the cursor would hand the hover to its neighbour and the two would
// flicker back and forth. Only the part of the slid-out card that sticks out of the arc (where no
// slot is) keeps the hover, so it can be reached and clicked.
function inCard(s, x, y){
  const t=s.rot*Math.PI/180, dx=x-s.x, dy=y-s.y;
  const lx=dx*Math.cos(t)+dy*Math.sin(t), ly=-dx*Math.sin(t)+dy*Math.cos(t);
  return Math.abs(lx)<=s.w/2 && Math.abs(ly)<=s.h/2;
}
function cardAt(x, y){
  let best=null;
  fan.querySelectorAll('.fcard:not(.mover)').forEach(el=>{
    if((!best || +el.dataset.z>+best.dataset.z) && inCard(arcState(el), x, y)) best=el;
  });
  if(!best && hoverCard && inCard(hoverCard._state||arcState(hoverCard), x, y)) return hoverCard;
  return best;
}
let faceTimer=0;
function setHover(el){
  if(el===hoverCard) return;
  // a card picked for the spread stays slid out
  if(hoverCard){
    const prev=hoverCard; prev.classList.remove('lit');
    if(!prev.classList.contains('picked'))
      animateCard(prev, arcState(prev), {duration:.3, ease:'power2.inOut', onComplete:()=>restoreInArc(prev)});
  }
  hoverCard=el;
  // a card only swept over on the way to another is not loaded
  clearTimeout(faceTimer); if(el) faceTimer=setTimeout(()=>loadFace(el), 150);
  fan.style.cursor = el ? 'pointer' : '';
  if(el){ el.classList.add('lit'); if(!el.classList.contains('picked')) animateCard(el, arcState(el, cardH/2), {duration:.3, ease:'power2.out'}); }
}
const fanIdle=()=>!busy && !activeCard;
fan.addEventListener('pointermove', e=>{ if(fanIdle() && e.pointerType==='mouse') setHover(cardAt(e.clientX, e.clientY)); });
fan.addEventListener('pointerleave', ()=>{ if(fanIdle()) setHover(null); });
const SKIP_TIME=.4;
fan.addEventListener('click', e=>{
  // a tap while the cards are being dealt fast-forwards the dealing instead of picking a card
  if(dealTl){ dealTl.timeScale(Math.max(1, (dealTl.duration()-dealTl.time())/SKIP_TIME)); return; }
  if(!fanIdle()) return;
  const el=cardAt(e.clientX, e.clientY);
  if(el) spread ? pickCard(el) : openCard(el, el._card);
});

// Draws a random orientation for the card, fills the description and places it; returns the pose
// of the opened card (face up): card + description fit the viewport minus FIT_MARGIN, the
// description right under the card.
function openedPose(el, card){
  const reversed = Math.random()<0.5; el.dataset.reversed=reversed;
  loadFace(el); el.querySelector('.fart').classList.toggle('reversed', reversed);
  // fill the description first so its real height is known
  document.getElementById('mPos').textContent=spread ? POSITIONS[spread.i] : '';
  document.getElementById('mName').textContent=card.name;
  document.getElementById('mTitle').textContent=card.title ? tr('q')(card.title) : '';
  document.getElementById('mText').textContent=reversed?card.rev:card.up;
  fitCardHead();
  return fitAbove(meaningPanel);
}
// the name over an open card stays on one line, its letters shrinking if it is too long for the screen
const cardHead=document.getElementById('cardHead');
function fitCardHead(){
  const h=document.getElementById('mName'); h.style.fontSize=h.style.letterSpacing='';
  for(let f=19; f>=12 && cardHead.offsetWidth>innerWidth-28; f-=.5){ h.style.fontSize=f+'px'; h.style.letterSpacing=f*.15+'px'; }
}
// the name takes the title's place for as long as the description is shown
new MutationObserver(()=>document.body.classList.toggle('card-open', meaningPanel.classList.contains('show')))
  .observe(meaningPanel, {attributes:true, attributeFilter:['class']});
// pose of a face-up card that, together with `panel` right under it, fits the viewport minus FIT_MARGIN
function fitAbove(panel){
  const GAP=16, panelH=panel.offsetHeight, ASPECT=CARD_ASPECT;
  // the title (or, over an open card, its name) stays above the scene, so the card must keep clear of it
  const head=panel===meaningPanel || document.body.classList.contains('car-open') ? cardHead : document.querySelector('h1.title');
  const minTop=Math.max(FIT_MARGIN, head.getBoundingClientRect().bottom+24);
  const availW=innerWidth-2*FIT_MARGIN;
  // the closing block stands on the bottom of the screen (style.css): the card is centred in the room above it
  if(panel===finale){
    const room=panel.getBoundingClientRect().top-GAP-minTop, h=Math.min(room, availW/ASPECT), w=h*ASPECT;
    return {x:innerWidth/2, y:minTop+room/2, rot:0, w, h, ry:180, tx:0, ty:0};
  }
  const availH=innerHeight-minTop-FIT_MARGIN-GAP-panelH;
  const h=Math.min(availH, availW/ASPECT), w=h*ASPECT;
  const top=Math.max(minTop, (innerHeight-(h+GAP+panelH))/2);
  panel.style.top=(top+h+GAP)+'px'; panel.style.bottom='auto';
  return {x:innerWidth/2, y:top+h/2, rot:0, w, h, ry:180, tx:0, ty:0};
}

function openCard(el, card){
  busy=true; activeCard=el; hoverCard=null; fan.style.cursor='';
  const pose=openedPose(el, card);

  // slide fully out of the arc, then - without stopping - grow, straighten and flip
  const s=el._state || (el._state=arcState(el));
  const render=()=>renderCard(el,s);
  gsap.killTweensOf(s);
  gsap.timeline()
    .to(s,{...arcState(el, cardH), duration:.35, ease:'power1.in', onUpdate:render})
    .call(()=>{
      // clear of its own arc now, so rising above everything shows no jump
      el.style.zIndex=1000; sfx.slide(1, .6);
      setDim(2, el);
    })
    .to(s,{...pose, duration:1, ease:'power2.out', onUpdate:render, onComplete:()=>onCardOpened(el)});
}

/* ---------- three cards: past, present, future ----------
   Desktop: three cards are picked in the fan, open one by one, each with its description, and at last lie
   open side by side with a summary of the whole spread. Phones: each card is drawn from the deck only when
   its turn comes - the past from the bottom of the deck, the present from its middle, the future from the
   top - and put away once read; at last all three come back as a carousel. */
let spread=null; // {cards, caps, list, i: the card open now, summary, carousel}
function startSpread(desktop){
  spread={cards:[], caps:[], i:0};
  if(!desktop) return;
  POSITIONS.forEach(p=>{
    const cap=document.createElement('div'); cap.className='spread-cap';
    cap.innerHTML=`<span class="cap-pos">${p}</span><span class="cap-name"></span><span class="cap-title"></span>`;
    fan.appendChild(cap); spread.caps.push(cap);
  });
  buildPickList();
}
// a caption right under (or above) a card
function placeCap(i, x, y, above){
  const cap=spread.caps[i];
  cap.style.left=x+'px'; cap.style.top=y+'px'; cap.classList.toggle('above', above);
}
const showCaps=on=>spread && spread.caps.forEach(c=>c.classList.toggle('on', on));
// desktop: in the hollow under the lower arc, "выбери три карты", then the position of the card just picked. It stands where
// the column of all three positions with a button under it would begin; that column (kept in the layout
// but never shown) is fitted inside the circle the slid-out cards of the lower arc leave free: as big as
// fits there, as low as the screen allows
function buildPickList(){
  const {rInner, pivotX, pivotY}=fanLayout, R=rInner-cardH-8;
  const list=document.createElement('div'); list.className='pick-list';
  list.innerHTML=`<div class="pick-hint"><span class="pick-word pick-ask">${tr('pickHint')}</span>${POSITIONS.map(p=>`<span class="pick-word">${p}</span>`).join('')}</div>`+
    POSITIONS.map(p=>`<div class="pick-line">${p}</div>`).join('')+`<div class="pick-go">${tr('reveal')}</div>`;
  list.style.left=pivotX+'px';
  fan.appendChild(list); spread.list=list;
  const rows=[...list.querySelectorAll('.pick-line, .pick-go')];
  for(let f=30;f>=11;f--){
    list.style.fontSize=f+'px';
    const H=list.offsetHeight, top=Math.min(innerHeight-Math.max(32, innerHeight*.045), pivotY+R*.35)-H;
    list.style.top=top+'px';
    // the top corners of every row must lie inside the free circle
    if(rows.every(r=>Math.hypot(r.offsetWidth/2, pivotY-(top+r.offsetTop))<=R)) break;
  }
  // a touch larger than the fit, growing upwards from the same bottom line
  const bottom=list.offsetTop+list.offsetHeight;
  list.style.fontSize=parseFloat(list.style.fontSize)+2+'px';
  list.style.top=bottom-list.offsetHeight+'px';
}
function updatePickList(){
  const n=spread.cards.length, list=spread.list;
  list.classList.add('on');
  list.querySelectorAll('.pick-word').forEach((w,i)=>w.classList.toggle('on', i===n)); // the hint, then each position as its card is picked
  // the reading opens by itself a moment after the last card is picked, unless one is put back meanwhile
  spread.go?.kill(); spread.go=null;
  if(n===POSITIONS.length) spread.go=gsap.delayedCall(2, ()=>{
    spread.go=null; if(busy) return;
    busy=true; setHover(null); list.classList.remove('on');
    // the fan is cleared away first; under the velvet the past rises above it and comes back out of it
    // opening, so with no neighbours left it needs no sliding out of its arc
    const first=spread.cards[0];
    setDim(2, first, ()=>{
      first.style.transition='none'; first.style.opacity='0'; first.style.zIndex=1000;
      first.offsetWidth; first.style.transition=''; first.style.opacity='';
      openSpreadCard(0);
    });
  });
}
// desktop: a picked card stays slid out of the arc; picked again, it goes back
function pickCard(el){
  const k=spread.cards.indexOf(el);
  if(k>=0){ spread.cards.splice(k,1); el.classList.remove('picked'); updatePickList(); return; }
  if(spread.cards.length>=POSITIONS.length) return;
  spread.cards.push(el); el.classList.add('picked'); loadFace(el); sfx.slide(.5, .25);
  if(hoverCard!==el) animateCard(el, arcState(el, cardH/2), {duration:.3, ease:'power2.out'});
  updatePickList();
}
// phones: the card of position i is drawn - the future slides up off the top of the deck; the past slides
// out from under the whole deck and the present from between its cards, both downwards until clear of it,
// and only then rise above it and open
function drawSpreadCard(i){
  busy=true;
  if(!spread){
    fanScreen.hidden=false; fan.innerHTML=''; fan.appendChild(dimOverlay); resetTable();
    startSpread(false);
  }
  const r=deckStack.lastElementChild.getBoundingClientRect();
  const rest={x:r.left+r.width/2, y:r.top+r.height/2, rot:0, w:r.width, h:r.height, ry:0, tx:0, ty:0};
  const used=spread.cards.map(c=>c._card), pool=DECK.filter(c=>!used.includes(c));
  const el=makeCard(pool[Math.floor(Math.random()*pool.length)], 0, 0);
  el.classList.add('picked'); el._fromDeck={topImg:null, dip:0, rest}; loadFace(el);
  const s=el._state={...rest};
  spread.cards.push(el);
  const place=()=>{ el.style.zIndex=1000; renderCard(el,s); fan.appendChild(el); };
  if(i===POSITIONS.length-1){
    place(); sfx.slide(.8, .8);
    gsap.to(s,{y:s.y-s.h*.45, duration:.9, ease:'sine.in', onUpdate:()=>renderCard(el,s), onComplete:()=>openSpreadCard(i)});
    return;
  }
  // a copy of a deck card stands in for it while it is still inside the deck: under all of it (z 0, before
  // the bottom card) or between the rest of the deck (::before, z 1) and the cards on top (z 2)
  const out=(rest.h*Math.cos(.07)+rest.w*Math.sin(.07))/2+rest.h/2+10;
  const c=deckStack.firstElementChild.cloneNode(true);
  if(i===0){ deckStack.prepend(c); c.style.zIndex=0; } else { deckStack.append(c); c.style.zIndex=1; }
  gsap.set(c,{x:0, y:0, rotation:0}); sfx.slide(.8, .9);
  const to=i===0 ? {x:0, y:out, rotation:4} : {x:rest.w*.2, y:out, rotation:-4};
  gsap.to(c,{...to, duration:1.1, ease:'power2.inOut', onComplete:()=>{
    Object.assign(s,{x:rest.x+to.x, y:rest.y+to.y, rot:to.rotation});
    c.remove(); place(); openSpreadCard(i);
  }});
}
// a card of the spread grows out of its place and opens, the rest of the table is cleared away
function openSpreadCard(i){
  const el=spread.cards[i]; spread.i=i;
  busy=true; activeCard=el;
  setDim(2, el); showCaps(false); el.classList.remove('lit');
  if(el.classList.contains('away')) fadeInCard(el);
  const s=el._state, pose=openedPose(el, el._card), render=()=>renderCard(el,s), tl=gsap.timeline();
  gsap.killTweensOf(s);
  // desktop: the fan is cleared away by now, so the card opens right where it lies
  tl.call(()=>{ el.style.zIndex=1000; sfx.slide(1, .7); })
    .to(s,{...pose, duration:1.3, ease:'power2.inOut', onUpdate:render, onComplete:()=>onCardOpened(el)});
}
// "Далее": desktop - the open card lies back face up just out of its arc slot and the next one opens;
// phones - it is put away off the screen, the deck comes back out of the dark and the next one is drawn
function nextSpreadCard(){
  busy=true; const el=activeCard, s=el._state, render=()=>renderCard(el,s);
  meaningPanel.classList.remove('show'); hideBigName(); el.classList.remove('lit');
  gsap.killTweensOf(s);
  if(!el._fromDeck) setDim(1, el);
  if(el._fromDeck){
    gsap.to(s,{x:-s.w*.7, rot:-14, tx:0, ty:0, duration:.8, ease:'power2.in', onUpdate:render, onComplete:()=>{
      el.style.visibility='hidden';
      setDim(0); gsap.to(deckStack,{opacity:1, duration:.6});
      gsap.delayedCall(.7, ()=>drawSpreadCard(spread.i+1));
    }});
    return;
  }
  // on a cleared table it fades on its way back and is put away with the rest
  const cleared=tableCleared; if(cleared){ el.style.opacity='0'; fadeInCard(spread.cards[spread.i+1]); }
  gsap.to(s,{...arcState(el, cardH), ry:180, tx:0, ty:0, duration:.9, ease:'power2.inOut', onUpdate:render,
    onComplete:()=>{ el.style.zIndex=900; if(cleared){ el.classList.add('away'); el.style.opacity=''; } openSpreadCard(spread.i+1); }});
}
// "Завершить": desktop - all three lie open side by side, captioned, above the summary and the way to the
// shop; phones - the carousel
function showSpreadSummary(){
  busy=true; const el=activeCard, els=spread.cards;
  meaningPanel.classList.remove('show'); hideBigName(); el.classList.remove('lit');
  setFinale(els);
  if(el._fromDeck){ showCarousel(); return; }
  const poses=fitRow(finale, els.length);
  els.forEach((c,i)=>{
    const s=c._state; gsap.killTweensOf(s); c.classList.remove('dim');
    // the cards put away come back
    if(+c.style.zIndex<1000) c.style.zIndex=1000+i;
    if(c.classList.contains('away')) fadeInCard(c);
    spread.caps[i].querySelector('.cap-name').textContent=c._card.name;
    spread.caps[i].querySelector('.cap-title').textContent=c._card.title ? tr('q')(c._card.title) : '';
    spread.caps[i].style.width=poses[i].w*1.1+'px'; // a long name wraps instead of running into the next one
    placeCap(i, poses[i].x, poses[i].y-poses[i].h/2-10, true);
    gsap.to(s,{...poses[i], duration:1, delay:.08*i, ease:'power2.inOut', onUpdate:()=>renderCard(c,s)});
  });
  // captions of one height, so the positions line up whether or not a card has a title
  spread.caps.forEach(c=>c.style.height='');
  const capH=Math.max(...spread.caps.map(c=>c.offsetHeight));
  spread.caps.forEach(c=>c.style.height=capH+'px');
  gsap.delayedCall(1.2, ()=>{ spread.summary=true; showCaps(true); finale.classList.add('show'); busy=false; });
}
// phones: the three cards lie face up in a small stack, the past on top; a swipe to the left (or a tap)
// slides the top card out sideways until it is clear of the stack and tucks it in under it, a swipe to the
// right pulls the bottom card out the other way and lays it on top - the description follows the top card
const fCard=document.getElementById('fCard');
function showCarousel(){
  const els=spread.cards;
  fCard.hidden=false; document.body.classList.add('car-open');
  // the description block keeps the height of the longest one, so nothing moves as the cards change
  fCard.style.minHeight='';
  const hMax=Math.max(...els.map(c=>{ fillCarouselText(c); return fCard.offsetHeight; }));
  fCard.style.minHeight=hMax+'px';
  fillCarouselText(els[0]);
  spread.carousel={order:els.map((_,i)=>i), pose:fitAbove(finale)};
  // they come back from where they were put away, the bottom of the stack first
  els.forEach(c=>{ c.classList.remove('dim', 'away'); c.style.visibility=''; });
  spread.carousel.order.forEach((j,d)=>{
    const c=els[j], s=c._state; c.style.zIndex=1000-d;
    gsap.killTweensOf(s);
    gsap.to(s,{...stackPose(d), duration:1, delay:(els.length-1-d)*.15, ease:'power2.out', onUpdate:()=>renderCard(c,s)});
  });
  fillCarouselText(els[0]); activeCard=els[0];
  fan.classList.add('carousel'); placeCarArrows();
  gsap.delayedCall(1.4, ()=>{ spread.summary=true; finale.classList.add('show'); busy=false; gsap.delayedCall(.6, peekStack); });
}
// the arrows stand in the margins just beside the stack, level with its middle
const carPrev=document.getElementById('carPrev'), carNext=document.getElementById('carNext');
function placeCarArrows(){
  const P=spread.carousel.pose, d=Math.min(P.w/2+46, innerWidth/2-22);
  carPrev.style.left=P.x-d+'px'; carNext.style.left=P.x+d+'px';
  carPrev.style.top=carNext.style.top=P.y+'px';
}
carPrev.addEventListener('click', ()=>spread?.carousel && turnStack(-1));
carNext.addEventListener('click', ()=>spread?.carousel && turnStack(1));
// once, as the stack is laid out, its top card slides a little aside and back: the cards can be turned
function peekStack(){
  const C=spread?.carousel; if(!C || busy) return;
  const c=spread.cards[C.order[0]], s=c._state, P=C.pose, render=()=>renderCard(c,s);
  busy=true;
  gsap.timeline({onComplete:()=>{ busy=false; }})
    .to(s,{x:P.x-P.w*.3, y:P.y-4, rot:-6, duration:.5, ease:'power2.out', onUpdate:render})
    .to(s,{...stackPose(0), duration:.6, ease:'power2.inOut', onUpdate:render});
}
// depth 0 is the top card; the ones under it lie a little askew, so their edges show
function stackPose(d){
  const P=spread.carousel.pose, SKEW=[[0,0,0],[4,.03,2],[-3.5,-.03,4]][d];
  return {...P, rot:SKEW[0], x:P.x+P.w*SKEW[1], y:P.y+SKEW[2]};
}
function fillCarouselText(el){
  const card=el._card, rev=el.dataset.reversed==='true';
  document.getElementById('fPos').textContent=POSITIONS[spread.cards.indexOf(el)];
  document.getElementById('fName').textContent=document.getElementById('mName').textContent=card.name;
  fitCardHead();
  document.getElementById('fTitle').textContent=card.title ? tr('q')(card.title) : '';
  document.getElementById('fText').textContent=rev ? card.rev : card.up;
}
// dir 1: the top card goes under the stack; -1: the bottom card comes on top
function turnStack(dir){
  if(busy) return;
  busy=true;
  const C=spread.carousel, els=spread.cards, n=C.order.length, P=C.pose;
  const j=dir>0 ? C.order[0] : C.order[n-1], c=els[j], s=c._state, render=()=>renderCard(c,s);
  C.order=dir>0 ? [...C.order.slice(1), j] : [j, ...C.order.slice(0, -1)];
  // far enough out that the tilted card clears the stack
  const out=(P.w*Math.cos(.14)+P.h*Math.sin(.14))/2+P.w/2+12, side=dir>0 ? -1 : 1;
  const mName=document.getElementById('mName');
  gsap.to([fCard, mName],{opacity:0, duration:.3});
  gsap.killTweensOf(s);
  gsap.timeline({onComplete:()=>{
      activeCard=els[C.order[0]]; fillCarouselText(activeCard);
      gsap.to([fCard, mName],{opacity:1, duration:.4}); busy=false;
    }})
    .to(s,{x:P.x+side*out, y:P.y-6, rot:side*8, duration:.5, ease:'power2.inOut', onUpdate:render})
    .call(()=>{
      // clear of the stack now: it changes sides with no jump, and the others settle into their new depths
      C.order.forEach((k,d)=>{
        els[k].style.zIndex=1000-d;
        if(k===j) return;
        const o=els[k], os=o._state;
        gsap.to(os,{...stackPose(d), duration:.5, ease:'power2.inOut', onUpdate:()=>renderCard(o,os)});
      });
    })
    .to(s,{...stackPose(C.order.indexOf(j)), duration:.5, ease:'power2.inOut', onUpdate:render});
}
let swipeX=null;
fan.addEventListener('pointerdown', e=>{ if(spread?.carousel) swipeX=e.clientX; });
fan.addEventListener('pointerup', e=>{
  if(!spread?.carousel || swipeX===null) return;
  const dx=e.clientX-swipeX; swipeX=null;
  if(Math.abs(dx)>40) turnStack(dx<0 ? 1 : -1);
  else if(inCard(spread.cards[spread.carousel.order[0]]._state, e.clientX, e.clientY)) turnStack(1);
});
// poses of n face-up cards side by side that, with their captions above and `panel` under them, fit the viewport
function fitRow(panel, n){
  const GAP=16, CAP=66, SP=.14, side=isPortraitMobile() ? 16 : FIT_MARGIN;
  const minTop=Math.max(FIT_MARGIN, document.querySelector('h1.title').getBoundingClientRect().bottom+24)+CAP;
  // the panel (the closing block) stands on the bottom of the screen: the row is centred in the room above it
  const room=panel.getBoundingClientRect().top-GAP-minTop, availW=innerWidth-2*side;
  const h=Math.min(room, availW/(CARD_ASPECT*(n+(n-1)*SP))), w=h*CARD_ASPECT;
  const top=minTop+(room-h)/2;
  return [...Array(n)].map((_,i)=>({x:innerWidth/2+(i-(n-1)/2)*w*(1+SP), y:top+h/2, rot:0, w, h, ry:180, tx:0, ty:0}));
}
// a few words on the spread as a whole: how many Major Arcana, a repeated suit, how many reversed cards
function spreadSummary(els){
  const cards=els.map(e=>e._card), out=[], say=(line,n)=>typeof line==='function' ? line(n) : line;
  const majors=cards.filter(c=>c.major), revs=els.filter(e=>e.dataset.reversed==='true');
  out.push(say(tr('majors')[majors.length], majors[0] && tr('q')(majors[0].name)));
  const suits={}; cards.forEach(c=>c.suit && (suits[c.suit]=(suits[c.suit]||0)+1));
  const [suit, count]=Object.entries(suits).sort((a,b)=>b[1]-a[1])[0] || [];
  if(count>=2) out.push(tr('suit')(count===3, suit));
  out.push(say(tr('revs')[revs.length],
    majors.length===1 && revs[0]?._card===majors[0] ? tr('sameCard') : revs[0] && tr('q')(revs[0]._card.name)));
  return out.join(' ');
}

// The table around `except`: 0 in view, 1 half veiled (desktop spreads: a card on its way), 2 cleared away -
// the velvet covers it, the fan (or on phones the deck) leaves the page under it, and the velvet fades
// again, so an open card lies over the live background of the start screen. Once cleared, it stays so
// until level 0 brings it back the same way.
let tableCleared=false;
function setDim(level, except, onCovered){
  document.querySelectorAll('.fcard').forEach(c=>c.classList.toggle('dim', level>0 && c!==except));
  dimOverlay.classList.toggle('on', level>0);
  if(level===2 && !tableCleared){
    tableCleared=true;
    gsap.to(dimOverlay,{opacity:1, duration:.7, ease:'sine.inOut', overwrite:true, onComplete:()=>{
      if(!tableCleared) return;
      fan.querySelectorAll('.fcard').forEach(c=>{ if(c!==activeCard && c!==except) c.classList.add('away'); });
      if(!openingEl.hidden) gsap.set(deckStack,{opacity:0});
      onCovered?.();
      gsap.to(dimOverlay,{opacity:0, duration:.9, ease:'sine.inOut'});
    }});
  } else if(level===1 && !tableCleared){
    gsap.to(dimOverlay,{opacity:.6, duration:.8, ease:'sine.inOut', overwrite:true});
  } else if(level===0){
    const away=[...fan.querySelectorAll('.fcard.away')].filter(c=>!spread?.cards.includes(c));
    tableCleared=false;
    if(!away.length){ gsap.to(dimOverlay,{opacity:0, duration:.8, ease:'sine.inOut', overwrite:true}); return; }
    gsap.to(dimOverlay,{opacity:1, duration:.4, ease:'sine.inOut', overwrite:true, onComplete:()=>{
      away.forEach(c=>c.classList.remove('away'));
      gsap.to(dimOverlay,{opacity:0, duration:.8, ease:'sine.inOut'});
    }});
  }
}
// a card put away with the table comes back, fading in
function fadeInCard(el){
  el.style.opacity='0'; el.classList.remove('away'); el.offsetWidth; el.style.opacity='';
}
// a new fan or a new draw: nothing is veiled or put away
function resetTable(){
  tableCleared=false; gsap.killTweensOf(dimOverlay); gsap.set(dimOverlay,{opacity:0}); dimOverlay.classList.remove('on');
}

const isDesktop=()=>matchMedia('(hover:hover) and (pointer:fine)').matches;

// The card lies open: its description surfaces, and on desktop its name, huge, behind it.
function onCardOpened(el){
  setEndRow(spread && spread.i<POSITIONS.length-1);
  if(spread && !el._fromDeck) setDim(2, el);
  meaningPanel.classList.add('show'); busy=false;
  inkReveal(document.getElementById('mName'), {delay:.3});
  const mTitle=document.getElementById('mTitle'); if(mTitle.textContent) inkReveal(mTitle, {delay:.45});
  const mText=document.getElementById('mText'), words=mText.textContent.trim().split(/\s+/).length;
  inkReveal(mText, {byWord:true, delay:.6, stagger:.03, dur:.7});
  revealEnd(Math.max(.6+.03*(words-1)+.7, showBigName(el)||0));
}

// "Теперь ты знаешь" and the way out appear only once everything above has surfaced
const endPhrase=document.getElementById('endPhrase'), endRule=document.getElementById('endRule');
// between the cards of a spread there is only the way on to the next one
function setEndRow(next){
  endPhrase.style.display=endRule.style.display=next ? 'none' : '';
  document.querySelector('#finishBtn .fill').textContent=tr(next ? 'next' : 'finish');
}
function revealEnd(at){
  const btn=document.getElementById('finishBtn');
  gsap.killTweensOf([endRule, btn]);
  gsap.set(btn,{autoAlpha:0}); gsap.set(endRule,{scaleY:0}); btn.classList.remove('tap');
  inkReveal(endPhrase, {delay:at, stagger:.035, dur:.7});
  gsap.to(endRule,{scaleY:1, duration:.45, ease:'power2.out', delay:at+.5});
  gsap.fromTo(btn,{x:-10},{autoAlpha:1, x:0, duration:.6, ease:'power2.out', delay:at+.75});
}

// Text surfaces like ink soaking into paper: letter by letter (or word by word), first blurred and
// red, then sharp in its own colour. Words are kept unbreakable so a line never wraps mid-word.
function inkReveal(el, {byWord=false, delay=0, stagger=.05, dur=.9}={}){
  const text=el.textContent, color=getComputedStyle(el).color, units=[];
  el.textContent='';
  // split at ordinary spaces only: words joined by a non-breaking space stay one unbreakable unit
  text.split(/([ \t\n]+)/).forEach(tok=>{
    if(!tok) return;
    if(/^[ \t\n]+$/.test(tok)){ el.appendChild(document.createTextNode(tok)); return; }
    const w=document.createElement('span'); w.className='ink-word';
    if(byWord){ w.textContent=tok; units.push(w); }
    else [...tok].forEach(ch=>{ const c=document.createElement('span'); c.className='ink'; c.textContent=ch; w.appendChild(c); units.push(c); });
    el.appendChild(w);
  });
  const red=getComputedStyle(document.body).getPropertyValue('--red').trim();
  gsap.fromTo(units, {opacity:0, filter:'blur(6px)', color:red},
    {opacity:1, filter:'blur(0px)', color, duration:dur, stagger, delay, ease:'sine.out', clearProps:'filter,color'});
}

// desktop: the name of the opened card, set huge right across the screen. It surfaces in front of the
// card, then sinks through it and stays behind it, darkening into the background so as not to compete
// with the card's artwork
const bigName=document.createElement('div'); bigName.className='big-name';
const BIG_FRONT=1001, BIG_BEHIND=950; // the opened card is at z 1000
const BIG_DIM='rgba(0,0,0,.55)'; // behind the card: a shadow pressed into the velvet
// It is drawn twice, behind and in front of the card; the front copy fades as the name sinks, so the
// letters over the card dissolve into it gradually instead of jumping behind it
let bigFront=null;
function showBigName(el){
  if(!isDesktop()) return;
  const s=el._state;
  if(bigFront){ gsap.killTweensOf(bigFront); bigFront.remove(); }
  bigName.textContent=el._card.name; bigName.style.letterSpacing=''; bigName.style.paddingLeft='';
  gsap.killTweensOf(bigName); bigName.style.color='';
  bigName.style.zIndex=BIG_BEHIND;
  const FRONT=1.1; // its scale while in front of the card; it ends at 1
  fan.appendChild(bigName);
  // it spans the whole visible width: sized to it, up to 60% of the card's height; a shorter name has
  // its letters spread out to the full width
  const FILL=innerWidth*.96, n=bigName.textContent.length;
  bigName.style.fontSize='100px';
  bigName.style.fontSize=Math.min(s.h*.6, 100*FILL/bigName.scrollWidth)+'px'; bigName.style.top=s.y+'px';
  if(bigName.scrollWidth<FILL && n>1){
    const sp=(FILL-bigName.scrollWidth)/(n+1);
    bigName.style.letterSpacing=sp+'px'; bigName.style.paddingLeft=sp+'px'; // balances the space after the last letter
  }
  bigFront=bigName.cloneNode(true); bigFront.style.zIndex=BIG_FRONT; fan.appendChild(bigFront);
  const both=[bigName, bigFront];
  gsap.set(both,{opacity:1, x:0, y:0, xPercent:-50, yPercent:-50, scale:FRONT});
  const STAGGER=.07, DUR=1.1, letters=bigName.textContent.replace(/\s/g,'').length, recede=.1+STAGGER*letters;
  // the copy behind the card surfaces straight into the dark colour it keeps there, so as the name sinks
  // through the card its letters are already darkening
  bigName.style.color=BIG_DIM;
  both.forEach(b=>inkReveal(b, {delay:.1, stagger:STAGGER, dur:DUR}));
  // as soon as the last letter starts to surface the name recedes through the card, so the letters
  // finish sharpening behind it
  gsap.to(both,{scale:1, duration:1.4, ease:'power1.inOut', delay:recede});
  gsap.to(bigFront,{opacity:0, duration:1.1, ease:'sine.inOut', delay:recede+.15});
  return recede+1.4;
}
function hideBigName(){
  [bigName, bigFront].forEach(b=>{
    if(!b || !b.isConnected) return;
    gsap.killTweensOf(b); gsap.to(b,{opacity:0, duration:.5, onComplete:()=>b.remove()});
  });
}

// desktop, closing screen: a few more cards of the deck fan out from behind the card of the day;
// each is a way to the shop
let showcase=[];
function showShowcase(el){
  if(!isDesktop()) return;
  const s=el._state, others=DECK.filter(c=>c!==el._card);
  for(let i=others.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [others[i],others[j]]=[others[j],others[i]]; }
  const picks=others.slice(0,4);
  let h=s.h*.62, w=h*CARD_ASPECT;
  const k=Math.min(1, (innerWidth/2-16-s.w/2-24)/(1.6*w)); // the outer ones must stay in view
  if(k<.55) return;
  h*=k; w*=k;
  [-1,1,-2,2].forEach((side,i)=>{
    const card=picks[i]; if(!card) return;
    const far=Math.abs(side)-1, dir=Math.sign(side);
    const c=makeCard(card, 0, 0); c.classList.add('showcase'); c.title=tr('etsy'); loadFace(c);
    c.style.zIndex=990-far;
    c.addEventListener('click', ()=>window.open(document.getElementById('etsyBtn').href, '_blank', 'noopener'));
    c._state={x:s.x, y:s.y, rot:0, w, h, ry:180, tx:0, ty:0};
    c._home={x:s.x+dir*(s.w/2+24+w*(.35+.75*far)), y:s.y+h*(.05+.1*far), rot:dir*(5+8*far), dir, i};
    renderCard(c, c._state); fan.appendChild(c); showcase.push(c);
    fanOutCard(c, .15*i);
  });
}
// a showcase card glides from behind the card of the day to its place, then sways there
function fanOutCard(c, delay=0){
  const cs=c._state, {x, y, rot, dir, i}=c._home, render=()=>renderCard(c,cs);
  gsap.killTweensOf(cs);
  gsap.to(cs,{x, y, rot, duration:1, delay, ease:'power2.out', onUpdate:render,
    onComplete:()=>gsap.to(cs,{y:y-7, rot:rot+dir*1.2, duration:3+i*.45, ease:'sine.inOut', yoyo:true, repeat:-1, onUpdate:render})});
}
function tuckCard(c, then){
  const s=activeCard._state, cs=c._state;
  gsap.killTweensOf(cs);
  gsap.to(cs,{x:s.x, y:s.y, rot:0, duration:.6, ease:'power2.inOut', onUpdate:()=>renderCard(c,cs), onComplete:then});
}

// desktop: pointing at "Поделиться картой" previews what gets shared - the showcase slips under the card
// of the day, which straightens up, holds still and shows its pure white
let sharePreview=false;
const shareBtnEl=document.getElementById('shareBtn');
shareBtnEl.addEventListener('pointerenter', e=>{
  if(e.pointerType!=='mouse' || !activeCard || busy || spread) return;
  sharePreview=true;
  const el=activeCard, s=el._state;
  gsap.to(s,{tx:0, ty:0, duration:.5, ease:'power2.out', overwrite:'auto', onUpdate:()=>renderCard(el,s)});
  el.classList.add('lit');
  showcase.forEach(c=>tuckCard(c));
});
shareBtnEl.addEventListener('pointerleave', ()=>{
  if(!sharePreview) return;
  sharePreview=false;
  if(activeCard) activeCard.classList.remove('lit');
  showcase.forEach((c,k)=>fanOutCard(c, .08*k));
});
// the showcase slips under the card of the day and is gone; `then` runs once all of it is under
function hideShowcase(then){
  sharePreview=false;
  const cards=showcase; showcase=[];
  if(!cards.length){ then&&then(); return; }
  let left=cards.length;
  cards.forEach(c=>tuckCard(c, ()=>{ c.remove(); if(--left===0 && then) then(); }));
}

// An opened card tilts after the cursor (desktop), under a finger dragging over the screen, or with the
// phone itself; nx, ny in -1..1
const TILT_X=7, TILT_Y=9, clamp1=v=>Math.max(-1, Math.min(1, v));
function tiltTo(nx, ny, dur=.5){
  const el=activeCard; if(!el || busy || !el._state || spread?.summary) return;
  const s=el._state;
  gsap.to(s,{ty:nx*TILT_Y, tx:-ny*TILT_X, duration:dur, ease:'power2.out', overwrite:'auto', onUpdate:()=>renderCard(el,s)});
}
const fpCursor=on=>document.documentElement.classList.toggle('fp-cursor', on);
window.addEventListener('pointermove', e=>{
  if(!activeCard){
    fpCursor(false);
    if(!deckAtRest() || (e.pointerType==='touch' && !e.buttons)) return;
    const r=deckStack.getBoundingClientRect();
    tiltDeck(clamp1((e.clientX-r.left-r.width/2)/(r.width*1.6)), clamp1((e.clientY-r.top-r.height/2)/(r.height*1.1)));
    return;
  }
  if(spread?.summary){ // the open spread: the card under the cursor lights up and its meaning replaces the summary
    let over=null;
    spread.cards.forEach(c=>{ const on=e.pointerType==='mouse' && inCard(c._state, e.clientX, e.clientY); c.classList.toggle('lit', on); if(on) over=c; });
    fpCursor(!!over);
    if(isDesktop() && !spread.carousel) showSummaryText(over); // the stack already shows its top card's meaning
    return;
  }
  const s=activeCard._state; if(!s || sharePreview) return;
  // under the cursor the warm paper of the illustration turns pure white
  const over=e.pointerType==='mouse' && inCard(s, e.clientX, e.clientY);
  activeCard.classList.toggle('lit', over); fpCursor(over);
  if(e.pointerType==='touch' && !e.buttons) return;
  tiltTo(clamp1((e.clientX-s.x)/(s.w*.9)), clamp1((e.clientY-s.y)/(s.h*.7)));
});
const untilt=()=>{ if(activeCard) tiltTo(0,0,.9); else if(deckAtRest()) tiltDeck(0,0,.9); };
document.documentElement.addEventListener('pointerleave', ()=>{ untilt(); activeCard&&activeCard.classList.remove('lit'); fpCursor(false); });
window.addEventListener('pointerup', e=>{ if(e.pointerType==='touch') untilt(); });
// the phone's pose when the card opens is neutral; the neutral slowly follows the phone, so the card
// always drifts back to lying flat
let tiltBase=null;
window.addEventListener('deviceorientation', e=>{
  const onDeck=!activeCard && deckAtRest();
  if(e.beta==null || (!onDeck && (!activeCard || busy))){ tiltBase=null; return; }
  if(!tiltBase) tiltBase={b:e.beta, g:e.gamma};
  tiltBase.b+=(e.beta-tiltBase.b)*.01; tiltBase.g+=(e.gamma-tiltBase.g)*.01;
  const nx=clamp1((e.gamma-tiltBase.g)/18), ny=clamp1((e.beta-tiltBase.b)/18);
  onDeck ? tiltDeck(nx, ny, .4) : tiltTo(nx, ny, .4);
});
// iOS lets a page read the phone's tilt only after asking, from a tap
function askTiltPermission(){
  if(isDesktop() || !window.DeviceOrientationEvent || typeof DeviceOrientationEvent.requestPermission!=='function') return;
  DeviceOrientationEvent.requestPermission().catch(()=>{});
}

/* ---------- end of a reading ---------- */
const ETSY_URL='https://illusbyme.etsy.com/il-en/listing/4487488141/bloody-feast-tarot-deck-printable-dark';
const finale=document.getElementById('finale');
// tagged so the shop's stats show visits coming from the app and which card led to them
const etsyLink=card=>`${ETSY_URL}?utm_source=tarot-app&utm_medium=${mode==='three' ? 'three-cards' : 'card-of-the-day'}&utm_content=${encodeURIComponent(card.id)}`;

// "Завершить гадание": the description gives way to the closing screen, the card makes room for it
document.getElementById('finishBtn').addEventListener('click', e=>{
  if(!activeCard || busy) return;
  // phones: the tapped button first fills with red, so the tap is seen, then does its work
  const btn=e.currentTarget;
  if(!isDesktop() && !btn._tapped){
    btn.classList.add('tap'); btn._tapped=true; busy=true;
    setTimeout(()=>{ busy=false; btn.click(); btn._tapped=false; }, 420);
    return;
  }
  if(spread){ spread.i<POSITIONS.length-1 ? nextSpreadCard() : showSpreadSummary(); return; }
  busy=true; const el=activeCard, s=el._state;
  meaningPanel.classList.remove('show');
  setFinale([el]);
  hideBigName();
  const pose=fitAbove(finale);
  gsap.killTweensOf(s);
  gsap.to(s,{...pose, duration:.7, ease:'power2.inOut', onUpdate:()=>renderCard(el,s),
    onComplete:()=>{ finale.classList.add('show'); busy=false; showShowcase(el); }});
});
document.getElementById('shareBtn').addEventListener('click', shareStory);
// the closing screen speaks of one card or of the whole spread
// the meaning of a card as it fell
const cardMeaning=el=>el.dataset.reversed==='true' ? el._card.rev : el._card.up;
// desktop spread: the summary gives way to the meaning of the card pointed at
let summaryFor=null;
function showSummaryText(el){
  if(el===summaryFor) return;
  summaryFor=el;
  const sum=document.getElementById('fSummary'), text=el ? cardMeaning(el) : spreadSummary(spread.cards);
  gsap.killTweensOf(sum);
  gsap.to(sum,{opacity:0, duration:.15, onComplete:()=>{ sum.textContent=text; sum.classList.toggle('card-text', !!el); gsap.to(sum,{opacity:1, duration:.25}); }});
}
function setFinale(els){
  const one=els.length===1, sum=document.getElementById('fSummary');
  prepareStory(els);
  document.getElementById('etsyBtn').href=etsyLink(els[0]._card);
  document.getElementById('fDeck').innerHTML=tr(one ? 'deckOne' : 'deckMany');
  document.getElementById('fDeck').hidden=!!els[0]._fromDeck && !one; // phones, three cards: room for the cards instead
  document.getElementById('etsyBtn').textContent=tr(document.getElementById('fDeck').hidden ? 'etsyPrint' : 'etsy'); // it tells of the file when that line is gone
  shareBtnEl.textContent=tr('share');
  document.getElementById('gatherBtn').innerHTML=tr(one ? 'gather' : 'onceMore');
  sum.hidden=one; sum.textContent=one ? '' : spreadSummary(els);
  sum.classList.remove('card-text'); sum.style.minHeight=''; summaryFor=null;
  // it keeps the height of the longest of those texts, so the buttons below do not jump
  if(!one && isDesktop() && !els[0]._fromDeck){
    const h=[sum.textContent, ...els.map(cardMeaning)].map((t,i)=>{
      sum.textContent=t; sum.classList.toggle('card-text', i>0); return sum.offsetHeight; });
    sum.classList.remove('card-text');
    sum.textContent=spreadSummary(els); sum.style.minHeight=Math.max(...h)+'px';
  }
  fCard.hidden=true;
}

// "Новое гадание": the card goes back where it came from - into its arc slot, or onto the deck on phones
document.getElementById('againBtn').addEventListener('click', ()=>{
  if(!activeCard || busy) return;
  busy=true; const el=activeCard;
  finale.classList.remove('show'); hideBigName();
  el.classList.remove('lit');
  // first the showcase slips under the card, then the card goes home
  hideShowcase(()=>el._fromDeck ? returnToDeck(el) : returnToArc(el));
});
// the exact reverse of opening: shrink and flip back to just outside the arc, then slide into the slot;
// the fan slowly comes back out of the dark as the card sets off
function returnToArc(el){
  const s=el._state, render=()=>renderCard(el,s);
  gsap.killTweensOf(s);
  setDim(0);
  gsap.timeline()
    .to(s,{...arcState(el, cardH), duration:.9, ease:'power2.inOut', onUpdate:render})
    .call(()=>{ el.style.zIndex=el.dataset.z; })
    .to(s,{...arcState(el), duration:.35, ease:'power2.out', onUpdate:render,
      onComplete:()=>{ restoreInArc(el); activeCard=null; busy=false; }});
}

// "Собрать колоду": the reading is over for today - the fan is gathered up the way it was dealt, backwards,
// and the deck is back on the velvet with the time left until the next card of the day
document.getElementById('gatherBtn').addEventListener('click', ()=>{
  if(!activeCard || busy) return;
  busy=true; const el=activeCard;
  finale.classList.remove('show'); hideBigName();
  el.classList.remove('lit');
  const els=spread ? spread.cards : [el];
  els.forEach(c=>c.classList.remove('lit'));
  showCaps(false); document.body.classList.remove('car-open');
  hideShowcase(()=>el._fromDeck ? tuckUnderDeck(els, endReading) : gatherDeck(els[0], els.slice(1)));
});
// portrait phones: the card of the day turns face down and goes to the bottom of the deck it was drawn
// from - like a shuffled card, it first slides out just below the deck (a narrow screen has no room
// beside it) until it is clear of it, and only then slips in under it
// Several cards (a spread) gather into one pile below the deck first and go under it together.
function tuckUnderDeck(els, onBack){
  const {topImg, dip, rest}=els[0]._fromDeck;
  const {w, h}=rest, rot=4, out=(h*Math.cos(.07)+w*Math.sin(.07))/2+h/2+10;
  // a card of the day takes back the place of the top image it was drawn as, a spread takes the top card of the deck
  const img=topImg || deckStack.lastElementChild;
  setDim(0); gsap.to(deckStack,{opacity:1, duration:.8});
  const tl=gsap.timeline();
  els.forEach((el,i)=>{
    const s=el._state; gsap.killTweensOf(s); el.classList.remove('dim', 'dim-soft', 'lit'); el.style.zIndex=1000+i;
    tl.to(s,{x:rest.x, y:rest.y+out, rot, w, h, ry:0, tx:0, ty:0, duration:1.2, ease:'power2.inOut', onUpdate:()=>renderCard(el,s)}, i*.15);
  });
  tl.call(()=>{
      // clear of the deck now: the pile becomes the deck's bottom card, still lying below it
      deckStack.prepend(img);
      [...deckStack.children].forEach((c,i)=>c.style.zIndex=i ? 2 : 0);
      gsap.set(img,{x:0, y:out, rotation:rot}); img.style.visibility='';
      els.forEach(el=>el.remove()); fanScreen.hidden=true; activeCard=null;
      [...deckStack.children].slice(1).forEach((c,i)=>gsap.to(c,{...DECK_REST[i+1], duration:.6, ease:'power2.inOut'}));
    })
    .to(img,{...DECK_REST[0], duration:.6, ease:'power2.inOut'})
    .call(()=>settleDeck(dip, ()=>{ onBack(); busy=false; }));
}
// the deck as it lies on the velvet, undoing its flight into the fan
function resetDeckStack(){
  deckStack.style.removeProperty('--edge-o');
  gsap.set(deckStack,{x:0, y:0, rotation:0, scaleX:1, scaleY:1, opacity:1});
  [...deckStack.children].forEach((c,i)=>gsap.set(c,{...DECK_REST[i], clearProps:'borderRadius'}));
  deckTilt.tx=deckTilt.ty=0; renderDeckTilt();
}
// The card of the day turns face down and is laid where the dealing ended, the left end of the lower arc.
// From there it is the pile: it slides along the lower arc picking up every card it covers, steps up to
// the upper arc's right end, sweeps it back to its left end, and flies home onto the velvet.
// The other cards of a spread (extras) land there just before it, and it covers them.
function gatherDeck(el, extras=[]){
  const s=el._state, render=()=>renderCard(el,s);
  gsap.killTweensOf(s);
  setDim(0);
  const {angleStart, angleEnd, rOuter, rInner, pivotX, pivotY}=fanLayout;
  const pop={a:angleStart, r:rInner};
  const place=()=>{ const t=pop.a*Math.PI/180; s.x=pivotX+pop.r*Math.sin(t); s.y=pivotY-pop.r*Math.cos(t); s.rot=pop.a; render(); };
  const cards=[...fan.querySelectorAll('.fcard:not(.mover)')].filter(c=>c!==el && !extras.includes(c));
  // a card is taken the moment the pile lies right over it, so it vanishes under the pile unseen
  const picker=(list, taken)=>()=>{ for(let i=list.length-1;i>=0;i--) if(taken(+list[i].dataset.angle)){ list[i].remove(); list.splice(i,1); sfx.tick(.6); } };
  const lower=cards.filter(c=>c.classList.contains('mirrored')), upper=cards.filter(c=>!c.classList.contains('mirrored'));
  const pickLower=picker(lower, a=>a<=pop.a+1e-6), pickUpper=picker(upper, a=>a>=pop.a-1e-6);
  const sweepDur=count=>Math.max(.45, count*.022);
  const t=angleStart*Math.PI/180;
  const laid={x:pivotX+rInner*Math.sin(t), y:pivotY-rInner*Math.cos(t), w:cardW, h:cardH, rot:angleStart, ry:0, tx:0, ty:0};
  const tl=gsap.timeline({onComplete:()=>flyHome(el)});
  el.style.zIndex=1000;
  extras.forEach((c,i)=>{
    const cs=c._state; gsap.killTweensOf(cs); c.style.zIndex=997+i;
    tl.to(cs,{...laid, duration:1.2, ease:'power2.inOut', onUpdate:()=>renderCard(c,cs)}, i*.12);
  });
  tl.to(s,{...laid, duration:1.2, ease:'power2.inOut', onUpdate:render}, extras.length*.12)
    .call(()=>extras.forEach(c=>c.remove()))
    .to(pop,{a:angleEnd, duration:sweepDur(lower.length), ease:'sine.inOut', onStart:pickLower, onUpdate:()=>{ place(); pickLower(); }, onComplete:pickLower})
    .to(pop,{r:rOuter, duration:.5, ease:'power2.inOut', onUpdate:place})
    .to(pop,{a:angleStart, duration:sweepDur(upper.length), ease:'sine.inOut', onStart:pickUpper, onUpdate:()=>{ place(); pickUpper(); }, onComplete:pickUpper});
}
// the reverse of the flight into the fan: the real deck takes over from the pile, squeezed to its exact
// size and pose, and unfolds back into the deck on the velvet
function flyHome(el){
  const s=el._state;
  openingEl.hidden=false; gsap.set(openingEl,{opacity:1});
  resetDeckStack();
  const r=deckStack.getBoundingClientRect(), w=deckStack.offsetWidth, h=deckStack.offsetHeight;
  const restR=getComputedStyle(deckStack.firstElementChild).borderRadius;
  const sx=cardW/w, sy=cardH/h, rad=cardW*CARD_RADIUS;
  const rest=deckEdge();
  deckStack.style.setProperty('--ex', FAN_EDGE.x/sx+'px'); deckStack.style.setProperty('--ey', FAN_EDGE.y/sy+'px');
  gsap.set(deckStack,{x:s.x-(r.left+r.width/2), y:s.y-(r.top+r.height/2), rotation:s.rot, scaleX:sx, scaleY:sy});
  gsap.set(deckStack.children,{rotation:0, x:0, y:0, borderRadius:`${rad/sx}px / ${rad/sy}px`});
  fanScreen.hidden=true; fan.innerHTML=''; fan.appendChild(dimOverlay);
  const DUR=1.2, EASE='power3.inOut';
  [...deckStack.children].forEach((c,i)=>gsap.to(c,{...DECK_REST[i], borderRadius:restR, duration:DUR, ease:EASE,
    onComplete:()=>gsap.set(c,{clearProps:'borderRadius'})}));
  tweenDeckEdge(rest.x, rest.y, {duration:DUR, ease:EASE});
  gsap.to(deckStack,{x:0, y:0, rotation:0, scaleX:1, scaleY:1, duration:DUR, ease:EASE,
    onComplete:()=>{ activeCard=null; hoverCard=null; shufflePhase='idle'; busy=false; endReading(); }});
}
// the deck is back on the velvet: after the card of the day the time left until the next one is shown
function endReading(){
  if(mode==='day') dayDone=true;
  spread=null; fan.classList.remove('carousel'); document.body.classList.remove('car-open'); fan.querySelectorAll('.spread-cap, .pick-list').forEach(e=>e.remove());
  setAskSub(); showStart(true);
}
// once the card of the day is drawn, the line under the options counts down to the next one, at local
// midnight, and the option dims and stops responding
function setAskSub(){
  const sub=askSub;
  spreadOpts.querySelector('[data-mode=day]').classList.toggle('done', dayDone);
  if(!dayDone){ sub.textContent=''; return false; }
  sub.innerHTML=`<span class="cd-phrase">${tr('comeBack')}</span>`+
    `<span class="cd-row"><span class="countdown"></span></span>`;
  tickCountdown();
  return true;
}
function tickCountdown(){
  if(dayDone && dayDrawn!==dayKey()){ dayDone=false; setAskSub(); return; }
  const cd=document.querySelector('#askSub .countdown'); if(!cd) return;
  const now=new Date(), next=new Date(now); next.setHours(24,0,0,0);
  const t=Math.floor((next-now)/1000), pad=v=>String(v).padStart(2,'0');
  cd.textContent=`${pad(Math.floor(t/3600))}:${pad(Math.floor(t/60)%60)}:${pad(t%60)}`;
}
setInterval(tickCountdown, 1000);

// A story-sized (9:16) picture of the card of the day (or of the spread) with the deck's name and shop -
// shared through the system share sheet where files can be shared (phones), otherwise downloaded.
// Everything on it stays inside the middle 4:5 (SAFE), which a post keeps when it crops the picture.
const SAFE={top:(1920-1350)/2, bottom:(1920+1350)/2};
function storyCanvas(title){
  const W=1080, H=1920, c=document.createElement('canvas'); c.width=W; c.height=H;
  const x=c.getContext('2d');
  const bg=x.createRadialGradient(W/2, H*.42, 0, W/2, H*.42, H*.7);
  bg.addColorStop(0,'#2a0a09'); bg.addColorStop(.5,'#160505'); bg.addColorStop(1,'#060202');
  x.fillStyle=bg; x.fillRect(0,0,W,H);
  // a line of text centred on cx, shrunk to fit maxW if given
  const text=(str, y, font, color, spacing=0, cx=W/2, maxW=0)=>{
    x.font=font; x.fillStyle=color; x.textAlign='center'; x.letterSpacing=spacing+'px';
    if(maxW){ const m=x.measureText(str).width; if(m>maxW) x.font=font.replace(/(\d+)px/, (_,n)=>Math.floor(n*maxW/m)+'px'); }
    x.fillText(str, cx, y);
  };
  text(title, SAFE.top+80, '500 40px Oswald', '#e9e6e1', 10);
  text('BLOODY FEAST TAROT', SAFE.bottom-92, '500 40px Oswald', '#e9e6e1', 10);
  text('illusbyme.etsy.com', SAFE.bottom-40, 'italic 500 34px "Cormorant Garamond"', '#8a8784');
  return {c, x, W, H, text};
}
// a card face (only what lies inside its cut line) at cx, cy, cw wide
async function drawStoryCard(x, card, reversed, cx, cy, cw){
  const ch=cw/CARD_ASPECT, radius=cw*CARD_RADIUS, k=cw/680;
  x.save(); x.shadowColor='rgba(0,0,0,.7)'; x.shadowBlur=60*k; x.shadowOffsetY=20*k;
  x.fillStyle='#f4f1ec'; x.beginPath(); x.roundRect(cx,cy,cw,ch,radius); x.fill(); x.restore();
  x.save(); x.beginPath(); x.roundRect(cx,cy,cw,ch,radius); x.clip();
  if(reversed){ x.translate(cx+cw/2, cy+ch/2); x.rotate(Math.PI); x.translate(-(cx+cw/2), -(cy+ch/2)); }
  if(card.art!==null){
    const img=new Image(); img.src=card.art;
    await img.decode().catch(()=>{});
    const f=img.naturalWidth/CUT.fileW;
    x.drawImage(img, CUT.left*f, CUT.top*f, CUT.w*f, CUT.h*f, cx, cy, cw, ch);
  } else {
    x.strokeStyle='#111'; x.lineWidth=3*k; x.beginPath(); x.roundRect(cx+cw*.06, cy+cw*.06, cw*.88, ch-cw*.12, cw*.05); x.stroke();
    x.textAlign='center'; x.letterSpacing='0px';
    if(card.num){ x.font=`500 ${96*k}px Oswald`; x.fillStyle='#e42423'; x.fillText(card.num, cx+cw/2, cy+ch/2-60*k); }
    x.font=`500 ${72*k}px Oswald`; x.fillStyle='#111';
    const m=x.measureText(card.name).width; if(m>cw*.8) x.font=`500 ${72*k*cw*.8/m}px Oswald`;
    x.fillText(card.name, cx+cw/2, cy+ch/2+50*k);
  }
  x.restore();
  return ch;
}
// The picture is drawn as soon as the closing screen comes up, so a tap on "Поделиться" opens the share
// sheet at once: phone browsers (Safari above all) allow it only right in the tap, not after a wait
let story=null, storyJob=null; // story: {file, title, text} once drawn
function prepareStory(els){
  story=null;
  const job=storyJob=(els.length===1 ? drawCardStory(els[0]) : drawSpreadStory(els))
    .then(d=>new Promise(r=>d.c.toBlob(b=>r({file:new File([b], d.name, {type:'image/jpeg'}), title:d.title, text:d.text}), 'image/jpeg', .9)))
    .then(st=>{ if(job===storyJob) story=st; return st; });
}
async function shareStory(){
  const st=story || await storyJob;
  if(!st) return;
  if(navigator.canShare && navigator.canShare({files:[st.file]})){
    try{ await navigator.share({files:[st.file], title:st.title, text:st.text}); return; }
    catch(e){ if(e.name==='AbortError') return; } // closed by the user; anything else - the picture is saved instead
  }
  const a=document.createElement('a'); a.href=URL.createObjectURL(st.file); a.download=st.file.name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  showToast(tr('saved'));
}
// the lines of `str` in `font`, each at most maxW wide
function wrapLines(x, str, font, maxW){
  x.font=font; x.letterSpacing='0px';
  const lines=[''];
  str.split(' ').forEach(w=>{ const t=(lines.at(-1)+' '+w).trim(); x.measureText(t).width>maxW ? lines.push(w) : lines[lines.length-1]=t; });
  return lines;
}
// the card lies as it fell; the meaning given is the one of that position
async function drawCardStory(el){
  const card=el._card, reversed=el.dataset.reversed==='true';
  const {c, x, W, text}=storyCanvas(tr('storyDay'));
  text(card.name.toUpperCase(), SAFE.top+162, '500 72px Oswald', '#f2efea', 6, W/2, W-120);
  const meaning=reversed ? card.rev : card.up;
  let font='italic 500 42px "Cormorant Garamond"', lh=54, lines=wrapLines(x, meaning, font, W-200);
  if(lines.length>2){ font='italic 500 38px "Cormorant Garamond"'; lh=48; lines=wrapLines(x, meaning, font, W-180); }
  // the card gives up height to a longer meaning, so the invitation stays clear of the deck's name below
  const cy=SAFE.top+200, askY=h=>cy+h+72+(lines.length-1)*lh+100;
  const cw=Math.min(420, (SAFE.bottom-205-askY(0))*CARD_ASPECT);
  const ch=await drawStoryCard(x, card, reversed, (W-cw)/2, cy, cw);
  lines.forEach((l,i)=>text(l, cy+ch+72+i*lh, font, '#d9d4ce'));
  // an invitation to whoever sees the story, in the red of the card backs
  text(tr('storyAsk'), askY(ch), '500 44px Oswald', '#e42423', 6, W/2, W-160);
  return {c, name:`card-of-the-day-${isoDay()}.jpg`, title:tr('optDay'), text:`${tr('shareDay')(card.name)} Bloody Feast Tarot: ${ETSY_URL}`};
}
// the spread: its three cards side by side, each under its position and over its name, then the summary
async function drawSpreadStory(els){
  const {c, x, W, text}=storyCanvas(tr('storyThree'));
  const cw=290, gap=45, left=(W-3*cw-2*gap)/2, cy=SAFE.top+220;
  let ch=0;
  for(const [i, el] of els.entries()){
    const cx=left+i*(cw+gap), mid=cx+cw/2;
    text(POSITIONS[i].toUpperCase(), cy-40, '500 30px Oswald', '#e42423', 6, mid);
    ch=await drawStoryCard(x, el._card, el.dataset.reversed==='true', cx, cy, cw);
    text(el._card.name.toUpperCase(), cy+ch+64, '500 32px Oswald', '#f2efea', 2, mid, cw+gap-10);
  }
  // the summary, wrapped to the width of the row
  const font='italic 500 40px "Cormorant Garamond"';
  wrapLines(x, spreadSummary(els), font, W-160).forEach((l,i)=>text(l, cy+ch+150+i*54, font, '#d9d4ce'));
  return {c, name:`three-cards-${isoDay()}-${spreadNo||1}.jpg`, title:tr('optThree'),
    text:`${tr('shareSpreadText')(els.map((e,i)=>POSITIONS[i]+' — '+e._card.name).join(', '))} Bloody Feast Tarot: ${ETSY_URL}`};
}

// the language is chosen on the resting deck, like the spread; the choice is remembered
function applyLang(){
  document.documentElement.lang=lang; document.title=tr('title');
  POSITIONS.splice(0, POSITIONS.length, ...tr('positions'));
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=tr(e.dataset.i18n));
  const other=lang==='ru' ? 'en' : 'ru';
  langBtn.textContent=other.toUpperCase(); langBtn.dataset.lang=other;
  setAskSub(); fitTitle();
}
// the title stays on one line, centred on the screen; its letters shrink until it clears the language
// button on both sides alike
function fitTitle(){
  const t=document.querySelector('h1.title'), GAP=10, EDGE=14;
  t.style.fontSize=t.style.letterSpacing='';
  const side=langSwitch.classList.contains('off') ? EDGE : innerWidth-langSwitch.getBoundingClientRect().left+GAP;
  const room=innerWidth-2*side;
  for(let f=parseFloat(getComputedStyle(t).fontSize); f>=8 && t.offsetWidth>room; f-=.5){
    t.style.fontSize=f+'px'; t.style.letterSpacing=f*.2+'px';
  }
}
document.fonts.ready.then(fitTitle); addEventListener('resize', fitTitle);
// one button, showing the language it switches to
const langBtn=document.getElementById('langBtn');
langBtn.addEventListener('click', ()=>{
  if(!deckAtRest()) return;
  lang=langBtn.dataset.lang; try{ localStorage.setItem('lang', lang); }catch(e){}
  applyLang();
});
// visitors whose browser speaks nothing but English are never offered Russian
const browserLangs=navigator.languages?.length ? navigator.languages : [navigator.language||'en'];
langSwitch.classList.toggle('off', browserLangs.every(l=>/^en\b/i.test(l)) && lang==='en');
applyLang();
// phones: a page opened from the home screen may keep upright; in the browser only the note in style.css can ask
if(!isDesktop()) screen.orientation?.lock?.('portrait').catch(()=>{});

document.addEventListener('contextmenu', e=>{ if(e.target.closest('img, .card, canvas')) e.preventDefault(); });
document.addEventListener('dragstart', e=>{ if(e.target.tagName==='IMG') e.preventDefault(); });
