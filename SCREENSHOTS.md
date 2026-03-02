# Application Screenshots

Complete visual documentation of the AI-Powered Factory Productivity Dashboard.

---

## 📸 Table of Contents

1. [Registration Page](#registration-page)
2. [Login Page](#login-page)
3. [Dashboard - Overview](#dashboard-overview)
4. [Dashboard - Worker Metrics](#dashboard-worker-metrics)
5. [Dashboard - Workstation Metrics](#dashboard-workstation-metrics)

---

## Registration Page

**URL:** `/register` or click "Don't have an account? Register here" from login page

**Features:**

- Email address input with validation
- Password input with toggle visibility (eye icon)
- Create Account button
- Link to login page for existing users
- Clean, modern UI with gradient background
- Responsive design

![Registration Page](screenshots/register-page.png)

**How to access:**

1. Navigate to the application root URL
2. Click "Already have an account? Sign in"
3. Then click "Don't have an account? Register here"

---

## Login Page

**URL:** `/login` (default landing page)

**Features:**

- Email/password authentication form
- Secure JWT token-based authentication
- Link to registration page
- Clean, professional interface
- Error handling for invalid credentials

![Login Page](screenshots/login-page.png)

**Default Credentials:**

- Email: `admin@factory.com`
- Password: `password123`
- Role: `admin`

---

## Dashboard - Overview

**URL:** `/dashboard` (protected route, requires authentication)

**Features:**

- Factory-level metrics cards
  - Total Workers count
  - Total Workstations count
  - Average Utilization percentage
  - Total Production units
- Seed Sample Data button for testing
- Logout functionality
- Real-time metrics computation

![Dashboard Overview](screenshots/dashboard-overview.png)

---

## Dashboard - Worker Metrics

**Section:** Worker Performance Table

**Displayed Metrics:**

- Worker ID (e.g., W001, W002)
- Worker Name
- Active Time (minutes)
- Idle Time (minutes)
- Utilization % with color-coded bar
  - Green: High utilization (>70%)
  - Yellow: Medium utilization (40-70%)
  - Red: Low utilization (<40%)
- Units Produced
- Production Rate (units/hour)

![Worker Metrics Table](screenshots/worker-metrics.png)

**Features:**

- Sortable columns
- Color-coded utilization bars for quick insights
- Real-time calculations from event data

---

## Dashboard - Workstation Metrics

**Section:** Workstation Performance Table

**Displayed Metrics:**

- Station ID (e.g., S001, S002)
- Station Name
- Occupancy Time (minutes)
- Utilization % with color-coded bar
- Total Units Produced
- Throughput Rate (units/hour)

![Workstation Metrics Table](screenshots/workstation-metrics.png)

**Features:**

- Visual utilization indicators
- Throughput calculations
- Occupancy tracking

---

## How to Add Screenshots

### Step 1: Create Screenshots Folder

```bash
# In project root directory
mkdir screenshots
```

### Step 2: Take Screenshots

**Recommended tools:**

- Windows: `Win + Shift + S` (Snipping Tool)
- Mac: `Cmd + Shift + 4`
- Browser DevTools: Full page screenshot (F12 → Console → Ctrl+Shift+P → "Capture full size screenshot")

### Step 3: Save Screenshots

Save your screenshots in the `screenshots/` folder with these recommended names:

- `register-page.png` - Registration form
- `login-page.png` - Login form
- `dashboard-overview.png` - Dashboard main view
- `worker-metrics.png` - Worker performance table
- `workstation-metrics.png` - Workstation performance table
- `seed-data-button.png` - Seed data functionality
- `factory-metrics-cards.png` - Top metrics cards close-up

### Step 4: Update This File

Add your screenshots using markdown image syntax:

```markdown
![Description Text](screenshots/your-image-name.png)
```

### Step 5: Commit and Push

```bash
git add screenshots/
git add SCREENSHOTS.md
git commit -m "Add application screenshots"
git push
```

---

## Image Guidelines

**Recommended Specifications:**

- Format: PNG or JPG
- Resolution: 1920x1080 or higher
- File size: < 2MB per image (compress if needed)
- Naming: Use kebab-case (lowercase with hyphens)

**Best Practices:**

- Capture full browser window
- Use consistent window sizes
- Hide sensitive information (passwords, emails if not demo data)
- Use light mode for better visibility
- Capture both desktop and mobile views if responsive

---

## Screenshot Checklist

Use this checklist to ensure complete documentation:

- [ ] Registration Page (clean form)
- [ ] Registration Page with validation error
- [ ] Login Page (default view)
- [ ] Login Page with authentication error
- [ ] Dashboard Overview (after login)
- [ ] Dashboard with no data (empty state)
- [ ] Dashboard with seeded data (populated tables)
- [ ] Worker Metrics Table (expanded view)
- [ ] Workstation Metrics Table (expanded view)
- [ ] Factory Metrics Cards (close-up)
- [ ] Mobile View - Login
- [ ] Mobile View - Dashboard
- [ ] Logout Confirmation
- [ ] Loading States

---

## Embedding in README

To showcase screenshots in the main README.md, add:

```markdown
## 📸 Screenshots

### Login Page

![Login](screenshots/login-page.png)

### Dashboard

![Dashboard](screenshots/dashboard-overview.png)

For complete visual documentation, see [SCREENSHOTS.md](SCREENSHOTS.md).
```

---

## Notes

- Images are referenced relative to the project root
- Ensure `screenshots/` folder is not in `.gitignore`
- Consider using GitHub-compatible paths for public repositories
- For large images, consider using image hosting (Imgur, GitHub releases)
- Add alt text for accessibility

---

**Last Updated:** March 2, 2026  
**Application Version:** 1.0.0
