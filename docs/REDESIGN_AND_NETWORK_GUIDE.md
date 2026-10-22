# Reference redesign and same-network access

## Design

The landing page now follows the supplied Campus Connect reference: compact header/navigation, lavender/purple accents, searchable college finder, two-student campus hero, floating destination cards, college cards, career tiles, featured roadmap list and three guidance banners. It adapts to narrow screens. Authentication, student profiles, uploaded account photos and profile-based logout remain connected.

Counts and college details come from the existing catalogue. Ratings/review counts, mentor counts and inflated platform usage numbers were not invented. College information is still sample/admin-managed data. Featured cards prioritize entries with images; every record remains available in the directory. Hearts create an optional shortlist on the current browser/device, not a cloud-synced account list.

Header search opens matching career guides or filters the college directory. Home search/chips filter featured colleges. Community reads existing questions and allows signed-in students to post a public question. The mentorship section provides a private account-linked guidance-question planner, with an explicit notice that live mentor matching/messaging is not yet available. Notifications display an empty state; no unread activity is fabricated.

## Why LAN access failed

The current Wi-Fi IP is 192.168.1.4. The ignored .env still listed 192.168.31.188 in DJANGO_ALLOWED_HOSTS. That older address belonged to another network. Also, localhost/127.0.0.1 on a phone points at the phone itself, not this computer. Servers must bind to 0.0.0.0, and Windows/router settings must permit traffic.

Django now reads .env and, only when DEBUG=1, discovers this computer's private IPv4 addresses and adds them to allowed hosts/trusted development origins (ports 8000 and 3000). Production origins stay explicit. No wildcard host/CSRF exemption was added. Vite binds 0.0.0.0 with strict port 3000 and keeps API requests on the same browser origin through its proxy. The existing CSRF cookie/token checks remain enabled.

## Easiest same-Wi-Fi setup

From a normal PowerShell terminal:

```powershell
cd "D:\College Project\Campus"
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-lan.ps1
```

This applies migrations, builds the frontend and starts Django on 0.0.0.0:8000. Keep the terminal open.

On this computer: http://127.0.0.1:8000/

On a phone/laptop connected to the same Wi-Fi: http://192.168.1.4:8000/

If the computer's IP changes, run ipconfig and use the Wi-Fi IPv4 address. Restart Django after switching networks so development address discovery runs again. Do not use 0.0.0.0 as the browser address. Do not use localhost on the second device.

## Windows firewall

The current Wi-Fi connection is classified Public. A local-subnet-only firewall script is supplied for ports 8000/3000. Applying it was attempted but Windows returned Access denied because the session lacks administrator rights; no successful rule creation was claimed.

If other devices still cannot connect, open PowerShell with Run as administrator and run:

```powershell
cd "D:\College Project\Campus"
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\allow-lan.ps1
```

It allows only local-subnet traffic to TCP 8000/3000, not arbitrary Internet traffic, and leaves the firewall enabled. The script stops with an error if not elevated. To remove its rule later, use Remove-NetFirewallRule -DisplayName 'Campus Connect development - local subnet' in an administrator terminal.

If it still fails, check that both devices use the same non-guest Wi-Fi, disable a device VPN for the test, and check router client/AP isolation. Those router/device settings cannot be verified from this computer. No router port forwarding is required.

## Live frontend development

Terminal 1:

```powershell
cd "D:\College Project\Campus"
& "..\.venv\Scripts\python.exe" manage.py runserver 0.0.0.0:8000
```

Terminal 2:

```powershell
cd "D:\College Project\Campus"
npm run dev
```

On the second device use http://192.168.1.4:3000/static/frontend/. Using the single Django port 8000 after a build is simpler for reviews. Keep DJANGO_DEBUG=1 for local development and DJANGO_DEBUG=0 on Render. Local code/database changes still require deployment to appear on Render.

## Main files

- src/screens/HomeScreen.jsx: redesigned home content and interactions.
- src/screens/CampusHome.css: new design and responsive layout, layered over existing directory styles.
- src/components/landing/LandingHeader.jsx and LandingIcon.jsx: navigation, search and SVG icons.
- src/screens/ConnectScreens.jsx: community, private guidance planner and Explore.
- portal/connect_views.py: community/guidance APIs with authentication, CSRF and limits.
- campus_project/network.py and settings.py: safe development LAN discovery.
- vite.config.js: network binding and API proxy.
- scripts/start-lan.ps1 and allow-lan.ps1: launch and local-subnet firewall helpers.
- portal/test_network.py and test_connect.py: LAN, CSRF and account isolation tests.

## Artwork provenance

public/landing/campus-future.png is a new OpenAI ImageGen asset generated for this project. No source asset was overwritten. The user supplied the page mockup as design reference; the interface itself is React/CSS.

Prompt: Use case: lifestyle-photo. Asset type: wide hero background photograph for an Indian college discovery website. Two happy Indian university students age 19-22, one young man in a navy hoodie carrying a silver laptop and backpack, one young woman in a lavender blouse carrying books and backpack, standing together on a beautiful sunlit Indian university campus with sandstone academic buildings, lush trees and blue sky. Both students on the RIGHT half, visible from waist up. Student faces fully visible and naturally posed looking toward their bright future. LEFT third is softly blurred pale lavender and white sky, mostly empty to blend with code-rendered heading. Refined aspirational photography, natural warm sunlight, realistic faces and hands, soft lilac color grading. Wide landscape 16:9 composition. NO text, typography, logos, watermarks, user interface, buttons or cards. Background artwork only.
