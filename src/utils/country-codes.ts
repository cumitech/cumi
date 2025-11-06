// Country codes for African countries with MTN Money and Orange Money support
export interface CountryCode {
  code: string;
  name: string;
  flag: string;
  mtnMoney: boolean;
  orangeMoney: boolean;
  phonePrefix: string;
}

export const AFRICAN_COUNTRY_CODES: CountryCode[] = [
  // Cameroon (Default)
  {
    code: 'CM',
    name: 'Cameroon',
    flag: '🇨🇲',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+237',
  },
  // West Africa
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+234',
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+233',
  },
  {
    code: 'CI',
    name: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+225',
  },
  {
    code: 'SN',
    name: 'Senegal',
    flag: '🇸🇳',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+221',
  },
  {
    code: 'ML',
    name: 'Mali',
    flag: '🇲🇱',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+223',
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+226',
  },
  {
    code: 'NE',
    name: 'Niger',
    flag: '🇳🇪',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+227',
  },
  {
    code: 'TG',
    name: 'Togo',
    flag: '🇹🇬',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+228',
  },
  {
    code: 'BJ',
    name: 'Benin',
    flag: '🇧🇯',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+229',
  },
  {
    code: 'GN',
    name: 'Guinea',
    flag: '🇬🇳',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+224',
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    flag: '🇸🇱',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+232',
  },
  {
    code: 'LR',
    name: 'Liberia',
    flag: '🇱🇷',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+231',
  },
  {
    code: 'GM',
    name: 'Gambia',
    flag: '🇬🇲',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+220',
  },
  {
    code: 'GW',
    name: 'Guinea-Bissau',
    flag: '🇬🇼',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+245',
  },
  {
    code: 'CV',
    name: 'Cape Verde',
    flag: '🇨🇻',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+238',
  },
  // Central Africa
  {
    code: 'TD',
    name: 'Chad',
    flag: '🇹🇩',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+235',
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    flag: '🇨🇫',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+236',
  },
  {
    code: 'CG',
    name: 'Republic of the Congo',
    flag: '🇨🇬',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+242',
  },
  {
    code: 'CD',
    name: 'Democratic Republic of the Congo',
    flag: '🇨🇩',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+243',
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+241',
  },
  {
    code: 'GQ',
    name: 'Equatorial Guinea',
    flag: '🇬🇶',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+240',
  },
  {
    code: 'ST',
    name: 'São Tomé and Príncipe',
    flag: '🇸🇹',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+239',
  },
  // East Africa
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+256',
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    mtnMoney: false,
    orangeMoney: true,
    phonePrefix: '+254',
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+255',
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+250',
  },
  {
    code: 'BI',
    name: 'Burundi',
    flag: '🇧🇮',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+257',
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    flag: '🇪🇹',
    mtnMoney: false,
    orangeMoney: false,
    phonePrefix: '+251',
  },
  {
    code: 'ER',
    name: 'Eritrea',
    flag: '🇪🇷',
    mtnMoney: false,
    orangeMoney: false,
    phonePrefix: '+291',
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    flag: '🇩🇯',
    mtnMoney: false,
    orangeMoney: true,
    phonePrefix: '+253',
  },
  {
    code: 'SO',
    name: 'Somalia',
    flag: '🇸🇴',
    mtnMoney: false,
    orangeMoney: false,
    phonePrefix: '+252',
  },
  {
    code: 'SS',
    name: 'South Sudan',
    flag: '🇸🇸',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+211',
  },
  // Southern Africa
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+27',
  },
  {
    code: 'BW',
    name: 'Botswana',
    flag: '🇧🇼',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+267',
  },
  {
    code: 'NA',
    name: 'Namibia',
    flag: '🇳🇦',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+264',
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    flag: '🇿🇼',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+263',
  },
  {
    code: 'ZM',
    name: 'Zambia',
    flag: '🇿🇲',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+260',
  },
  {
    code: 'MW',
    name: 'Malawi',
    flag: '🇲🇼',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+265',
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    flag: '🇲🇿',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+258',
  },
  {
    code: 'MG',
    name: 'Madagascar',
    flag: '🇲🇬',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+261',
  },
  {
    code: 'MU',
    name: 'Mauritius',
    flag: '🇲🇺',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+230',
  },
  {
    code: 'SC',
    name: 'Seychelles',
    flag: '🇸🇨',
    mtnMoney: true,
    orangeMoney: false,
    phonePrefix: '+248',
  },
  {
    code: 'KM',
    name: 'Comoros',
    flag: '🇰🇲',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+269',
  },
  // North Africa
  {
    code: 'MA',
    name: 'Morocco',
    flag: '🇲🇦',
    mtnMoney: false,
    orangeMoney: true,
    phonePrefix: '+212',
  },
  {
    code: 'DZ',
    name: 'Algeria',
    flag: '🇩🇿',
    mtnMoney: false,
    orangeMoney: true,
    phonePrefix: '+213',
  },
  {
    code: 'TN',
    name: 'Tunisia',
    flag: '🇹🇳',
    mtnMoney: false,
    orangeMoney: true,
    phonePrefix: '+216',
  },
  {
    code: 'LY',
    name: 'Libya',
    flag: '🇱🇾',
    mtnMoney: false,
    orangeMoney: false,
    phonePrefix: '+218',
  },
  {
    code: 'EG',
    name: 'Egypt',
    flag: '🇪🇬',
    mtnMoney: false,
    orangeMoney: true,
    phonePrefix: '+20',
  },
  {
    code: 'SD',
    name: 'Sudan',
    flag: '🇸🇩',
    mtnMoney: true,
    orangeMoney: true,
    phonePrefix: '+249',
  },
];

// Get default country (Cameroon)
export const DEFAULT_COUNTRY = AFRICAN_COUNTRY_CODES.find(country => country.code === 'CM') || AFRICAN_COUNTRY_CODES[0];

// Get countries with MTN Money support
export const MTN_MONEY_COUNTRIES = AFRICAN_COUNTRY_CODES.filter(country => country.mtnMoney);

// Get countries with Orange Money support
export const ORANGE_MONEY_COUNTRIES = AFRICAN_COUNTRY_CODES.filter(country => country.orangeMoney);

// Get countries with both MTN Money and Orange Money
export const BOTH_MONEY_SERVICES_COUNTRIES = AFRICAN_COUNTRY_CODES.filter(country => country.mtnMoney && country.orangeMoney);

// Utility functions
export const getCountryByCode = (code: string): CountryCode | undefined => {
  return AFRICAN_COUNTRY_CODES.find(country => country.code === code);
};

export const getCountryByPhonePrefix = (prefix: string): CountryCode | undefined => {
  return AFRICAN_COUNTRY_CODES.find(country => country.phonePrefix === prefix);
};

export const formatPhoneNumber = (countryCode: string, phoneNumber: string): string => {
  const country = getCountryByCode(countryCode);
  if (!country) return phoneNumber;
  
  // Remove any existing country code from phone number
  const cleanNumber = phoneNumber.replace(/^\+?\d{1,4}/, '');
  return `${country.phonePrefix}${cleanNumber}`;
};

export const validatePhoneNumber = (countryCode: string, phoneNumber: string): boolean => {
  const country = getCountryByCode(countryCode);
  if (!country) {
    console.warn(`Country not found for code: ${countryCode}`);
    return false;
  }
  
  // Basic validation - remove country code, spaces, and check if remaining digits are valid
  const cleanNumber = phoneNumber
    .replace(/^\+?\d{1,4}/, '') // Remove country code prefix
    .replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
  
  const isValid = /^\d{6,15}$/.test(cleanNumber);
  
  return isValid; // 6-15 digits for African countries
};

// Normalize any input into E.164-like form using the provided country
// Ensures a single space after prefix for UI consistency when storing/displaying
export const normalizePhoneNumber = (countryCode: string, phoneNumber: string): string => {
  const country = getCountryByCode(countryCode);
  if (!country) return phoneNumber.trim();

  // Strip existing prefix and non-digit formatting except leading + in prefix
  const withoutPrefix = phoneNumber
    .replace(/^\+?\d{1,4}/, '')
    .replace(/[\s\-\(\)]/g, '')
    .replace(/^0+/, ''); // drop leading zeros common in local formats

  if (!withoutPrefix) return `${country.phonePrefix} `;

  return `${country.phonePrefix} ${withoutPrefix}`;
};

