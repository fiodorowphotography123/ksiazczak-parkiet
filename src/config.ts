/**
 * Centralna konfiguracja strony — telefon, email, adres.
 * Zmień dane tutaj → zaktualizuje się na WSZYSTKICH stronach.
 */

export const SITE = {
  name: 'Książczak Parkiety i Schody',
  url: 'https://ksiazczak-parkiet.pl',
} as const;

export const CONTACT = {
  phone: '+48 501 652 697',
  phoneLabel: 'Krzysztof – parkiety',
  phoneHref: 'tel:+48501652697',
  phoneSecond: '+48 604 820 769',
  phoneSecondLabel: 'Andrzej – schody',
  phoneSecondHref: 'tel:+48604820769',
  email: 'ksiazczak.krzysztof@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=100087186586035',
  google: 'https://g.co/kgs/r7Xu2b',
} as const;

export const ADDRESS = {
  street: '11-go Listopada 61',
  city: 'Mordy',
  region: 'Mazowieckie',
  postalCode: '08-140',
  country: 'PL',
  lat: '52.2148',
  lng: '22.5258',
} as const;

export const BUSINESS = {
  nip: '8212012992',
  experience: '25+',
} as const;
