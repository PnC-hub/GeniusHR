import { prisma } from './prisma'

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  logo: string | null
  favicon: string | null
  companyName: string
  supportEmail: string | null
  customCss: string | null
}

export async function getTenantTheme(tenantId: string): Promise<ThemeConfig> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      name: true,
      primaryColor: true,
      secondaryColor: true,
      logo: true
    }
  })

  if (!tenant) {
    return getDefaultTheme()
  }

  return {
    primaryColor: tenant.primaryColor,
    secondaryColor: tenant.secondaryColor,
    logo: tenant.logo,
    favicon: null,
    companyName: tenant.name,
    supportEmail: null,
    customCss: null
  }
}

export function getDefaultTheme(): ThemeConfig {
  return {
    primaryColor: '#2563eb',
    secondaryColor: '#10b981',
    logo: null,
    favicon: null,
    companyName: 'GeniusHR',
    supportEmail: 'support@geniushr.it',
    customCss: null
  }
}

export function generateCssVariables(theme: ThemeConfig): string {
  return `
    :root {
      --primary: ${theme.primaryColor};
      --primary-dark: ${adjustBrightness(theme.primaryColor, -20)};
      --primary-light: ${adjustBrightness(theme.primaryColor, 20)};
      --secondary: ${theme.secondaryColor};
      --secondary-dark: ${adjustBrightness(theme.secondaryColor, -20)};
      --secondary-light: ${adjustBrightness(theme.secondaryColor, 20)};
    }
  `
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt

  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1)
}

export async function updateTenantTheme(
  tenantId: string,
  theme: Partial<ThemeConfig>
): Promise<void> {
  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      logo: theme.logo,
      name: theme.companyName
    }
  })
}

export function isWhiteLabelEnabled(plan: string): boolean {
  return plan === 'PARTNER'
}
