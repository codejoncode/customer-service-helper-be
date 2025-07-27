🧭 RESTful Routes Reference (Updated)
Table of Contents

- Authentication
- Organizations
- Agents
- Members API
- Member Validation
- Articles API
- Article Suggester
- Actions API
- Call-flow API
- Escalation Router
- Training Mode Assistant
- Bug Reporting Agent
- Middleware & Errors

🛂 Authentication
| Method | Endpoint | Description | Allowed Roles |
| POST | /api/auth/register | Register a new organization and admin | Public |
| POST | /api/auth/login | Log in as admin, manager, or agent | Public |

🏢 Organizations
| Method | Endpoint | Description | Allowed Roles |
| GET | /api/orgs | List all organizations | Admin |
| POST | /api/orgs | Create a new organization | Admin |
| GET | /api/orgs/:orgId | Get org details | Authenticated |
| PUT | /api/orgs/:orgId | Update org profile | Admin, Manager |
| DELETE | /api/orgs/:orgId | Delete org | Admin |
| POST | /api/orgs/:orgId/upgrade | Upgrade from free to paid tier | Admin |

👤 Agents
| Method | Endpoint | Description | Allowed Roles |
| GET | /api/orgs/:orgId/agents | List agents in org | Admin, Manager |
| POST | /api/orgs/:orgId/agents | Create agent | Admin, Manager |
| PUT | /api/orgs/:orgId/agents/:agentId | Update agent | Admin, Manager |
| DELETE | /api/orgs/:orgId/agents/:agentId | Remove agent | Admin |

👥 Members API
| Method | Endpoint | Description | Allowed Roles |
| POST | /api/orgs/:orgId/members | Add new member | Admin, Manager |
| GET | /api/orgs/:orgId/members/:memberId | Fetch one member by ID | Agent, Manager, Admin |

⚠️ GET /members (bulk list) removed for security reasons.

🔍 Member Validation
| Method | Endpoint | Description | Allowed Roles |
| POST | /api/orgs/:orgId/members/:memberId/validate | Validate member fields | Agent, Manager, Admin |

Requires minimum 2 matched fields. Returns validation report with field-level success/failure.

📚 Articles API
| Method | Endpoint | Description | Allowed Roles |
| GET | /api/orgs/:orgId/articles | List all articles | Admin, Manager |
| GET | /api/orgs/:orgId/articles/:id | Get article by ID | Admin, Manager |
| POST | /api/orgs/:orgId/articles | Create new article | Admin, Manager |
| PUT | /api/orgs/:orgId/articles/:id | Update article | Admin, Manager |
| DELETE | /api/orgs/:orgId/articles/:id | Delete article | Admin, Manager |

🤖 Article Suggester
| Method | Endpoint | Description | Allowed Roles |
| POST | /api/orgs/:orgId/articles/suggest | Suggest articles based on call reason or checklist | Agent, Manager |

Returns list of article matches with titles, summaries, and inline suggestion text.

⚙️ Actions API
| Method | Endpoint | Description | Allowed Roles |
| GET | /api/orgs/:orgId/actions | List reason → article mappings | Admin, Manager |
| POST | /api/orgs/:orgId/actions | Create new mapping | Admin, Manager |
| PUT | /api/orgs/:orgId/actions/:id | Update mapping | Admin, Manager |
| DELETE | /api/orgs/:orgId/actions/:id | Delete mapping | Admin, Manager |

📋 Call-flow API
| Method | Endpoint | Description | Allowed Roles |
| GET | /api/orgs/:orgId/call-flows | List call checklists | Admin, Manager |
| POST | /api/orgs/:orgId/call-flows | Create checklist | Admin, Manager |
| PUT | /api/orgs/:orgId/call-flows/:id | Update checklist | Admin, Manager |
| DELETE | /api/orgs/:orgId/call-flows/:id | Remove checklist | Admin, Manager |

🆘 Escalation Router
| Method | Endpoint | Description | Allowed Roles |
| POST | /api/orgs/:orgId/escalations | Create new escalation | Agent, Manager |
| GET | /api/orgs/:orgId/escalations | List escalations | Manager, Admin |

Escalations link to call logs and send formatted messages via Teams or email.

🧪 Training Mode Assistant
| Method | Endpoint | Description | Allowed Roles |
| POST | /api/orgs/:orgId/training | Log a training session | Agent, Manager |
| GET | /api/orgs/:orgId/training | List training logs | Manager, Admin |

Requires X-Training-Mode: true header to enable bot simulation behavior.
7-23-25 last update
