# Specyfikacja — Kalkulator Ryzyka Cybernetycznego (Rubikon Ubezpieczenia)

Źródło prawdy dla logiki i copy. Kod w `src/lib/` importuje wartości stąd, nie odwrotnie. Wersja 1.1, 20.09.2026.

## 1. Flow i stany

Start → Pytanie 1/3 → 2/3 → 3/3 → Przeliczanie → Wynik (Low / Mid / High + kwota + czynniki) → „Zabezpiecz się” → Formularz z uzupełnionymi odpowiedziami → Potwierdzenie.

Zasady: jedno pytanie na ekran, pasek postępu z trzech segmentów (wypełniają się kolejno, bez licznika „Pytanie X z 3”), wybór kafelka przechodzi dalej automatycznie, „Wróć” zachowuje odpowiedzi, „Zmień odpowiedzi” na wyniku wraca do pytania 1 z zachowanymi wyborami. Wynik bez bramki — dane kontaktowe dopiero po CTA.

## 2. Pytania i warianty odpowiedzi

### Pytanie 1 — W jakiej branży działa firma?

| id | Etykieta | Punkty | Mnożnik kwoty |
|---|---|---|---|
| `finance` | Finanse i ubezpieczenia | 3 | 1,26 |
| `health` | Ochrona zdrowia | 3 | 1,33 |
| `industry` | Produkcja i przemysł | 2 | 1,10 |
| `tech` | IT i technologia | 2 | 1,10 |
| `retail` | Handel i e-commerce | 1 | 0,76 |
| `services` | Usługi i inne | 1 | 1,02 |

### Pytanie 2 — Ilu pracowników ma firma?

Progi z definicji MŚP (Komisja Europejska, zalecenie 2003/361/WE).

| id | Etykieta | Punkty | Baza kwoty |
|---|---|---|---|
| `s1` | 1–49 | 1 | 200 000 zł |
| `s2` | 50–249 | 2 | 1 400 000 zł |
| `s3` | 250–999 | 3 | 6 500 000 zł |
| `s4` | 1000+ | 3 | 19 000 000 zł |

### Pytanie 3 — Czy przy logowaniu do poczty, po wpisaniu hasła, trzeba jeszcze podać kod (MFA)?

| id | Etykieta | Punkty | Mnożnik kwoty |
|---|---|---|---|
| `yes` | Tak, wszędzie | 0 | 0,85 |
| `unknown` | Tylko częściowo | 2 | 1,00 |
| `no` | Nie lub nie wiem | 4 | 1,15 |

„Nie wiem” idzie razem z „nie” — kto nie wie, czy ma MFA, najpewniej go nie ma. Wariant „tylko częściowo” punktowany pomiędzy: jedno niezabezpieczone konto wystarczy do włamania. Pytanie o MFA zastąpiło „pracę zdalną” z briefu, bo praca zdalna dziś nie różnicuje firm, a MFA tak.

## 3. Punktacja i progi poziomu ryzyka

`score = punkty(branża) + punkty(pracownicy) + punkty(MFA)` — zakres 2–10.

| Poziom | Zakres | Etykieta w UI | Kolor |
|---|---|---|---|
| Low | 2–4 | Ryzyko niskie | niebieski (akcent marki) |
| Mid | 5–7 | Ryzyko umiarkowane | bursztyn (kolor semantyczny, tylko tu) |
| High | 8–10 | Ryzyko wysokie | czerwień (jedyne użycie czerwieni w interfejsie) |

Wagi: MFA waży najwięcej (0–4), bo przejęcie konta jest główną drogą włamania — w 2025 r. phishing stanowił ok. 30% incydentów zarejestrowanych przez CERT Polska, a wg badania Microsoftu MFA obniża ryzyko przejęcia konta o 99,22%.

Zestawy kontrolne:

| Branża | Pracownicy | MFA | Score | Poziom |
|---|---|---|---|---|
| Handel | 1–49 | tak | 2 | Low |
| Handel | 1–49 | częściowo | 4 | Low |
| Finanse | 1–49 | tak | 4 | Low |
| Finanse | 50–249 | tak | 5 | Mid |
| IT | 250–999 | częściowo | 7 | Mid |
| Zdrowie | 1000+ | tak | 6 | Mid |
| Produkcja | 50–249 | nie | 8 | High |
| Finanse | 250–999 | nie | 10 | High |

## 4. Kwota potencjalnych strat

`kwota = baza(pracownicy) × mnożnik(branża) × mnożnik(MFA)`

Zaokrąglenie do wyświetlenia: poniżej 1 mln zł do pełnych 10 tys. zł, od 1 mln zł do 0,1 mln zł. W UI zawsze z etykietą **„szacunek orientacyjny”** i dopiskiem, że to koszt jednego poważnego incydentu, nie roczna składka ani limit polisy.

Przeliczenie USD → PLN po średnim kursie NBP z 18.09.2026: **3,7998 zł** (tabela nr 182/A/NBP/2026, https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/). Bazy zaokrąglone w dół do „okrągłej” kwoty.

### 4.1 Baza — koszt jednego incydentu wg wielkości firmy

| Przedział | Dana źródłowa | Przeliczenie | Baza | Źródło |
|---|---|---|---|---|
| 1–49 | 52 000 USD — średni roczny koszt cyberincydentów w firmach poniżej 250 pracowników | 197 590 zł | **200 000 zł** | Hiscox, *Cyber Readiness Report 2026* — https://www.hiscox.com/documents/Hiscox-Cyber-Readiness-Report-2026.pdf (omówienie: https://www.infosecurity-magazine.com/news/cyberattacks-cost-organizations/) |
| 50–249 | 375 000 USD — mediana kosztu odzyskania sprawności po ataku ransomware, bez okupu (firmy 100–5000 pracowników, n=2158) | 1 424 925 zł | **1 400 000 zł** | Sophos, *The State of Ransomware 2026* — https://www.sophos.com/en-us/content/state-of-ransomware |
| 250–999 | 1 700 200 USD — średni (mean) koszt odzyskania po ataku ransomware, bez okupu | 6 460 220 zł | **6 500 000 zł** | Sophos, *The State of Ransomware 2026* (j.w.) |
| 1000+ | 4 990 000 USD — globalny średni koszt naruszenia danych (602 organizacje, III 2025 – II 2026) | 18 961 002 zł | **19 000 000 zł** | IBM, *Cost of a Data Breach Report 2026* — https://www.ibm.com/reports/data-breach (omówienie: https://www.helpnetsecurity.com/2026/07/30/ibm-cost-of-a-data-breach-2026/) |

Uwaga metodyczna (do pokazania uczciwie): to trzy różne raporty o różnych metodykach (koszt roczny vs koszt pojedynczego incydentu, ransomware vs naruszenie danych). Łączymy je, bo żadne pojedyncze źródło nie obejmuje pełnej skali od mikrofirmy do korporacji. Dlatego kwota jest szacunkiem orientacyjnym, a nie wyceną.

### 4.2 Mnożnik branży

Stosunek średniego kosztu naruszenia w branży do średniej globalnej 4,99 mln USD — IBM, *Cost of a Data Breach Report 2026* (https://www.ibm.com/reports/data-breach; zestawienie branż: https://databreachcost.com/report/2026).

| Branża w kalkulatorze | Branża w raporcie IBM | Koszt (mln USD) | Mnożnik |
|---|---|---|---|
| Ochrona zdrowia | Healthcare | 6,64 | 1,33 |
| Finanse i ubezpieczenia | Financial | 6,29 | 1,26 |
| Produkcja i przemysł | Industrial | 5,50 | 1,10 |
| IT i technologia | Technology | 5,50 | 1,10 |
| Usługi i inne | Services | 5,08 | 1,02 |
| Handel i e-commerce | Retail | 3,80 | 0,76 |

### 4.3 Mnożnik MFA — założenie projektowe

| Odpowiedź | Mnożnik |
|---|---|
| Tak, wszędzie | 0,85 |
| Tylko częściowo | 1,00 |
| Nie lub nie wiem | 1,15 |

**To nie jest dana ze źródła.** Badania (Microsoft) mierzą wpływ MFA na *prawdopodobieństwo* przejęcia konta, nie na *koszt* incydentu. Mnożnik ±15% to umowne, ostrożne odzwierciedlenie faktu, że bez MFA atakujący dłużej pozostaje niewykryty i incydent jest głębszy. W interfejsie nie pokazujemy tej liczby — MFA opisujemy słowem jako czynnik, a w oknie „Skąd te liczby?” zaznaczamy, że mnożnik jest założeniem.

### 4.4 Zestawy kontrolne kwoty

| Branża | Pracownicy | MFA | Obliczenie | Wynik | Po zaokrągleniu |
|---|---|---|---|---|---|
| Handel | 1–49 | tak | 200 000 × 0,76 × 0,85 | 129 200 | **130 tys. zł** |
| Finanse | 50–249 | nie | 1 400 000 × 1,26 × 1,15 | 2 028 600 | **2,0 mln zł** |
| Zdrowie | 1000+ | nie | 19 000 000 × 1,33 × 1,15 | 29 060 500 | **29,1 mln zł** |
| Usługi | 1–49 | częściowo | 200 000 × 1,02 × 1,00 | 204 000 | **200 tys. zł** |

## 5. Źródła kontekstowe (okno „Skąd te liczby?” i komentarz na wideo)

- CERT Polska / NASK, raport roczny za 2025 (publikacja 8.04.2026): 658 320 zgłoszeń, 260 783 incydenty (+152% r/r), phishing ok. 30% incydentów — https://www.nask.pl/aktualnosci/prawie-2-tys-zgloszen-kazdego-dnia-raport-cert-polska-za-2025-rok · https://cert.pl/tag/raport/
- KPMG, *Barometr cyberbezpieczeństwa 2026*: 96% firm w Polsce odnotowało co najmniej jeden incydent w 2025 r. — https://kpmg.com/pl/pl/wiedza/technologia/barometr-cyberbezpieczenstwa-2026.html
- Microsoft, *How effective is multifactor authentication at deterring cyberattacks?*: MFA obniża ryzyko przejęcia konta o 99,22% — https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/MFA-Microsoft-Research-Paper-update.pdf
- IBM, *Cost of a Data Breach Report 2026* — https://www.ibm.com/reports/data-breach
- Sophos, *The State of Ransomware 2026* — https://www.sophos.com/en-us/content/state-of-ransomware
- Hiscox, *Cyber Readiness Report 2026* — https://www.hiscox.com/documents/Hiscox-Cyber-Readiness-Report-2026.pdf
- NBP, tabela kursów średnich A nr 182/A/NBP/2026 z 18.09.2026 — https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/

## 6. Czynniki przy wyniku

Każda odpowiedź daje jeden czynnik z kierunkiem: `up` (podbija), `down` (obniża), `neutral`. Kolejność wyświetlania: najpierw `up`, potem `neutral`, potem `down`. Zawsze pokazujemy min. 2, maks. 3 czynniki. Przy trzech odpowiedziach to zawsze 3, chyba że wszystkie trzy są `down` — wtedy pokazujemy 2 najistotniejsze i zdanie wyniku Low.

| Odpowiedź | Kierunek | Tekst |
|---|---|---|
| Branża: finanse | up | Finanse: dane o wysokiej wartości dla przestępców |
| Branża: zdrowie | up | Ochrona zdrowia: wyciek danych pacjentów to najdroższy incydent ze wszystkich branż |
| Branża: produkcja | up | Produkcja: przestój linii kosztuje z każdą godziną |
| Branża: IT | up | IT: incydent u Ciebie uderza też w klientów |
| Branża: handel | down | Handel: koszt incydentu niższy, ale przestój sklepu zatrzymuje sprzedaż od pierwszej godziny |
| Branża: usługi | neutral | Usługi: dane klientów i faktury to częsty cel |
| Pracownicy 1–49 | down | Mała firma: mniej kont, ale nikogo, kto ich pilnuje |
| Pracownicy 50–249 | neutral | Średnia firma: dziesiątki kont, najczęściej bez nikogo od bezpieczeństwa |
| Pracownicy 250–999 | up | Duża firma: setki kont i dostawców, jeden słaby punkt wystarczy |
| Pracownicy 1000+ | up | Ponad tysiąc pracowników: skala mnoży koszt incydentu |
| MFA: tak, wszędzie | down | MFA działa: najczęstsza droga włamania zamknięta. Koszt przestoju i kar zostaje |
| MFA: tylko częściowo | up | MFA tylko częściowo: jedno niezabezpieczone konto wystarczy do włamania |
| MFA: nie lub nie wiem | up | Brak MFA: jedna przejęta skrzynka otwiera drogę do pieniędzy i danych |

## 7. Copy interfejsu

Zasada: żaden akapit nie jest dłuższy niż dwie linie, także na telefonie. Nagłówek strony: pierwsza linia „Rubikon Ubezpieczenia”, druga „Zanim coś się wydarzy.” (na ciemnym pasku, z motywem linii z uskokiem w tle). Przyciski bez strzałek.

### Ekran startowy

- Nadtytuł: Kalkulator Ryzyka Cybernetycznego
- Tytuł: Ile Twoja firma może stracić na jednym cyberataku?
- Etykiety pod tytułem: „3 pytania, ok. 30 sekund” · „Wynik od razu, bez podawania danych”
- Przycisk: Sprawdź ryzyko
- Dopisek: Szacunek na podstawie raportów IBM, Sophos, Hiscox i CERT Polska.

### Pytania

- Bez licznika; postęp pokazują trzy segmenty paska.
- Przycisk wstecz: Wróć
- Pytanie 1: W jakiej branży działa firma?
- Pytanie 2: Ilu pracowników ma firma? (podpisy kafelków: mikro i mała firma · średnia firma · duża firma · korporacja)
- Pytanie 3: Czy przy logowaniu do poczty, po wpisaniu hasła, trzeba jeszcze podać kod (MFA)?
- Podpowiedź do pytania 3: MFA to drugi składnik logowania: po haśle system prosi o kod z aplikacji lub SMS-a.
- Odpowiedzi na pytanie 3: Tak, wszędzie · Tylko częściowo · Nie lub nie wiem

### Przeliczanie (ok. 1,3 s, trzy komunikaty po kolei)

1. Porównujemy odpowiedzi z danymi z branży…
2. Liczymy koszt typowego incydentu…
3. Przygotowujemy wynik…

### Wynik

- Etykiety poziomu: Ryzyko niskie · Ryzyko umiarkowane · Ryzyko wysokie
- Nagłówek kwoty: Strata przy jednym incydencie
- Przy kwocie klikalna gwiazdka (aria-label „szacunek orientacyjny — Skąd te liczby?”) otwierająca okno źródeł, to samo co link w stopce.
- Dopisek pod kwotą, tylko gdy kwota przekracza 5 mln zł: Niskie ryzyko nie znaczy mała strata — decyduje skala firmy.
- Nagłówek czynników: Co wpłynęło na wynik
- Zdanie wyniku:
  - Low: Podstawy działają — i dobrze. Żadne zabezpieczenie nie pokryje jednak przestoju, kar i odzyskiwania danych.
  - Mid: Część ryzyka usuniesz w kilka tygodni. Reszty nie — i to jest dokładnie ta część, którą pokrywa polisa.
  - High, gdy MFA „tylko częściowo”: Jeden atak może zatrzymać firmę na tygodnie. Dokończ MFA i zabezpiecz koszty, których nie unikniesz.
  - High, pozostałe: Jeden atak może zatrzymać firmę na tygodnie. Zacznij od MFA i zabezpiecz koszty, których nie unikniesz.
- Przycisk główny: Zabezpiecz się
- Link: Zmień odpowiedzi
- Dopisek: Tyle kosztuje jeden poważny incydent. Polisa to ułamek tej kwoty.

### Formularz (po „Zabezpiecz się”)

- Tytuł: Porozmawiajmy o ochronie
- Opis: Odpowiedzi z kalkulatora już mamy — dopisz tylko, jak się skontaktować.
- Nagłówek podsumowania: Twoje odpowiedzi (trzy czipy: branża, pracownicy, MFA — poziom i kwota są widoczne za modalem)
- Pola: Imię i nazwisko · Służbowy e-mail · Telefon
- Przycisk: Poproś o kontakt
- Zgoda: Zgadzasz się na kontakt w sprawie oferty. Dane nie trafią nigdzie indziej.
- Błędy: Wpisz imię i nazwisko · Wpisz poprawny adres e-mail · Wpisz numer telefonu

### Potwierdzenie

- Tytuł: Dziękujemy, jesteśmy w kontakcie
- Opis: Doradca zadzwoni w ciągu jednego dnia roboczego. Do tego czasu włącz MFA w poczcie. (gdy MFA „tak, wszędzie”: …Do tego czasu sprawdź, czy kopie zapasowe da się odtworzyć.)
- Przycisk: Zamknij

### Stopka

- Link: Skąd te liczby?
- Nota: Prototyp. Formularz nie wysyła danych.
- Tytuł okna źródeł: Skąd te liczby?
- Wstęp okna: Kwota to szacunek orientacyjny: typowy koszt incydentu dla firmy tej wielkości, przeliczony przez branżę i MFA. Mnożnik MFA (±15%) to nasze założenie, nie dana z badań.
