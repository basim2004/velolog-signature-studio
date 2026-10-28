const fs = require('fs');

const b64Assets = JSON.parse(fs.readFileSync('assets/all_base64_assets.json', 'utf8'));

const employees = [
  {
    "id": "sudeer",
    "name": "Mohammed Sudeer",
    "title": "General Manager",
    "department": "Management",
    "phone": "+966 573602726",
    "email": "sudeer@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/SUDHEER.jpg.jpeg",
    "note": "General Manager leading VELOLOG KSA operations"
  },
  {
    "id": "amjed",
    "name": "Amjed Azeez",
    "title": "Business Development Manager",
    "department": "Sales & Business Development",
    "phone": "+966 534832448",
    "email": "amjed@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/AMJED- MAIL.png",
    "note": "Overseeing corporate client partnerships and freight accounts"
  },
  {
    "id": "shabbir",
    "name": "Shabbir Khan",
    "title": "Sales Manager",
    "department": "Sales & Business Development",
    "phone": "0536222984 | 0552819901",
    "phonePrimary": "+966 536222984",
    "phoneSecondary": "+966 552819901",
    "email": "shabbir@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/SHABBIR KHAN.jpg.jpeg",
    "note": "Leading sales strategy and enterprise freight accounts"
  },
  {
    "id": "hafeez",
    "name": "Mohammed Hafeez",
    "title": "Operations and Sales Executive",
    "department": "Operations & Sales",
    "phone": "+966 533679606",
    "email": "hafeez@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/HAFEEZ.png",
    "note": "Operations execution and customer delivery coordination"
  },
  {
    "id": "alaftageen",
    "name": "Muhammad Alaftageen",
    "title": "Sales Executive",
    "department": "Sales & Business Development",
    "phone": "0558991537",
    "phonePrimary": "+966 558991537",
    "email": "bde.ksa@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/Muhammad Alaftageen Mail Signature.png",
    "note": "Business development and client logistics solutions"
  },
  {
    "id": "naseeh",
    "name": "Muhammed Naseeh",
    "title": "Accounts Department",
    "department": "Accounts",
    "phone": "+966 546979474",
    "email": "accounts@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/NASEEH.png",
    "note": "Financial accounting, billing, and invoicing management"
  },
  {
    "id": "sanjid",
    "name": "Sanjid P",
    "title": "Operation / Pricing",
    "department": "Operations Department",
    "phone": "+966 538667355",
    "email": "sanjid@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/SANJID.png",
    "note": "Freight pricing quotation and shipment routing"
  },
  {
    "id": "yadhu",
    "name": "Yadhu Krishna T",
    "title": "Operation / Pricing",
    "department": "Operations & Pricing",
    "phone": "+91 9778156150",
    "email": "opp@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/YADHU.png",
    "note": "International pricing analysis and cargo operations"
  },
  {
    "id": "nihal",
    "name": "Nihal Muhyudheen TK",
    "title": "Operation Executive",
    "department": "Operations",
    "phone": "+966 546979474",
    "email": "nihal@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "details/Nihal Muhyudheen Mail Signature.png",
    "note": "Shipment tracking, customs clearance, and road freight operations"
  },
  {
    "id": "ishan",
    "name": "Ishan Ahmed",
    "title": "Operation Executive",
    "department": "Operations",
    "phone": "",
    "email": "ishan@velologsa.com",
    "gender": "male",
    "photo": "",
    "detailsImage": "",
    "note": "Operations executive coordinating freight logistics and shipment routing"
  }
];

const company = {
  name: "VELOLOG",
  tagline: "Across Miles, Beyond Limits",
  brandColor: "#2154a3",
  brandColorDark: "#102f67",
  brandColorSlate: "#475569",
  dividerColor: "#caddec",
  addressLine1: "An Nawras, King Saud Road,",
  addressLine2: "Dammam, Building 4612 Office 102",
  fullAddress: "An Nawras, King Saud Road, Dammam, Building 4612 Office 102, Saudi Arabia",
  website: "www.velologsa.com",
  websiteUrl: "https://www.velologsa.com",
  phone: "+966 546979474",
  email: "info@velologsa.com",
  assets: b64Assets
};

const fileContent = `// VELOLOG Staff & Brand Dataset - Final Design Lock
const VELOLOG_EMPLOYEES = ${JSON.stringify(employees, null, 2)};

const VELOLOG_COMPANY = ${JSON.stringify(company, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VELOLOG_EMPLOYEES, VELOLOG_COMPANY };
}
`;

fs.writeFileSync('data.js', fileContent, 'utf8');
console.log('data.js generated with locked assets!');
