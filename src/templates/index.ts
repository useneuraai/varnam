import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { TemplateData } from "@/lib/templates";

export const templatesMap: Record<
  string,
  ComponentType<{ data: TemplateData; isPreview?: boolean }>
> = {
  // 5 New Distinct Tamil Wedding Visual Worlds
  "thiruvizha": dynamic(() => import("./thiruvizha/Template")),
  "manamagan": dynamic(() => import("./manamagan/Template")),
  "mangalam": dynamic(() => import("./mangalam/Template")),
  "vizha": dynamic(() => import("./vizha/Template")),
  "kadhal": dynamic(() => import("./kadhal/Template")),

  // Existing Tamil Wedding Templates
  "thanjavur-heritage": dynamic(() => import("./thanjavur-heritage/Template")),
  "chettinad-vintage": dynamic(() => import("./chettinad-vintage/Template")),
  "jasmine-romance": dynamic(() => import("./jasmine-romance/Template")),
  "temple-grandeur": dynamic(() => import("./temple-grandeur/Template")),
  "modern-tamil-minimal": dynamic(() => import("./modern-tamil-minimal/Template")),

  // Legacy mappings for backwards compatibility
  "royal-tamil": dynamic(() => import("./thanjavur-heritage/Template")),
  "temple-gold": dynamic(() => import("./temple-grandeur/Template")),
  "traditional-red": dynamic(() => import("./thanjavur-heritage/Template")),
  "floral-luxury": dynamic(() => import("./jasmine-romance/Template")),
  "modern-minimal": dynamic(() => import("./modern-tamil-minimal/Template")),
  "royal-heritage": dynamic(() => import("./thanjavur-heritage/Template")),
  "elegant-muslim": dynamic(() => import("./elegant-muslim/Template")),
  "modern-christian": dynamic(() => import("./modern-christian/Template")),
  "luxury-floral": dynamic(() => import("./luxury-floral/Template")),
};
