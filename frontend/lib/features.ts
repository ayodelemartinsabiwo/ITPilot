/**
 * Feature gating based on subscription plans
 * Controls access to features based on user's subscription
 */

export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise' | 'custom'

export interface PlanFeatures {
  // Core features
  maxDevices: number
  maxTickets: number
  aiChatMessages: number

  // Feature flags
  canAccessAIChat: boolean
  canAccessAnalytics: boolean
  canAccessUsers: boolean
  canAccessRemoteAccess: boolean
  canAccessIntegrations: boolean
  canExportData: boolean
  canAccessAPI: boolean

  // Support features
  prioritySupport: boolean
  dedicatedSupport: boolean
  slaGuarantee: boolean

  // Advanced features
  canUseAutomation: boolean
  canUseCustomBranding: boolean
  canUseSSO: boolean
  canUseAuditLogs: boolean
}

/**
 * Feature matrix based on plan tier
 */
export const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  free: {
    maxDevices: 5,
    maxTickets: 10,
    aiChatMessages: 100,
    canAccessAIChat: true,  // Limited messages
    canAccessAnalytics: false,
    canAccessUsers: false,
    canAccessRemoteAccess: false,
    canAccessIntegrations: false,
    canExportData: false,
    canAccessAPI: false,
    prioritySupport: false,
    dedicatedSupport: false,
    slaGuarantee: false,
    canUseAutomation: false,
    canUseCustomBranding: false,
    canUseSSO: false,
    canUseAuditLogs: false,
  },
  starter: {
    maxDevices: 50,
    maxTickets: -1,  // unlimited
    aiChatMessages: 1000,
    canAccessAIChat: true,
    canAccessAnalytics: true,
    canAccessUsers: false,
    canAccessRemoteAccess: true,
    canAccessIntegrations: false,
    canExportData: true,
    canAccessAPI: false,
    prioritySupport: false,
    dedicatedSupport: false,
    slaGuarantee: false,
    canUseAutomation: false,
    canUseCustomBranding: false,
    canUseSSO: false,
    canUseAuditLogs: false,
  },
  professional: {
    maxDevices: 200,
    maxTickets: -1,  // unlimited
    aiChatMessages: 5000,
    canAccessAIChat: true,
    canAccessAnalytics: true,
    canAccessUsers: true,
    canAccessRemoteAccess: true,
    canAccessIntegrations: true,
    canExportData: true,
    canAccessAPI: true,
    prioritySupport: true,
    dedicatedSupport: false,
    slaGuarantee: true,
    canUseAutomation: true,
    canUseCustomBranding: false,
    canUseSSO: false,
    canUseAuditLogs: true,
  },
  enterprise: {
    maxDevices: -1,  // unlimited
    maxTickets: -1,  // unlimited
    aiChatMessages: -1,  // unlimited
    canAccessAIChat: true,
    canAccessAnalytics: true,
    canAccessUsers: true,
    canAccessRemoteAccess: true,
    canAccessIntegrations: true,
    canExportData: true,
    canAccessAPI: true,
    prioritySupport: true,
    dedicatedSupport: true,
    slaGuarantee: true,
    canUseAutomation: true,
    canUseCustomBranding: true,
    canUseSSO: true,
    canUseAuditLogs: true,
  },
  custom: {
    maxDevices: -1,  // unlimited
    maxTickets: -1,  // unlimited
    aiChatMessages: -1,  // unlimited
    canAccessAIChat: true,
    canAccessAnalytics: true,
    canAccessUsers: true,
    canAccessRemoteAccess: true,
    canAccessIntegrations: true,
    canExportData: true,
    canAccessAPI: true,
    prioritySupport: true,
    dedicatedSupport: true,
    slaGuarantee: true,
    canUseAutomation: true,
    canUseCustomBranding: true,
    canUseSSO: true,
    canUseAuditLogs: true,
  },
}

/**
 * Get features for a specific plan
 */
export function getPlanFeatures(planName: string | null | undefined): PlanFeatures {
  if (!planName) {
    return PLAN_FEATURES.free
  }

  const normalizedPlan = planName.toLowerCase() as PlanTier
  return PLAN_FEATURES[normalizedPlan] || PLAN_FEATURES.free
}

/**
 * Check if a user can access a specific feature
 */
export function canAccessFeature(
  planName: string | null | undefined,
  featureKey: keyof PlanFeatures
): boolean {
  const features = getPlanFeatures(planName)
  const value = features[featureKey]

  // For boolean features
  if (typeof value === 'boolean') {
    return value
  }

  // For number features (limits), return true if unlimited (-1) or > 0
  if (typeof value === 'number') {
    return value === -1 || value > 0
  }

  return false
}

/**
 * Get usage limit for a feature
 */
export function getFeatureLimit(
  planName: string | null | undefined,
  featureKey: 'maxDevices' | 'maxTickets' | 'aiChatMessages'
): number {
  const features = getPlanFeatures(planName)
  return features[featureKey]
}

/**
 * Check if limit is reached
 */
export function isLimitReached(
  currentUsage: number,
  limit: number
): boolean {
  if (limit === -1) return false  // unlimited
  return currentUsage >= limit
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(featureName: string, currentPlan: string): string {
  const planName = currentPlan || 'Free'
  return `${featureName} is not available on the ${planName} plan. Upgrade to access this feature.`
}
