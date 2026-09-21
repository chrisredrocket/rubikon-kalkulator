import type { Level, MfaId } from "./risk"

/** Całe copy interfejsu — 1:1 ze `specyfikacja.md`, sekcja 7. */
export const copy = {
  brand: "Rubikon Ubezpieczenia",
  tagline: "Ubezpieczenia dla firm. Zanim coś się wydarzy.",
  start: {
    kicker: "Kalkulator Ryzyka Cybernetycznego",
    title: "Ile Twoja firma może stracić na jednym cyberataku?",
    lead: "Trzy pytania, pół minuty, bez podawania danych.",
    cta: "Sprawdź ryzyko",
    note: "Szacunek na podstawie raportów IBM, Sophos, Hiscox i CERT Polska.",
  },
  questions: {
    counter: (n: number, total: number) => `Pytanie ${n} z ${total}`,
    back: "Wróć",
    industry: "W jakiej branży działa firma?",
    size: "Ilu pracowników ma firma?",
    mfa: "Czy po wpisaniu hasła do poczty trzeba jeszcze podać kod (MFA)?",
    mfaHint: "MFA to drugi składnik logowania: po haśle system prosi o kod z aplikacji lub SMS-a.",
  },
  calculating: [
    "Porównujemy odpowiedzi z danymi z branży…",
    "Liczymy koszt typowego incydentu…",
    "Przeliczamy na złote po kursie NBP…",
  ],
  result: {
    level: {
      low: "Ryzyko niskie",
      mid: "Ryzyko umiarkowane",
      high: "Ryzyko wysokie",
    } satisfies Record<Level, string>,
    amountTitle: "Strata przy jednym incydencie",
    amountTag: "szacunek orientacyjny",
    factorsTitle: "Co wpłynęło na wynik",
    sentence: (level: Level, mfa: MfaId, _amountLabel?: string) => {
      if (level === "low")
        return "Dziś tę stratę pokrywasz sam. Sprawdź, ile kosztuje przeniesienie jej na polisę."
      if (level === "mid")
        return "Nie ma zabezpieczeń bez luk. Polisa to ostatnia warstwa, która działa wtedy, gdy poprzednie zawiodą."
      return mfa === "unknown"
        ? "Jeden atak potrafi zatrzymać firmę na tygodnie. Dokończ MFA, a koszt przestoju przenieś na polisę."
        : "Jeden atak potrafi zatrzymać firmę na tygodnie. Włącz MFA, a koszt przestoju przenieś na polisę."
    },
    /** Dopisek przy kwocie powyżej 5 mln — rozdziela poziom (higiena) od kwoty (skala). */
    scaleNote: "Niskie ryzyko nie znaczy mała strata. Decyduje skala firmy.",
    cta: "Zabezpiecz się",
    change: "Zmień odpowiedzi",
    note: "Polisa kosztuje ułamek tej kwoty.",
  },
  form: {
    title: "Wycena polisy dla Twojej firmy",
    lead: "Odpowiedzi z kalkulatora już mamy. Dopisz tylko, jak się skontaktować.",
    summaryTitle: "Twoje odpowiedzi",
    summary: {
      industry: "Branża",
      size: "Pracownicy",
      mfa: "MFA",
    },
    fields: {
      name: "Imię i nazwisko",
      email: "Służbowy e-mail",
      phone: "Telefon",
    },
    placeholders: {
      name: "Anna Nowak",
      email: "anna.nowak@firma.pl",
      phone: "+48 600 000 000",
    },
    submit: "Chcę wycenę",
    consent: "Zgadzasz się na kontakt w sprawie oferty. Dane nie trafią nigdzie indziej.",
    errors: {
      name: "Wpisz imię i nazwisko",
      email: "Wpisz poprawny adres e-mail",
      phone: "Wpisz numer telefonu",
    },
  },
  confirmation: {
    title: "Zgłoszenie przyjęte",
    lead: (mfa: MfaId) =>
      mfa === "yes"
        ? "Doradca zadzwoni w ciągu jednego dnia roboczego. Do tego czasu sprawdź, czy kopie zapasowe da się odtworzyć."
        : "Doradca zadzwoni w ciągu jednego dnia roboczego. Do tego czasu włącz MFA w poczcie.",
    close: "Zamknij",
  },
  footer: {
    sources: "Skąd te liczby?",
    prototype: "Prototyp. Formularz nie wysyła danych.",
  },
  sources: {
    title: "Skąd te liczby?",
    lead: "Kwota to szacunek orientacyjny: typowy koszt incydentu dla firmy tej wielkości, skorygowany o branżę i MFA. Mnożnik MFA (±15%) to nasze założenie, nie dana z badań.",
    items: [
      {
        name: "Hiscox, Cyber Readiness Report 2026",
        what: "baza dla firm 1–49: średni roczny koszt incydentów w firmach poniżej 250 pracowników, 52 000 USD",
        url: "https://www.hiscox.com/documents/Hiscox-Cyber-Readiness-Report-2026.pdf",
      },
      {
        name: "Sophos, The State of Ransomware 2026",
        what: "bazy dla firm 50–249 i 250–999: mediana 375 000 USD i średnia 1 700 200 USD kosztu odzyskania po ataku, bez okupu",
        url: "https://www.sophos.com/en-us/content/state-of-ransomware",
      },
      {
        name: "IBM, Cost of a Data Breach Report 2026",
        what: "baza dla firm 1000+: średnia globalna 4,99 mln USD; mnożniki branż jako stosunek kosztu w branży do średniej",
        url: "https://www.ibm.com/reports/data-breach",
      },
      {
        name: "CERT Polska, raport roczny za 2025",
        what: "260 783 incydenty w Polsce (+152% r/r), phishing ok. 30% z nich, dlatego MFA waży w punktacji najwięcej",
        url: "https://www.nask.pl/aktualnosci/prawie-2-tys-zgloszen-kazdego-dnia-raport-cert-polska-za-2025-rok",
      },
      {
        name: "KPMG, Barometr cyberbezpieczeństwa 2026",
        what: "96% firm w Polsce odnotowało co najmniej jeden incydent w 2025 r.",
        url: "https://kpmg.com/pl/pl/wiedza/technologia/barometr-cyberbezpieczenstwa-2026.html",
      },
      {
        name: "Microsoft, How effective is multifactor authentication",
        what: "MFA obniża ryzyko przejęcia konta o 99,22%",
        url: "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/final/en-us/microsoft-brand/documents/MFA-Microsoft-Research-Paper-update.pdf",
      },
      {
        name: "NBP, tabela A nr 182/A/NBP/2026",
        what: "kurs 3,7998 zł za 1 USD z 18.09.2026 użyty do przeliczenia",
        url: "https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/",
      },
    ],
  },
} as const
