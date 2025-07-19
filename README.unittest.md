# Customer Service Helper – Backend Unit Test Plan

This backend is tested using Jest and Supertest to ensure:

- Routes behave correctly with valid input
- Unauthorized access is rejected
- Role-based restrictions are enforced
- Functional edge cases are properly handled

---

## 🔐 Authentication & Role Validation

- ✅ Valid JWT returns expected user payload
- ❌ Invalid or expired token → 401 Unauthorized
- ❌ Missing token → 401 Unauthorized
- ❌ Wrong role → 403 Forbidden
- ✅ Correct role → access permitted

---

## 👥 Member Routes

| Test Case                     | Expectation                  |
| ----------------------------- | ---------------------------- |
| POST `/members` no token      | 401 Unauthorized             |
| POST `/members` agent role    | 403 Forbidden                |
| POST `/members` admin/manager | 201 Created, member returned |
| POST `/members` bad input     | 400 Bad Request              |
| GET `/members` unauthorized   | 401/403                      |
| GET `/members` as manager     | 200 OK, array of members     |

---

## 📚 Article Routes

| Test Case                          | Expectation                   |
| ---------------------------------- | ----------------------------- |
| POST `/articles` no token          | 401 Unauthorized              |
| POST `/articles` wrong role        | 403 Forbidden                 |
| POST `/articles` admin/manager     | 201 Created, article returned |
| GET `/articles` with valid role    | 200 OK, list of articles      |
| PUT `/articles/:id` update missing | 404 Not Found                 |
| PUT `/articles/:id` with bad data  | 400 Bad Request               |
| DELETE `/articles/:id` success     | 200 OK                        |
| GET `/articles/:id` as agent       | 200 OK (read access allowed)  |

---

## 🔁 Actions (Call Reason → Default Article)

| Test Case                             | Expectation                     |
| ------------------------------------- | ------------------------------- |
| POST `/actions` no token              | 401 Unauthorized                |
| POST `/actions` wrong role            | 403 Forbidden                   |
| POST `/actions` valid mapping         | 201 Created                     |
| POST `/actions` duplicate mapping     | 409 Conflict or validation fail |
| GET `/actions` admin                  | 200 OK, list of mappings        |
| PUT `/actions/:id` change article     | 200 OK                          |
| DELETE `/actions/:id` non-existent ID | 404 Not Found                   |

---

## ✅ End-of-Call Checklists

| Test Case                             | Expectation     |
| ------------------------------------- | --------------- |
| POST `/checklists` with missing tasks | 400 Bad Request |
| POST `/checklists` valid input        | 201 Created     |
| PUT `/checklists/:id` update name     | 200 OK          |
| DELETE `/checklists/:id` success      | 204 No Content  |
| GET `/checklists/:id` not found       | 404 Not Found   |

---

## 🧪 Test Tools

- [Jest](https://jestjs.io/) for assertion + mocks
- [Supertest](https://www.npmjs.com/package/supertest) for HTTP simulation
- [ts-jest](https://github.com/kulshekhar/ts-jest) for TypeScript support
- In-memory DB or seeded test database

---

## 🔍 Coverage Summary

| Category      | Routes Tested | RBAC Enforced | Error Paths | Validation |
| ------------- | ------------- | ------------- | ----------- | ---------- |
| Auth/Login    | ✅            | ✅            | ✅          | ✅         |
| Organizations | ✅            | ✅            | ✅          | ✅         |
| Agents        | ✅            | ✅            | ✅          | ✅         |
| Members       | ✅            | ✅            | ✅          | ✅         |
| Articles      | ✅            | ✅            | ✅          | ✅         |
| Actions       | ✅            | ✅            | ✅          | ✅         |
| Checklists    | ✅            | ✅            | ✅          | ✅         |

All routes and middleware are covered with pass/fail assertions for:

- Missing or invalid tokens
- Role mismatch
- Field validation
- Nonexistent resource access

---

## ✅ Passing Criteria
