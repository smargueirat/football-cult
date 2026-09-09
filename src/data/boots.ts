// Datos reales de botas de fútbol -- piloto para ver cómo queda la
// sección más allá de camisetas. Extraídos de los feeds reales ya
// aprobados de Futbol Emotion (TradeTracker) y Forum Sport ES (Awin),
// cruzados por nombre de modelo para tener comparación de precio real
// entre 2 tiendas. Solo modelos de bota adulta (se excluyó Academy/Niño
// explícitamente). Tallas convertidas de UK/US reales a EU con tabla
// estándar de conversión de calzado.
export interface BootOffer {
  store: "FutbolEmotion" | "ForumSport";
  price: number;
  shipping: number;
  url: string;
  imageUrl: string;
  sizes: string[];
}

export interface BootProduct {
  id: string;
  brand: string;
  model: string;
  groundType: string;
  offers: BootOffer[];
}

export const bootProducts: BootProduct[] = [
  {
    id: "puma-future-9-match-fg-ag",
    brand: "Puma",
    model: "Puma Future 9 Match FG/AG",
    groundType: "FG/AG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 46.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Ffuture-9-match-fgag-puma-red-puma-white-glowing-red-puma-black",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285527/750/bota-puma-future-9-match-fgag-rojo-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45"],
      },
      {
        store: "ForumSport",
        price: 53.86,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=45841261321&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108166-00-P-X-20260121133411.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NjI3NHxpbWFnZS9qcGVnfGFEbGlMMmcwTUM4eE16VXhNVGM1TmpnNE16UTROaTl0WldScFlYTmZNVEF3TVRFd09ERTJObDh3TUY5UVgxZ3RNakF5TmpBeE1qRXhNek0wTVRFdWFuQm58YTg2ZWY4ZWRmMWEwZmFmODBhODZiMTVmYTlhNGM0NWQ2ZWE5NzQxMTQ2MjNhNTMzYzFjNTIyZjc2MjI2YWEzMA&feedId=58083&k=93a4870b87fde4f2c7dad68df9edba7ed4c4e280",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
      },
    ],
  },
  {
    id: "puma-ultra-6-match-fg-ag",
    brand: "Puma",
    model: "Puma Ultra 6 Match FG/AG",
    groundType: "FG/AG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 42.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Fultra-6-match-fgag-yellow-alert-puma-black-puma-silver-glowing-r",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285544/750/bota-puma-ultra-6-match-fgag-amarillo-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5"],
      },
      {
        store: "ForumSport",
        price: 54.14,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=43791561083&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108151-00-P-X-20260121133411.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NzM4NnxpbWFnZS9qcGVnfGFEYzFMMmhtTlM4eE16VXhNVGM1TXpRM05UWXhOQzl0WldScFlYTmZNVEF3TVRFd09ERTFNVjh3TUY5UVgxZ3RNakF5TmpBeE1qRXhNek0wTVRFdWFuQm58MGM0Y2UyNWEyOTdmODI0NjhiYjM0ZDcyMzQ5YjRlNWRjODE1NDJkNzFmMTNmNjQyOWFmNDgxNDY5NzI3YmMwNw&feedId=58083&k=64bd988cc967848df725f950495218d7c4708b49",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46", "47"],
      },
    ],
  },
  {
    id: "adidas-predator-league-ft-fg",
    brand: "adidas",
    model: "adidas Predator League FT FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 75.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fadidas%2Fpredator-league-ft-fg-lucid-red-core-black-white",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/291506/750/bota-adidas-predator-league-ft-fg-rojo-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 73.07,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=44914445219&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001094444-00-P-X-20260513144218.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5ODk3NXxpbWFnZS9qcGVnfGFHUmtMMmc1T1M4eE16YzJNakF6TWpNMk9UWTVOQzl0WldScFlYTmZNVEF3TVRBNU5EUTBORjh3TUY5UVgxZ3RNakF5TmpBMU1UTXhORFF5TVRndWFuQm58MmYzOTA1MWI4YjA1N2RjNmYzZTlmNDJlNzE4Y2ZkZmM0NjU5M2RjZjIzMTdhYzQyYzNkMGQzOTBlMDRhY2Y2MA&feedId=58083&k=8c321bc31d67187b9fc8087b17f56f8c465eef67",
        sizes: ["40", "42", "44", "46"],
      },
    ],
  },
  {
    id: "puma-future-9-ultimate-fg",
    brand: "Puma",
    model: "Puma Future 9 Ultimate FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 155.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Ffuture-9-ultimate-fg-puma-black-glowing-red-strong-gray",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285568/750/bota-puma-future-9-ultimate-fg-puma-black-glowing-red-strong-gray-1.jpg",
        sizes: ["39", "40", "41", "42", "42.5", "43", "44", "44.5", "45"],
      },
      {
        store: "ForumSport",
        price: 131.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=43791561060&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108170-00-P-X-20260121133411.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5ODUwMHxpbWFnZS9qcGVnfGFHSXpMMmhtTmk4eE16VXhNVGM1T0RVeU1UZzROaTl0WldScFlYTmZNVEF3TVRFd09ERTNNRjh3TUY5UVgxZ3RNakF5TmpBeE1qRXhNek0wTVRFdWFuQm58YjMyMTk1NWRiOTA3OGI0ZTQ0NTI4ZTUwZWIzMDcyNGU5ZDU0ODk3MDU3ZGRhOTNjZGVmYTgzNzI3NTlmMGU0Nw&feedId=58083&k=34e72b2957688a81081569e65a866bd11e484a57",
        sizes: ["37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
      },
    ],
  },
  {
    id: "adidas-predator-elite-ft-fg",
    brand: "adidas",
    model: "adidas Predator Elite FT FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 195.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fadidas%2Fpredator-elite-ft-fg-crystal-sky-ray-blue-team-solar-yellow",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/291494/750/bota-adidas-predator-elite-ft-fg-crystal-sky-ray-blue-team-solar-yellow-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 167.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=38653402549&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1000974326-00-P-X-20240716092346.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5OTQwNXxpbWFnZS9qcGVnfGFHWmxMMmd3WWk4eE1qSTFPRGc0TURVMU1qazVNQzl0WldScFlYTmZNVEF3TURrM05ETXlObDh3TUY5UVgxZ3RNakF5TkRBM01UWXdPVEl6TkRZdWFuQm58MjExNDExODVmYmE5YTA5NmY4YzkwYTg3MjRjYjZhMDYzOTQwMzdhNTdmMmJmMDljMjUzMmM3MzExOTc5ZWE5Yw&feedId=58083&k=6f9a7612c0706b95f813958df7ad784487d0fb3f",
        sizes: ["40", "42", "44"],
      },
    ],
  },
  {
    id: "adidas-copa-pure-iv-league-fg",
    brand: "adidas",
    model: "adidas Copa Pure IV League FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 58.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fadidas%2Fcopa-pure-iv-league-fg-zero-met-core-black-lucid-red",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/291297/750/bota-adidas-copa-pure-iv-league-fg-plata-1.jpg",
        sizes: ["38", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5"],
      },
      {
        store: "ForumSport",
        price: 58.28,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=43912856204&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001111324-00-P-X-20260205141246.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5ODU1OHxpbWFnZS9qcGVnfGFHWmpMMmd6Wmk4eE16VTFNRFF6TlRreU5qQTBOaTl0WldScFlYTmZNVEF3TVRFeE1UTXlORjh3TUY5UVgxZ3RNakF5TmpBeU1EVXhOREV5TkRZdWFuQm58ZGVhNzkzOTc0OWUzOTUzNGUxNGUyZDFiMTRmZWJiM2FkYjgyYmU4YmEyNjdjNWFlYzc2MTIwZDE0YWYxNzJlYQ&feedId=58083&k=ce1361ad2c8f0b1dec5f8c7322ee109d35fa1b69",
        sizes: ["40", "42", "44", "46"],
      },
    ],
  },
  {
    id: "puma-future-9-pro-fg-ag",
    brand: "Puma",
    model: "Puma Future 9 Pro FG/AG",
    groundType: "FG/AG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 89.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Ffuture-9-pro-fgag-red-white-glowing-red-black",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285526/750/bota-puma-future-9-pro-fgag-rojo-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45"],
      },
      {
        store: "ForumSport",
        price: 83.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=43791560871&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108161-00-P-X-20260121133411.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5OTk2MHxpbWFnZS9qcGVnfGFERTVMMmd6WlM4eE16VXhNVGM1TlRJME5UQTROaTl0WldScFlYTmZNVEF3TVRFd09ERTJNVjh3TUY5UVgxZ3RNakF5TmpBeE1qRXhNek0wTVRFdWFuQm58NmI0ZWJjZjkwMjVhYjE0OTIzMzg3ZTIwM2Q0MDk4MDdmMWUxMzc1NGY5ODA1ZGRiMDNjZjJiY2Y2ZDMxMjE3OQ&feedId=58083&k=04cbe0c908d97756de586ba4c5117eeace3476b5",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
      },
    ],
  },
  {
    id: "puma-future-9-ultimate-ag",
    brand: "Puma",
    model: "Puma Future 9 Ultimate AG",
    groundType: "AG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 143.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Ffuture-9-ultimate-ag-red-white-glowing-red-black",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285524/750/bota-puma-future-9-ultimate-ag-red-white-glowing-red-black-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45"],
      },
      {
        store: "ForumSport",
        price: 131.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=43791560956&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108200-00-P-X-20260121133411.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5OTA3OXxpbWFnZS9qcGVnfGFHVmlMMmd3T0M4eE16VXhNVGd6TlRFNE9USTNPQzl0WldScFlYTmZNVEF3TVRFd09ESXdNRjh3TUY5UVgxZ3RNakF5TmpBeE1qRXhNek0wTVRFdWFuQm58NzJiZmIxNWJmMTExZGRjN2FiY2EyZDE5NmNhZTRmOWVlMWI4YTE5MzhlNmY2OWE5MDVmZDU0MWI4YTE3YzY1Mw&feedId=58083&k=adec2f0bcd7701b7e14ff0d558d511e06397b76a",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
      },
    ],
  },
  {
    id: "adidas-predator-elite-ft-ag",
    brand: "adidas",
    model: "adidas Predator Elite FT AG",
    groundType: "AG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 251.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fadidas%2Fpredator-elite-ft-ag-tursol-croter-core-black",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/327349/750/bota-adidas-predator-elite-ft-ag-tursol-croter-core-black-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 209.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=45409724935&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001102006-00-P-X-20260616161934.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5ODg5NnxpbWFnZS9qcGVnfGFHWmxMMmhsTVM4eE16Z3pNVFU0T1RrMU16VTJOaTl0WldScFlYTmZNVEF3TVRFd01qQXdObDh3TUY5UVgxZ3RNakF5TmpBMk1UWXhOakU1TXpRdWFuQm58NGZiNTc1YmZhNWE2NzUxMzM2ZTgyNDg1ZTBkZGZlY2I1Zjk0NTJkNzBlZGEzZjQ1MGJmYzMwNTkyY2E1NGE2OA&feedId=58083&k=39040b2fbdca33ece951de55a9e0b2129f5f4771",
        sizes: ["40", "42", "44", "46"],
      },
    ],
  },
  {
    id: "adidas-f50-pro-fg",
    brand: "adidas",
    model: "adidas F50 Pro FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 119.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fadidas%2Ff50-pro-fg-team-solar-yellow-core-black-lucid-red",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/291415/750/bota-adidas-f50-pro-fg-naranja-1.jpg",
        sizes: ["40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5"],
      },
      {
        store: "ForumSport",
        price: 87.29,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=44338442033&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001048407-00-P-X-20250828181619.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NjI1MHxpbWFnZS9qcGVnfGFHWXlMMmd4TUM4eE16RTBOVGt4TkRNM05qSXlNaTl0WldScFlYTmZNVEF3TVRBME9EUXdOMTh3TUY5UVgxZ3RNakF5TlRBNE1qZ3hPREUyTVRrdWFuQm58MTc5NTllZTQ1NmNkYTg2M2IzZjliYTA5ZWRlNzc1YWJhMmRhYjYyYzcyMWY1OWVlYzc5NjJhN2IyODFmYjUzMQ&feedId=58083&k=7f62d31905198c85cdc4b3efe0370015d5ed0a2e",
        sizes: ["36", "38", "40", "42", "44", "46"],
      },
    ],
  },
  {
    id: "nike-phantom-6-low-pro-fg",
    brand: "Nike",
    model: "Nike Phantom 6 Low Pro FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 127.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fnike%2Fphantom-6-low-pro-fg-hyper-crimson-black-limelight",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/280385/750/bota-nike-phantom-6-low-pro-fg-naranja-1.jpg",
        sizes: ["38.5", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 159.99,
        shipping: 0.0,
        url: "https://www.awin1.com/pclick.php?p=45865220942&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001103647-00-P-X-20260722151919.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5ODAxMnxpbWFnZS9qcGVnfGFETXlMMmhoTkM4eE16a3dPRGMyTkRNeU56azJOaTl0WldScFlYTmZNVEF3TVRFd016WTBOMTh3TUY5UVgxZ3RNakF5TmpBM01qSXhOVEU1TVRrdWFuQm58ZDA2NWQ4MmVkMjI5NzZkMDEzZDhiNzE3Yjc2NDkwMjk3NzRiMDEyNGFlODVmZTVjZjcwNjI3MDRkZTMxN2FhOA&feedId=58083&k=669cdde4e00e44268416615df1673de4af8187b6",
        sizes: ["38", "40", "41", "42", "43", "44", "45", "46", "47"],
      },
    ],
  },
  {
    id: "puma-ultra-6-ultimate-fg",
    brand: "Puma",
    model: "Puma Ultra 6 Ultimate FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 114.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Fultra-6-ultimate-fg-heat-fire-black-glowing-red",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/271561/750/bota-puma-ultra-6-ultimate-fg-heat-fire-black-glowing-red-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5"],
      },
      {
        store: "ForumSport",
        price: 126.49,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=43791560711&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108138-00-P-X-20260121133411.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5ODE1NXxpbWFnZS9qcGVnfGFHWTRMMmd4TXk4eE16VXhNVGM1TVRBMU1EYzRNaTl0WldScFlYTmZNVEF3TVRFd09ERXpPRjh3TUY5UVgxZ3RNakF5TmpBeE1qRXhNek0wTVRFdWFuQm58ZGQ0NDA0YTkyODRhMzI3NzI3MGQ3NTFmMTdiYzhiM2U5MDk2N2NjYzUxMWRlYzIyZWMwNWFhZTRlMzYwYmY1ZA&feedId=58083&k=f1c6a26e9c4cf90be5d3e3fadbe469d9c4f62129",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46", "47"],
      },
    ],
  },
  {
    id: "adidas-predator-pro-ft-fg",
    brand: "adidas",
    model: "adidas Predator Pro FT FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 111.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fadidas%2Fpredator-pro-ft-fg-signal-core-ftwr-white-beam-orange",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/272996/750/bota-adidas-predator-pro-ft-fg-coral-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 111.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=45854596317&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001048507-00-P-X-20250618150155.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5ODEyMnxpbWFnZS9qcGVnfGFEVmlMMmcyTUM4eE1qazVOems1TVRjNU1qWTNNQzl0WldScFlYTmZNVEF3TVRBME9EVXdOMTh3TUY5UVgxZ3RNakF5TlRBMk1UZ3hOVEF4TlRVdWFuQm58ODZkYWI0NWUzZmEzMWQzMjYyYTcwMTYwNTJhNzc0ZTQ3MTA1NTM1NWM4ZmI4MjVlOTFiZjUwZmNiNjZjNDZjZQ&feedId=58083&k=72f79474e1dcc71b1f3ea24b7d777cae8f1dbe63",
        sizes: ["40", "42", "44"],
      },
    ],
  },
  {
    id: "puma-ultra-6-pro-fg-ag",
    brand: "Puma",
    model: "Puma Ultra 6 Pro FG/AG",
    groundType: "FG/AG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 83.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Fultra-6-pro-fgag-puma-black-puma-red-strong-gray",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285584/750/bota-puma-ultra-6-pro-fgag-negro-1.jpg",
        sizes: ["40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45"],
      },
      {
        store: "ForumSport",
        price: 78.39,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=43791560895&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108132-00-P-X-20260121133411.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NjY4M3xpbWFnZS9qcGVnfGFEVm1MMmhoWkM4eE16VXhNVGM0T1Rnd05UVTVPQzl0WldScFlYTmZNVEF3TVRFd09ERXpNbDh3TUY5UVgxZ3RNakF5TmpBeE1qRXhNek0wTVRFdWFuQm58NzY2ZTk2ZDhiNmI0NzMxMDM5ZWRkZDdjN2IwOGQ4MzYxMDQ4Zjc2MGYxYjc5Mzc2NTk4N2M3YTBhY2YzZDgyYg&feedId=58083&k=0f9f3b357415bfdf9b7d739366212efab4a583aa",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
      },
    ],
  },
  {
    id: "puma-future-9-match-mg",
    brand: "Puma",
    model: "Puma Future 9 Match MG",
    groundType: "MG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 65.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Ffuture-9-match-mg-puma-red-puma-white-glowing-red-puma-black",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285642/750/bota-puma-future-9-match-mg-rojo-1.jpg",
        sizes: ["39", "40", "41", "42", "42.5", "43", "44", "44.5", "45"],
      },
      {
        store: "ForumSport",
        price: 55.85,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=45841261213&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001108238-00-P-X-20260306131858.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5MjAyNXxpbWFnZS9qcGVnfGFESXhMMmd3T0M4eE16WXlOVEkwT0RRME9EVTBNaTl0WldScFlYTmZNVEF3TVRFd09ESXpPRjh3TUY5UVgxZ3RNakF5TmpBek1EWXhNekU0TlRndWFuQm58N2UwMGQ3NWM3OTg3OWU0ZjYyNDcyNThjN2IzOGU0Yjc3MzFmMzQ4Y2E4ODcxYTFjMDhiNTQzZDUxMjNkOTZkMA&feedId=58083&k=3a7e5d9c1e493326c807d78b2f15916871062055",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
      },
    ],
  },
  {
    id: "nike-phantom-6-high-elite-fg",
    brand: "Nike",
    model: "Nike Phantom 6 High Elite FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 239.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fnike%2Fphantom-6-high-elite-fg-brt-crimson-blur-black",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/336672/750/bota-nike-phantom-6-high-elite-fg-brt-crimson-blur-black-1.jpg",
        sizes: ["38.5", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 218.39,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=45865220937&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001103643-00-P-X-20260619074024.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NzY0NHxpbWFnZS9qcGVnfGFHRTBMMmczTlM4eE16Z3pPREF6TnpjM09EUTJNaTl0WldScFlYTmZNVEF3TVRFd016WTBNMTh3TUY5UVgxZ3RNakF5TmpBMk1Ua3dOelF3TWpRdWFuQm58NGJmNTdkMWE2YzEzNGVmYjYxMmJkNGY0ODhmYjM1MDc3NDhiMTZhMjkyMDNjOWEzNDYwNjE0YmYzMmM3NDI4Yw&feedId=58083&k=b7c8c50fbedbf0954ba2ec0fcce3c810c7d50445",
        sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"],
      },
    ],
  },
  {
    id: "puma-ultra-6-ultimate-ag",
    brand: "Puma",
    model: "Puma Ultra 6 Ultimate AG",
    groundType: "AG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 137.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fpuma%2Fultra-6-ultimate-ag-yellow-alert-black-silver-glowing",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/285541/750/bota-puma-ultra-6-ultimate-ag-yellow-alert-black-silver-glowing-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5"],
      },
      {
        store: "ForumSport",
        price: 125.57,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=41854061839&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001048057-00-P-X-20260625091041.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NjA3NHxpbWFnZS9qcGVnfGFHWTBMMmc1Tnk4eE16ZzFNVE16TVRBd01qTTVPQzl0WldScFlYTmZNVEF3TVRBME9EQTFOMTh3TUY5UVgxZ3RNakF5TmpBMk1qVXdPVEV3TkRFdWFuQm58ZTEzMzhhMzkwMmQwNWYyYjQ5ZDU3OTk0M2M1MTAyNGQ3MTkxYzVlYjE4MTUyMzg5YzNlNGMyYzg0M2IzZDMxNg&feedId=58083&k=97e92c07966ec301f00c10e375a0743dd936d8fd",
        sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
      },
    ],
  },
  {
    id: "nike-phantom-6-high-elite-ag-pro",
    brand: "Nike",
    model: "Nike Phantom 6 High Elite AG-Pro",
    groundType: "AG-PRO",
    offers: [
      {
        store: "FutbolEmotion",
        price: 279.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fnike%2Fphantom-6-high-elite-ag-pro-brt-crimson-blur-black",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/336669/750/bota-nike-phantom-6-high-elite-ag-pro-brt-crimson-blur-black-1.jpg",
        sizes: ["38.5", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 195.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=45942701936&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001101121-00-P-X-20260219115345.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NTYyMXxpbWFnZS9qcGVnfGFETTRMMmhoTkM4eE16VTRPVEkxTXpZNE5USTNPQzl0WldScFlYTmZNVEF3TVRFd01URXlNVjh3TUY5UVgxZ3RNakF5TmpBeU1Ua3hNVFV6TkRVdWFuQm58YzUxNGE2Mzk3YzU3ZmIyODBiZGI1NzJlMTQ2MTU3YmE4MmZhYTBmNTFlM2QyYjJlZTkxNzgzOWIyNzQ4NDE4NA&feedId=58083&k=8fe70d2f69da7557c84d70686ec1fe4dada43916",
        sizes: ["38", "40", "41", "42", "43", "44", "45", "46", "47"],
      },
    ],
  },
  {
    id: "adidas-f50-hyperfast-elite-ll-fg",
    brand: "adidas",
    model: "adidas F50 Hyperfast Elite LL FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 239.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fadidas%2Ff50-hyperfast-elite-ll-fg-core-black-core-black-lucid-ray-blue",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/335850/750/bota-adidas-f50-hyperfast-elite-ll-fg-core-black-core-black-lucid-ray-blue-1.jpg",
        sizes: ["39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46", "47"],
      },
      {
        store: "ForumSport",
        price: 211.59,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=44926361476&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001094450-00-P-X-20260513144218.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5NzMzM3xpbWFnZS9qcGVnfGFHSmhMMmcxTkM4eE16YzJNakF6T1RZME5ERTVNQzl0WldScFlYTmZNVEF3TVRBNU5EUTFNRjh3TUY5UVgxZ3RNakF5TmpBMU1UTXhORFF5TVRndWFuQm58MzI3Mzk2MmZlY2MyOGVlOTU1Y2ZhN2FiNWEzZTMyNjUyOTBmOGZlOTE2OTU5M2U1YjM5Yjg4NzA5ZjdhNzU5Nw&feedId=58083&k=d856d2dae5d9ab1d3609f14daa1c52e981c76ad0",
        sizes: ["40", "42", "44"],
      },
    ],
  },
  {
    id: "nike-phantom-6-high-pro-fg",
    brand: "Nike",
    model: "Nike Phantom 6 High Pro FG",
    groundType: "FG",
    offers: [
      {
        store: "FutbolEmotion",
        price: 135.99,
        shipping: 0,
        url: "https://tc.tradetracker.net/?c=35939&m=2066871&a=514692&r=&u=https%3A%2F%2Fwww.futbolemotion.com%2Fes%2Fcomprar%2Fbota-de-futbol%2Fnike%2Fphantom-6-high-pro-fg-racer-blue-pink-blast-white",
        imageUrl: "https://www.futbolemotion.com/imagesarticulos/301038/750/bota-nike-phantom-6-high-pro-fg-azul-1.jpg",
        sizes: ["38.5", "39", "40", "40.5", "41", "42", "42.5", "43", "44", "44.5", "45", "45.5", "46"],
      },
      {
        store: "ForumSport",
        price: 101.99,
        shipping: 3.99,
        url: "https://www.awin1.com/pclick.php?p=44846712127&a=3013769&m=23805",
        imageUrl: "https://images2.productserve.com/?w=200&h=200&bg=white&trim=5&t=letterbox&url=ssl%3Awww.forumsport.com%2Fmedias%2Fmedias-1001078979-00-P-X-20251211144707.jpg%3Fcontext%3DbWFzdGVyfGltYWdlc3w5OTQ0NnxpbWFnZS9qcGVnfGFEUmtMMmczWXk4eE16TTVOekE0TlRVMU1qWTNNQzl0WldScFlYTmZNVEF3TVRBM09EazNPVjh3TUY5UVgxZ3RNakF5TlRFeU1URXhORFEzTURjdWFuQm58MjY3YmJkNzU2OGVkNzdjZGEyMmUyMTU1YjhlMTNhNGFkNTg4MWU4ZTI4MTg1MmI3MDIyY2MyMGNhYTIwMjQyMg&feedId=58083&k=0e57d96a15db0217703354b3194416b596428707",
        sizes: ["36", "38", "40", "41", "42", "47"],
      },
    ],
  },
];