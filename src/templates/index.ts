import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { TemplateData } from "@/lib/templates";

export const templatesMap: Record<
  string,
  ComponentType<{ data: TemplateData; isPreview?: boolean }>
> = {
  "royal-tamil": dynamic(() => import("./royal-tamil/Template")),
  "elegant-muslim": dynamic(() => import("./elegant-muslim/Template")),
  "modern-christian": dynamic(() => import("./modern-christian/Template")),
  "luxury-floral": dynamic(() => import("./luxury-floral/Template")),
  "temple-gold": dynamic(() => import("./temple-gold/Template")),
  "traditional-red": dynamic(() => import("./traditional-red/Template")),
  "floral-luxury": dynamic(() => import("./floral-luxury/Template")),
  "modern-minimal": dynamic(() => import("./modern-minimal/Template")),
  "royal-heritage": dynamic(() => import("./royal-heritage/Template")),
};
