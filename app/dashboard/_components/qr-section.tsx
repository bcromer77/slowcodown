"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

export function QRSection({ restaurant }: { restaurant: Restaurant }) {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window?.location?.origin ?? "");
  }, []);

  const qrUrl = `${baseUrl}/qr/${restaurant?.slug}`;

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx?.fillRect?.(0, 0, 400, 400);
      if (ctx) {
        ctx.fillStyle = "#faf9f6";
        ctx.fillRect(0, 0, 400, 400);
      }
      ctx?.drawImage?.(img, 50, 50, 300, 300);

      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${restaurant?.slug ?? "restaurant"}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-xl text-charcoal mb-2">QR Code</h2>
        <p className="text-sm text-charcoal/60">
          Print this code and place it on your tables. When scanned, visitors see a minimal view of your restaurant and today&apos;s menu.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* QR Code */}
        <div className="bg-warm-white p-8">
          {baseUrl && (
            <QRCodeSVG
              id="qr-code"
              value={qrUrl}
              size={200}
              level="M"
              fgColor="#36454f"
              bgColor="#faf9f6"
            />
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-charcoal/60 mb-1">QR Link</p>
            <p className="text-sm text-charcoal font-mono bg-warm-white px-3 py-2">
              {qrUrl || "Loading..."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadQR} variant="secondary">
              <Download size={16} />
              Download PNG
            </Button>
            {baseUrl && (
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-stone/50 text-charcoal px-6 py-3 text-sm hover:bg-stone/70 transition-colors"
              >
                <ExternalLink size={16} />
                Preview
              </a>
            )}
          </div>

          <div className="bg-linen/50 p-4 mt-4">
            <p className="text-xs text-charcoal/60">
              <strong>Tip:</strong> The QR view is intentionally minimal. One image, today&apos;s menu, one sentence about your place. The phone is meant to go back on the table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
