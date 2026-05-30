import { ComponentType } from "react";
import { TemplateData } from "@/lib/templates";
import RoyalTamilTemplate from "./royal-tamil/Template";
import ElegantMuslimTemplate from "./elegant-muslim/Template";
import ModernChristianTemplate from "./modern-christian/Template";
import LuxuryFloralTemplate from "./luxury-floral/Template";

import TempleGoldTemplate from "./temple-gold/Template";
import TraditionalRedTemplate from "./traditional-red/Template";
import FloralLuxuryTemplate from "./floral-luxury/Template";
import ModernMinimalTemplate from "./modern-minimal/Template";
import RoyalHeritageTemplate from "./royal-heritage/Template";

export const templatesMap: Record<string, ComponentType<{ data: TemplateData }>> = {
  "royal-tamil": RoyalTamilTemplate,
  "elegant-muslim": ElegantMuslimTemplate,
  "modern-christian": ModernChristianTemplate,
  "luxury-floral": LuxuryFloralTemplate,
  "temple-gold": TempleGoldTemplate,
  "traditional-red": TraditionalRedTemplate,
  "floral-luxury": FloralLuxuryTemplate,
  "modern-minimal": ModernMinimalTemplate,
  "royal-heritage": RoyalHeritageTemplate,
};
