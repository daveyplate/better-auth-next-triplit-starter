import { or, Schema as S } from "@triplit/client"

export const authSchema = S.Collections({
    users: {
        schema: S.Schema({
            id: S.Id(),
            name: S.String(),
            email: S.String(),
            emailVerified: S.Boolean({ default: false }),
            image: S.Optional(S.String()),
            theme: S.Optional(S.String()),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        }),
        relationships: {
            sessions: S.RelationMany("sessions", {
                where: [["userId", "=", "$id"]]
            }),
            accounts: S.RelationMany("accounts", {
                where: [["userId", "=", "$id"]]
            }),
            apikeys: S.RelationMany("apikeys", {
                where: [["userId", "=", "$id"]]
            }),
            members: S.RelationMany("members", {
                where: [["userId", "=", "$id"]]
            })
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [["id", "=", "$token.sub"]]
                },
                update: {
                    filter: [["id", "=", "$token.sub"]]
                },
                postUpdate: {
                    filter: [
                        ["id", "=", "$token.sub"],
                        ["email", "=", "$prev.email"],
                        ["emailVerified", "=", "$prev.emailVerified"],
                        ["createdAt", "=", "$prev.createdAt"],
                        ["updatedAt", ">", "$prev.updatedAt"]
                    ]
                }
            }
        }
    },
    sessions: {
        schema: S.Schema({
            id: S.Id(),
            userId: S.String(),
            token: S.String(),
            expiresAt: S.Date(),
            activeOrganizationId: S.Optional(S.String()),
            ipAddress: S.Optional(S.String()),
            userAgent: S.Optional(S.String()),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        }),
        relationships: {
            user: S.RelationById("users", "$userId"),
            activeOrganization: S.RelationById(
                "organizations",
                "$activeOrganizationId"
            )
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [["userId", "=", "$token.sub"]]
                },
                delete: {
                    filter: [["userId", "=", "$token.sub"]]
                }
            }
        }
    },
    accounts: {
        schema: S.Schema({
            id: S.Id(),
            userId: S.String(),
            accountId: S.String(),
            providerId: S.String(),
            accessToken: S.Optional(S.String()),
            refreshToken: S.Optional(S.String()),
            accessTokenExpiresAt: S.Optional(S.Date()),
            refreshTokenExpiresAt: S.Optional(S.Date()),
            scope: S.Optional(S.String()),
            idToken: S.Optional(S.String()),
            password: S.Optional(S.String()),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        }),
        relationships: {
            user: S.RelationById("users", "$userId")
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [["userId", "=", "$token.sub"]]
                },
                delete: {
                    filter: [
                        ["userId", "=", "$token.sub"],
                        ["providerId", "!=", "credential"]
                    ]
                }
            }
        }
    },
    verifications: {
        schema: S.Schema({
            id: S.Id(),
            identifier: S.String(),
            value: S.String(),
            expiresAt: S.Date(),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        }),
        permissions: {}
    },
    organizations: {
        schema: S.Schema({
            id: S.Id(),
            name: S.String(),
            slug: S.String(),
            logo: S.Optional(S.String()),
            metadata: S.Optional(S.Json()),
            createdAt: S.Date({ default: S.Default.now() })
        }),
        relationships: {
            members: S.RelationMany("members", {
                where: [["organizationId", "=", "$id"]]
            }),
            invitations: S.RelationMany("invitations", {
                where: [["organizationId", "=", "$id"]]
            })
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [["members.userId", "=", "$token.sub"]]
                }
            }
        }
    },
    members: {
        schema: S.Schema({
            id: S.Id(),
            userId: S.String(),
            organizationId: S.String(),
            role: S.String(),
            createdAt: S.Date({ default: S.Default.now() })
        }),
        relationships: {
            user: S.RelationById("users", "$userId"),
            organization: S.RelationById("organizations", "$organizationId")
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [["organization.members.userId", "=", "$token.sub"]]
                }
            }
        }
    },
    invitations: {
        schema: S.Schema({
            id: S.Id(),
            email: S.String(),
            inviterId: S.String(),
            organizationId: S.String(),
            role: S.String(),
            status: S.String(),
            expiresAt: S.Date(),
            createdAt: S.Date({ default: S.Default.now() })
        }),
        relationships: {
            inviter: S.RelationById("users", "$inviterId"),
            organization: S.RelationById("organizations", "$organizationId")
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [
                        or([
                            ["organization.members.userId", "=", "$token.sub"],
                            ["email", "=", "$token.email"]
                        ])
                    ]
                }
            }
        }
    },
    apikeys: {
        schema: S.Schema({
            id: S.Id(),
            name: S.Optional(S.String()),
            start: S.Optional(S.String()),
            prefix: S.Optional(S.String()),
            key: S.String(),
            userId: S.String(),
            refillInterval: S.Optional(S.Number()),
            refillAmount: S.Optional(S.Number()),
            lastRefillAt: S.Optional(S.Date()),
            enabled: S.Boolean({ default: true }),
            rateLimitEnabled: S.Boolean({ default: false }),
            rateLimitTimeWindow: S.Optional(S.Number()),
            rateLimitMax: S.Optional(S.Number()),
            requestCount: S.Number(),
            remaining: S.Optional(S.Number()),
            lastRequest: S.Optional(S.Date()),
            expiresAt: S.Optional(S.Date()),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() }),
            permissions: S.Optional(S.String()),
            metadata: S.Optional(S.Json())
        }),
        relationships: {
            user: S.RelationById("users", "$userId"),
            organization: S.RelationById(
                "organizations",
                "$metadata.organizationId"
            )
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [
                        or([
                            ["userId", "=", "$token.sub"],
                            ["organization.members.userId", "=", "$token.sub"]
                        ])
                    ]
                },
                delete: {
                    filter: [["userId", "=", "$token.sub"]]
                }
            }
        }
    }
})
