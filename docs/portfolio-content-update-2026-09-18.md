# Portfolio content update — 18 September 2026

This content-only update uses Ujjwal Kumar's supplied Career Project Portfolio (44 pages), ANKURAM IVF Work Dossier (19 pages), and RIAOM image archive (156 JPGs).

## Scope

- Expanded all 12 existing project detail pages and added 13 missing project/workstream pages: 25 in total.
- Preserved every existing project URL, original project-card copy, and the 12 featured homepage selections. The full catalogue is on `/projects`. New projects can be featured from the CMS.
- Rewrote only the ANKURAM experience entry, shown on both Home and Experience, around the confirmed current title **Head of Growth & IT**. The displayed date is employment tenure, not an invented title-promotion date.
- Added 15 selected archival photographs/creatives plus one original software screenshot with record IDs redacted. All media uses the existing CMS media directory and existing gallery renderer.
- No component, layout, style, animation, portrait, API, form, education, certification, or other employer changes.

## Editorial decisions

The case studies retain personal contribution, delivery approach, outcomes, and dated project status. Reported resume metrics remain attributed; local acceptance and implementation foundations are not promoted into production launches. The 350+ directly established kiosks remain a subset of the wider 1,200+ merchant network. Shared programme outcomes are not additive.

The archive is predominantly RIAOM fieldwork. Distinct relevant images were selected rather than repeating near-duplicate shots. Unrelated landscape images, an uncredited newspaper clipping, unverified medical-claim creatives, uncertain assignments, and personal-document/vehicle details were omitted. No archive participant is labelled as an inmate or patient. Projects without matching supplied media remain text case studies; no stock image or fabricated software screenshot fills that gap.

The lead-sync screenshot is the original embedded image from portfolio page 29. With the user's approval, 12 solid rectangles cover only operational record IDs. It is saved losslessly as PNG; an automated pixel comparison verified zero changed pixels outside those rectangles. No unredacted screenshot or source PDF is published.

## Project source map

| Source ID | Portfolio page | Website project ID | Page |
|---|---:|---|---|
| S01 | 6 | `real-estate-digital-campaign-delivery` | Added |
| S02 | 7 | `integrated-property-communication-brand-assets` | Added |
| R01 | 8 | `retail-banking-kiosk-rollout` | Added |
| R02 | 9 | `saral-pe-fintech-launch` | Expanded |
| R03 | 11 | `rural-livelihood-micro-entrepreneurship-program` | Expanded |
| R04 | 14 | `prison-inmate-rehabilitation-micro-manufacturing-program` | Expanded |
| R05 | 15 | `covid-19-emergency-response` | Expanded |
| R06 | 17 | `rural-telemedicine-pilots` | Expanded |
| H01 | 19 | `residential-property-acquisition-campaigns` | Added |
| H02 | 20 | `property-pipeline-budget-allocation` | Added |
| H03 | 21 | `property-launches-brand-communication` | Added |
| A01 | 22 | `ivf-growth-engine` | Expanded |
| A02 | 23 | `automation-first-marketing-org` | Expanded |
| A03 | 24 | `telecalling-performance-management-reporting` | Expanded |
| A04 | 25 | `marketing-measurement-management-dashboards` | Added |
| A05 | 26 | `aeo-ai-search-alignment` | Expanded |
| A06 | 27 | `multi-platform-content-operations` | Expanded |
| A07 | 28 | `lead-data-reconciliation-crm-reliability` | Expanded |
| A08 | 30 | `fieldops-healthcare-field-operations-platform` | Expanded |
| A09 | 31 | `ankuram-website-content-governance` | Added |
| A10 | 32 | `ankuram-os-revenue-operations` | Added |
| A11 | 33 | `appointment-booking-engine` | Added |
| A12 | 34 | `central-mis-clinical-information` | Added |
| A13 | 35 | `dynamic-qr-destination-management` | Added |
| A14 | 36 | `operating-procedures-management-enablement` | Added |

## Media source map

| Public asset | Supplied source | Used on |
|---|---|---|
| `saral-cash-point-creative.webp` | IMG-20200328-WA0007.jpg | saral-pe-fintech-launch, retail-banking-kiosk-rollout |
| `saral-sewa-medtel-creative.webp` | IMG-20200411-WA0001.jpg | rural-telemedicine-pilots |
| `cultivation-field-discussion.webp` | IMG-20200206-WA0004.jpg | rural-livelihood-micro-entrepreneurship-program |
| `mushroom-harvest-group.webp` | IMG-20200313-WA0008.jpg | rural-livelihood-micro-entrepreneurship-program |
| `mushroom-cultivation-room.webp` | IMG-20200128-WA0019.jpg | rural-livelihood-micro-entrepreneurship-program |
| `cultivation-material-preparation.webp` | IMG-20200224-WA0023.jpg | rural-livelihood-micro-entrepreneurship-program |
| `harvested-mushrooms.webp` | IMG-20200313-WA0005.jpg | rural-livelihood-micro-entrepreneurship-program |
| `lamp-component-assembly.webp` | IMG-20200625-WA0005.jpg | rural-livelihood-micro-entrepreneurship-program |
| `assembled-lamp-units.webp` | IMG-20200625-WA0008.jpg | rural-livelihood-micro-entrepreneurship-program |
| `small-press-equipment.webp` | IMG-20200503-WA0043.jpg | rural-livelihood-micro-entrepreneurship-program |
| `plate-product-samples.webp` | IMG-20200503-WA0058.jpg | rural-livelihood-micro-entrepreneurship-program |
| `emergency-fabric-cutting.webp` | IMG-20200324-WA0002.jpg | covid-19-emergency-response |
| `emergency-sewing-workspace.webp` | IMG-20200324-WA0005.jpg | covid-19-emergency-response |
| `face-shield-assembly.webp` | IMG-20200404-WA0022.jpg | covid-19-emergency-response |
| `face-shield-components.webp` | IMG-20200404-WA0021.jpg | covid-19-emergency-response |
| `ankuram-leads-sync-redacted.png` | Career Project Portfolio, page 29, embedded original screenshot | lead-data-reconciliation-crm-reliability |

## CMS maintenance

Open `/admin/`, then **Portfolio → Projects** to edit a case study. Use **Additional details**, **Role on this project**, **Project period**, **Project outcome**, and **Project gallery** (image, description, caption). **Featured** controls whether an entry appears on Home. Keep stable IDs unchanged to preserve existing links.

Use **Portfolio → Experience** for the ANKURAM entry. Uploaded images are under `public/media/projects`; future CMS uploads continue using the existing `public/media` library. No CMS configuration change or paid service was introduced.

## Verification

The existing preservation suite was updated only to permit the owner-requested ANKURAM content fields and future CMS project additions while retaining all six prior CV project IDs. Original CSS, animation, portrait, homepage component bodies, other experience entries, certifications, and original six project cards remain protected.

- `npm test`: 40 passing tests, including original-design preservation.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser: all 25 detail routes rendered their expected titles and case-study content at desktop width; no horizontal overflow.
- Browser at 390 px: all 25 detail routes and the Experience page had no horizontal overflow.
- Browser: all 17 gallery references (16 unique images) decoded successfully with non-empty image descriptions.
- Total added media: 1,870,505 bytes; photos encoded as WebP, redacted screenshot lossless PNG.

Content checking does not revalidate the historical business metrics or email/Sheets/CMS backend integrations.

## Gallery framing follow-up

Following the owner's screenshot feedback, project gallery images use consistent 4:3 frames. Photographs fill the frame without stretching; the growing-material preparation portrait is anchored at the top to retain the person and activity. Screenshots and service creatives show the complete image inside the frame, preserving their text. Source image files and captions are unchanged.

Under **Portfolio → Projects → Project gallery**, **Image fit** selects **Fill frame (crop)** or **Show full image**. **Crop focus** selects the part of a photograph to keep visible. These controls apply to each gallery image independently.

Verified the nine livelihood photos at desktop and 390 px mobile widths: every frame is 4:3, every image loads, and neither viewport has horizontal overflow. Visually inspected the corrected second row and assembly crop, and checked the software screenshot uses full-image mode. Build, type check, all 40 existing tests, and CMS YAML parsing passed.
