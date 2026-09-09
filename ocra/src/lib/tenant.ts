import { db } from "./db";

export type TenantConfig = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  colorPrimary: string;
  colorSecondary: string;
  modulesActive: string[];
};

export async function getTenantBySlug(
  slug: string
): Promise<TenantConfig | null> {
  return db.tenant.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      colorPrimary: true,
      colorSecondary: true,
      modulesActive: true,
    },
  });
}

export async function getTenantById(
  id: string
): Promise<TenantConfig | null> {
  return db.tenant.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      colorPrimary: true,
      colorSecondary: true,
      modulesActive: true,
    },
  });
}

export function generatePoCode(
  companyAcronym: string,
  service: string,
  year: number,
  number: number,
  clientName: string,
  direction: "E" | "U"
): string {
  const svc = service
    .replace(/\s+/g, "")
    .substring(0, 6)
    .toUpperCase();
  const num = String(number).padStart(2, "0");
  const client = clientName.replace(/\s+/g, "").toUpperCase();
  return `${companyAcronym}/${svc}/${num}-${year}/${client}/${direction}`;
}
