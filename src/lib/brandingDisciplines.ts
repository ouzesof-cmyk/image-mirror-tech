import {
  PenTool,
  Layers,
  Type,
  Palette,
  Package,
  Layout,
  Shapes,
  Brush,
  type LucideIcon,
} from "lucide-react";

import schemaLogos from "@/assets/branding/schema-logos.jpg";
import schemaIdentity from "@/assets/branding/schema-identity.jpg";
import schemaTypography from "@/assets/branding/schema-typography.jpg";
import schemaArt from "@/assets/branding/schema-art.jpg";
import schemaPackaging from "@/assets/branding/schema-packaging.jpg";
import schemaEditorial from "@/assets/branding/schema-editorial.jpg";
import schemaIconography from "@/assets/branding/schema-iconography.jpg";
import schemaSocial from "@/assets/branding/schema-social.jpg";

export type BrandingDiscipline = {
  slug: string;
  n: number;
  Icon: LucideIcon;
  schema: string;
};

export const BRANDING_DISCIPLINES: BrandingDiscipline[] = [
  { slug: "logos", n: 1, Icon: PenTool, schema: schemaLogos },
  { slug: "identity", n: 2, Icon: Layers, schema: schemaIdentity },
  { slug: "typography", n: 3, Icon: Type, schema: schemaTypography },
  { slug: "art-direction", n: 4, Icon: Palette, schema: schemaArt },
  { slug: "packaging", n: 5, Icon: Package, schema: schemaPackaging },
  { slug: "editorial", n: 6, Icon: Layout, schema: schemaEditorial },
  { slug: "iconography", n: 7, Icon: Shapes, schema: schemaIconography },
  { slug: "social", n: 8, Icon: Brush, schema: schemaSocial },
];

export const getBrandingDiscipline = (slug: string) =>
  BRANDING_DISCIPLINES.find((d) => d.slug === slug);
