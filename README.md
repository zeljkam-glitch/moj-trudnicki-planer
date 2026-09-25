# Moj trudnički planer

Mobile-first web aplikacija za organizaciju trudnoće, poroda i prvih obveza nakon rođenja. Digitalna verzija obuhvaća sve korisničke cjeline izvornog PDF planera i pretvara ih u obrasce, popise i bilješke koje se automatski spremaju.

**Javna aplikacija:** [moj-trudnicki-planer.vercel.app](https://moj-trudnicki-planer.vercel.app/)

Dokumentacija za nastavak rada u Claudeu nalazi se u `CLAUDE.md`, `docs/PRODUCT-BRIEF.md` i `docs/DESIGN-FOUNDATIONS.md`.

## Što je uključeno

- **Danas:** tjedan trudnoće, odbrojavanje i tri predložena zadatka prema fazi trudnoće i prioritetu
- **Termini:** pregledi, vrijeme, lokacija, pitanja, bilješke i izvoz u osobni kalendar
- **Moja priča:** obitelj, važni datumi, ciljevi, savjeti, komplimenti i trudnička mantra
- **Pripreme:** 205 početnih stavki za mamu i bebu iz PDF-a, osnovni ili potpuni prikaz, pretraga, filteri, prioriteti, odgovorna osoba, troškovi i vlastite stavke
- **Torba za rodilište:** 78 stavki u šest odvojenih torbi i napredak pakiranja
- **Troškovi:** planirano, plaćeno, pokloni i ušteda
- **Plan poroda:** obrazac koji se automatski sprema i uredan A4 ispis
- **Knjige i tečajevi:** preporuke iz planera, vlastite stavke i statusi
- **Nakon poroda:** svih 10 administrativnih obveza i rokova iz PDF-a
- **Bilješke:** neograničen prostor za pitanja, uspomene, ideje i inspiraciju
- **Onboarding:** ime, termin poroda i rodilište
- **localStorage:** svi se podaci čuvaju samo u pregledniku, bez računa i backenda
- **Postavke i sigurnosna kopija:** uređivanje profila i načina prikaza, JSON izvoz/uvoz i potvrđeni reset podataka
- responsive sučelje s mobilnom donjom i desktop bočnom navigacijom

> Napomena: medicinske informacije i administrativne rokove prije javne objave treba provjeriti sa stručnim osobama i na aktualnim službenim izvorima.

## Tehnologija

- Next.js (App Router)
- React + TypeScript
- čisti CSS, bez UI frameworka
- localStorage za lokalnu pohranu

## Lokalno pokretanje

Potrebni su Node.js 20.9 ili noviji i pnpm. Ako pnpm nije dostupan, uključi ga naredbom `corepack enable`.

```bash
pnpm install
pnpm dev
```

Otvori [http://localhost:3000](http://localhost:3000).

Provjera produkcijskog builda:

```bash
pnpm lint
pnpm build
pnpm start
```

## Kako objaviti na GitHubu

1. Na GitHubu napravi novi prazan repozitorij, primjerice `moj-trudnicki-planer`.
2. U korijenu ovog projekta pokreni:

```bash
git init
git add .
git commit -m "Initial MVP"
git branch -M main
git remote add origin https://github.com/TVOJE-IME/moj-trudnicki-planer.git
git push -u origin main
```

Ako je projekt već Git repozitorij, preskoči `git init`. Zamijeni `TVOJE-IME` svojim GitHub korisničkim imenom.

## Kako objaviti na Vercelu

Najjednostavnije:

1. Otvori [vercel.com/new](https://vercel.com/new).
2. Poveži GitHub račun i odaberi repozitorij.
3. Vercel će automatski prepoznati Next.js.
4. Nisu potrebne environment varijable.
5. Klikni **Deploy**.

Svaki idući push na `main` automatski objavljuje produkcijsku verziju, a svaki pull request dobiva zaseban preview link koji možeš poslati testericama.

Alternativa kroz Vercel CLI:

```bash
npx vercel
npx vercel --prod
```

## Struktura projekta

```text
app/
  globals.css          globalni dizajn i responsive pravila
  layout.tsx           fontovi, metadata i osnovni layout
  manifest.ts          web app manifest
  page.tsx             ulaz u aplikaciju
components/
  views/               pojedini ekrani planera
  app-shell.tsx        mobilna i desktop navigacija
  planner-provider.tsx globalno stanje i localStorage
  ui.tsx               zajedničke UI komponente
lib/
  catalog.ts           potpuni katalozi priprema, torbi i sažeci savjeta
  seed.ts              početni sadržaj iz izvornog planera
  types.ts             TypeScript podatkovni model
```

## Privatnost i ograničenja MVP-a

- Podaci se spremaju samo u localStorage trenutačnog preglednika.
- Podaci se ne sinkroniziraju između uređaja.
- Brisanje podataka preglednika briše i unesene podatke ako prethodno nije preuzeta sigurnosna kopija.
- Sigurnosna kopija može se preuzeti u **Više → Postavke i podaci** i vratiti na istom ili drugom uređaju.
- Nema prijave, analitike, servera ni slanja osobnih podataka.
- Za sljedeću fazu ima smisla dodati PWA ikone, podsjetnike i tek potom korisničke račune sa sinkronizacijom.

## Smjer nakon testiranja

Prije proširenja MVP-a preporuka je provesti test s 10–20 trudnica, posebno za Today prioritete, razumljivost statusa, stvarni način pakiranja torbe i korisnost plana poroda. Tek nakon potvrde potrebe dodavati login, cloud bazu, podsjetnike i naplatu.
