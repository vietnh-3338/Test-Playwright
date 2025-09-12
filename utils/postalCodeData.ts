// Postal code data mapping for test verification
export interface PostalCodeData {
  postalCode: string;
  applicableRegion: string;
  governmentOfficeAddress: string;
  governmentOfficePhone: string;
  communityCenterAddress: string;
  communityCenterPhone: string;
  linkToCertificateForm: string;
  referenceLink1?: string;
  referenceLink2?: string;
  referenceLink3?: string;
}

// Sample postal code data from the CSV
export const POSTAL_CODE_DATA: PostalCodeData[] = [
  {
    postalCode: '0640941',
    applicableRegion: '札幌市中央区',
    governmentOfficeAddress: '札幌市中央区役所 保健福祉課福祉支援一・二係',
    governmentOfficePhone: '011‑205‑3304',
    communityCenterAddress: '札幌市中央区旭ケ丘5丁目6-51 中央区第2地域包括支援センター',
    communityCenterPhone: '011‑520‑3668',
    linkToCertificateForm: 'https://www.city.sapporo.jp/kaigo/k100citizen/k141sinse.html',
    referenceLink1: 'https://www.city.sapporo.jp/kaigo/k100citizen/k170houkatuyobou.html'
  },
  {
    postalCode: '0600041',
    applicableRegion: '札幌市中央区',
    governmentOfficeAddress: '札幌市中央区役所 保健福祉課福祉支援一・二係',
    governmentOfficePhone: '011‑205‑3304',
    communityCenterAddress: '札幌市中央区南2条西10丁目1001番5 中央区第1地域包括支援センター',
    communityCenterPhone: '011‑209‑2939',
    linkToCertificateForm: 'https://www.city.sapporo.jp/kaigo/k100citizen/k141sinse.html',
    referenceLink1: 'https://www.city.sapporo.jp/kaigo/k100citizen/k170houkatuyobou.html'
  },
  {
    postalCode: '0600042',
    applicableRegion: '札幌市中央区',
    governmentOfficeAddress: '札幌市中央区役所 保健福祉課福祉支援一・二係',
    governmentOfficePhone: '011‑205‑3304',
    communityCenterAddress: '札幌市中央区南2条西10丁目1001番5 中央区第1地域包括支援センター',
    communityCenterPhone: '011‑209‑2939',
    linkToCertificateForm: 'https://www.city.sapporo.jp/kaigo/k100citizen/k141sinse.html',
    referenceLink1: 'https://www.city.sapporo.jp/kaigo/k100citizen/k170houkatuyobou.html'
  },
  {
    postalCode: '0640820',
    applicableRegion: '札幌市中央区',
    governmentOfficeAddress: '札幌市中央区役所 保健福祉課福祉支援一・二係',
    governmentOfficePhone: '011‑205‑3304',
    communityCenterAddress: '札幌市中央区南2条西10丁目1001番5 中央区第1地域包括支援センター',
    communityCenterPhone: '011‑209‑2939',
    linkToCertificateForm: 'https://www.city.sapporo.jp/kaigo/k100citizen/k141sinse.html',
    referenceLink1: 'https://www.city.sapporo.jp/kaigo/k100citizen/k170houkatuyobou.html'
  },
  {
    postalCode: '0640802',
    applicableRegion: '札幌市中央区',
    governmentOfficeAddress: '札幌市中央区役所 保健福祉課福祉支援一・二係',
    governmentOfficePhone: '011‑205‑3304',
    communityCenterAddress: '札幌市中央区旭ケ丘5丁目6-51 中央区第2地域包括支援センター',
    communityCenterPhone: '011‑520‑3668',
    linkToCertificateForm: 'https://www.city.sapporo.jp/kaigo/k100citizen/k141sinse.html',
    referenceLink1: 'https://www.city.sapporo.jp/kaigo/k100citizen/k170houkatuyobou.html'
  }
];

// Helper function to get postal code data by postal code
export function getPostalCodeData(postalCode: string): PostalCodeData | undefined {
  return POSTAL_CODE_DATA.find(data => data.postalCode === postalCode);
}

// Helper function to format postal code for display (add hyphens)
export function formatPostalCodeForDisplay(postalCode: string): string {
  if (postalCode.length === 7) {
    return `${postalCode.substring(0, 3)}‑${postalCode.substring(3)}`;
  }
  return postalCode;
}
