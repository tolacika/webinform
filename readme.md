PHP tesztfeladat:
• 1 oldalas weblap: hírlevél feliratkozási űrlap (név, email)
• Feliratkozók száma, utolsó feliratkozó adatai, automatikus (5 mp-enként) és azonnali frissítés AJAX-szal
• MySQL adatbázis, név (5-40 karakter), email (valid), feliratkozás dátuma
• Vanilla PHP , jQuery, AJAX-os űrlap, PHP oldali validáció, mezőnkénti hibajelzés
• Opcionális: Twig , Doctrine, ingyenes html template használata.
React tesztfeladat
Készíts egy egyoldalas React alkalmazást, amely lehetővé teszi felhasználók számára, hogy feliratkozzanak egy
hírlevélre. Az alkalmazás a következő funkciókat tartalmazza:
• Hírlevél-feliratkozási űrlap:
o Név (5–40 karakter)
o Email (valós email formátum)
o Űrlap mezőnkénti validáció (hibaüzenetek)
o Beküldés után sikeres/hibas visszajelzés
• Feliratkozók számlálója:
o Mutatja a feliratkozók számát
o Megjeleníti a legutóbbi feliratkozó nevét és emailjét
• Adatkezelés:
o Használj mock API-t (pl. json-server, vagy saját mock adatkezelés)
o Az adatok frissítése történjen 5 másodpercenként automatikusan, illetve sikeres feliratkozás után
azonnal
• Technológiai elvárások:
o React (hooks használata kötelező)
o State- és effektkezelés (pl. useState, useEffect)
o Komponens-alapú felépítés
o Stílusozás: bármilyen ingyenes CSS framework vagy saját CSS
o Nincs szükség backendre, de az adatkezelést mock API-n keresztül szimuláld
• Extra (nem kötelező):
o Egységteszt egy vagy több komponensre (pl. Jest, React Testing Library)
o Responsív dizájn