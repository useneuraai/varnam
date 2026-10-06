import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { TemplateData } from "@/lib/templates";

export const templatesMap: Record<
  string,
  ComponentType<{ data: TemplateData; isPreview?: boolean }>
> = {
  // The Definitive Premier 3D Animated Templates
  "kamalam-kalyanam": dynamic(() => import("./kamalam-kalyanam/Template")),
  "kovil-thirumanam": dynamic(() => import("./kovil-thirumanam/Template")),
  "kalyana-mandapam": dynamic(() => import("./kalyana-mandapam/Template")),
  "konaseema-kalyanam": dynamic(() => import("./konaseema-kalyanam/Template")),
  "theertha-mandapam": dynamic(() => import("./theertha-mandapam/Template")),
  "malligai-manam": dynamic(() => import("./theertha-mandapam/Template")),
  "marigold-vizha": dynamic(() => import("./marigold-vizha/Template")),
  "chettinad-rajamaligai": dynamic(() => import("./marigold-vizha/Template")),
  "kadhal-editorial": dynamic(() => import("./kadhal-editorial/Template")),
  "thanjavur-heritage": dynamic(() => import("./kadhal-editorial/Template")),

  // Legacy mappings for backwards compatibility (safe fallback to the premier templates)
  kamalam: dynamic(() => import("./kamalam-kalyanam/Template")),
  padmam: dynamic(() => import("./kamalam-kalyanam/Template")),
  "padma-kalyanam": dynamic(() => import("./kamalam-kalyanam/Template")),
  "radha-krishna": dynamic(() => import("./kamalam-kalyanam/Template")),
  "thiruvizha": dynamic(() => import("./marigold-vizha/Template")),
  "vizha": dynamic(() => import("./marigold-vizha/Template")),
  "manamagan": dynamic(() => import("./theertha-mandapam/Template")),
  "mangalam": dynamic(() => import("./kovil-thirumanam/Template")),
  "kadhal": dynamic(() => import("./kadhal-editorial/Template")),
  "chettinad-vintage": dynamic(() => import("./marigold-vizha/Template")),
  "jasmine-romance": dynamic(() => import("./theertha-mandapam/Template")),
  "temple-grandeur": dynamic(() => import("./kovil-thirumanam/Template")),
  "modern-tamil-minimal": dynamic(() => import("./kadhal-editorial/Template")),
  "gopuram": dynamic(() => import("./kovil-thirumanam/Template")),
  "koyil": dynamic(() => import("./kovil-thirumanam/Template")),
  "royal-tamil": dynamic(() => import("./kovil-thirumanam/Template")),
  "temple-gold": dynamic(() => import("./kovil-thirumanam/Template")),
  "traditional-red": dynamic(() => import("./kovil-thirumanam/Template")),
  "floral-luxury": dynamic(() => import("./theertha-mandapam/Template")),
  "modern-minimal": dynamic(() => import("./kadhal-editorial/Template")),
  "royal-heritage": dynamic(() => import("./kovil-thirumanam/Template")),
  "elegant-muslim": dynamic(() => import("./kovil-thirumanam/Template")),
  "modern-christian": dynamic(() => import("./kovil-thirumanam/Template")),
  "luxury-floral": dynamic(() => import("./kovil-thirumanam/Template")),
};
