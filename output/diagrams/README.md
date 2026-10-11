# Campus Web House diagrams

20 requested categories, 22 SVG diagrams, and a landscape PDF. Prepared 11 October 2026 for review 12 October 2026.

SVG files are scalable and open in a browser or vector editor. The generation source uses ReportLab and pypdf and contains the diagram definitions. It is configured for D:/College Project/Campus; update ROOT if generating elsewhere.

Scope: actual Django + React + SQLite implementation. Student actions are session-based. Authentication is Django admin with cookies, not JWT or student signup. The Gantt chart is a proposed six-week plan, not historical work dates. Local deployment and network diagrams do not imply cloud hosting.

Framework tables additionally present in SQLite: auth_group, auth_group_permissions, auth_permission, auth_user, auth_user_groups, auth_user_user_permissions, django_admin_log, django_content_type, django_migrations, django_session. The schema diagram covers every field in the five application models; it does not expand framework-internal schemas.

Source basis: portal/models.py, portal/views.py, portal/urls.py, portal/admin.py, campus_project/urls.py and settings.py, src/App.tsx and api.ts, screen/components, vite.config.ts, scripts/build-django.mjs and local SQLite table introspection. No live external mentor, AI or payment integrations exist.

## 01 - Use Case Diagram
Priority: Essential
File: 01_use_case_diagram.svg

Student actions use browser sessions; no student signup exists. Admin management requires staff authentication and appropriate permissions. Career content and assessment remain demonstrations.

## 02 - System Architecture Diagram
Priority: Essential
File: 02_system_architecture_diagram.svg

The frontend and API share the Django origin in the built application. Vite is a development/build tool, not a required production API server.

## 03a - DFD Level 0
Priority: Essential
File: 03a_dfd_level_0.svg

A single process shows system inputs and outputs. Student, administrator and maintainer are external actors. Internal tables and processes are intentionally hidden at this level.

## 03b - DFD Level 1
Priority: Essential
File: 03b_dfd_level_1.svg

D1-D4 are logical stores implemented in one SQLite database. Paired arrows represent request/write data and returned/read data. Community and catalogue results merge with D3 preferences; administration uses Django auth/session tables. Seed import reads bundled JSON.

## 03c - DFD Level 2
Priority: Essential
File: 03c_dfd_level_2.svg

Decomposition of the create-discussion part of process 2.0. CSRF/method checks precede the view; title/body/tags are validated. The atomic action writes the thread and visitor vote state, then returns refreshed state.

## 04 - Entity Relationship Diagram
Priority: Essential
File: 04_entity_relationship_diagram.svg

Only Discussion-to-Answer is an application-model foreign key. Saved college/thread identifiers inside VisitorState JSON are not enforced relational links. No College-to-Discussion or User-to-VisitorState foreign key exists.

## 05 - Flowchart
Priority: Essential
File: 05_flowchart.svg

High-level page load and persisted-action flow. Failed POST requests display an error without claiming a successful save. Browser-only tools such as comparison do not require a write request.

## 06 - Activity Diagram
Priority: Essential
File: 06_activity_diagram.svg

Swimlanes assign responsibilities. The happy path validates and saves a new community discussion. The invalid path returns an error and allows correction; no signup is required in the current prototype.

## 07 - Sequence Diagram
Priority: Essential
File: 07_sequence_diagram.svg

The save-college sequence represents successful interaction order. Responses use dashed arrows. Refresh persistence follows from another bootstrap GET reading the same browser session. Error sequences are summarized in the API/authentication diagrams.

## 08 - Class Diagram
Priority: Recommended
File: 08_class_diagram.svg

The diagram mirrors the actual Django model classes. Only College and Discussion define __str__. save/delete/query APIs are inherited, not custom methods. There are no fabricated student login or recommendation classes.

## 09 - Component Diagram
Priority: Recommended
File: 09_component_diagram.svg

Component responsibilities are dependencies, not separate deployed services. React has no direct database access. The seed command and admin also use Django models. Framework middleware participates in the request lifecycle.

## 10 - Deployment Diagram
Priority: Recommended
File: 10_deployment_diagram.svg

Actual deployment is local, not cloud hosting. .venv is outside Campus. A production deployment would need an appropriate WSGI/ASGI server, HTTPS and separate static-file serving; these are future configuration, not currently implemented nodes.

## 11 - Database Schema Diagram
Priority: Essential
File: 11_database_schema_diagram.svg

All application fields are included. Session key fields are not database foreign keys. Django additionally manages auth, session, permission, content-type, migration and admin-log tables; those framework tables are listed in the accompanying README.

## 12 - Wireframe Diagram
Priority: Essential
File: 12_wireframe_diagram.svg

Low-fidelity structural wireframes of three existing screens. This is not a pixel-exact screenshot. Shared header and mobile bottom navigation remain outside screen content; dialogs/drawers appear as overlays.

## 13 - Sitemap
Priority: Essential
File: 13_sitemap.svg

Logical screen hierarchy for the SPA. Dashboard, careers, colleges and community are React views under /. Admin is a distinct Django route. The overlays are application dialogs, not additional website pages.

## 14 - User Flow Diagram
Priority: Essential
File: 14_user_flow_diagram.svg

Shows three real navigation journeys. Only actions wired to the API persist. Comparison selection and roadmap task state remain temporary UI state; mentor questions are stored without external delivery.

## 15 - State Diagram
Priority: Optional
File: 15_state_diagram.svg

State machine for one college bookmark, not a whole student profile. Initial state comes from session-aware bootstrap. A successful POST toggles the stored flag. An unsuccessful request leaves the last confirmed state unchanged.

## 16 - API Flow Diagram
Priority: Recommended
File: 16_api_flow_diagram.svg

api.ts handles bootstrap and action calls; DiscussionDetailScreen fetches the thread-answer endpoint directly. Normal responses contain refreshed state or answer data. Error responses must not be interpreted as successful database saves.

## 17 - Authentication Flow Diagram
Priority: Recommended
File: 17_authentication_flow_diagram.svg

This is Django admin session authentication, not JWT or student authentication. Django checks active/staff status and model permissions; a superuser has broad permissions. Student API actions currently use visitor sessions, not registered student ownership.

## 18 - Network Architecture Diagram
Priority: Optional
File: 18_network_architecture_diagram.svg

The implemented environment uses local HTTP on loopback. External font/image requests need internet. This is not a deployed internet service; HTTPS termination, firewall policy and production hosting are future infrastructure. No JWT or cloud database is present.

## 19 - Gantt Chart
Priority: Academic / planning
File: 19_gantt_chart.svg

No development schedule was provided. This chart is an explicitly proposed six-week improvement plan, with relative weeks rather than invented completion dates. Scope and timing are subject to mentor review.

## 20 - Context Diagram
Priority: Recommended
File: 20_context_diagram.svg

Context and DFD Level 0 intentionally cover the same system boundary. This view emphasizes external actors, while the DFD labels the single process as 0. No mentor-delivery platform, payment service or AI API is connected.

