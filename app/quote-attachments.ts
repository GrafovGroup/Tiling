export const MAX_ATTACHMENT_FILES = 5;
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const MAX_ATTACHMENT_TOTAL_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = ".jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf";
const types: Record<string, string[]> = {
  jpg: ["image/jpeg"], jpeg: ["image/jpeg"], png: ["image/png"], webp: ["image/webp"],
  heic: ["image/heic", "image/heic-sequence"], heif: ["image/heif", "image/heif-sequence"], pdf: ["application/pdf"],
};
export function attachmentError(files: { name: string; size: number; type: string }[], locale: "en" | "fr" = "en") {
  const fr = locale === "fr";
  if (files.length > MAX_ATTACHMENT_FILES) return fr ? "Joignez au maximum 5 fichiers." : "Please attach no more than 5 files.";
  if (files.some(file => !file.size)) return fr ? "Un fichier est vide. Retirez-le ou choisissez une autre copie." : "One file is empty. Remove it or choose another copy.";
  if (files.some(file => file.size > MAX_ATTACHMENT_BYTES)) return fr ? "Chaque fichier doit peser au maximum 5 Mo." : "Each file must be 5 MB or smaller.";
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_ATTACHMENT_TOTAL_BYTES) return fr ? "La taille totale doit être de 10 Mo ou moins." : "Keep the total attachment size at 10 MB or less.";
  if (files.some(file => { const ext = file.name.split(".").pop()?.toLowerCase() || ""; return !types[ext] || (file.type && !types[ext].includes(file.type.toLowerCase())); })) return fr ? "Choisissez des images JPG, PNG, WebP, HEIC ou un document PDF." : "Choose JPG, PNG, WebP or HEIC images, or a PDF document.";
  return "";
}
