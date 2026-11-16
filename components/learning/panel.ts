// Where the Learning panel sits on screen. The landing grows the Agent Pill's panel to
// exactly this box and the Learning index draws its panel in the same place, so the
// hand-off between the two pages is seamless. The CSS for .lp-panel mirrors these numbers.
export const PANEL_MAX_W = 960;
export const PANEL_SIDE = 16; // gap to the screen's sides on narrow screens, and to the bottom
export const PANEL_RADIUS = 16;

/** top: clamp(16px, 7vh, 64px) */
const top = () => Math.min(64, Math.max(16, innerHeight * 0.07));

export function panelRect() {
  const w = Math.min(PANEL_MAX_W, innerWidth - PANEL_SIDE * 2);
  const y = top();
  return { x: (innerWidth - w) / 2, y, w, h: innerHeight - y - PANEL_SIDE };
}

/** The panel as a clip-path inset on a full-screen layer. */
export function panelInset(round = PANEL_RADIUS) {
  const r = panelRect();
  return `inset(${r.y}px ${innerWidth - r.x - r.w}px ${innerHeight - r.y - r.h}px ${r.x}px round ${round}px)`;
}

// sessionStorage keys shared by the landing and the Learning pages
export const RETURN_KEY = "landing-return"; // the landing plays the way back into this side
export const FROM_PROJECT_KEY = "learning-from-project"; // the index plays a project page shrinking back into it
