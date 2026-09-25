# Osnove dizajn sustava

Ovaj dokument opisuje trenutačne vizualne temelje. Namijenjen je kao polazište za detaljan dizajn sustav koji će povezati web aplikaciju i tiskani PDF planer.

## Smjer

Vizualni identitet je topao, profinjen i miran. Ne koristi ilustracije i dekoracije koje djeluju djetinjasto. Informacije trebaju biti jasne i dovoljno neutralne za svakodnevno korištenje tijekom trudnoće.

## Paleta

| Token | Vrijednost | Primjena |
|---|---:|---|
| Premium white | `#f7f4ef` | glavna podloga |
| Soft peach | `#f7d6c2` | veće nježne površine |
| Rosa | `#edbeb5` | rubovi i sekundarni naglasci |
| Blush apricot | `#ef946b` | dekorativni naglasci |
| Rose frost | `#f57a60` | statusi i ilustrativni detalji |
| Tangerine | `#f04b12` | napredak i aktivna stanja |
| Burnt orange | `#bd3218` | glavne akcije i poveznice |
| Ink | `#332722` | glavni tekst |
| Muted | `#75635d` | pomoćni tekst |

Implementacijski tokeni nalaze se na početku datoteke `app/globals.css`.

## Tipografija

- Primarni font je sistemski sans serif radi brzine, čitljivosti i privatnosti.
- Naslovi koriste čvršću težinu i zbijeniji razmak slova.
- Tekst sučelja treba ostati kratak i razgovoran.
- PDF verzija može koristiti kompatibilan display font, ali mora zadržati istu hijerarhiju.

## Oblikovanje

- Kartice koriste velike, ali ne pretjerane radijuse.
- Sjene su tople i diskretne.
- Aktivna stanja koriste burnt orange ili tangerine.
- Velike površine koriste premium white, soft peach i rosa.
- Zelena je dopuštena samo kao semantička potvrda ako je potrebna za jasnoću statusa.

## Temeljne komponente

- primarni, sekundarni i tekstualni gumb
- kartica sadržaja
- kartica napretka
- polje obrasca i tekstualno područje
- statusna oznaka
- stavka kontrolnog popisa
- navigacijska stavka
- vremenska faza
- prsten i linearni prikaz napretka
- modalni prozor

Za svaku komponentu u proširenom dizajn sustavu treba definirati desktop, mobilno i tiskano ponašanje, stanja, kontrast i minimalnu veličinu dodirne površine.

## Tiskani planer

- Osnovni format je A4, uz mogućnost kasnije prilagodbe na A5.
- Svaka stranica treba imati sigurnu zonu, definiran grid i prostor za uvez.
- Boje trebaju imati tintne varijante pogodne za ekonomičniji ispis.
- Polja za pisanje moraju ostati dovoljno velika nakon ispisa.
- Interaktivne web kontrole u PDF-u treba prevesti u kućice, linije, tablice i prostore za bilješke.

## Pristupačnost

- Obični tekst treba zadovoljiti najmanje WCAG AA kontrast.
- Boja ne smije biti jedini način prikaza statusa.
- Dodirne površine na mobitelu trebaju biti najmanje 44 puta 44 piksela.
- Tiskana verzija mora ostati razumljiva i u sivim tonovima.
