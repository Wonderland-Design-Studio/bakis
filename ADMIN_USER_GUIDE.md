# Bakis Engineering – Administrator Product Management Guide

Welcome to the **Bakis Engineering Product Management & Catalog Administration Suite**. This guide provides step-by-step instructions for authorized administrators to access the portal, upload new products, update existing specifications, manage photography, and monitor live mobile previews.

---

## Table of Contents
1. [Portal Access & Login](#1-portal-access--login)
2. [Managing Existing Products](#2-managing-existing-products)
3. [Uploading a New Product](#3-uploading-a-new-product)
4. [Editing Existing Products](#4-editing-existing-products)
5. [Image Guidelines & Optimization](#5-image-guidelines--optimization)
6. [Color Themes & Bento Styling](#6-color-themes--bento-styling)
7. [Mobile Testing & Live QR Connect](#7-mobile-testing--live-qr-connect)
8. [Session Security & Logging Out](#8-session-security--logging-out)
9. [Troubleshooting & Emergency Reset](#9-troubleshooting--emergency-reset)

---

## 1. Portal Access & Login

To prevent public tampering while keeping customer browsing clean, the product management area is protected behind an authentication gate.

### Step 1: Locate the Staff Portal Entry
1. Open the website: [http://localhost:8080/](http://localhost:8080/) (or your live domain).
2. Scroll down to the bottom **footer**.
3. In the footer copyright bar, click the **Staff Portal** button (marked with a lock icon).

### Step 2: Authenticate
In the **Admin Authentication** dialog, enter your administrator credentials:

- **Administrator Email**: `tsoanelomodise@gmail.com`
- **Password**: `qwe123`
- Click **Log In to Manager** (or press Enter).

Once verified, your session will be active and the **Product Management Suite** dashboard will open automatically.

---

## 2. Managing Existing Products

When the suite opens, the default tab is **Active Products**.

### Features in the Catalog Table:
- **Search / Filter**: Type keywords into the search box at the top to instantly filter products by name, category, or technical parameters.
- **Product Counter**: Shows total active products published in the live mosaic grid.
- **Color Theme Preview**: Displays the exact jewel-tone hex code and swatch assigned to the tile.
- **Key Specifications**: Quick overview of the primary engineering standards.
- **Action Buttons**:
  - **Edit (Pencil Icon)**: Loads the product directly into the edit form.
  - **Delete (Trash Icon)**: Removes the product from the catalog and live grid after confirmation.

---

## 3. Uploading a New Product

To add a new electrical equipment commodity to the live website:

### Step 1: Open the Upload Form
Click the **Upload New Product** tab at the top, or click the **Add Product** button in the catalog toolbar.

### Step 2: Fill in the Product Information
| Field | Requirement | Description & Example |
| :--- | :--- | :--- |
| **Product Title** | Required | Name of the equipment (e.g., `Vacuum Circuit Breakers (VCB)` or `Solar Combiner Box`). |
| **Category / Segment** | Required | Industry classification (e.g., `Medium & High Voltage`, `Power Enclosures`, `Renewables`). |
| **Technical Tagline** | Required | 1–2 sentence summary displayed on the card and modal header (e.g., `High-reliability arc-resistant modular units for substation primary distribution.`). |
| **Tile Theme Color** | Required | Select the background jewel tone for the mosaic card (see [Color Themes](#6-color-themes--bento-styling)). |
| **Overview Description** | Required | Detailed engineering overview. You can use standard paragraphs or HTML bullet lists `<ul><li>...</li></ul>`. |

### Step 3: Upload Product Photography
1. In the **Product Cutout Photograph** section, drag and drop an image file into the dropzone or click to browse.
2. Supports `.png`, `.jpg`, `.jpeg`, and `.webp`.
3. An instant preview will appear. If you need to change it, click the red **✕** button to remove the preview and upload another file.

### Step 4: Add Technical Specifications (4 Key Highlights)
The customer modal renders a dedicated 4-metric engineering highlights card. Provide 4 concise technical parameters:
- **Specification 1**: e.g., `Voltage Range` → `11kV – 33kV`
- **Specification 2**: e.g., `Rated Current` → `630A – 2500A`
- **Specification 3**: e.g., `Standards` → `IEC 62271-100 / SANS`
- **Specification 4**: e.g., `Protection Class` → `IP54 Indoor / IP65 Outdoor`

### Step 5: Save & Publish
Click **Save & Publish Product**.
- The product is immediately committed to the catalog.
- The live mosaic grid on the home page refreshes in real-time.
- Customers can immediately click the tile to open the spec sheet and request an RFQ quotation.

---

## 4. Editing Existing Products

1. In the **Active Products** table, find the product you wish to edit.
2. Click the blue **Edit (Pencil)** button on the right.
3. The form will pre-populate with all existing title, category, description, specs, and image data.
4. Update any values or upload a replacement image.
5. Click **Save & Update Product**.

---

## 5. Image Guidelines & Optimization

For the cleanest professional presentation matching the existing aesthetic:
- **Background**: Transparent background (`.png` with transparent alpha channel) is strongly recommended.
- **Subject Framing**: Centered or edge-anchored equipment photograph with shadows trimmed.
- **Dimensions**: Square or 4:3 aspect ratio (minimum `600 × 600 px` recommended).
- **File Size**: Keep images under 1.5MB for fast mobile loading.

---

## 6. Color Themes & Bento Styling

Choose a theme color that complements adjacent cards in the mosaic grid:

| Theme Name | Hex Code | Visual Tone | Recommended Categories |
| :--- | :--- | :--- | :--- |
| **Deep Turbine Navy** | `#253b58` | Dark Slate Blue | Circuit Breakers, Switchgear, Transformers |
| **Spruce Green** | `#265953` | Deep Emerald Spruce | Distribution Boards, Enclosures |
| **Slate Cyan** | `#398896` | High-Tech Cyan Grey | Control Panels, Automation, Relays |
| **Steel Slate** | `#2e4d68` | Cool Steel Blue | Substation Hardware, Busbars |
| **Terracotta Crimson** | `#8e393b` | Industrial Oxide Red | Surge Arrestors, Safety & Lightning |
| **Dark Indigo** | `#1e3352` | Deep Twilight Navy | Street Lighting, Luminaires |
| **Grid Forest** | `#1e4a3b` | Organic Forest Green | Solar Solutions, Inverters, Battery storage |
| **Bakis Dark Green** | `#0d4737` | Corporate Dark Green | Core Flagship Equipment |

---

## 7. Mobile Testing & Live QR Connect

The suite includes built-in mobile synchronization tools:
1. In the Admin Suite, click the **Mobile Access** tab.
2. Ensure your smartphone or tablet is connected to the same Wi-Fi network.
3. **Scan the QR Code** with your camera or click **Copy Link** to share the local testing address (`http://192.168.0.153:8080/`).
4. Any products you add or edit on desktop will appear on mobile upon refresh.

---

## 8. Session Security & Logging Out

- Your login remains stored for the active browser session (`sessionStorage`).
- When you have finished administering products, click the red **Log Out** button located in the top-right of the admin header.
- Closing the browser tab also automatically clears active session credentials.

---

## 9. Troubleshooting & Emergency Reset

- **Missing Image**: If a photo does not load immediately, re-open the product in the edit tab and re-upload the image.
- **Restoring Original Catalog**:
  - If test products clutter the catalog or you wish to revert to the factory dataset, open the upload form and click **Restore Factory Defaults**.
  - Confirm the prompt. This will reset the catalog back to the official Bakis Engineering 8-commodity lineup.
- **Forgotten Password**:
  - Contact the lead system developer or verify administrator credentials in `assets/js/main.js`.
