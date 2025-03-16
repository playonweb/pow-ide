import { ref } from "vue";
import { useQRCode } from "@vueuse/integrations/useQRCode";

const qrCode = ref("");
export function useQr() {

  const generateQr = async (text) => {
    qrCode.value = "";
    const qr = await useQRCode(text, {
      errorCorrectionLevel: 'H',
      margin: 3,
    });
    qrCode.value = qr.value || "";
  };

  return { qrCode, generateQr };
}
