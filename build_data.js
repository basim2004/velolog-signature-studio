const fs = require('fs');

const veloLogoBase64 = 'data:image/png;base64,' + fs.readFileSync('logo/file -03.png').toString('base64');
const isoLogoBase64 = 'data:image/png;base64,' + fs.readFileSync('logo/ISO Certified Seal and JCTRANS Logo.png').toString('base64');

const employees = [
  {
    id: 'sudeer',
    name: 'MOHAMMED SUDEER',
    title: 'General Manager',
    department: 'Management',
    phone: '+966 573602726',
    email: 'sudeer@velologsa.com',
    detailsImage: 'details/SUDHEER.jpg.jpeg',
    note: 'General Manager leading VELOLOG KSA operations'
  },
  {
    id: 'amjed',
    name: 'AMJED AZEEZ',
    title: 'Business Development Manager',
    department: 'Sales & Business Development',
    phone: '+966 534832448',
    email: 'amjed@velologsa.com',
    detailsImage: 'details/AMJED- MAIL.png',
    note: 'Overseeing corporate client partnerships and freight accounts'
  },
  {
    id: 'shabbir',
    name: 'SHABBIR KHAN',
    title: 'Sales Manager',
    department: 'Sales & Business Development',
    phone: '0536222984 | 0552819901',
    phonePrimary: '+966 536222984',
    phoneSecondary: '+966 552819901',
    email: 'shabbir@velologsa.com',
    detailsImage: 'details/SHABBIR KHAN.jpg.jpeg',
    note: 'Leading sales strategy and enterprise freight accounts'
  },
  {
    id: 'hafeez',
    name: 'MOHAMMED HAFEEZ',
    title: 'Operations and Sales Executive',
    department: 'Operations & Sales',
    phone: '+966 533679606',
    email: 'hafeez@velologsa.com',
    detailsImage: 'details/HAFEEZ.png',
    note: 'Operations execution and customer delivery coordination'
  },
  {
    id: 'alaftageen',
    name: 'MUHAMMAD ALAFTAGEEN',
    title: 'Sales Executive',
    department: 'Sales & Business Development',
    phone: '0558991537',
    phonePrimary: '+966 558991537',
    email: 'bde.ksa@velologsa.com',
    detailsImage: 'details/Muhammad Alaftageen Mail Signature.png',
    note: 'Business development and client logistics solutions'
  },
  {
    id: 'naseeh',
    name: 'MUHAMMED NASEEH',
    title: 'Accounts Department',
    department: 'Accounts',
    phone: '+966 546979474',
    email: 'accounts@velologsa.com',
    detailsImage: 'details/NASEEH.png',
    note: 'Financial accounting, billing, and invoicing management'
  },
  {
    id: 'sanjid',
    name: 'SANJID P',
    title: 'Operation/ Pricing',
    department: 'Operations & Pricing',
    phone: '+966 538667355',
    email: 'ops@velologsa.com',
    detailsImage: 'details/SANJID.png',
    note: 'Freight pricing quotation and shipment routing'
  },
  {
    id: 'yadhu',
    name: 'YADHU KRISHNA T',
    title: 'Operation/ Pricing',
    department: 'Operations & Pricing',
    phone: '+91 9778156150',
    email: 'opp@velologsa.com',
    detailsImage: 'details/YADHU.png',
    note: 'International pricing analysis and cargo operations'
  },
  {
    id: 'nihal',
    name: 'NIHAL MUHYUDHEEN TK',
    title: 'Operation Executive',
    department: 'Operations',
    phone: '+966 546979474',
    email: 'nihal@velologsa.com',
    detailsImage: 'details/Nihal Muhyudheen Mail Signature.png',
    note: 'Shipment tracking, customs clearance, and road freight operations'
  }
];

const companyData = {
  name: 'VELOLOG',
  brandColor: '#2056a5',
  brandColorDark: '#12396e',
  brandColorLight: '#ebf2fa',
  tagline: 'Across Miles, Beyond Limits',
  address: 'An Nawras, King Saud Road, Dammam, Building 4612 Office 102, Saudi Arabia',
  addressShort: 'An Nawras, King Saud Road, Dammam, Building 4612 Office 102',
  mapUrl: 'https://maps.google.com/?q=An+Nawras+King+Saud+Road+Dammam+Saudi+Arabia',
  website: 'www.velologsa.com',
  websiteUrl: 'https://www.velologsa.com',
  linkedinUrl: 'https://www.linkedin.com/company/velolog',
  whatsappUrl: 'https://wa.me/966546979474',
  cta1: {
    text: 'Request a Freight Quote',
    url: 'https://www.velologsa.com#quote'
  },
  cta2: {
    text: 'Book a Call with Us',
    url: 'https://www.velologsa.com#contact'
  },
  assets: {
    veloLogoPath: 'logo/file -03.png',
    isoLogoPath: 'logo/ISO Certified Seal and JCTRANS Logo.png',
    veloLogoBase64: veloLogoBase64,
    isoLogoBase64: isoLogoBase64
  }
};

const output = `// VELOLOG Staff & Brand Dataset
const VELOLOG_EMPLOYEES = ${JSON.stringify(employees, null, 2)};

const VELOLOG_COMPANY = ${JSON.stringify(companyData, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VELOLOG_EMPLOYEES, VELOLOG_COMPANY };
}
`;

fs.writeFileSync('data.js', output, 'utf8');
console.log('Successfully generated data.js (' + fs.statSync('data.js').size + ' bytes)');
