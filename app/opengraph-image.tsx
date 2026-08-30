import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vamanan GPT — Meet the storyteller of Onam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F6F1E7",
          position: "relative",
        }}
      >
        {/* subtle pookalam ring backdrop */}
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: 9999,
            border: "2px dashed rgba(232,184,75,0.5)",
            top: -180,
            right: -260,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 640,
            height: 640,
            borderRadius: 9999,
            border: "2px solid rgba(22,59,50,0.15)",
            bottom: -240,
            left: -200,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
          }}
        >
          {/* umbrella mark */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 260,
                height: 260,
                borderRadius: 60,
                background: "#163B32",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 24px 60px rgba(22,22,22,0.12)",
              }}
            >
              <div
                style={{
                  width: 190,
                  height: 190,
                  position: "relative",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 93,
                    top: 95,
                    width: 7,
                    height: 80,
                    background: "#F6F1E7",
                    borderRadius: 4,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 44,
                    width: 175,
                    height: 66,
                    background: "#E8B84B",
                    // scalloped canopy via three arcs approximated with radius
                    borderRadius: "100% 100% 100% 100% / 100% 100% 60% 60%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 91,
                    top: 28,
                    width: 14,
                    height: 14,
                    borderRadius: 9999,
                    background: "#D85D4E",
                  }}
                />
              </div>
            </div>
          </div>

          {/* wordmark */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 28,
                letterSpacing: 6,
                color: "#D85D4E",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              A story from Kerala
            </div>
            <div
              style={{
                fontSize: 110,
                fontWeight: 700,
                color: "#161616",
                lineHeight: 1.05,
              }}
            >
              Vamanan
            </div>
            <div
              style={{
                fontSize: 110,
                fontWeight: 700,
                color: "#163B32",
                lineHeight: 1.05,
              }}
            >
              GPT
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 30,
                color: "#6E695F",
              }}
            >
              Ask. Listen. Explore.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
