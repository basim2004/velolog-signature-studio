/**
 * VELOLOG Email Signature Generator Core - Final Design Lock
 * Exactly adheres to the Approved Final Design Specification:
 * - Left: Original VELOLOG Stacked Logo (mark, VELOLOG, tagline) in brand blue (#2154a3)
 * - Thin vertical divider (#caddec)
 * - Center: Employee Name (bold navy blue #102f67), Designation (brand blue #2154a3),
 *           Department (slate gray #475569), Contact Rows with solid blue icons (phone, mail, pin, globe)
 * - Right: Approved Dotted World Map Graphic & "GLOBAL FREIGHT. SMART LOGISTICS."
 * - Bottom-Right: Original ISO 9001 Seal & JCTRANS Logo with thin divider
 * - 100% Email-Safe HTML Tables with Inline CSS
 * - Fixed column proportions preventing layout shifts
 */

/**
 * Format phone string into clean display and tel: link
 */
function parsePhoneNumbers(phoneStr) {
  if (!phoneStr) return [];
  const parts = phoneStr.split(/[|,/]/).map(p => p.trim()).filter(Boolean);
  return parts.map(raw => {
    let clean = raw.replace(/[^\d+]/g, '');
    if (clean.startsWith('05')) {
      clean = '+966' + clean.slice(1);
    } else if (clean.startsWith('5') && clean.length === 9) {
      clean = '+966' + clean;
    }
    return {
      display: raw,
      tel: clean.startsWith('+') ? clean : ('+' + clean)
    };
  });
}

/**
 * Main signature HTML generator
 */
function generateSignatureHtml(employee, options = {}) {
  const company = (typeof VELOLOG_COMPANY !== 'undefined') ? VELOLOG_COMPANY : (typeof require !== 'undefined' ? require('./data.js').VELOLOG_COMPANY : {});

  // Settings & options
  const useBase64 = options.useBase64 !== undefined ? options.useBase64 : true;
  const showAddress = options.showAddress !== undefined ? options.showAddress : true;
  const showRegards = options.showRegards !== undefined ? options.showRegards : false;
  const customRegards = options.regardsText || 'Best regards,';
  
  // Custom or overridden employee fields
  const name = (options.name || employee.name || '').trim();
  const title = (options.title || employee.title || '').trim();
  const department = (options.department || employee.department || '').trim();
  const phone = (options.phone || employee.phone || '').trim();
  const email = (options.email || employee.email || '').trim();

  // Assets (Base64 or Hosted URLs)
  const assets = company.assets || {};
  const logoSrc = useBase64 && assets.logoStacked ? assets.logoStacked : 'assets/velolog_logo_stacked.png';
  const mapSrc = useBase64 && assets.worldMap ? assets.worldMap : 'assets/world_map_dotted.png';
  const accSrc = useBase64 && assets.accreditations ? assets.accreditations : 'assets/accreditations_badges.png';
  const iconPhoneSrc = useBase64 && assets.iconPhone ? assets.iconPhone : 'assets/icon_phone.png';
  const iconMailSrc = useBase64 && assets.iconMail ? assets.iconMail : 'assets/icon_mail.png';
  const iconPinSrc = useBase64 && assets.iconPin ? assets.iconPin : 'assets/icon_pin.png';
  const iconGlobeSrc = useBase64 && assets.iconGlobe ? assets.iconGlobe : 'assets/icon_globe.png';

  // Phone parsing
  const phoneList = parsePhoneNumbers(phone);
  let phoneHtml = '';
  if (phoneList.length > 0) {
    phoneHtml = phoneList.map((p) => 
      `<a href="tel:${p.tel}" style="color: #1e293b; text-decoration: none; font-weight: 500;">${p.display}</a>`
    ).join('<span style="color: #94a3b8; margin: 0 4px;">|</span>');
  }

  // Address
  const addressLine1 = company.addressLine1 || 'An Nawras, King Saud Road,';
  const addressLine2 = company.addressLine2 || 'Dammam, Building 4612 Office 102';

  return `<!-- VELOLOG OFFICIAL EMAIL SIGNATURE START -->
<table id="velolog-signature" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; background-color: #ffffff; width: 640px; min-width: 640px; max-width: 640px; font-family: Arial, Helvetica, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
  ${showRegards ? `<tr><td colspan="3" style="padding-bottom: 8px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #334155; font-weight: normal;">${customRegards}</td></tr>` : ''}
  <tr>
    <!-- LEFT SECTION: Stacked VELOLOG Logo (top-aligned with name) -->
    <td valign="top" align="center" style="width: 140px; min-width: 140px; max-width: 140px; padding: 2px 14px 4px 0; border-right: 1px solid #caddec; text-align: center;">
      <a href="${company.websiteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
        <img src="${logoSrc}" alt="VELOLOG" width="112" style="display: block; width: 112px; max-width: 112px; height: auto; border: 0; margin: 0 auto;" />
      </a>
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 8.5px; font-weight: 600; color: #2154a3; letter-spacing: 0.2px; line-height: 12px; margin-top: 10px; text-align: center; white-space: nowrap;">
        Across Miles. Beyond Limits.
      </div>
    </td>

    <!-- CENTER SECTION: Employee Details & Contact Rows -->
    <td valign="top" align="left" style="width: 260px; min-width: 260px; max-width: 260px; padding: 4px 16px 4px 18px; text-align: left;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
        <!-- Full Name in Bold Dark Navy -->
        <tr>
          <td style="font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; color: #102f67; line-height: 22px; padding: 0 0 2px 0;">
            ${name}
          </td>
        </tr>
        <!-- Designation in VELOLOG Brand Blue -->
        <tr>
          <td style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; font-weight: 600; color: #2154a3; line-height: 17px; padding: 0 0 2px 0;">
            ${title}
          </td>
        </tr>
        <!-- Department in Slate Gray -->
        <tr>
          <td style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: normal; color: #475569; line-height: 16px; padding: 0 0 8px 0;">
            ${department}
          </td>
        </tr>

        <!-- Contact Rows with Brand Blue Icons -->
        <tr>
          <td style="padding: 0;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; font-size: 11.5px; color: #1e293b;">
              ${phoneHtml ? `<!-- Phone -->
              <tr>
                <td valign="middle" style="width: 20px; min-width: 20px; padding: 2px 0; text-align: left;">
                  <img src="${iconPhoneSrc}" alt="Phone" width="14" height="14" style="display: block; width: 14px; height: 14px; border: 0;" />
                </td>
                <td valign="middle" style="padding: 2px 0 2px 6px;">
                  ${phoneHtml}
                </td>
              </tr>` : ''}
              <!-- Email -->
              <tr>
                <td valign="middle" style="width: 20px; min-width: 20px; padding: 2px 0; text-align: left;">
                  <img src="${iconMailSrc}" alt="Email" width="14" height="14" style="display: block; width: 14px; height: 14px; border: 0;" />
                </td>
                <td valign="middle" style="padding: 2px 0 2px 6px;">
                  <a href="mailto:${email}" style="color: #1e293b; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <!-- Address -->
              ${showAddress ? `
              <tr>
                <td valign="top" style="width: 20px; min-width: 20px; padding: 3px 0 2px 0; text-align: left;">
                  <img src="${iconPinSrc}" alt="Address" width="14" height="16" style="display: block; width: 14px; height: 16px; border: 0;" />
                </td>
                <td valign="top" style="padding: 2px 0 2px 6px; color: #1e293b; line-height: 14px; font-size: 11px;">
                  ${addressLine1}<br>${addressLine2}
                </td>
              </tr>` : ''}
              <!-- Website (Seamless, balanced spacing) -->
              <tr>
                <td valign="middle" style="width: 20px; min-width: 20px; padding: 2px 0; text-align: left;">
                  <img src="${iconGlobeSrc}" alt="Website" width="14" height="14" style="display: block; width: 14px; height: 14px; border: 0;" />
                </td>
                <td valign="middle" style="padding: 2px 0 2px 6px;">
                  <a href="${company.websiteUrl}" target="_blank" style="color: #2154a3; text-decoration: none; font-weight: bold; font-size: 12px; line-height: 14px;">www.velologsa.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>

    <!-- RIGHT SECTION: Dotted World Map & "GLOBAL FREIGHT. SMART LOGISTICS." & Accreditation Seals -->
    <td valign="top" align="right" style="width: 240px; min-width: 240px; max-width: 240px; padding: 4px 0 4px 6px; text-align: right;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; margin-left: auto;">
        <!-- Upper Row: World Map & Text -->
        <tr>
          <td valign="top" align="right" style="padding-bottom: 44px;">
            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-left: auto;">
              <tr>
                <td valign="middle" style="padding-right: 6px;">
                  <img src="${mapSrc}" alt="Global Freight Network" width="136" style="display: block; width: 136px; max-width: 136px; height: auto; border: 0;" />
                </td>
                <td valign="middle" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: bold; color: #2154a3; letter-spacing: 0.3px; line-height: 14px; text-transform: uppercase; white-space: nowrap; text-align: left;">
                  GLOBAL FREIGHT.<br>SMART LOGISTICS.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Lower Row: ISO 9001 Seal | Divider | JCTRANS Logo -->
        <tr>
          <td valign="bottom" align="right" style="text-align: right; padding-right: 2px;">
            <img src="${accSrc}" alt="ISO 9001 Certified & JCTRANS Member ID 159403" width="165" style="display: block; width: 165px; max-width: 165px; height: auto; border: 0; margin-left: auto;" />
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
<!-- VELOLOG OFFICIAL EMAIL SIGNATURE END -->`;
}

/**
 * Generate a complete standalone HTML document with UTF-8 encoding
 */
function generateCleanHtmlDocument(employee, options = {}) {
  const signatureHtml = generateSignatureHtml(employee, options);
  const employeeName = (options.name || employee.name || 'VELOLOG Employee').trim();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VELOLOG Email Signature - ${employeeName}</title>
  <style>
    body {
      margin: 20px;
      padding: 0;
      background-color: #f8fafc;
      font-family: Arial, sans-serif;
    }
    .signature-container {
      max-width: 680px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 10px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="signature-container">
    ${signatureHtml}
  </div>
</body>
</html>`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateSignatureHtml, generateCleanHtmlDocument, parsePhoneNumbers };
}
