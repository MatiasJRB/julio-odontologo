import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm?url';

let wasmInitialized = false;

export const GET: APIRoute = async () => {
  // Initialize WASM once
  if (!wasmInitialized) {
    const wasmResponse = await fetch(new URL(resvgWasm, 'file://'));
    await initWasm(wasmResponse);
    wasmInitialized = true;
  }

  // Fetch Inter font for body text
  const interFont = await fetch(
    'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.woff'
  ).then((res) => res.arrayBuffer());

  // Fetch Cormorant Garamond for display text
  const cormorantFont = await fetch(
    'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff'
  ).then((res) => res.arrayBuffer());

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0d1424 0%, #172136 50%, #0d1424 100%)',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Subtle decorative border
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '24px',
                left: '24px',
                right: '24px',
                bottom: '24px',
                border: '1px solid rgba(184, 150, 110, 0.25)',
                borderRadius: '8px',
              },
            },
          },
          // Corner accents top-left
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '60px',
                height: '60px',
                borderTop: '2px solid #b8966e',
                borderLeft: '2px solid #b8966e',
              },
            },
          },
          // Corner accents bottom-right
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '60px',
                height: '60px',
                borderBottom: '2px solid #b8966e',
                borderRight: '2px solid #b8966e',
              },
            },
          },
          // Main content container
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0px',
              },
              children: [
                // JF Monogram
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '90px',
                      height: '90px',
                      borderRadius: '16px',
                      background: '#1a2540',
                      border: '2px solid rgba(184, 150, 110, 0.4)',
                      marginBottom: '28px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '40px',
                            fontWeight: 700,
                            color: '#b8966e',
                            fontFamily: 'Cormorant Garamond',
                          },
                          children: 'JF',
                        },
                      },
                    ],
                  },
                },
                // Name
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '56px',
                      fontWeight: 700,
                      color: '#ffffff',
                      fontFamily: 'Cormorant Garamond',
                      letterSpacing: '0.04em',
                      lineHeight: 1.1,
                    },
                    children: 'Julio A. Ferraro',
                  },
                },
                // Gold divider line
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '80px',
                      height: '2px',
                      background: '#b8966e',
                      margin: '20px 0',
                    },
                  },
                },
                // Subtitle
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '28px',
                      fontWeight: 400,
                      color: '#d4b896',
                      fontFamily: 'Cormorant Garamond',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase' as const,
                    },
                    children: 'Contactología',
                  },
                },
                // Description
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontFamily: 'Inter',
                      marginTop: '24px',
                      letterSpacing: '0.05em',
                    },
                    children: 'Lentes de Contacto · Prótesis Oculares',
                  },
                },
                // Location
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '14px',
                      color: 'rgba(184, 150, 110, 0.7)',
                      fontFamily: 'Inter',
                      marginTop: '12px',
                      letterSpacing: '0.12em',
                    },
                    children: 'Bahía Blanca — Desde 1981',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interFont,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Cormorant Garamond',
          data: cormorantFont,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
};
