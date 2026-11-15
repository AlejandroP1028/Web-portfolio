// Shared by the root layout (server) and ThemeToggle (client); a "use client" module
// can't hand plain values to a server component, so they live here.

export const THEME_KEY = "theme";

/** Runs in <head> before first paint, so a saved choice never flashes the other theme. */
export const THEME_BOOT = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
