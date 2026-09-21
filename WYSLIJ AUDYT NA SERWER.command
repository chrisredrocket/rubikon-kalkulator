#!/bin/bash
cd "/Users/krzysztofkowalski/Documents/MOJE/PRYWATNE/PRACA/CV KARIERA etc./180hb.com - aplikuję zadanie/rubikon-kalkulator" || exit 1

export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1

echo "=== 1/4  Build ==========================================="
npm run build || { echo; echo "XXX Build sie wywalil. Zrob screenshot tego okna i wyslij Tomowi."; echo; read -n 1 -s -r -p "Nacisnij dowolny klawisz, zeby zamknac."; exit 1; }
if [ ! -f dist/audyt.html ]; then
  echo; echo "XXX Brak dist/audyt.html po buildzie."; read -n 1 -s -r -p "Nacisnij dowolny klawisz."; exit 1
fi
echo ">>> dist/audyt.html OK, rozmiar: $(wc -c < dist/audyt.html) bajtow"

echo
echo "=== 2/4  Projekt Cloudflare =============================="
LIST=$(npx --yes wrangler pages project list 2>&1)
echo "$LIST"
PROJ=$(echo "$LIST" | grep -oE '[a-z0-9][a-z0-9-]*rubikon[a-z0-9-]*|rubikon[a-z0-9-]*' | head -1)
if [ -z "$PROJ" ]; then
  echo; echo "XXX Nie znalazlem projektu z 'rubikon' w nazwie. Zrob screenshot tej listy i wyslij Tomowi."
  read -n 1 -s -r -p "Nacisnij dowolny klawisz."; exit 1
fi
echo ">>> Projekt: $PROJ"

echo
echo "=== 3/4  Deploy =========================================="
npx --yes wrangler pages deploy dist --project-name="$PROJ" || { echo; echo "XXX Deploy sie nie udal. Screenshot -> Tom."; read -n 1 -s -r -p "Nacisnij dowolny klawisz."; exit 1; }

echo
echo "=== 4/4  Sprawdzenie linku ==============================="
sleep 12
CODE=$(curl -s -o /dev/null -w "%{http_code}" https://rubikon.chrisrocket.pl/audyt.html)
SIZE=$(curl -s -o /dev/null -w "%{size_download}" https://rubikon.chrisrocket.pl/audyt.html)
echo "HTTP $CODE, rozmiar $SIZE bajtow"
echo
if [ "$CODE" = "200" ] && [ "$SIZE" -gt 20000 ]; then
  echo "#########################################################"
  echo "###  AUDYT DZIALA. MOZESZ WYSYLAC FORMULARZ.          ###"
  echo "#########################################################"
else
  echo "XXX Link nadal pokazuje kalkulator. Poczekaj minute, odswiez w przegladarce."
  echo "    Jesli dalej zle - screenshot tego okna do Toma."
fi

echo
echo "=== Git (porzadki, nie blokuje wysylki) =================="
git add public/audyt.html "WYSLIJ AUDYT NA SERWER.command" 2>/dev/null
git commit -m "Audyt copy: szesc iteracji, publikacja pod /audyt.html" 2>&1 | tail -2
git push 2>&1 | tail -2

echo
read -n 1 -s -r -p "Gotowe. Nacisnij dowolny klawisz, zeby zamknac to okno."
