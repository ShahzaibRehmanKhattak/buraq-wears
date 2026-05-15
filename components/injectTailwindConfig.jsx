export const injectTailwindConfig = () => {
  const script = document.createElement('script');
  script.id = 'tailwind-config';
  script.innerHTML = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          "colors": {
            "on-tertiary": "#ffffff",
            "inverse-on-surface": "#f0f1f1",
            "secondary-fixed": "#e3e2e2",
            "on-surface-variant": "#4c4546",
            "background": "#f9f9f9",
            "tertiary-fixed-dim": "#c6c6c7",
            "on-error-container": "#93000a",
            "error-container": "#ffdad6",
            "on-secondary-fixed": "#1b1c1c",
            "on-secondary": "#ffffff",
            "primary": "#000000",
            "on-primary-fixed": "#1b1b1b",
            "on-error": "#ffffff",
            "on-primary-fixed-variant": "#474747",
            "on-surface": "#1a1c1c",
            "on-secondary-fixed-variant": "#464747",
            "surface-dim": "#dadada",
            "secondary-container": "#e3e2e2",
            "tertiary": "#000000",
            "inverse-primary": "#c6c6c6",
            "surface-bright": "#f9f9f9",
            "outline": "#7e7576",
            "surface-container-high": "#e8e8e8",
            "on-primary": "#ffffff",
            "on-tertiary-fixed-variant": "#454747",
            "outline-variant": "#cfc4c5",
            "on-secondary-container": "#646464",
            "surface-container-highest": "#e2e2e2",
            "secondary-fixed-dim": "#c7c6c6",
            "on-background": "#1a1c1c",
            "inverse-surface": "#2f3131",
            "tertiary-fixed": "#e2e2e2",
            "primary-container": "#1b1b1b",
            "error": "#ba1a1a",
            "tertiary-container": "#1a1c1c",
            "surface-variant": "#e2e2e2",
            "surface-tint": "#5e5e5e",
            "primary-fixed": "#e2e2e2",
            "surface": "#f9f9f9",
            "surface-container-lowest": "#ffffff",
            "surface-container-low": "#f3f3f4",
            "secondary": "#5e5e5e",
            "on-primary-container": "#848484",
            "primary-fixed-dim": "#c6c6c6",
            "on-tertiary-fixed": "#1a1c1c",
            "surface-container": "#eeeeee",
            "on-tertiary-container": "#838484"
          },
          "borderRadius": {
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
          },
          "spacing": {
            "unit": "4px",
            "gutter": "24px",
            "margin-desktop": "64px",
            "container-max": "1440px",
            "margin-mobile": "20px"
          },
          "fontFamily": {
            "headline-md": ["Inter"],
            "body-md": ["Inter"],
            "body-lg": ["Inter"],
            "headline-lg-mobile": ["Inter"],
            "display-lg": ["Inter"],
            "label-lg": ["Inter"],
            "label-md": ["Inter"],
            "headline-lg": ["Inter"]
          },
          "fontSize": {
            "headline-md": ["24px", {"lineHeight": "1.3", "letterSpacing": "-0.01em", "fontWeight": "600"}],
            "body-md": ["16px", {"lineHeight": "1.5", "letterSpacing": "0", "fontWeight": "400"}],
            "body-lg": ["18px", {"lineHeight": "1.6", "letterSpacing": "0", "fontWeight": "400"}],
            "headline-lg-mobile": ["28px", {"lineHeight": "1.2", "fontWeight": "600"}],
            "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
            "label-lg": ["14px", {"lineHeight": "1", "letterSpacing": "0.05em", "fontWeight": "600"}],
            "label-md": ["12px", {"lineHeight": "1", "letterSpacing": "0", "fontWeight": "500"}],
            "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}]
          }
        },
      },
    }
  `;
  document.head.appendChild(script);
};
