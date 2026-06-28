// Interface stricte pour la réponse de l'action
export type AuditActionResponse =
    | { success: true; auditId: string }
    | { success: false; error: string }

/**
 * Initialise un nouvel audit en base de données (Simulé pour la V0)
 */
export async function createAuditAction(): Promise<AuditActionResponse> {
    // Simule la création d'un audit
    return { success: true, auditId: "mock-audit-id" }
}