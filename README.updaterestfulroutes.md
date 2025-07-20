# RESTful Routes Reference

This document describes all the RESTful HTTP endpoints provided by the Customer Service Helper Backend API. Each resource’s routes are listed with method, path, description, allowed roles, and notes on request/response behavior.

---

## Table of Contents

- [Authentication](#authentication)  
- [Organizations](#organizations)  
- [Agents](#agents)  
- [Members API](#members-api)  
- [Articles API](#articles-api)  
- [Actions API](#actions-api)  
- [Call-flow API](#call-flow-api)  
- [Middleware & Errors](#middleware--errors)  

---

## Authentication

| Method | Endpoint             | Description                            | Allowed Roles |
| ------ | -------------------- | -------------------------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new organization and admin  | Public        |
| POST   | `/api/auth/login`    | Log in as admin, manager, or agent     | Public        |

No authentication or role guard on these routes. Returns a signed JWT and user profile on success.

---

## Organizations

| Method | Endpoint                   | Description                               | Allowed Roles       |
| ------ | -------------------------- | ----------------------------------------- | ------------------- |
| GET    | `/api/orgs`                | List all organizations                    | Admin               |
| POST   | `/api/orgs`                | Create a new organization                 | Admin               |
| GET    | `/api/orgs/:orgId`         | Retrieve one organization by ID           | Any authenticated   |
| PUT    | `/api/orgs/:orgId`         | Update org details (name, plan tier)      | Admin, Manager      |
| DELETE | `/api/orgs/:orgId`         | Delete an organization                    | Admin               |
| POST   | `/api/orgs/:orgId/upgrade` | Upgrade free-tier org to paid plan        | Admin               |

Free-tier organizations are capped at 3 active agents. Attempting to exceed this limit returns `403 Forbidden`.

---

## Agents

| Method | Endpoint                               | Description                | Allowed Roles  |
| ------ | -------------------------------------- | -------------------------- | -------------- |
| GET    | `/api/orgs/:orgId/agents`              | List all agents in an org  | Admin, Manager |
| POST   | `/api/orgs/:orgId/agents`              | Add a new agent            | Admin, Manager |
| PUT    | `/api/orgs/:orgId/agents/:agentId`     | Update agent profile       | Admin, Manager |
| DELETE | `/api/orgs/:orgId/agents/:agentId`     | Remove or deactivate agent | Admin          |

Creating an agent on a free-tier org beyond the 3-agent limit yields `403 Forbidden`.

---

## Members API

Manages member profiles for administrative tasks. All routes require admin or manager privileges.

| Method | Endpoint                 | Description                                    | Allowed Roles   |
| ------ | ------------------------ | ---------------------------------------------- | --------------- |
| POST   | `/api/orgs/:orgId/members` | Create a new member profile                    | Admin, Manager  |
| GET    | `/api/orgs/:orgId/members` | Retrieve a list of all member profiles         | Admin, Manager  |

Creating a member returns `201 Created` with the new member object. Listing members omits sensitive fields (e.g. passwords) and returns `200 OK`.

---

## Articles API

CRUD operations for knowledge-base entries. Restricted to admins and managers.

| Method | Endpoint                              | Description                                  | Allowed Roles   |
| ------ | ------------------------------------- | -------------------------------------------- | --------------- |
| GET    | `/api/orgs/:orgId/articles`           | List all knowledge-base articles             | Admin, Manager  |
| GET    | `/api/orgs/:orgId/articles/:articleId`| Get one article by ID                        | Admin, Manager  |
| POST   | `/api/orgs/:orgId/articles`           | Create a new article                         | Admin, Manager  |
| PUT    | `/api/orgs/:orgId/articles/:articleId`| Update an existing article                   | Admin, Manager  |
| DELETE | `/api/orgs/:orgId/articles/:articleId`| Delete an article                            | Admin, Manager  |

POST and PUT handlers validate required fields (`title`, `content`). Missing or invalid data returns `400 Bad Request`. Non-existent IDs yield `404 Not Found`.

---

## Actions API

Defines default knowledge-base article mappings for call reasons. Administrators use this to auto-suggest help articles.

| Method | Endpoint                           | Description                             | Allowed Roles   |
| ------ | ---------------------------------- | --------------------------------------- | --------------- |
| GET    | `/api/orgs/:orgId/actions`         | List all call-reason → article mappings | Admin, Manager  |
| GET    | `/api/orgs/:orgId/actions/:actionId` | Retrieve a specific mapping by ID      | Admin, Manager  |
| POST   | `/api/orgs/:orgId/actions`         | Create a new mapping                    | Admin, Manager  |
| PUT    | `/api/orgs/:orgId/actions/:actionId` | Update an existing mapping             | Admin, Manager  |
| DELETE | `/api/orgs/:orgId/actions/:actionId` | Delete a mapping                       | Admin, Manager  |

Requests validate that both `callReasonId` and `articleId` exist. Invalid references return `400 Bad Request` or `404 Not Found`.

---

## Call-flow API

Manages end-of-call checklists that agents complete after each support call. Restricted to admins and managers.

| Method | Endpoint                                | Description                                  | Allowed Roles   |
| ------ | --------------------------------------- | -------------------------------------------- | --------------- |
| GET    | `/api/orgs/:orgId/call-flows`           | List all end-of-call checklists              | Admin, Manager  |
| GET    | `/api/orgs/:orgId/call-flows/:flowId`   | Retrieve a specific checklist by ID          | Admin, Manager  |
| POST   | `/api/orgs/:orgId/call-flows`           | Create a new call-flow checklist             | Admin, Manager  |
| PUT    | `/api/orgs/:orgId/call-flows/:flowId`   | Update an existing checklist                 | Admin, Manager  |
| DELETE | `/api/orgs/:orgId/call-flows/:flowId`   | Delete a checklist                           | Admin, Manager  |

Each checklist must include at least one `task`. Creating or updating an empty checklist returns `400 Bad Request`. Non-existent `flowId` returns `404 Not Found`.

---

## Middleware & Errors

- **`authenticateJWT`**  
  Verifies the `Authorization: Bearer <token>` header. Fails with `401 Unauthorized` if missing/invalid.

- **Role Guards (`hasRole([...])`)**  
  - Returns `403 Forbidden` if the authenticated user’s role is insufficient.  
  - Applied per-route to enforce Admin, Manager, or Agent access as specified.

- **Error Responses**  
  - `400 Bad Request` → validation errors or malformed payloads  
  - `401 Unauthorized` → missing/invalid JWT  
  - `403 Forbidden` → valid JWT but insufficient role  
  - `404 Not Found` → resource does not exist  
  - `500 Internal Server Error` → unexpected failures  

---
updated as of 7-19-25