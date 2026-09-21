# Rubikon — Kalkulator Ryzyka Cybernetycznego

## Kontekst

To jest zadanie rekrutacyjne na stanowisko **AI Prototype Builder** w agencji 180heartbeats + Jung von Matt (Warszawa). Deliverable dla agencji to **wideo** (screencast, maks. 5 minut) pokazujące proces powstawania prototypu. Ten folder to prototyp, który powstaje na nagraniu.

Pełny brief, treść ogłoszenia, research i checklista: `kontekst/180heartbeats_AI_Prototype_Builder.html` (otwórz w przeglądarce lub przeczytaj, gdy potrzebujesz szczegółów). Zrzut ogłoszenia: `kontekst/rola opis.png`.

**Kim jestem:** Krzysztof Kowalski, brand strategist i web designer, 15+ lat doświadczenia, solo pod marką Chris Rocket. Pracuję AI-first: od strategii prosto do działającego prototypu.

## Jak ze mną rozmawiać

- Po polsku. Bez lania wody, bez wstępów typu „świetne pytanie”.
- Proza zamiast list, jeśli lista nie jest naprawdę potrzebna.
- Nie pytaj o zgodę na każdy krok. Wykonaj zadanie i pokaż wynik.
- Nie deployuj niczego bez mojej wyraźnej decyzji.
- Gdy czegoś nie wiesz, powiedz wprost i przyjmij założenie, oznaczając je.

## Zadanie do zbudowania

Interaktywne narzędzie lead-genowe na landing page ubezpieczyciela B2B: **Kalkulator Ryzyka Cybernetycznego**.

Wymagania twarde (z briefu agencji, nic nie można pominąć):

- 3 pytania, jedno na ekran, z paskiem postępu
- dynamicznie wyliczany poziom ryzyka: Low / Mid / High
- estymowana kwota potencjalnych strat, oznaczona jako szacunek orientacyjny
- przycisk „Zabezpiecz się”
- mikroanimacje przy przeliczaniu wyniku
- nowoczesny UI: Tailwind + shadcn/ui
- responsywność — ma wyglądać dobrze także na telefonie

Decyzje projektowe, które już podjąłem:

1. **Trzy pytania:** branża; liczba pracowników; czy działa logowanie dwuskładnikowe (MFA) do poczty i kluczowych systemów. Trzecie pytanie ma wariant „nie wiem”, punktowany pomiędzy „tak” a „nie” — brak wiedzy o zabezpieczeniach też jest ryzykiem. Świadomie zamieniłem „praca zdalna” z briefu na MFA, bo praca zdalna dziś nie różnicuje firm, a MFA tak.
2. **Wynik bez bramki.** Poziom ryzyka i kwotę pokazujemy od razu. Formularz kontaktowy otwiera się dopiero po kliknięciu „Zabezpiecz się” i ma już wypełnione odpowiedzi z kalkulatora — użytkownik dopisuje tylko imię, e-mail i telefon.
3. **Przy wyniku zawsze 2–3 czynniki**, które go podbiły (np. „branża o wysokiej wrażliwości danych”, „brak MFA”). Żadnych magicznych liczb bez wyjaśnienia.
4. **Kwoty strat muszą mieć źródło.** Formuła i źródła są w pliku specyfikacji. Nigdy nie wymyślaj liczb.

## Marka klienta (fikcyjna)

**Rubikon Ubezpieczenia** — ubezpieczenia dla firm. Nazwa gra z „przekroczeniem Rubikonu”: cyberincydent dzieli firmę na „przed” i „po”.

- Kolory: biel (tło), granat (kolor główny), jaśniejszy niebieski (tła pomocnicze, akcenty UI), czerwień **wyłącznie** przy wysokim ryzyku
- Typografia: jeden poważny krój bezszeryfowy (Inter), liczby tabularne w kwotach
- Zaokrąglenia 12–16 px, delikatne cienie, dużo światła
- Ton: rzeczowy i spokojny. Nie straszymy, nie używamy żargonu ubezpieczeniowego ani technicznego
- Logo: inline SVG, generowane w kodzie
- **Marka jest fikcyjna i musi być oryginalna.** Żadnych nawiązań wizualnych ani nazewniczych do PZU, Warty czy innego realnego ubezpieczyciela

## Stack i zasady techniczne

- Vite + React + Tailwind + shadcn/ui
- Grafiki tylko jako inline SVG i CSS — bez zewnętrznych plików graficznych i bez zewnętrznych generatorów
- **Zero lorem ipsum.** Od razu prawdziwe polskie copy, jak w gotowym produkcie
- Każdy element interfejsu ma działać — bez atrap i martwych przycisków
- Po każdej zmianie sprawdź: zmiana jest w pliku, nie ma martwych referencji, nic nie zniknęło
- Preferuj poprawki w istniejących plikach zamiast tworzenia kolejnych wersji obok

## Struktura folderu

```
rubikon-kalkulator/
├── CLAUDE.md          ← ten plik
├── kontekst/          ← brief, ogłoszenie, research (materiał źródłowy, nie kod)
├── specyfikacja.md    ← pytania, punktacja, progi, formuła kwot i źródła
├── index.html         ← wejście Vite, noindex, favicon jako inline SVG
├── public/robots.txt  ← blokada indeksowania
├── package.json, vite.config.ts, tsconfig*.json, components.json (shadcn)
└── src/
    ├── lib/           ← risk.ts (logika 1:1 ze specyfikacji), format.ts, copy.ts (całe copy PL)
    ├── components/brand/Logo.tsx
    ├── components/calculator/  ← Calculator (maszyna stanów), QuestionStep, OptionTile,
    │                              Calculating, RiskGauge, ResultCard, LeadDialog, SourcesDialog
    └── components/ui/ ← komponenty shadcn/ui (base-nova)
```

Uruchomienie: `npm install`, `npm run dev` → http://localhost:5173. Build: `npm run build`.

## Publikacja

Docelowo: GitHub → Cloudflare Pages, na subdomenie chrisrocket.pl, jako strona nieindeksowana (`noindex` w kodzie i blokada w `robots.txt`), dostępna tylko dla osoby z linkiem. Link trafia do formularza rekrutacyjnego. Plan awaryjny: ręczny upload na Netlify.
