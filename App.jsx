import { useState, useMemo, useEffect, useRef } from "react";

/* ── Styles ─────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
:root{
  --bg:#FFFFFF; --panel:#FFFFFF; --panel2:#F6F3F4; --line:#E7DEDF;
  --text:#1A1113; --muted:#7A6A6D; --dim:#A99A9C;
  --iris:#E11D2E; --cyan:#FF5A3C; --accent:#E11D2E; --accent2:#FF5A3C;
  --good:#1FA971; --ok:#C98A00; --bad:#E11D2E;
  --grad:linear-gradient(100deg,#E11D2E 0%,#F0322F 50%,#FF5A3C 100%);
  --grad-brand:linear-gradient(100deg,#E11D2E 0%,#F0322F 50%,#FF5A3C 100%);
}
.app.dark{
  --bg:#120C0D; --panel:#1B1315; --panel2:#221A1C; --line:#3A2A2D;
  --text:#F3EBEC; --muted:#A78F92; --dim:#7A6467;
  --good:#4FD196; --ok:#E0AC3A; --bad:#FF5A6E;
}
.app{transition:background-color .3s ease,color .3s ease}
*{box-sizing:border-box;margin:0}
html{-webkit-text-size-adjust:100%}
.app{min-height:100vh;background:var(--bg);color:var(--text);
  font-family:'Inter',system-ui,sans-serif;line-height:1.5;
  padding:22px 16px 64px;max-width:780px;margin:0 auto;overflow-x:hidden;
  background-image:radial-gradient(600px 340px at 92% -6%, rgba(225,29,46,.07), transparent 62%),
                   radial-gradient(520px 300px at 4% 4%, rgba(255,90,60,.05), transparent 60%);}
.mono{font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums}



/* ── Teinte selon le profil d'usage (le rouge de marque reste le point de départ) ── */
.app{transition:background-image .5s ease}
.prof-gaming{--accent:#E11D2E;--accent2:#FF5A3C;--iris:#E11D2E;--cyan:#FF5A3C;
  --grad:linear-gradient(100deg,#E11D2E 0%,#F0322F 50%,#FF5A3C 100%)}
.prof-workstation{--accent:#E11D2E;--accent2:#8B5CF6;--iris:#E11D2E;--cyan:#8B5CF6;
  --grad:linear-gradient(100deg,#E11D2E 0%,#C9349B 50%,#8B5CF6 100%)}
.prof-bureautique{--accent:#E11D2E;--accent2:#1D6FE1;--iris:#E11D2E;--cyan:#1D6FE1;
  --grad:linear-gradient(100deg,#E11D2E 0%,#7A4FD0 45%,#1D6FE1 100%)}
.prof-workstation{background-image:radial-gradient(600px 340px at 92% -6%, rgba(139,92,246,.08), transparent 62%),
  radial-gradient(520px 300px at 4% 4%, rgba(225,29,46,.05), transparent 60%)}
.prof-bureautique{background-image:radial-gradient(600px 340px at 92% -6%, rgba(29,111,225,.09), transparent 62%),
  radial-gradient(520px 300px at 4% 4%, rgba(225,29,46,.04), transparent 60%)}
/* Le logo et le grand titre gardent le rouge de la marque en toutes circonstances */
.brand-name .g,.hero h1 .g{background:var(--grad-brand);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent}
.bar,.prof-switch button,.budget-go,.edit-close,.aff-btn,.readout::after{transition:background .45s ease,color .3s ease}


.theme-btn{position:fixed;top:14px;right:14px;z-index:50;width:38px;height:38px;border-radius:50%;
  background:var(--panel);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.08);transition:transform .15s,background .3s}
.theme-btn:hover{transform:scale(1.06)}
.theme-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.theme-btn svg{width:18px;height:18px;stroke:var(--text)}

/* ── Marque ── */
.brand{display:flex;flex-direction:column;gap:2px;margin-bottom:22px}
.brand-name{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:26px;
  letter-spacing:-.02em;line-height:1}
.brand-tag{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted)}

/* ── Hero ── */
.hero{padding:30px 2px 10px;animation:rise .6s cubic-bezier(.2,.7,.2,1) both}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;
  font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);
  padding:6px 12px;border:1px solid var(--line);border-radius:100px;background:rgba(0,0,0,.02)}
.eyebrow::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--cyan);
  box-shadow:0 0 10px var(--accent)}
.hero h1{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;
  font-size:clamp(38px,9vw,68px);line-height:.98;letter-spacing:-.03em;margin-top:20px}
.hero h1 .g{background:var(--grad);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent}
.sub{color:var(--muted);margin-top:18px;max-width:50ch;font-size:15.5px;line-height:1.6}

/* ── Bandeau signature : lecture live du build ── */
.readout{margin-top:26px;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;
  padding:20px 22px;border:1px solid var(--line);border-radius:20px;position:relative;overflow:hidden;
  background:linear-gradient(180deg,rgba(225,29,46,.05),rgba(0,0,0,0)) ,var(--panel);
  animation:rise .6s .08s cubic-bezier(.2,.7,.2,1) both}
.readout::after{content:"";position:absolute;inset:0;border-radius:20px;padding:1px;
  background:var(--grad);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;mask-composite:exclude;opacity:.5;pointer-events:none}
.readout-label{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.18em;
  text-transform:uppercase;color:var(--muted)}
.readout-score{font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:56px;
  line-height:1;letter-spacing:-.03em;margin-top:6px}
.readout-score .g{background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.readout-score small{font-size:20px;color:var(--dim);-webkit-text-fill-color:var(--dim);font-weight:700}
.readout-price{text-align:right}
.readout-price b{font-family:'JetBrains Mono',monospace;font-size:26px;font-weight:700;display:block}
.readout-price span{font-size:11px;color:var(--muted);letter-spacing:.04em}

.disclosure{font-size:12px;color:var(--dim);margin-top:18px;line-height:1.5;padding-left:2px}

/* ── Panels ── */
.panel{background:var(--panel);border:1px solid var(--line);border-radius:20px;
  padding:22px;margin-top:16px;animation:rise .5s .12s cubic-bezier(.2,.7,.2,1) both}
.panel-title{display:flex;align-items:center;gap:9px;font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:500;margin-bottom:18px}
.panel-title::before{content:"";width:5px;height:5px;border-radius:1px;background:var(--iris);
  box-shadow:0 0 8px rgba(225,29,46,.5);flex-shrink:0}

.fields{display:grid;gap:13px}
@media(min-width:580px){.fields{grid-template-columns:1fr 1fr}}
.field{display:flex;flex-direction:column;gap:7px}
.field-label{font-size:11px;color:var(--muted);letter-spacing:.05em;text-transform:uppercase;font-weight:500}
select{appearance:none;-webkit-appearance:none;background:var(--panel2);color:var(--text);
  border:1px solid var(--line);border-radius:12px;padding:12px 34px 12px 13px;font:inherit;font-size:14px;width:100%;
  cursor:pointer;transition:border-color .15s,box-shadow .15s;
  background-image:linear-gradient(45deg,transparent 50%,var(--muted) 50%),linear-gradient(135deg,var(--muted) 50%,transparent 50%);
  background-position:calc(100% - 18px) 55%,calc(100% - 13px) 55%;background-size:5px 5px,5px 5px;background-repeat:no-repeat}
select:hover{border-color:var(--dim)}
select:focus-visible{outline:none;border-color:var(--iris);box-shadow:0 0 0 3px rgba(225,29,46,.18)}
optgroup{color:var(--cyan);font-style:normal;background:var(--panel);font-family:'JetBrains Mono',monospace;font-size:12px}
option{color:var(--text);background:var(--panel2);font-family:'Inter',sans-serif}

/* ── Récap composants ── */
.picks{list-style:none;padding:0;margin-top:20px;display:grid;gap:8px}
.picks li{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;
  background:var(--panel2);border:1px solid var(--line);border-radius:13px;padding:9px 10px;
  transition:border-color .15s,transform .15s}
.picks li:hover{border-color:var(--dim);transform:translateX(2px)}
.pick-name{font-size:13.5px;display:flex;align-items:flex-start;gap:11px;min-width:0;flex:1 1 auto}
.pick-ico{flex-shrink:0;width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center}
.pick-tag{font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--muted);letter-spacing:.1em;white-space:normal;overflow-wrap:anywhere;line-height:1.35}
.pick-label{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1 1 auto}
.pick-label b{font-weight:500;font-size:13.5px;white-space:normal;overflow-wrap:anywhere;line-height:1.3}

@media(max-width:420px){
  .picks li{gap:8px;padding:8px 10px 8px 8px}
  .pick-ico{width:34px;height:34px}
  .aff-btn{font-size:11.5px;padding:7px 10px}
  .pick-label b{font-size:13px}
}
.aff-btn{flex-shrink:0;margin-top:2px;font-size:12.5px;font-weight:600;color:#fff;background:var(--accent);
  padding:8px 13px;border-radius:9px;text-decoration:none;white-space:nowrap;transition:transform .12s,background .15s}
.aff-btn:hover{background:var(--accent2);transform:translateY(-1px)}
.aff-btn:focus-visible{outline:2px solid var(--iris);outline-offset:2px}

/* ── Visualisation ── */
.pcview-wrap{margin-top:20px;padding:20px 12px;background:
  radial-gradient(420px 280px at 50% 0%, rgba(139,123,255,.08), transparent 70%),var(--panel2);
  border:1px solid var(--line);border-radius:16px;display:flex;flex-direction:column}
.pcview-wrap .pick-tag{display:block}
.hotspot{cursor:pointer;outline:none}
.hotspot rect,.hotspot circle,.hotspot path{transition:stroke .15s,filter .15s}
.hotspot:hover rect:first-of-type,.hotspot:focus-visible rect:first-of-type{stroke:var(--iris);filter:drop-shadow(0 0 6px rgba(225,29,46,.4))}
.edit-pop{margin-top:16px;background:var(--panel);border:1px solid var(--iris);border-radius:14px;
  padding:16px;display:grid;gap:12px;box-shadow:0 0 0 3px rgba(225,29,46,.10);animation:pop .2s ease}
@keyframes pop{from{opacity:0;transform:translateY(6px) scale(.99)}to{opacity:1;transform:none}}
.edit-close{background:var(--grad);color:#fff;border:0;font:inherit;font-size:13px;font-weight:700;
  padding:11px;border-radius:10px;cursor:pointer}
.edit-close:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}

/* ── Totaux (sous la viz) ── */
.totals{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;
  margin-top:18px;padding-top:16px;border-top:1px solid var(--line);flex-wrap:wrap}
.big{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;display:block}
.copper{color:var(--cyan)}
.score-block{text-align:right}
.score-max{font-size:14px;color:var(--dim)}
.tiny{font-size:11px;color:var(--dim);display:block;margin-top:4px;max-width:42ch;line-height:1.45}

/* ── Compatibilité ── */
.compat{list-style:none;padding:0;display:grid;gap:11px}
.compat li{display:flex;gap:12px;align-items:flex-start;font-size:14px;line-height:1.5}
.compat .dot{font-family:'JetBrains Mono',monospace;font-weight:700;flex-shrink:0;width:22px;height:22px;
  display:flex;align-items:center;justify-content:center;border-radius:7px;font-size:12px;margin-top:1px}
.compat .c-ok .dot{color:var(--good);background:rgba(94,233,181,.12)}
.compat .c-warn .dot{color:var(--ok);background:rgba(251,210,78,.12)}
.compat .c-bad .dot{color:var(--bad);background:rgba(251,112,137,.14)}
.compat .c-bad span:last-child{color:#FFC2CC}
.compat .c-warn span:last-child{color:#FDE9AE}

.diag{position:relative}
.diag-msg{line-height:1.6;font-size:15px}
.diag-ok .panel-title::before{background:var(--good);box-shadow:0 0 8px rgba(94,233,181,.8)}
.diag-cpu .panel-title::before,.diag-gpu .panel-title::before{background:var(--bad);box-shadow:0 0 8px rgba(251,112,137,.8)}

/* ── Performances (signature télémétrie) ── */
.bench-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:4px}
.res-switch{display:flex;gap:3px;background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:3px;margin-bottom:18px}
.res-switch button{background:none;border:0;color:var(--muted);font:inherit;font-size:13px;font-weight:500;
  padding:7px 14px;border-radius:8px;cursor:pointer;transition:color .15s,background .15s}
.res-switch button.on{background:var(--accent);color:#fff;font-weight:600}
.res-switch button:focus-visible{outline:2px solid var(--iris);outline-offset:1px}
.bench{list-style:none;display:grid;gap:17px;padding:0}
.bench-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px}
.game{font-size:14.5px;font-weight:500}
.fps{font-size:15px;font-weight:700}
.fps.top{color:var(--cyan)} .fps.good{color:var(--good)} .fps.ok{color:var(--ok)} .fps.bad{color:var(--bad)}
.bar-track{height:8px;background:rgba(0,0,0,.06);border-radius:6px;overflow:hidden}
.bar{height:100%;border-radius:6px;transition:width .55s cubic-bezier(.2,.8,.2,1);position:relative}
.bar.top{background:var(--grad)}
.bar.good{background:linear-gradient(90deg,#3DBB90,var(--good))}
.bar.ok{background:linear-gradient(90deg,#C99A2E,var(--ok))}
.bar.bad{background:linear-gradient(90deg,#C4506180,var(--bad))}
@media(prefers-reduced-motion:reduce){.bar{transition:none}.hero,.readout,.panel,.edit-pop{animation:none}}
.tier{font-size:11px;color:var(--dim);margin-top:5px;display:block;letter-spacing:.02em}
.note{margin-top:20px;max-width:none}

/* ── Applis ── */
.apps{list-style:none;display:grid;gap:9px;padding:0}
.apps li{display:flex;gap:13px;align-items:flex-start;padding:13px 14px;background:var(--panel2);
  border:1px solid var(--line);border-radius:12px;transition:border-color .15s}
.apps li.yes:hover{border-color:rgba(94,233,181,.4)}
.check{font-family:'JetBrains Mono',monospace;font-weight:700;width:22px;height:22px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;border-radius:7px;font-size:12px}
.yes .check{color:var(--good);background:rgba(94,233,181,.12)} .no .check{color:var(--bad);background:rgba(251,112,137,.12)}
.no .app-name{color:var(--muted)}
.app-name{font-size:14.5px;display:block;font-weight:500}
.app-need{font-size:12px;color:var(--cyan);display:block;margin-top:3px}

/* ── Footer + légal ── */
.foot{text-align:center;color:var(--dim);font-size:12px;margin-top:34px;line-height:1.7}
.foot-nav{display:flex;justify-content:center;gap:12px;margin-bottom:8px;flex-wrap:wrap}
.foot-nav button{background:none;border:0;color:var(--muted);font:inherit;font-size:12.5px;cursor:pointer;padding:2px;
  border-bottom:1px solid transparent;transition:color .15s,border-color .15s}
.foot-nav button:hover{color:var(--text);border-color:var(--iris)}
.foot-nav button:focus-visible{outline:2px solid var(--iris);outline-offset:2px}
.legal{padding:14px 4px;line-height:1.7;animation:rise .5s cubic-bezier(.2,.7,.2,1) both}
.legal h1{font-family:'Bricolage Grotesque',sans-serif;font-size:32px;font-weight:800;letter-spacing:-.02em;margin:18px 0 10px}
.legal h2{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);margin:24px 0 8px}
.legal p{color:var(--text);font-size:14.5px;max-width:64ch}
.legal a{color:var(--accent);text-decoration:underline}
.back{background:var(--panel);border:1px solid var(--line);color:var(--text);font:inherit;font-size:13px;
  padding:9px 15px;border-radius:10px;cursor:pointer;transition:border-color .15s}
.back:hover{border-color:var(--dim)}
.back:focus-visible{outline:2px solid var(--iris)}




/* ── Sommaire de navigation ── */
.toc{display:flex;gap:6px;flex-wrap:wrap;margin-top:18px}
.toc a{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.04em;color:var(--muted);
  text-decoration:none;padding:7px 12px;border:1px solid var(--line);border-radius:100px;
  background:rgba(0,0,0,.02);transition:color .15s,border-color .15s}
.toc a:hover{color:var(--text);border-color:var(--iris)}
.toc a:focus-visible{outline:2px solid var(--iris);outline-offset:2px}
html{scroll-behavior:smooth}
section[id]{scroll-margin-top:16px}

/* ── Sélecteur de profil ── */
.prof-switch{display:flex;gap:6px;flex-wrap:wrap}
.prof-switch button{flex:1;min-width:110px;background:var(--panel2);border:1px solid var(--line);
  color:var(--muted);font:inherit;font-size:14px;font-weight:600;padding:12px;border-radius:12px;
  cursor:pointer;transition:all .15s}
.prof-switch button.on{background:var(--grad);color:#fff;border-color:transparent}
.prof-switch button:not(.on):hover{border-color:var(--dim);color:var(--text)}
.prof-switch button:focus-visible{outline:2px solid var(--iris);outline-offset:2px}
.prof-hint{color:var(--muted);font-size:13px;margin-top:12px;margin-bottom:18px;line-height:1.5}

/* ── Panneau budget ── */
.budget-panel{background:linear-gradient(180deg,rgba(79,224,208,.05),transparent),var(--panel)}
.budget-sub{color:var(--muted);font-size:14px;margin-bottom:16px;max-width:52ch;line-height:1.55}
.budget-row{display:flex;gap:10px;flex-wrap:wrap}
.budget-input{position:relative;flex:1;min-width:130px}
.budget-input input{width:100%;background:var(--panel2);color:var(--text);border:1px solid var(--line);
  border-radius:12px;padding:13px 34px 13px 14px;font:inherit;font-size:17px;font-weight:600;
  font-family:'JetBrains Mono',monospace}
.budget-input input:focus-visible{outline:none;border-color:var(--cyan);box-shadow:0 0 0 3px rgba(255,90,60,.2)}
.budget-cur{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:var(--muted);
  font-family:'JetBrains Mono',monospace;font-size:16px;pointer-events:none}
.budget-go{background:var(--grad);color:#fff;border:0;border-radius:12px;padding:13px 20px;
  font:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:transform .12s,filter .15s;white-space:nowrap}
.budget-go:hover{transform:translateY(-1px);filter:brightness(1.08)}
.budget-go:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}

.budget-go.done{background:var(--good);color:#0A0A0F}
.budget-out{margin-top:16px}
.budget-figures{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-end}
.bf{display:flex;flex-direction:column;gap:2px}
.bf-num{font-size:22px;font-weight:700;color:var(--text)}
.bf-max{font-size:13px;color:var(--dim);font-weight:500}
.bf-lbl{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--muted)}
.budget-result{margin-top:12px;font-size:13.5px;color:var(--good);line-height:1.5}
.budget-result.over{color:var(--ok)}

/* ── Effet d'ouverture « TV qui s'allume » ── */
.tv-boot{position:fixed;inset:0;z-index:100;background:#000;pointer-events:none;
  animation:tvOff .5s .65s forwards}
.tv-line{position:absolute;left:0;right:0;top:50%;height:3px;background:#fff;
  box-shadow:0 0 24px 6px rgba(255,255,255,.9);transform:translateY(-50%) scaleY(1);
  animation:tvLine .42s .12s cubic-bezier(.6,0,.4,1) forwards}
.tv-flash{position:absolute;inset:0;background:#fff;opacity:0;animation:tvFlash .5s .5s ease-out forwards}
@keyframes tvLine{0%{transform:translateY(-50%) scaleX(.15);opacity:0}
  30%{opacity:1}55%{transform:translateY(-50%) scaleX(1);height:3px}
  100%{transform:translateY(-50%) scaleX(1);height:100vh;opacity:.9}}
@keyframes tvFlash{0%{opacity:0}40%{opacity:.85}100%{opacity:0}}
@keyframes tvOff{to{opacity:0;visibility:hidden}}

/* ── Ambiance de fond : lueur qui respire, très discrète ── */
.ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:radial-gradient(680px 420px at 82% 8%, rgba(225,29,46,.05), transparent 60%),
             radial-gradient(560px 360px at 12% 92%, rgba(255,90,60,.04), transparent 60%);
  animation:breathe 11s ease-in-out infinite}
.dark .ambient{background:radial-gradient(680px 420px at 82% 8%, rgba(255,59,78,.14), transparent 60%),
  radial-gradient(560px 360px at 12% 92%, rgba(255,90,60,.09), transparent 60%)}
@keyframes breathe{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.06)}}

/* ── Champ de recherche dans les listes ── */
.field-search{background:var(--panel2);color:var(--text);border:1px solid var(--line);
  border-radius:10px;padding:9px 12px;font:inherit;font-size:13px;width:100%;margin-bottom:-2px}
.field-search::placeholder{color:var(--dim)}
.field-search:focus-visible{outline:none;border-color:var(--iris);box-shadow:0 0 0 3px rgba(225,29,46,.16)}


/* ── Comparateur ── */
.cmp-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
.cmp{width:100%;border-collapse:collapse;font-size:13.5px}
.cmp th,.cmp td{padding:11px 10px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
.cmp thead th{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--muted);font-weight:500}
.cmp tbody th{font-weight:500;color:var(--muted);white-space:nowrap;padding-right:14px}
.cmp td{font-weight:500}
.cmp td.win{color:var(--good);font-weight:700}
.cmp td.win::after{content:" ✓";font-size:11px}

/* ── Encart de partage (bas de page) ── */
.share-panel{background:linear-gradient(180deg,rgba(225,29,46,.05),transparent),var(--panel)}
.share-sub{color:var(--muted);font-size:14px;margin-bottom:16px;max-width:54ch;line-height:1.55}
/* ── Bouton de partage ── */
.share-btn{width:100%;background:var(--panel);color:var(--text);
  border:1px solid var(--line);border-radius:14px;padding:13px;font:inherit;font-size:14px;font-weight:600;
  cursor:pointer;transition:border-color .15s,transform .12s,background .15s}
.share-btn:hover{border-color:var(--iris);transform:translateY(-1px)}
.share-btn:focus-visible{outline:2px solid var(--iris);outline-offset:2px}

@media(prefers-reduced-motion:reduce){
  .tv-boot,.tv-line,.tv-flash{animation:none;display:none}
  .ambient{animation:none}
}

@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
`;

/* ════════════════════════════════════════════════════════
   CONFIG AFFILIATION — remplace par tes identifiants.
   ════════════════════════════════════════════════════════ */
const AFFILIATE = { amazonTag: "athosbuilder-21" };
const HAS_AFFILIATE = AFFILIATE.amazonTag.trim().length > 0;
// Lien Amazon. Si l'article a un ASIN renseigné, on pointe directement sur sa fiche
// produit (lien précis). Sinon, on fait une recherche restreinte à l'informatique,
// ce qui place le modèle exact en tête et évite les résultats hors sujet.
function affLink(product) {
  const tagParam = AFFILIATE.amazonTag ? `tag=${AFFILIATE.amazonTag}` : "";
  const asin = typeof product === "object" ? product.asin : null;
  const name = typeof product === "object" ? product.name : product;
  // Composants qui ne se vendent plus neufs : on oriente la recherche vers
  // les offres d'occasion et reconditionnées plutôt que vers du stock inexistant.
  const isUsed = typeof product === "object" && product.used;
  if (asin) {
    return `https://www.amazon.fr/dp/${asin}${tagParam ? "?" + tagParam : ""}`;
  }
  const q = encodeURIComponent(isUsed ? `${name} occasion reconditionné` : name);
  return `https://www.amazon.fr/s?k=${q}&i=computers${tagParam ? "&" + tagParam : ""}`;
}

/* ── Marques & visuels SVG ─────────────────────────── */
function brandOf(name) {
  if (/^(RTX|GTX)/.test(name)) return { color: "#76B900", bg: "rgba(118,185,0,.14)" };   // NVIDIA
  if (/^RX /.test(name) || /^Ryzen/.test(name)) return { color: "#ED4C4C", bg: "rgba(237,76,76,.13)" }; // AMD
  if (/^(Arc|i[3579]|Core)/.test(name)) return { color: "#4C9AE8", bg: "rgba(76,154,232,.14)" };        // Intel
  return { color: "#D9964A", bg: "rgba(217,150,74,.13)" };
}
function Icon({ kind, name }) {
  const b = brandOf(name || "");
  const s = { stroke: b.color, strokeWidth: 1.6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const shapes = {
    cpu: <><rect x="6" y="6" width="12" height="12" rx="2" {...s}/><rect x="9.5" y="9.5" width="5" height="5" {...s}/><path d="M9 6V3M12 6V3M15 6V3M9 21v-3M12 21v-3M15 21v-3M6 9H3M6 12H3M6 15H3M21 9h-3M21 12h-3M21 15h-3" {...s}/></>,
    gpu: <><rect x="3" y="7" width="17" height="9" rx="1.5" {...s}/><circle cx="9" cy="11.5" r="2.6" {...s}/><circle cx="15.5" cy="11.5" r="2.6" {...s}/><path d="M4 16v3M8 16v3" {...s}/></>,
    ram: <><rect x="3" y="8" width="18" height="8" rx="1" {...s}/><path d="M6 16v2M10 16v2M14 16v2M18 16v2M6.5 10.5h2v3h-2zM11 10.5h2v3h-2zM15.5 10.5h2v3h-2z" {...s}/></>,
    ssd: <><rect x="4" y="7" width="16" height="10" rx="2" {...s}/><path d="M8 11h6M8 13.5h4" {...s}/><circle cx="16.5" cy="12" r="1" {...s}/></>,
    psu: <><rect x="4" y="6" width="16" height="12" rx="1.5" {...s}/><circle cx="10" cy="12" r="3.2" {...s}/><path d="M10 9.8v1M10 13.2v1M8 12h1M11 12h1M16 9h2M16 12h2M16 15h2" {...s}/></>,
    cooler: <><circle cx="12" cy="12" r="7.5" {...s}/><circle cx="12" cy="12" r="1.6" {...s}/><path d="M12 4.5c2 2 2 4 0 5.5M19.5 12c-2 2-4 2-5.5 0M12 19.5c-2-2-2-4 0-5.5M4.5 12c2-2 4-2 5.5 0" {...s}/></>,
    fan: <><rect x="3.5" y="3.5" width="17" height="17" rx="2.5" {...s}/><circle cx="12" cy="12" r="1.5" {...s}/><path d="M12 5.5c1.8 1.6 1.8 3.6 0 4.9M18.5 12c-1.6 1.8-3.6 1.8-4.9 0M12 18.5c-1.8-1.6-1.8-3.6 0-4.9M5.5 12c1.6-1.8 3.6-1.8 4.9 0" {...s}/></>,
    mb: <><rect x="4" y="4" width="16" height="16" rx="1.5" {...s}/><rect x="8" y="8" width="5" height="5" {...s}/><path d="M16 6v4M18 6v4M7 16h6M7 18.5h9" {...s}/></>,
    case: <><rect x="6" y="3" width="12" height="18" rx="1.5" {...s}/><circle cx="12" cy="8" r="2.4" {...s}/><path d="M9 13.5h6M9 16h6M9 18.5h4" {...s}/></>,
  };
  return (
    <span className="pick-ico" style={{ background: b.bg }} aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24">{shapes[kind]}</svg>
    </span>
  );
}

/* ── GPU (desktop 2019 → 2026) — score 100 = RTX 5090 ──
   watts = conso jeu typique · size: std | large ── */
const GPU_GROUPS = [
  { label: "NVIDIA · RTX 50 (2025-26)", items: [
    { id:"5090", name:"RTX 5090", vram:32, score:100, price:3499, watts:575, size:"large" },
    { id:"5080", name:"RTX 5080", vram:16, score:78, price:1199, watts:360, size:"large" },
    { id:"5070ti", name:"RTX 5070 Ti", vram:16, score:70, price:949, watts:300, size:"large" },
    { id:"5070", name:"RTX 5070", vram:12, score:58, price:599, watts:250, size:"std" },
    { id:"5060ti", name:"RTX 5060 Ti 16 Go", vram:16, score:45, price:539, watts:180, size:"std" },
    { id:"5060", name:"RTX 5060", vram:8, score:38, price:349, watts:145, size:"std" },
    { id:"5050", name:"RTX 5050", vram:8, score:30, price:259, watts:130, size:"std" },
  ]},
  { label: "NVIDIA · RTX 40 (2022-24)", items: [
    { id:"4090", name:"RTX 4090", vram:24, score:88, price:1950, watts:450, size:"large" },
    { id:"4080s", name:"RTX 4080 Super", vram:16, score:72, price:1000, watts:320, size:"large" },
    { id:"4080", name:"RTX 4080", vram:16, score:70, price:950, watts:320, size:"large" },
    { id:"4070tis", name:"RTX 4070 Ti Super", vram:16, score:63, price:780, watts:285, size:"large" },
    { id:"4070ti", name:"RTX 4070 Ti", vram:12, score:60, price:650, watts:285, size:"std" },
    { id:"4070s", name:"RTX 4070 Super", vram:12, score:56, price:560, watts:220, size:"std" },
    { id:"4070", name:"RTX 4070", vram:12, score:50, price:480, watts:200, size:"std" },
    { id:"4060ti16", name:"RTX 4060 Ti 16 Go", vram:16, score:41, price:400, watts:165, size:"std" },
    { id:"4060ti", name:"RTX 4060 Ti 8 Go", vram:8, score:40, price:330, watts:160, size:"std" },
    { id:"4060", name:"RTX 4060", vram:8, score:35, price:280, watts:115, size:"std" },
  ]},
  { label: "NVIDIA · RTX 30 (2020-22)", items: [
    { id:"3090ti", name:"RTX 3090 Ti", vram:24, score:65, price:800, watts:450, size:"large" },
    { id:"3090", name:"RTX 3090", vram:24, score:61, price:650, watts:350, size:"large" },
    { id:"3080ti", name:"RTX 3080 Ti", vram:12, score:59, price:520, watts:350, size:"large" },
    { id:"3080", name:"RTX 3080 10 Go", vram:10, score:54, price:420, watts:320, size:"large" },
    { id:"3070ti", name:"RTX 3070 Ti", vram:8, score:47, price:330, watts:290, size:"std" },
    { id:"3070", name:"RTX 3070", vram:8, score:44, price:300, watts:220, size:"std" },
    { id:"3060ti", name:"RTX 3060 Ti", vram:8, score:38, price:250, watts:200, size:"std" },
    { id:"3060", name:"RTX 3060 12 Go", vram:12, score:30, price:220, watts:170, size:"std" },
    { id:"3050", name:"RTX 3050", vram:8, score:22, price:180, watts:130, size:"std" },
  ]},
  { label: "NVIDIA · RTX 20 / GTX 16 (2019-20)", items: [
    { id:"2080ti", used:true, name:"RTX 2080 Ti", vram:11, score:41, price:300, watts:260, size:"std" },
    { id:"2080s", used:true, name:"RTX 2080 Super", vram:8, score:36, price:250, watts:250, size:"std" },
    { id:"2080", used:true, name:"RTX 2080", vram:8, score:34, price:220, watts:225, size:"std" },
    { id:"2070s", used:true, name:"RTX 2070 Super", vram:8, score:32, price:200, watts:215, size:"std" },
    { id:"2070", used:true, name:"RTX 2070", vram:8, score:29, price:180, watts:185, size:"std" },
    { id:"2060s", used:true, name:"RTX 2060 Super", vram:8, score:28, price:170, watts:175, size:"std" },
    { id:"2060", used:true, name:"RTX 2060", vram:6, score:25, price:150, watts:160, size:"std" },
    { id:"1660ti", used:true, name:"GTX 1660 Ti", vram:6, score:21, price:130, watts:120, size:"std" },
    { id:"1660s", used:true, name:"GTX 1660 Super", vram:6, score:21, price:120, watts:125, size:"std" },
    { id:"1660", used:true, name:"GTX 1660", vram:6, score:19, price:110, watts:120, size:"std" },
    { id:"1650s", used:true, name:"GTX 1650 Super", vram:4, score:17, price:100, watts:100, size:"std" },
    { id:"1650", used:true, name:"GTX 1650", vram:4, score:14, price:90, watts:75, size:"std" },
  ]},
  { label: "AMD · RX 9000 (2025-26)", items: [
    { id:"9070xt", name:"RX 9070 XT", vram:16, score:66, price:655, watts:305, size:"large" },
    { id:"9070", name:"RX 9070", vram:16, score:58, price:569, watts:220, size:"std" },
    { id:"9060xt", name:"RX 9060 XT 16 Go", vram:16, score:44, price:419, watts:180, size:"std" },
  ]},
  { label: "AMD · RX 7000 (2022-24)", items: [
    { id:"7900xtx", name:"RX 7900 XTX", vram:24, score:70, price:900, watts:355, size:"large" },
    { id:"7900xt", name:"RX 7900 XT", vram:20, score:63, price:720, watts:315, size:"large" },
    { id:"7900gre", name:"RX 7900 GRE", vram:16, score:57, price:580, watts:260, size:"std" },
    { id:"7800xt", name:"RX 7800 XT", vram:16, score:53, price:490, watts:263, size:"std" },
    { id:"7700xt", name:"RX 7700 XT", vram:12, score:46, price:400, watts:245, size:"std" },
    { id:"7600xt", name:"RX 7600 XT", vram:16, score:36, price:320, watts:190, size:"std" },
    { id:"7600", name:"RX 7600", vram:8, score:34, price:260, watts:165, size:"std" },
  ]},
  { label: "AMD · RX 6000 (2020-22)", items: [
    { id:"6950xt", name:"RX 6950 XT", vram:16, score:61, price:550, watts:335, size:"large" },
    { id:"6900xt", name:"RX 6900 XT", vram:16, score:58, price:480, watts:300, size:"large" },
    { id:"6800xt", name:"RX 6800 XT", vram:16, score:54, price:420, watts:300, size:"large" },
    { id:"6800", name:"RX 6800", vram:16, score:48, price:360, watts:250, size:"std" },
    { id:"6750xt", name:"RX 6750 XT", vram:12, score:42, price:300, watts:250, size:"std" },
    { id:"6700xt", name:"RX 6700 XT", vram:12, score:40, price:270, watts:230, size:"std" },
    { id:"6650xt", name:"RX 6650 XT", vram:8, score:33, price:220, watts:180, size:"std" },
    { id:"6600xt", name:"RX 6600 XT", vram:8, score:32, price:200, watts:160, size:"std" },
    { id:"6600", name:"RX 6600", vram:8, score:28, price:180, watts:132, size:"std" },
    { id:"6500xt", name:"RX 6500 XT", vram:4, score:16, price:120, watts:107, size:"std" },
  ]},
  { label: "AMD · RX 5000 (2019-20)", items: [
    { id:"5700xt", used:true, name:"RX 5700 XT", vram:8, score:30, price:170, watts:225, size:"std" },
    { id:"5700", used:true, name:"RX 5700", vram:8, score:27, price:150, watts:180, size:"std" },
    { id:"5600xt", used:true, name:"RX 5600 XT", vram:6, score:24, price:130, watts:150, size:"std" },
    { id:"5500xt", used:true, name:"RX 5500 XT 8 Go", vram:8, score:18, price:100, watts:130, size:"std" },
  ]},
  { label: "NVIDIA · RTX PRO / workstation", items: [
    { id:"pro6000b", name:"RTX PRO 6000 Blackwell", vram:96, score:96, price:8500, watts:600, size:"large", pro:true, compute:100 },
    { id:"rtx6000ada", name:"RTX 6000 Ada", vram:48, score:72, price:6800, watts:300, size:"large", pro:true, compute:80 },
    { id:"rtx5000ada", name:"RTX 5000 Ada", vram:32, score:62, price:4000, watts:250, size:"large", pro:true, compute:64 },
    { id:"rtx4500ada", name:"RTX 4500 Ada", vram:24, score:50, price:2400, watts:210, size:"std", pro:true, compute:50 },
  ]},
  { label: "AMD · Radeon PRO / workstation", items: [
    { id:"w7900", name:"Radeon PRO W7900", vram:48, score:64, price:3500, watts:295, size:"large", pro:true, compute:62 },
    { id:"w7800", name:"Radeon PRO W7800", vram:32, score:56, price:2500, watts:260, size:"std", pro:true, compute:52 },
  ]},
  { label: "Intel · Arc (2022-25)", items: [
    { id:"b580", name:"Arc B580", vram:12, score:36, price:319, watts:190, size:"std" },
    { id:"b570", name:"Arc B570", vram:10, score:32, price:269, watts:150, size:"std" },
    { id:"a770", name:"Arc A770 16 Go", vram:16, score:31, price:250, watts:225, size:"std" },
    { id:"a750", name:"Arc A750", vram:8, score:28, price:200, watts:225, size:"std" },
    { id:"a580", name:"Arc A580", vram:8, score:24, price:170, watts:185, size:"std" },
    { id:"a380", name:"Arc A380", vram:6, score:12, price:110, watts:75, size:"std" },
  ]},
];

/* ── CPU (desktop 2019 → 2026) — score 100 = 9800X3D ──
   ddr: type mémoire supporté · tdp = charge réelle (dimensionnement ventirad) ── */
const CPU_GROUPS = [
  { label: "AMD · Ryzen 9000 (2024-25)", items: [
    { id:"9950x3d", name:"Ryzen 9 9950X3D", cores:16, score:98, price:780, ddr:"DDR5", tdp:200, socket:"AM5" },
    { id:"9800x3d", name:"Ryzen 7 9800X3D", cores:8, score:100, price:409, ddr:"DDR5", tdp:160, socket:"AM5" },
    { id:"9950x", name:"Ryzen 9 9950X", cores:16, score:82, price:650, ddr:"DDR5", tdp:230, socket:"AM5" },
    { id:"9900x", name:"Ryzen 9 9900X", cores:12, score:80, price:470, ddr:"DDR5", tdp:160, socket:"AM5" },
    { id:"9700x", name:"Ryzen 7 9700X", cores:8, score:77, price:360, ddr:"DDR5", tdp:110, socket:"AM5" },
    { id:"9600x", name:"Ryzen 5 9600X", cores:6, score:74, price:280, ddr:"DDR5", tdp:110, socket:"AM5" },
  ]},
  { label: "AMD · Ryzen 7000 (2022-23)", items: [
    { id:"7950x3d", name:"Ryzen 9 7950X3D", cores:16, score:90, price:620, ddr:"DDR5", tdp:162, socket:"AM5" },
    { id:"7800x3d", name:"Ryzen 7 7800X3D", cores:8, score:92, price:420, ddr:"DDR5", tdp:120, socket:"AM5" },
    { id:"7950x", name:"Ryzen 9 7950X", cores:16, score:78, price:520, ddr:"DDR5", tdp:230, socket:"AM5" },
    { id:"7900x", name:"Ryzen 9 7900X", cores:12, score:76, price:400, ddr:"DDR5", tdp:230, socket:"AM5" },
    { id:"7700x", name:"Ryzen 7 7700X", cores:8, score:73, price:300, ddr:"DDR5", tdp:142, socket:"AM5" },
    { id:"7700", name:"Ryzen 7 7700", cores:8, score:72, price:280, ddr:"DDR5", tdp:88, socket:"AM5" },
    { id:"7600x", name:"Ryzen 5 7600X", cores:6, score:69, price:230, ddr:"DDR5", tdp:142, socket:"AM5" },
    { id:"7600", name:"Ryzen 5 7600", cores:6, score:68, price:210, ddr:"DDR5", tdp:88, socket:"AM5" },
  ]},
  { label: "AMD · Ryzen 5000 (2020-22)", items: [
    { id:"5800x3d", name:"Ryzen 7 5800X3D", cores:8, score:72, price:300, ddr:"DDR4", tdp:105, socket:"AM4" },
    { id:"5950x", name:"Ryzen 9 5950X", cores:16, score:62, price:340, ddr:"DDR4", tdp:142, socket:"AM4" },
    { id:"5900x", name:"Ryzen 9 5900X", cores:12, score:60, price:260, ddr:"DDR4", tdp:142, socket:"AM4" },
    { id:"5800x", name:"Ryzen 7 5800X", cores:8, score:58, price:190, ddr:"DDR4", tdp:142, socket:"AM4" },
    { id:"5700x", name:"Ryzen 7 5700X", cores:8, score:56, price:160, ddr:"DDR4", tdp:76, socket:"AM4" },
    { id:"5600x", name:"Ryzen 5 5600X", cores:6, score:54, price:130, ddr:"DDR4", tdp:76, socket:"AM4" },
    { id:"5600", name:"Ryzen 5 5600", cores:6, score:52, price:110, ddr:"DDR4", tdp:76, socket:"AM4" },
    { id:"5500", name:"Ryzen 5 5500", cores:6, score:45, price:90, ddr:"DDR4", tdp:65, socket:"AM4" },
  ]},
  { label: "AMD · Ryzen 3000 (2019)", items: [
    { id:"3950x", used:true, name:"Ryzen 9 3950X", cores:16, score:48, price:250, ddr:"DDR4", tdp:142, socket:"AM4" },
    { id:"3900x", used:true, name:"Ryzen 9 3900X", cores:12, score:47, price:180, ddr:"DDR4", tdp:142, socket:"AM4" },
    { id:"3700x", used:true, name:"Ryzen 7 3700X", cores:8, score:44, price:120, ddr:"DDR4", tdp:88, socket:"AM4" },
    { id:"3600", used:true, name:"Ryzen 5 3600", cores:6, score:40, price:80, ddr:"DDR4", tdp:88, socket:"AM4" },
  ]},
  { label: "AMD · Threadripper (workstation)", items: [
    { id:"tr7980x", name:"Ryzen Threadripper 7980X", cores:64, score:80, price:5200, ddr:"DDR5", tdp:350, socket:"sTR5", pro:true },
    { id:"tr7970x", name:"Ryzen Threadripper 7970X", cores:32, score:78, price:2900, ddr:"DDR5", tdp:350, socket:"sTR5", pro:true },
    { id:"tr7960x", name:"Ryzen Threadripper 7960X", cores:24, score:76, price:1500, ddr:"DDR5", tdp:350, socket:"sTR5", pro:true },
  ]},
  { label: "Intel · Core Ultra 200 (2024-26)", items: [
    { id:"270kplus", name:"Core Ultra 7 270K Plus", cores:24, score:86, price:359, ddr:"DDR5", tdp:250, socket:"LGA1851" },
    { id:"250kplus", name:"Core Ultra 5 250K Plus", cores:18, score:79, price:234, ddr:"DDR5", tdp:159, socket:"LGA1851" },
    { id:"285k", name:"Core Ultra 9 285K", cores:24, score:84, price:589, ddr:"DDR5", tdp:250, socket:"LGA1851" },
    { id:"265k", name:"Core Ultra 7 265K", cores:20, score:80, price:400, ddr:"DDR5", tdp:250, socket:"LGA1851" },
    { id:"245k", name:"Core Ultra 5 245K", cores:14, score:75, price:300, ddr:"DDR5", tdp:159, socket:"LGA1851" },
  ]},
  { label: "Intel · 13e / 14e gen (2022-24)", items: [
    { id:"14900k", name:"i9-14900K", cores:24, score:87, price:480, ddr:"DDR4/DDR5", tdp:253, socket:"LGA1700" },
    { id:"14700k", name:"i7-14700K", cores:20, score:82, price:380, ddr:"DDR4/DDR5", tdp:253, socket:"LGA1700" },
    { id:"14600k", name:"i5-14600K", cores:14, score:76, price:280, ddr:"DDR4/DDR5", tdp:181, socket:"LGA1700" },
    { id:"14400f", name:"i5-14400F", cores:10, score:66, price:180, ddr:"DDR4/DDR5", tdp:148, socket:"LGA1700" },
    { id:"13900k", name:"i9-13900K", cores:24, score:85, price:420, ddr:"DDR4/DDR5", tdp:253, socket:"LGA1700" },
    { id:"13700k", name:"i7-13700K", cores:16, score:80, price:330, ddr:"DDR4/DDR5", tdp:253, socket:"LGA1700" },
    { id:"13600k", name:"i5-13600K", cores:14, score:74, price:250, ddr:"DDR4/DDR5", tdp:181, socket:"LGA1700" },
    { id:"13400f", name:"i5-13400F", cores:10, score:64, price:170, ddr:"DDR4/DDR5", tdp:148, socket:"LGA1700" },
  ]},
  { label: "Intel · 11e / 12e gen (2021-22)", items: [
    { id:"12900k", name:"i9-12900K", cores:16, score:75, price:280, ddr:"DDR4/DDR5", tdp:241, socket:"LGA1700" },
    { id:"12700k", name:"i7-12700K", cores:12, score:70, price:220, ddr:"DDR4/DDR5", tdp:190, socket:"LGA1700" },
    { id:"12600k", name:"i5-12600K", cores:10, score:65, price:170, ddr:"DDR4/DDR5", tdp:150, socket:"LGA1700" },
    { id:"12400f", name:"i5-12400F", cores:6, score:58, price:120, ddr:"DDR4/DDR5", tdp:117, socket:"LGA1700" },
    { id:"11900k", name:"i9-11900K", cores:8, score:54, price:180, ddr:"DDR4", tdp:251, socket:"LGA1200" },
    { id:"11700k", name:"i7-11700K", cores:8, score:52, price:150, ddr:"DDR4", tdp:225, socket:"LGA1200" },
    { id:"11400f", name:"i5-11400F", cores:6, score:45, price:90, ddr:"DDR4", tdp:154, socket:"LGA1200" },
  ]},
  { label: "Intel · 9e / 10e gen (2019-20)", items: [
    { id:"10900k", used:true, name:"i9-10900K", cores:10, score:52, price:170, ddr:"DDR4", tdp:250, socket:"LGA1200" },
    { id:"10700k", used:true, name:"i7-10700K", cores:8, score:48, price:130, ddr:"DDR4", tdp:229, socket:"LGA1200" },
    { id:"10400f", used:true, name:"i5-10400F", cores:6, score:40, price:75, ddr:"DDR4", tdp:134, socket:"LGA1200" },
    { id:"9900k", used:true, name:"i9-9900K", cores:8, score:46, price:140, ddr:"DDR4", tdp:210, socket:"LGA1151" },
    { id:"9700k", used:true, name:"i7-9700K", cores:8, score:42, price:100, ddr:"DDR4", tdp:180, socket:"LGA1151" },
    { id:"9400f", used:true, name:"i5-9400F", cores:6, score:33, price:60, ddr:"DDR4", tdp:84, socket:"LGA1151" },
  ]},
];

const RAM_GROUPS = [
  { label: "DDR5 · 16 Go (budget serré)", items: [
    { id:"r-fury16-6000", name:"Kingston FURY Beast 16 Go (2x8) DDR5-6000 CL36", gb:16, type:"DDR5", mhz:6000, speed:"6000 MHz", price:215 },
    { id:"r-veng16-5600", name:"Corsair Vengeance 16 Go (2x8) DDR5-5600 CL36", gb:16, type:"DDR5", mhz:5600, speed:"5600 MHz", price:195 },
  ]},
  { label: "DDR5 · 32 Go (référence gaming)", items: [
    { id:"r-fury32-5600", name:"Kingston FURY Beast RGB 32 Go (2x16) DDR5-5600 CL40", gb:32, type:"DDR5", mhz:5600, speed:"5600 MHz", price:249 },
    { id:"r-veng32-5600", name:"Corsair Vengeance 32 Go (2x16) DDR5-5600 CL40", gb:32, type:"DDR5", mhz:5600, speed:"5600 MHz", price:339 },
    { id:"r-fury32-6000", name:"Kingston FURY Beast 32 Go (2x16) DDR5-6000 CL30", gb:32, type:"DDR5", mhz:6000, speed:"6000 MHz", price:399 },
    { id:"r-veng32-6000", name:"Corsair Vengeance 32 Go (2x16) DDR5-6000 CL36", gb:32, type:"DDR5", mhz:6000, speed:"6000 MHz", price:409 },
    { id:"r-flare32-6000", name:"G.Skill Flare X5 32 Go (2x16) DDR5-6000 CL36 EXPO", gb:32, type:"DDR5", mhz:6000, speed:"6000 MHz", price:419 },
    { id:"r-tz32-6000", name:"G.Skill Trident Z5 Neo RGB 32 Go DDR5-6000 CL30", gb:32, type:"DDR5", mhz:6000, speed:"6000 MHz", price:519 },
    { id:"r-veng32-6400", name:"Corsair Vengeance RGB 32 Go (2x16) DDR5-6400 CL36", gb:32, type:"DDR5", mhz:6400, speed:"6400 MHz", price:459 },
    { id:"r-crucial32-6400", name:"Crucial Pro Overclocking 32 Go DDR5-6400 CL32", gb:32, type:"DDR5", mhz:6400, speed:"6400 MHz", price:449 },
    { id:"r-tz32-7200", name:"G.Skill Trident Z5 RGB 32 Go DDR5-7200 CL36", gb:32, type:"DDR5", mhz:7200, speed:"7200 MHz", price:559 },
    { id:"r-tz32-8000", name:"G.Skill Trident Z5 RGB 32 Go DDR5-8000 CL38", gb:32, type:"DDR5", mhz:8000, speed:"8000 MHz", price:629 },
  ]},
  { label: "DDR5 · 64 Go (création, multitâche)", items: [
    { id:"r-fury64-6000", name:"Kingston FURY Beast 64 Go (2x32) DDR5-6000 CL36", gb:64, type:"DDR5", mhz:6000, speed:"6000 MHz", price:789 },
    { id:"r-reneg64-6400", name:"Kingston FURY Renegade 64 Go (2x32) DDR5-6400 CL32", gb:64, type:"DDR5", mhz:6400, speed:"6400 MHz", price:849 },
    { id:"r-veng64-6000", name:"Corsair Vengeance RGB 64 Go (2x32) DDR5-6000 CL30", gb:64, type:"DDR5", mhz:6000, speed:"6000 MHz", price:1229 },
  ]},
  { label: "DDR5 · 128 Go et plus (workstation)", items: [
    { id:"r-veng128-5600", name:"Corsair Vengeance 128 Go (4x32) DDR5-5600 CL40", gb:128, type:"DDR5", mhz:5600, speed:"5600 MHz", price:1490 },
    { id:"r-fury128-6000", name:"Kingston FURY Beast 128 Go (4x32) DDR5-6000 CL36", gb:128, type:"DDR5", mhz:6000, speed:"6000 MHz", price:1590 },
    { id:"r-tz128-6400", name:"G.Skill Trident Z5 Neo RGB 128 Go (2x64) DDR5-6400", gb:128, type:"DDR5", mhz:6400, speed:"6400 MHz", price:1790 },
    { id:"r-reneg256-5600", name:"Kingston FURY Renegade Pro 256 Go DDR5-5600 (workstation)", gb:256, type:"DDR5", mhz:5600, speed:"5600 MHz", price:2890, ws:true },
    { id:"r-reneg256-6000", name:"Kingston FURY Renegade Pro 256 Go DDR5-6000 (workstation)", gb:256, type:"DDR5", mhz:6000, speed:"6000 MHz", price:3190, ws:true },
  ]},
  { label: "DDR4 · plateformes 2019-2022", items: [
    { id:"r-lpx8-3200", name:"Corsair Vengeance LPX 8 Go (2x4) DDR4-3200 CL16", gb:8, type:"DDR4", mhz:3200, speed:"3200 MHz", price:69 },
    { id:"r-lpx16-3200", name:"Corsair Vengeance LPX 16 Go (2x8) DDR4-3200 CL16", gb:16, type:"DDR4", mhz:3200, speed:"3200 MHz", price:119 },
    { id:"r-ripjaws16-3600", name:"G.Skill Ripjaws V 16 Go (2x8) DDR4-3600 CL16", gb:16, type:"DDR4", mhz:3600, speed:"3600 MHz", price:129 },
    { id:"r-lpx32-3200", name:"Corsair Vengeance LPX 32 Go (2x16) DDR4-3200 CL16", gb:32, type:"DDR4", mhz:3200, speed:"3200 MHz", price:235 },
    { id:"r-fury32-3600d4", name:"Kingston FURY Beast 32 Go (2x16) DDR4-3600 CL18", gb:32, type:"DDR4", mhz:3600, speed:"3600 MHz", price:249 },
  ]},
];
const SSD_GROUPS = [
  { label: "SSD NVMe · 500 Go", items: [
    { id:"s-p3plus500", name:"Crucial P3 Plus 500 Go NVMe", tb:0.5, price:99 },
    { id:"s-nq790-500", name:"Lexar NQ790 500 Go NVMe", tb:0.5, price:95 },
  ]},
  { label: "SSD NVMe · 1 To", items: [
    { id:"s-nq790-1", name:"Lexar NQ790 1 To NVMe PCIe 4.0", tb:1, price:169 },
    { id:"s-p3plus1", name:"Crucial P3 Plus 1 To NVMe", tb:1, price:159 },
    { id:"s-sn770-1", name:"WD Black SN770 1 To NVMe", tb:1, price:175 },
    { id:"s-990evo1", name:"Samsung 990 EVO Plus 1 To NVMe", tb:1, price:185 },
  ]},
  { label: "SSD NVMe · 2 To", items: [
    { id:"s-t500-2", name:"Crucial T500 2 To NVMe PCIe 4.0", tb:2, price:319 },
    { id:"s-nm790-2", name:"Lexar NM790 2 To NVMe", tb:2, price:305 },
    { id:"s-sn850x-2", name:"WD Black SN850X 2 To NVMe", tb:2, price:349 },
    { id:"s-990pro2", name:"Samsung 990 PRO 2 To NVMe", tb:2, price:345 },
  ]},
  { label: "SSD NVMe · 4 To", items: [
    { id:"s-nm790-4", name:"Lexar NM790 4 To NVMe", tb:4, price:599 },
    { id:"s-t500-4", name:"Crucial T500 4 To NVMe", tb:4, price:645 },
    { id:"s-990pro4", name:"Samsung 990 PRO 4 To NVMe", tb:4, price:669 },
  ]},
  { label: "SSD SATA", items: [
    { id:"s-bx500-1", name:"Crucial BX500 1 To SATA", tb:1, price:145 },
    { id:"s-870evo1", name:"Samsung 870 EVO 1 To SATA", tb:1, price:165 },
    { id:"s-bx500-500", name:"Crucial BX500 500 Go SATA", tb:0.5, price:85 },
  ]},
];
const PSU_GROUPS = [
  { label: "Très haute puissance (workstation, RTX 5090)", items: [
    { id:"p-tx1600", name:"Seasonic PRIME TX-1600", watts:1600, price:449, cert:"Titanium" },
    { id:"p-hx1500i", name:"Corsair HX1500i", watts:1500, price:289, cert:"Platinum" },
    { id:"p-dpp13", name:"be quiet! Dark Power Pro 13 1300W", watts:1300, price:329, cert:"Titanium" },
    { id:"p-hx1200", name:"Corsair HX1200", watts:1200, price:229, cert:"Platinum" },
  ]},
  { label: "Haut de gamme (1000 W)", items: [
    { id:"p-rm1000x", name:"Corsair RM1000x", watts:1000, price:149, cert:"Gold" },
    { id:"p-pp13m1000", name:"be quiet! Pure Power 13 M 1000W", watts:1000, price:159, cert:"Gold" },
  ]},
  { label: "Gaming (850 W)", items: [
    { id:"p-rm850x", name:"Corsair RM850x Shift", watts:850, price:149, cert:"Platinum" },
    { id:"p-rm850e", name:"Corsair RM850e", watts:850, price:120, cert:"Gold" },
    { id:"p-gx850", name:"Seasonic FOCUS GX-850", watts:850, price:129, cert:"Gold" },
    { id:"p-pp13m850", name:"be quiet! Pure Power 13 M 850W", watts:850, price:135, cert:"Gold" },
    { id:"p-c850", name:"NZXT C850 Gold", watts:850, price:119, cert:"Gold" },
  ]},
  { label: "Milieu de gamme (650-750 W)", items: [
    { id:"p-rm750e", name:"Corsair RM750e", watts:750, price:104, cert:"Gold" }, // asin:"XXXX" à compléter
    { id:"p-gx750", name:"Seasonic FOCUS GX-750", watts:750, price:109, cert:"Gold" },
    { id:"p-pp13m750", name:"be quiet! Pure Power 13 M 750W", watts:750, price:115, cert:"Gold" },
    { id:"p-rm650e", name:"Corsair RM650e", watts:650, price:99, cert:"Gold" },
    { id:"p-a650gls", name:"MSI MAG A650GLS", watts:650, price:75, cert:"Gold" },
  ]},
  { label: "Entrée de gamme (550 W)", items: [
    { id:"p-vero550", name:"Endorfy Vero L6 550W", watts:550, price:50, cert:"Bronze" },
    { id:"p-sp10-550", name:"be quiet! System Power 10 550W", watts:550, price:59, cert:"Bronze" },
  ]},
];
const COOLER_GROUPS = [
  { label: "Watercooling AIO", items: [
    { id:"cl-lf3pro420", name:"ARCTIC Liquid Freezer III Pro 420 A-RGB", cap:450, price:115 },
    { id:"cl-lf3pro360", name:"ARCTIC Liquid Freezer III Pro 360 A-RGB", cap:420, price:95 },
    { id:"cl-lf3-240", name:"ARCTIC Liquid Freezer III 240", cap:300, price:75 },
    { id:"cl-nautilus360", name:"Corsair Nautilus 360 RS", cap:340, price:125 },
    { id:"cl-pureloop360", name:"be quiet! Pure Loop 3 360mm", cap:350, price:145 },
    { id:"cl-kraken360", name:"NZXT Kraken 360 RGB", cap:350, price:199 },
    { id:"cl-h150i", name:"Corsair iCUE LINK H150i RGB", cap:360, price:209 },
  ]},
  { label: "Ventirads (air)", items: [
    { id:"cl-nhd15g2", name:"Noctua NH-D15 G2", cap:290, price:155 },
    { id:"cl-nhd15", name:"Noctua NH-D15 chromax.black", cap:250, price:119 },
    { id:"cl-darkrockpro5", name:"be quiet! Dark Rock Pro 5", cap:270, price:105 },
    { id:"cl-darkrock5", name:"be quiet! Dark Rock 5", cap:210, price:75 },
    { id:"cl-ak620", name:"DeepCool AK620 Digital", cap:240, price:65 },
    { id:"cl-phantom", name:"Thermalright Phantom Spirit 120 SE", cap:245, price:45 },
    { id:"cl-peerless", name:"Thermalright Peerless Assassin 120 SE", cap:220, price:39 },
    { id:"cl-assassinx", name:"Thermalright Assassin X 120 R SE", cap:150, price:22 },
    { id:"cl-stock", name:"Ventirad d'origine (fourni avec le CPU)", cap:95, price:0 },
  ]},
  { label: "Threadripper (sTR5)", items: [
    { id:"cl-freezer4u", name:"ARCTIC Freezer 4U-M (sTR5)", cap:400, price:99 },
    { id:"cl-nhu14s-tr5", name:"Noctua NH-U14S TR5-SP6", cap:360, price:135 },
  ]},
];
const FAN_GROUPS = [
  { label: "Ventilation boîtier", items: [
    { id:"f-arctic5", name:"ARCTIC P12 PWM PST (pack de 5)", flow:3, price:39 },
    { id:"f-argb3", name:"Pack 3 ventilateurs ARGB 120 mm", flow:2, price:28 },
    { id:"f-purewings3", name:"be quiet! Pure Wings 3 120 mm (x3)", flow:2, price:33 },
    { id:"f-stock", name:"Ventilateurs fournis avec le boîtier", flow:1, price:0 },
  ]},
];
const MB_GROUPS = [
  { label: "sTR5 · Threadripper workstation", items: [
    { id:"mb-wrx90sage", name:"ASUS Pro WS WRX90E-SAGE SE", socket:"sTR5", ddr:"DDR5", price:1390 },
    { id:"mb-trx50sage", name:"ASUS Pro WS TRX50-SAGE WiFi", socket:"sTR5", ddr:"DDR5", price:890 },
    { id:"mb-trx50aorus", name:"Gigabyte TRX50 Aorus Master", socket:"sTR5", ddr:"DDR5", price:850 },
    { id:"mb-trx50ws", name:"ASRock TRX50 WS", socket:"sTR5", ddr:"DDR5", price:790 },
  ]},
  { label: "AM5 · haut de gamme (X870 / X670)", items: [
    { id:"mb-x870ehero", name:"ASUS ROG Crosshair X870E Hero", socket:"AM5", ddr:"DDR5", price:690 },
    { id:"mb-x870estrix", name:"ASUS ROG Strix X870E-E Gaming WiFi", socket:"AM5", ddr:"DDR5", price:499 },
    { id:"mb-x870emaster", name:"Gigabyte X870E Aorus Master", socket:"AM5", ddr:"DDR5", price:449 },
    { id:"mb-x870ecarbon", name:"MSI MPG X870E Carbon WiFi", socket:"AM5", ddr:"DDR5", price:439 },
    { id:"mb-x670emaster", name:"Gigabyte X670E Aorus Master", socket:"AM5", ddr:"DDR5", price:399 },
    { id:"mb-x670estrix", name:"ASUS ROG Strix X670E-E Gaming WiFi", socket:"AM5", ddr:"DDR5", price:429 },
    { id:"mb-x670proart", name:"ASUS ProArt X670E-Creator WiFi", socket:"AM5", ddr:"DDR5", price:449 },
    { id:"mb-x870tomahawk", name:"MSI MAG X870 Tomahawk WiFi", socket:"AM5", ddr:"DDR5", price:329 },
    { id:"mb-x870tuf", name:"ASUS TUF Gaming X870-Plus WiFi", socket:"AM5", ddr:"DDR5", price:299 },
    { id:"mb-x870steel", name:"ASRock X870 Steel Legend WiFi", socket:"AM5", ddr:"DDR5", price:249 },
    { id:"mb-x670steel", name:"ASRock X670E Steel Legend", socket:"AM5", ddr:"DDR5", price:279 },
  ]},
  { label: "AM5 · milieu de gamme (B850 / B650)", items: [
    { id:"mb-b850tomahawk", name:"MSI MAG B850 Tomahawk WiFi", socket:"AM5", ddr:"DDR5", price:249 },
    { id:"mb-b650estrix", name:"ASUS ROG Strix B650E-F Gaming WiFi", socket:"AM5", ddr:"DDR5", price:269 },
    { id:"mb-b850tuf", name:"ASUS TUF Gaming B850-Plus WiFi", socket:"AM5", ddr:"DDR5", price:229 },
    { id:"mb-b850aorus", name:"Gigabyte B850 Aorus Elite WiFi7", socket:"AM5", ddr:"DDR5", price:219 },
    { id:"mb-b650tomahawk", name:"MSI MAG B650 Tomahawk WiFi", socket:"AM5", ddr:"DDR5", price:209 },
    { id:"mb-b650aorus", name:"Gigabyte B650 Aorus Elite AX", socket:"AM5", ddr:"DDR5", price:189 },
    { id:"mb-b650prime", name:"ASUS Prime B650M-A WiFi", socket:"AM5", ddr:"DDR5", price:159 },
    { id:"mb-b650mprors", name:"ASRock B650M Pro RS", socket:"AM5", ddr:"DDR5", price:129 },
  ]},
  { label: "AM5 · entrée de gamme (A620)", items: [
    { id:"mb-a620gaming", name:"Gigabyte A620M Gaming X", socket:"AM5", ddr:"DDR5", price:99 },
    { id:"mb-a620hdv", name:"ASRock A620M-HDV/M.2", socket:"AM5", ddr:"DDR5", price:85 },
  ]},
  { label: "AM4 · Ryzen 3000/5000 (DDR4)", items: [
    { id:"mb-x570strix", name:"ASUS ROG Strix X570-E Gaming", socket:"AM4", ddr:"DDR4", price:249 },
    { id:"mb-x570saorus", name:"Gigabyte X570S Aorus Elite AX", socket:"AM4", ddr:"DDR4", price:199 },
    { id:"mb-x570tomahawk", name:"MSI MAG X570 Tomahawk WiFi", socket:"AM4", ddr:"DDR4", price:179 },
    { id:"mb-b550tomahawk", name:"MSI MAG B550 Tomahawk", socket:"AM4", ddr:"DDR4", price:149 },
    { id:"mb-b550tuf", name:"ASUS TUF Gaming B550-Plus", socket:"AM4", ddr:"DDR4", price:139 },
    { id:"mb-b550aorus", name:"Gigabyte B550 Aorus Elite AX V2", socket:"AM4", ddr:"DDR4", price:135 },
    { id:"mb-b550mpro4", name:"ASRock B550M Pro4", socket:"AM4", ddr:"DDR4", price:89 },
    { id:"mb-b450tomahawk", name:"MSI B450 Tomahawk Max II", socket:"AM4", ddr:"DDR4", price:85 },
    { id:"mb-a520mk", name:"Gigabyte A520M K V2", socket:"AM4", ddr:"DDR4", price:59 },
  ]},
  { label: "LGA1851 · Core Ultra 200 (DDR5)", items: [
    { id:"mb-z890hero", name:"ASUS ROG Maximus Z890 Hero", socket:"LGA1851", ddr:"DDR5", price:649 },
    { id:"mb-z890ace", name:"MSI MEG Z890 Ace", socket:"LGA1851", ddr:"DDR5", price:599 },
    { id:"mb-z890master", name:"Gigabyte Z890 Aorus Master", socket:"LGA1851", ddr:"DDR5", price:499 },
    { id:"mb-z890carbon", name:"MSI MPG Z890 Carbon WiFi", socket:"LGA1851", ddr:"DDR5", price:419 },
    { id:"mb-z890strix", name:"ASUS ROG Strix Z890-A Gaming WiFi", socket:"LGA1851", ddr:"DDR5", price:399 },
    { id:"mb-z890tuf", name:"ASUS TUF Gaming Z890-Plus WiFi", socket:"LGA1851", ddr:"DDR5", price:329 },
    { id:"mb-w880proart", name:"ASUS Pro WS W880-ACE SE (workstation)", socket:"LGA1851", ddr:"DDR5", price:459 },
    { id:"mb-b860tomahawk", name:"MSI MAG B860 Tomahawk WiFi", socket:"LGA1851", ddr:"DDR5", price:229 },
    { id:"mb-b860aorus", name:"Gigabyte B860 Aorus Elite WiFi7", socket:"LGA1851", ddr:"DDR5", price:209 },
    { id:"mb-b860prime", name:"ASUS Prime B860-Plus WiFi", socket:"LGA1851", ddr:"DDR5", price:199 },
    { id:"mb-h810m", name:"ASRock H810M-H/M.2", socket:"LGA1851", ddr:"DDR5", price:109 },
  ]},
  { label: "LGA1700 · Intel 12-14e gen (DDR5)", items: [
    { id:"mb-z790hero", name:"ASUS ROG Maximus Z790 Hero", socket:"LGA1700", ddr:"DDR5", price:589 },
    { id:"mb-z790carbon", name:"MSI MPG Z790 Carbon WiFi", socket:"LGA1700", ddr:"DDR5", price:389 },
    { id:"mb-z790tomahawk", name:"MSI MAG Z790 Tomahawk WiFi", socket:"LGA1700", ddr:"DDR5", price:299 },
    { id:"mb-z790aorus", name:"Gigabyte Z790 Aorus Elite AX", socket:"LGA1700", ddr:"DDR5", price:289 },
    { id:"mb-z790tuf", name:"ASUS TUF Gaming Z790-Plus WiFi", socket:"LGA1700", ddr:"DDR5", price:279 },
    { id:"mb-b760strix", name:"ASUS ROG Strix B760-F Gaming WiFi", socket:"LGA1700", ddr:"DDR5", price:249 },
    { id:"mb-b760tomahawkd5", name:"MSI MAG B760 Tomahawk WiFi DDR5", socket:"LGA1700", ddr:"DDR5", price:199 },
    { id:"mb-b760aorusd5", name:"Gigabyte B760 Aorus Elite AX DDR5", socket:"LGA1700", ddr:"DDR5", price:189 },
    { id:"mb-b760primed5", name:"ASUS Prime B760M-A WiFi DDR5", socket:"LGA1700", ddr:"DDR5", price:149 },
  ]},
  { label: "LGA1700 · Intel 12-14e gen (DDR4)", items: [
    { id:"mb-z790prod4", name:"MSI PRO Z790-A WiFi DDR4", socket:"LGA1700", ddr:"DDR4", price:229 },
    { id:"mb-z790udd4", name:"Gigabyte Z790 UD AC DDR4", socket:"LGA1700", ddr:"DDR4", price:199 },
    { id:"mb-b760tomahawkd4", name:"MSI MAG B760 Tomahawk WiFi DDR4", socket:"LGA1700", ddr:"DDR4", price:179 },
    { id:"mb-b660mhdv", name:"ASRock B660M-HDV DDR4", socket:"LGA1700", ddr:"DDR4", price:99 },
    { id:"mb-b760primed4", name:"ASUS Prime B760M-K DDR4", socket:"LGA1700", ddr:"DDR4", price:119 },
    { id:"mb-h610mh", name:"Gigabyte H610M H DDR4", socket:"LGA1700", ddr:"DDR4", price:79 },
  ]},
  { label: "LGA1200 · Intel 10-11e gen (DDR4)", items: [
    { id:"mb-z590strix", used:true, name:"ASUS ROG Strix Z590-E Gaming WiFi", socket:"LGA1200", ddr:"DDR4", price:199 },
    { id:"mb-z590tomahawk", used:true, name:"MSI MAG Z590 Tomahawk WiFi", socket:"LGA1200", ddr:"DDR4", price:169 },
    { id:"mb-b560aorus", used:true, name:"Gigabyte B560M Aorus Elite", socket:"LGA1200", ddr:"DDR4", price:109 },
    { id:"mb-b460pro4", used:true, name:"ASRock B460M Pro4", socket:"LGA1200", ddr:"DDR4", price:89 },
    { id:"mb-h510prime", used:true, name:"ASUS Prime H510M-K", socket:"LGA1200", ddr:"DDR4", price:69 },
  ]},
  { label: "LGA1151 · Intel 9e gen (DDR4, occasion)", items: [
    { id:"mb-z390strix", used:true, name:"ASUS ROG Strix Z390-E Gaming", socket:"LGA1151", ddr:"DDR4", price:149 },
    { id:"mb-z390aorus", used:true, name:"Gigabyte Z390 Aorus Elite", socket:"LGA1151", ddr:"DDR4", price:119 },
    { id:"mb-b365mortar", used:true, name:"MSI MAG B365M Mortar", socket:"LGA1151", ddr:"DDR4", price:89 },
    { id:"mb-b360prime", used:true, name:"ASUS Prime B360M-A", socket:"LGA1151", ddr:"DDR4", price:75 },
    { id:"mb-h310s2h", used:true, name:"Gigabyte H310M S2H", socket:"LGA1151", ddr:"DDR4", price:55 },
  ]},
];
const CASE_GROUPS = [
  { label: "Boîtiers · entrée de gamme", items: [
    { id:"c-forge100r", name:"MSI MAG Forge 100R", fits:"large", mesh:true, price:60 },
    { id:"c-vsk4000", name:"Antec VSK4000E-U3", fits:"std", mesh:false, price:55 },
    { id:"c-h3flow", name:"NZXT H3 Flow (mATX)", fits:"std", mesh:true, price:70 },
    { id:"c-forge120a", name:"MSI MAG Forge 120A Airflow", fits:"large", mesh:true, price:75 },
  ]},
  { label: "Boîtiers · gaming (le meilleur rapport qualité/prix)", items: [
    { id:"c-3000d", name:"Corsair 3000D Airflow", fits:"large", mesh:true, price:85 },
    { id:"c-h5flow", name:"NZXT H5 Flow", fits:"large", mesh:true, price:89 },
    { id:"c-xtpro", name:"Phanteks XT Pro Ultra", fits:"large", mesh:true, price:95 },
    { id:"c-4000d", name:"Corsair 4000D Airflow", fits:"large", mesh:true, price:99 },
    { id:"c-c5argb", name:"Antec C5 ARGB", fits:"large", mesh:true, price:90 },
    { id:"c-purebase500dx", name:"be quiet! Pure Base 500DX", fits:"large", mesh:true, price:115 },
    { id:"c-lancool216", name:"Lian Li Lancool 216", fits:"large", mesh:true, price:115 },
    { id:"c-o11mini", name:"Lian Li O11 Dynamic Mini V2 Flow", fits:"large", mesh:true, price:125 },
    { id:"c-h7flow", name:"NZXT H7 Flow", fits:"large", mesh:true, price:139 },
  ]},
  { label: "Boîtiers · premium", items: [
    { id:"c-north", name:"Fractal Design North TG", fits:"large", mesh:true, price:149 },
    { id:"c-meshify2", name:"Fractal Design Meshify 2", fits:"large", mesh:true, price:155 },
    { id:"c-lancool3", name:"Lian Li Lancool III", fits:"large", mesh:true, price:165 },
    { id:"c-5000d", name:"Corsair 5000D RGB Airflow", fits:"large", mesh:true, price:179 },
    { id:"c-o11evo", name:"Lian Li O11 Dynamic EVO", fits:"large", mesh:false, price:189 },
  ]},
  { label: "Boîtiers · grand format (workstation)", items: [
    { id:"c-northxl", name:"Fractal Design North XL TG", fits:"large", mesh:true, price:219 },
    { id:"c-shadow800", name:"be quiet! Shadow Base 800 FX", fits:"large", mesh:true, price:229 },
    { id:"c-o11xl", name:"Lian Li O11 Dynamic XL", fits:"large", mesh:false, price:239 },
    { id:"c-7000d", name:"Corsair 7000D Airflow", fits:"large", mesh:true, price:259 },
  ]},
];

const flat = (g) => g.flatMap((x) => x.items);
const ALL_GPUS = flat(GPU_GROUPS), ALL_CPUS = flat(CPU_GROUPS);
const ALL_RAMS = flat(RAM_GROUPS), ALL_SSDS = flat(SSD_GROUPS);
const ALL_PSUS = flat(PSU_GROUPS), ALL_COOLERS = flat(COOLER_GROUPS);
const ALL_FANS = flat(FAN_GROUPS), ALL_CASES = flat(CASE_GROUPS);
const ALL_MBS = flat(MB_GROUPS);

// Badges dérivés : upscaling supporté par GPU
function upscalingOf(name){
  if(/^RTX 5\d/.test(name)||/RTX PRO 6000/.test(name)) return "DLSS 4.5";
  if(/^RTX 4|Ada/.test(name)) return "DLSS 4";
  if(/^RTX [23]\d/.test(name)) return "DLSS";
  if(/^RX 9\d/.test(name)) return "FSR 4.1";           // RDNA 4 : natif depuis le lancement
  if(/^RX 7\d/.test(name)) return "FSR 4.1";           // RDNA 3 : déploiement juillet 2026
  if(/^RX 6\d/.test(name)) return "FSR 3"; // RDNA 2 : FSR 4.1 annoncé pour 2027 (voir upscalingNext)
  if(/^RX |Radeon PRO/.test(name)) return "FSR 3";
  if(/^Arc/.test(name)) return "XeSS";
  return null; // GTX : pas d'upscaling IA
}
// Prochaines générations d'upscaling annoncées, par constructeur
function upscalingNext(name){
  if(/^RTX 5\d/.test(name)||/RTX PRO 6000/.test(name)) return "DLSS 5 (automne 2026)";
  if(/^RX 6\d/.test(name)) return "FSR 4.1 (prévu début 2027)";
  return null;
}
ALL_GPUS.forEach((g)=>{ g.up = upscalingOf(g.name); g.upNext = upscalingNext(g.name); if(g.pro===undefined) g.pro=false; });
ALL_CPUS.forEach((c)=>{ if(c.pro===undefined) c.pro=false; c.x3d=/X3D/i.test(c.name); });


const GAMES = [
  { name: "Valorant", base: 600, cpuBound: 0.75 },
  { name: "Fortnite", base: 320, cpuBound: 0.5 },
  { name: "GTA V", base: 260, cpuBound: 0.45 },
  { name: "Call of Duty : Warzone", base: 210, cpuBound: 0.4 },
  { name: "Elden Ring", base: 165, cpuBound: 0.3 },
  { name: "Cyberpunk 2077 (Ultra)", base: 130, cpuBound: 0.15 },
];
const RES = { "1080p": 1, "1440p": 0.72, "4K": 0.45 };

function estimateFps(game, cpu, gpu, res) {
  const gpuFps = game.base * (gpu.score / 100) * RES[res];
  const cpuCap = game.base * (cpu.score / 100) * (1 + (1 - game.cpuBound));
  return Math.round(Math.min(gpuFps, cpuCap));
}
// Bonus de score lié à la fréquence RAM (impact volontairement léger)
function ramSpeedBonus(ram) {
  const base = ram.type === "DDR5" ? 6000 : 3200;
  const b = ((ram.mhz || base) - base) / 2000; // ex: DDR5-8000 -> +1, 6000 -> 0
  return Math.max(-1, Math.min(2, b)) * 1.2; // borné, faible amplitude
}
// Score global (une décimale)
function computeScore(cpu, gpu, ram) {
  const base = gpu.score * 0.55 + cpu.score * 0.3 + (Math.min(ram.gb, 64) / 64) * 100 * 0.15;
  return Math.round((base + ramSpeedBonus(ram)) * 10) / 10;
}

function fpsTier(fps) {
  if (fps >= 144) return { label: "Fluide e-sport", cls: "top" };
  if (fps >= 60) return { label: "Très jouable", cls: "good" };
  if (fps >= 30) return { label: "Jouable", cls: "ok" };
  return { label: "Limite", cls: "bad" };
}
function appSupport(cpu, gpu, ram) {
  return [
    { name: "Streaming (OBS + jeu)", ok: cpu.cores >= 8 || gpu.score >= 55, need: "8 cœurs CPU ou encodeur GPU récent" },
    { name: "Montage vidéo 4K (Premiere / DaVinci)", ok: ram.gb >= 32 && gpu.vram >= 8, need: "32 Go RAM + 8 Go VRAM" },
    { name: "IA locale (Stable Diffusion, LLM)", ok: gpu.vram >= 12, need: "12 Go de VRAM minimum" },
    { name: "3D & rendu (Blender)", ok: gpu.score >= 50 && ram.gb >= 32, need: "GPU milieu de gamme + 32 Go RAM" },
    { name: "Dev / machines virtuelles", ok: cpu.cores >= 8 && ram.gb >= 32, need: "8 cœurs + 32 Go RAM" },
    { name: "Bureautique & navigation", ok: true, need: "" },
  ];
}
// Estimation des capacités IA & création selon VRAM / cœurs
function aiCreation(cpu, gpu, ram) {
  const v = gpu.vram, cores = cpu.cores;
  // LLM local : dépend surtout de la VRAM
  const llm = v >= 48 ? { lvl: "top", txt: "Modèles 70B quantifiés (Llama 70B, Qwen 72B) en local, fluide." }
    : v >= 24 ? { lvl: "good", txt: "Modèles 30B quantifiés confortables ; 70B en version très compressée." }
    : v >= 16 ? { lvl: "good", txt: "Modèles 13B fluides, 30B quantifiés jouables." }
    : v >= 12 ? { lvl: "ok", txt: "Modèles 7B–13B quantifiés en local." }
    : v >= 8 ? { lvl: "ok", txt: "Petits modèles 7B quantifiés seulement." }
    : { lvl: "bad", txt: "VRAM trop juste pour de l'IA locale confortable." };
  // Stable Diffusion / génération d'images
  const sd = v >= 16 ? { lvl: "top", txt: "SDXL et Flux en pleine résolution, génération rapide." }
    : v >= 12 ? { lvl: "good", txt: "SDXL fluide, Flux jouable." }
    : v >= 8 ? { lvl: "ok", txt: "SD 1.5 rapide, SDXL possible mais plus lent." }
    : v >= 6 ? { lvl: "ok", txt: "SD 1.5 en basse résolution." }
    : { lvl: "bad", txt: "VRAM insuffisante pour la génération d'images." };
  // Montage vidéo
  const video = (v >= 16 && ram.gb >= 32 && cores >= 8) ? { lvl: "top", txt: "Montage 8K et effets lourds fluides (Premiere, DaVinci)." }
    : (v >= 8 && ram.gb >= 32) ? { lvl: "good", txt: "Montage 4K confortable avec étalonnage." }
    : (v >= 8 && ram.gb >= 16) ? { lvl: "ok", txt: "Montage 1080p fluide, 4K possible mais plus lourd." }
    : { lvl: "bad", txt: "Configuration juste pour du montage au-delà du 1080p." };
  return [
    { name: "IA locale (LLM)", ...llm },
    { name: "Génération d'images (Stable Diffusion, Flux)", ...sd },
    { name: "Montage & création vidéo", ...video },
  ];
}

function bottleneck(cpu, gpu) {
  const r = cpu.score / gpu.score;
  if (r < 0.72) return { type: "cpu", msg: "Ton processeur bride ta carte graphique : en 1080p tu perds des FPS. Monte en gamme CPU ou joue en 1440p/4K." };
  if (r > 1.6) return { type: "gpu", msg: "Ton CPU est surdimensionné par rapport au GPU : la carte graphique sera le facteur limitant. Budget mieux réparti = plus de FPS." };
  return { type: "ok", msg: "Config équilibrée : CPU et GPU travaillent de pair, aucun composant ne bride l'autre." };
}

/* ── Vérification de compatibilité ──────────────────── */
function compatChecks({ cpu, gpu, ram, mb, psu, cooler, box, fans }) {
  const checks = [];
  // 1. Socket CPU ↔ carte mère
  checks.push(cpu.socket === mb.socket
    ? { lvl: "ok", msg: `Le ${cpu.name} (socket ${cpu.socket}) se monte sur cette carte mère.` }
    : { lvl: "bad", msg: `Incompatible : le ${cpu.name} est en socket ${cpu.socket}, cette carte mère est en ${mb.socket}. Change de carte mère ou de CPU.` });
  // 2. RAM ↔ carte mère : type mémoire, puis capacité max par plateforme
  const RAM_MAX = { sTR5: 1024, AM5: 256, LGA1851: 256, LGA1700: 192, AM4: 128, LGA1200: 128, LGA1151: 128 };
  const RAM_MHZ_MAX = { sTR5: 6400, AM5: 6400, LGA1851: 8000, LGA1700: 7200, AM4: 3600, LGA1200: 3200, LGA1151: 3200 };
  const mhzMax = RAM_MHZ_MAX[mb.socket] || 6000;
  const maxRam = RAM_MAX[mb.socket] || 128;
  if (ram.type !== mb.ddr) {
    checks.push({ lvl: "bad", msg: `Incompatible : cette carte mère accepte uniquement de la ${mb.ddr}, pas de la ${ram.type}.` });
  } else if (ram.gb > maxRam) {
    checks.push({ lvl: "bad", msg: `${ram.gb} Go dépasse la limite de la plateforme ${mb.socket} (${maxRam} Go maximum). Passe sur une carte mère qui accepte cette capacité${mb.socket !== "sTR5" ? ", ou sur une plateforme Threadripper (sTR5) pour aller plus haut" : ""}.` });
  } else {
    checks.push({ lvl: "ok", msg: `Mémoire ${ram.speed || ram.type} (${ram.gb} Go) compatible avec cette carte mère (max ${maxRam} Go sur ${mb.socket}).` });
  }
  if (ram.type === mb.ddr && (ram.mhz || 0) > mhzMax) {
    checks.push({ lvl: "warn", msg: `La fréquence ${ram.speed} dépasse ce que la plateforme ${mb.socket} garantit (${mhzMax} MHz). La RAM tournera plus lentement, sauf carte mère haut de gamme compatible.` });
  }
  // Cohérence de gamme : carte mère d'entrée de gamme sous un CPU/GPU haut de gamme
  const mbTier = /(X[0-9]|Z[0-9]|W[0-9]|TRX|WRX)/.test(mb.name) ? "high" : /B[0-9]/.test(mb.name) ? "mid" : "entry";
  if (mbTier === "entry" && (gpu.score >= 70 || cpu.price >= 350)) {
    checks.push({ lvl: "warn", msg: `Cette carte mère d'entrée de gamme est sous-dimensionnée pour un ${cpu.name} / ${gpu.name} : elle peut brider l'alimentation du processeur et limiter la fréquence mémoire. Une carte B ou X/Z serait plus cohérente.` });
  }
  // 2. Alimentation
  const draw = gpu.watts + cpu.tdp + 75; // + carte mère, SSD, ventilos
  const headroom = psu.watts / draw;
  if (headroom < 1.05) checks.push({ lvl: "bad", msg: `Alimentation insuffisante : la config tire ~${draw} W en charge, ton alim fait ${psu.watts} W. Risque d'extinctions. Minimum conseillé : ${Math.ceil(draw * 1.3 / 50) * 50} W.` });
  else if (headroom < 1.3) checks.push({ lvl: "warn", msg: `Alimentation juste : ~${draw} W de charge pour ${psu.watts} W. Ça démarre, mais sans marge pour les pics. ${Math.ceil(draw * 1.3 / 50) * 50} W serait plus serein.` });
  else checks.push({ lvl: "ok", msg: `Alimentation ${psu.watts} W adaptée : ~${draw} W de charge estimée, bonne marge de sécurité.` });
  // 3. Refroidissement CPU
  if (cooler.cap < cpu.tdp * 0.85) checks.push({ lvl: "bad", msg: `Refroidissement insuffisant : le ${cpu.name} dissipe jusqu'à ${cpu.tdp} W, ton ${cooler.name.toLowerCase()} plafonne vers ${cooler.cap} W. Surchauffe et perte de perfs garanties.` });
  else if (cooler.cap < cpu.tdp * 1.1) checks.push({ lvl: "warn", msg: `Refroidissement limite pour ${cpu.tdp} W de dissipation : ça tiendra, mais bruyant en charge. Un cran au-dessus serait plus confortable.` });
  else checks.push({ lvl: "ok", msg: `Refroidissement adapté (capacité ~${cooler.cap} W pour ${cpu.tdp} W à dissiper).` });
  // 4. Boîtier ↔ taille GPU
  if (gpu.size === "large" && box.fits !== "large") checks.push({ lvl: "bad", msg: `La ${gpu.name} est une carte longue/épaisse : elle ne rentre pas dans un boîtier compact. Prends un moyen ou grand tour.` });
  else checks.push({ lvl: "ok", msg: `La ${gpu.name} rentre dans ce boîtier.` });
  // 5. Flux d'air
  if (gpu.watts >= 300 && (!box.mesh || fans.flow < 2)) checks.push({ lvl: "warn", msg: `GPU à ${gpu.watts} W dans un boîtier peu ventilé : ajoute des ventilos ou passe sur une façade mesh pour éviter l'étuve.` });
  else checks.push({ lvl: "ok", msg: `Flux d'air suffisant pour cette config.` });
  return checks;
}


/* ── Visualisation du PC monté (vue de côté, interactive) ── */
function Hot({ kind, label, onPick, children }) {
  return (
    <g className="hotspot" role="button" tabIndex={0} aria-label={`Modifier : ${label}`}
       onClick={() => onPick(kind)}
       onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(kind); } }}>
      <title>{`Modifier : ${label}`}</title>
      {children}
    </g>
  );
}
function PcView({ cpu, gpu, ram, ssd, cooler, fans, box, onPick }) {
  const gb = brandOf(gpu.name), cb = brandOf(cpu.name);
  const H = box.fits === "std" ? 240 : box.price >= 200 ? 300 : 280;
  const W = 240;
  const gpuLen = gpu.size === "large" ? 150 : 110;
  const isAio = cooler.cap >= 300 && /Liquid|Loop|Kraken|H150i|Nautilus|AIO/i.test(cooler.name);
  const aioW = /420/.test(cooler.name) ? 130 : /360/.test(cooler.name) ? 120 : 84;
  const sticks = ram.gb >= 64 ? 4 : 2;
  const frontFans = Math.min(fans.flow + 1, 3);
  const ln = "#2C2C42", fill = "#0E0E16", metal = "#191926";
  return (
    <svg viewBox={`0 0 ${W + 20} ${H + 20}`} width="100%" style={{ maxWidth: 320, display: "block", margin: "0 auto" }} role="img" aria-label="Schéma interactif de la configuration, touche un composant pour le modifier">
      {/* Boîtier (cliquable) */}
      <Hot kind="box" label="boîtier" onPick={onPick}>
        <rect x="10" y="10" width={W} height={H} rx="10" fill={fill} stroke={ln} strokeWidth="2"/>
        <rect x="10" y="10" width={W} height={H} rx="10" fill="none" stroke="rgba(217,150,74,.25)" strokeWidth="1"/>
        {box.mesh && [...Array(Math.floor((H - 40) / 10))].map((_, i) => (
          <line key={i} x1="16" y1={26 + i * 10} x2="30" y2={26 + i * 10} stroke={ln} strokeWidth="1.4"/>
        ))}
      </Hot>
      {/* Carte mère + SSD M.2 */}
      <Hot kind="mb" label="carte mère" onPick={onPick}>
        <rect x="86" y="34" width="148" height={H - 100} rx="4" fill={metal} stroke={ln} strokeWidth="1.4"/>
      </Hot>
      <Hot kind="ssd" label="stockage" onPick={onPick}>
        <rect x="96" y={H - 130} width="34" height="8" rx="2" fill={fill} stroke="#6E7BA0" strokeWidth="1.3"/>
        <circle cx="126" cy={H - 126} r="1.5" fill="#7FA396"/>
      </Hot>
      {/* Ventilos façade */}
      <Hot kind="fans" label="ventilation" onPick={onPick}>
        {[...Array(frontFans)].map((_, i) => (
          <g key={i}>
            <circle cx="48" cy={54 + i * 52} r="19" fill={fill} stroke="#5C6B8A" strokeWidth="1.6"/>
            <circle cx="48" cy={54 + i * 52} r="3" fill="#5C6B8A"/>
            <path d={`M48 ${41 + i * 52} a13 13 0 0 1 11 19 M48 ${67 + i * 52} a13 13 0 0 1 -11 -19`} fill="none" stroke="#5C6B8A" strokeWidth="1.4"/>
          </g>
        ))}
      </Hot>
      {/* CPU + refroidissement */}
      <Hot kind="cpucool" label="processeur et refroidissement" onPick={onPick}>
        {isAio ? (
          <g>
            <rect x={220 - aioW} y="18" width={aioW} height="16" rx="3" fill={metal} stroke="#5C6B8A" strokeWidth="1.4"/>
            {[...Array(/360|420/.test(cooler.name) ? 3 : 2)].map((_, i) => (
              <circle key={i} cx={220 - aioW + 20 + i * 38} cy="26" r="6.5" fill="none" stroke="#5C6B8A" strokeWidth="1.2"/>
            ))}
            <path d={`M150 60 C 150 44, ${222 - aioW} 40, ${222 - aioW} 30`} fill="none" stroke="#5C6B8A" strokeWidth="2"/>
            <circle cx="150" cy="68" r="13" fill={fill} stroke={cb.color} strokeWidth="1.6"/>
          </g>
        ) : cooler.id === "stock" ? (
          <g>
            <rect x="138" y="56" width="26" height="26" rx="3" fill={fill} stroke={cb.color} strokeWidth="1.6"/>
            <circle cx="151" cy="69" r="8" fill="none" stroke={cb.color} strokeWidth="1.2"/>
          </g>
        ) : (
          <g>
            <rect x="136" y="46" width="32" height="44" rx="3" fill={fill} stroke={cb.color} strokeWidth="1.6"/>
            {[...Array(5)].map((_, i) => (
              <line key={i} x1="138" y1={52 + i * 8} x2="166" y2={52 + i * 8} stroke={cb.color} strokeWidth="1" opacity=".7"/>
            ))}
          </g>
        )}
      </Hot>
      {/* RAM */}
      <Hot kind="ram" label="mémoire vive" onPick={onPick}>
        {[...Array(sticks)].map((_, i) => (
          <rect key={i} x={182 + i * 9} y="48" width="5" height="52" rx="1.5" fill={fill} stroke="#B98A4C" strokeWidth="1.3"/>
        ))}
      </Hot>
      {/* GPU */}
      <Hot kind="gpu" label="carte graphique" onPick={onPick}>
        <rect x="92" y={H - 110} width={gpuLen} height="30" rx="4" fill={fill} stroke={gb.color} strokeWidth="2"/>
        {[...Array(gpu.size === "large" ? 3 : 2)].map((_, i) => (
          <circle key={i} cx={112 + i * 44} cy={H - 95} r="10" fill="none" stroke={gb.color} strokeWidth="1.4"/>
        ))}
        <rect x="92" y={H - 114} width={gpuLen * 0.6} height="4" rx="2" fill={gb.color} opacity=".8"/>
      </Hot>
      {/* Alimentation */}
      <Hot kind="psu" label="alimentation" onPick={onPick}>
        <rect x="14" y={H - 46} width={W - 8} height="42" rx="6" fill={metal} stroke={ln} strokeWidth="1.4"/>
        <rect x={W - 66} y={H - 38} width="52" height="26" rx="3" fill={fill} stroke="#6E7BA0" strokeWidth="1.3"/>
        <circle cx={W - 40} cy={H - 25} r="8" fill="none" stroke="#6E7BA0" strokeWidth="1.2"/>
      </Hot>
      {/* Ventilo arrière (décoratif) */}
      <circle cx={W - 14} cy="58" r="14" fill="none" stroke="#5C6B8A" strokeWidth="1.4"/>
      <circle cx={W - 14} cy="58" r="2.5" fill="#5C6B8A"/>
    </svg>
  );
}

function GroupSelect({ label, groups, items, value, onChange, fmt, searchable }) {
  const [q, setQ] = useState("");
  const nq = q.trim().toLowerCase();
  const fg = nq
    ? groups.map((g) => ({ ...g, items: g.items.filter((i) => i.name.toLowerCase().includes(nq)) })).filter((g) => g.items.length)
    : groups;
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {searchable && (
        <input className="field-search" type="text" placeholder="Rechercher un modèle…"
          value={q} onChange={(e) => setQ(e.target.value)} aria-label={`Rechercher : ${label}`} />
      )}
      <select value={value.id} onChange={(e) => onChange(items.find((i) => i.id === e.target.value))}>
        {fg.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.items.map((i) => (
              <option key={i.id} value={i.id}>{fmt(i)}</option>
            ))}
          </optgroup>
        ))}
        {!fg.length && <option disabled>Aucun résultat</option>}
      </select>
    </label>
  );
}
function AffButton({ product }) {
  return (
    <a className="aff-btn" href={affLink(product)} target="_blank" rel="sponsored noopener noreferrer">
      Voir le prix →
    </a>
  );
}
function LegalPage({ onBack }) {
  return (
    <div className="legal">
      <button className="back" onClick={onBack}>← Retour au simulateur</button>
      <h1>Mentions légales</h1>
      <h2>Éditeur du site</h2>
      <p><b>Athos Builder</b> · athosbuilder.fr</p>
      <p>Site édité à titre personnel. Contact : <a href="mailto:athosbuilder.fr@gmail.com">athosbuilder.fr@gmail.com</a></p>
      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
      <h2>Liens vers les marchands</h2>
      <p>{HAS_AFFILIATE
        ? "Ce site contient des liens d'affiliation. Lorsque vous achetez un produit via ces liens, l'éditeur du site perçoit une commission de la part du marchand, sans surcoût pour vous. Ces commissions n'influencent pas les scores et estimations affichés, qui sont calculés indépendamment."
        : "Les boutons « Voir le prix » renvoient vers une recherche marchand classique. Ce site ne perçoit actuellement aucune commission sur les achats. Si des liens d'affiliation étaient mis en place, cette page serait mise à jour et une mention visible apparaîtrait sur le site."}</p>
      <h2>Limites des estimations</h2>
      <p>Les performances (FPS, scores, compatibilités, consommations) sont des estimations indicatives issues d'un modèle basé sur des moyennes de benchmarks et fiches techniques publiques. Elles ne constituent ni une garantie ni un conseil d'achat contractuel. Vérifiez toujours les dimensions et compatibilités exactes des modèles précis avant achat.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les noms de produits et marques cités (NVIDIA, AMD, Intel, etc.) appartiennent à leurs propriétaires respectifs et sont cités à titre informatif.</p>
    </div>
  );
}
function PrivacyPage({ onBack }) {
  return (
    <div className="legal">
      <button className="back" onClick={onBack}>← Retour au simulateur</button>
      <h1>Confidentialité &amp; sécurité</h1>
      <h2>Aucune donnée collectée</h2>
      <p>Ce site ne collecte aucune donnée personnelle : pas de compte, pas de formulaire, pas de cookie de suivi, pas de traceur publicitaire. Vos choix de composants restent dans votre navigateur.</p>
      <h2>Liens externes</h2>
      <p>Lorsque vous cliquez sur « Voir le prix », vous quittez ce site pour celui d'un marchand. Leurs politiques de confidentialité s'appliquent alors. Les liens s'ouvrent dans un onglet isolé (noopener) : le site marchand ne peut pas interagir avec cette page.</p>
      <h2>Vos droits (RGPD)</h2>
      <p>Aucune donnée n'étant collectée ni stockée par ce site, il n'y a aucune donnée à consulter, rectifier ou supprimer. Pour toute question : <a href="mailto:athosbuilder.fr@gmail.com">athosbuilder.fr@gmail.com</a>.</p>
    </div>
  );
}

/* ── Suggestion de config selon un budget ───────────── */
function suggestBuild(budget, profile = "gaming") {
  const P = {
    gaming:      { gpuW:0.45, cpuW:0.18, ram:32, allowPro:false, cpuKey:(c)=>c.score, gpuKey:(g)=>g.score },
    workstation: { gpuW:0.38, cpuW:0.30, ram:64, allowPro:true,  cpuKey:(c)=>c.cores*10+c.score, gpuKey:(g)=>(g.vram*2+(g.compute||g.score)) },
    bureautique: { gpuW:0.16, cpuW:0.20, ram:16, allowPro:false,
      cpuKey:(c)=>(c.x3d ? -100 : 0) + Math.min(c.cores,8)*8 - c.tdp*0.15 - c.price*0.02,
      gpuKey:(g)=>-g.watts },
  }[profile] || {};
  const under = (arr, cap) => arr.filter((x) => x.price <= cap).sort((a, b) => b.score - a.score)[0];
  const cheapest = (arr) => arr.slice().sort((a, b) => a.price - b.price)[0];
  // Marges volontairement au-dessus des seuils d'alerte du diagnostic (1.3 pour
  // l'alimentation, 1.1 pour le refroidissement) : une config proposée doit être
  // montable telle quelle, sans avertissement à corriger.
  const psuFor = (gpu, cpu) => {
    const d = gpu.watts + cpu.tdp + 75;
    return ALL_PSUS.slice().sort((a, b) => a.watts - b.watts || a.price - b.price).find((p) => p.watts >= d * 1.35)
        || ALL_PSUS.slice().sort((a, b) => b.watts - a.watts)[0];
  };
  const coolerFor = (cpu) => {
    // Threadripper : refroidissement dédié sTR5 obligatoire
    const pool = cpu.socket === "sTR5"
      ? ALL_COOLERS.filter((c) => /sTR5|TR5/.test(c.name))
      : ALL_COOLERS.filter((c) => !/sTR5|TR5/.test(c.name));
    return pool.slice().sort((a, b) => a.price - b.price).find((c) => c.cap >= cpu.tdp * 1.2)
        || pool.slice().sort((a, b) => b.cap - a.cap)[0]
        || ALL_COOLERS.slice().sort((a, b) => b.cap - a.cap)[0];
  };
  const fansFor = (gpu) => gpu.watts >= 300 ? ALL_FANS.find((f) => f.id === "f-argb3") : ALL_FANS.find((f) => f.id === "f-stock");
  const boxFor = (gpu) => gpu.size === "large" ? ALL_CASES.find((c) => c.id === "c-3000d") : ALL_CASES.find((c) => c.id === "c-forge100r");
  const fansNeeded = (gpu, box) => gpu.watts >= 300 ? ALL_FANS.find((f) => f.id === "f-argb3") : ALL_FANS.find((f) => f.id === "f-stock");

  let gpuPool = P.allowPro ? ALL_GPUS : ALL_GPUS.filter((g) => !g.pro);
  let cpuPool = P.allowPro ? ALL_CPUS : ALL_CPUS.filter((c) => !c.pro);
  if (profile === "bureautique") cpuPool = cpuPool.filter((c) => !c.x3d); // le cache 3D est gaming, inutile en bureautique
  // Au-dessus de 2500 €, on privilégie NVIDIA : dans ce très haut de gamme,
  // NVIDIA domine (ray tracing, DLSS 4, IA). On ne garde AMD/Intel que s'il
  // n'existe aucune option NVIDIA (sécurité), sinon on filtre le pool.
  const isNvidia = (g) => /^(RTX|GTX)/.test(g.name) || /RTX PRO/.test(g.name);
  if (budget > 2500 && gpuPool.some(isNvidia)) gpuPool = gpuPool.filter(isNvidia);
  let gpu = gpuPool.filter((g) => g.price <= budget * P.gpuW).sort((a, b) => P.gpuKey(b) - P.gpuKey(a))[0] || cheapest(gpuPool);
  const affCpus = cpuPool.filter((c) => c.price <= Math.max(budget * P.cpuW, 60));
  let cpu;
  if (profile === "gaming") {
    cpu = affCpus.map((c) => ({ c, bal: c.score / gpu.score }))
        .filter((o) => o.bal >= 0.72 && o.bal <= 1.6).sort((a, b) => b.c.score - a.c.score)[0]?.c
      || affCpus.slice().sort((a, b) => b.score - a.score)[0] || cheapest(cpuPool);
  } else {
    cpu = affCpus.slice().sort((a, b) => P.cpuKey(b) - P.cpuKey(a))[0] || cheapest(cpuPool);
  }

  const boardTier = (m) => /(X[0-9]|Z[0-9]|W[0-9]|TRX|WRX)/.test(m.name) ? "high" : /B[0-9]/.test(m.name) ? "mid" : "entry";
  const cfgLevel = (gpu.score >= 70 || cpu.price >= 350) ? "high" : (gpu.score >= 40 || cpu.price >= 150) ? "mid" : "entry";
  const tierPref = cfgLevel === "high" ? ["high", "mid", "entry"] : cfgLevel === "mid" ? ["mid", "high", "entry"] : ["entry", "mid", "high"];
  const socketBoards = ALL_MBS.filter((m) => m.socket === cpu.socket);
  const pickBoard = () => {
    for (const t of tierPref) {
      const cand = socketBoards.filter((m) => boardTier(m) === t);
      if (cand.length) {
        const ddr5 = profile !== "bureautique" ? cand.filter((m) => m.ddr === "DDR5") : [];
        return (ddr5.length ? ddr5 : cand).sort((a, b) => a.price - b.price)[0];
      }
    }
    return socketBoards.sort((a, b) => a.price - b.price)[0];
  };
  let mb = pickBoard();
  const MHZ_MAX = { sTR5: 6400, AM5: 6400, LGA1851: 8000, LGA1700: 7200, AM4: 3600, LGA1200: 3200, LGA1151: 3200 };
  const mhzCap = MHZ_MAX[mb.socket] || 6000;
  const ramsType = ALL_RAMS.filter((r) => r.type === mb.ddr
      && (!r.ws || mb.socket === "sTR5")
      && (r.gb < 128 || ["sTR5", "AM5", "LGA1851", "LGA1700"].includes(mb.socket))
      && (r.mhz || 0) <= mhzCap)
    .sort((a, b) => a.gb - b.gb || b.mhz - a.mhz || a.price - b.price);
  // Pour une capacité donnée, prendre la barrette la plus rapide compatible
  const ramAt = (gb) => ramsType.filter((r) => r.gb === gb).sort((a, b) => b.mhz - a.mhz || a.price - b.price)[0];
  let ram = ramAt(P.ram) || ramsType.filter((r) => r.gb <= P.ram).pop() || ramsType[ramsType.length - 1];
  let ssd = ALL_SSDS.find((s) => s.id === "s-p3plus1");
  let psu = psuFor(gpu, cpu), cooler = coolerFor(cpu), fans = fansFor(gpu), box = boxFor(gpu);

  const cost = () => cpu.price + gpu.price + mb.price + ram.price + ssd.price + psu.price + cooler.price + fans.price + box.price;

  // Réduire jusqu'à rentrer dans le budget
  let guard = 0;
  while (cost() > budget && guard++ < 60) {
    if (ram.gb > 16) { const sm = ramsType.filter((r) => r.gb < ram.gb).pop(); if (sm) { ram = sm; continue; } }
    if (ssd.id === "n1") { ssd = ALL_SSDS.find((s) => s.id === "n05"); continue; }
    const lg = gpuPool.filter((g) => g.score < gpu.score).sort((a, b) => b.score - a.score)[0];
    if (lg) { gpu = lg; psu = psuFor(gpu, cpu); fans = fansFor(gpu); box = boxFor(gpu); continue; }
    const lc = cpuPool.filter((c) => c.score < cpu.score && c.socket === mb.socket).sort((a, b) => b.score - a.score)[0];
    if (lc) { cpu = lc; cooler = coolerFor(cpu); psu = psuFor(gpu, cpu); continue; }
    break;
  }
  // Sécuriser d'abord la mémoire cible du profil : une config chère avec trop peu
  // de RAM n'a pas de sens, même si le GPU pourrait encore monter.
  {
    const target = ramAt(P.ram);
    if (target && ram.gb < P.ram) {
      const delta = target.price - ram.price;
      if (cost() + delta <= budget) ram = target;
    }
  }
  // Réinvestir le reliquat dans le GPU (sauf bureautique : on ne gonfle pas le GPU)
  if (profile !== "bureautique") {
    const rank = (g) => profile === "workstation" ? P.gpuKey(g) : g.score;
    guard = 0;
    while (guard++ < 60) {
      const up = gpuPool.filter((g) => rank(g) > rank(gpu)).sort((a, b) => rank(a) - rank(b))[0];
      if (!up) break;
      const prev = { gpu, psu, fans, box };
      gpu = up; psu = psuFor(gpu, cpu); fans = fansFor(gpu); box = boxFor(gpu);
      if (cost() > budget) { gpu = prev.gpu; psu = prev.psu; fans = prev.fans; box = prev.box; break; }
    }
  }
  // Réinvestir le reliquat : RAM d'abord (plus déterminante que le stockage),
  // puis SSD, CPU (équilibré) et refroidissement
  guard = 0; let improved = true;
  while (improved && guard++ < 80) {
    improved = false;
    const ramUp = ramsType.filter((r) => r.gb > ram.gb).sort((a, b) => a.gb - b.gb || a.price - b.price)[0];
    if (ramUp && cost() - ram.price + ramUp.price <= budget) { ram = ramUp; improved = true; continue; }
    const ssdUp = ALL_SSDS.filter((x) => x.tb > ssd.tb).sort((a, b) => a.tb - b.tb)[0];
    if (ssdUp && cost() - ssd.price + ssdUp.price <= budget) { ssd = ssdUp; improved = true; continue; }
    const cpuUp = cpuPool.filter((c) => c.socket === mb.socket && c.score > cpu.score
        && (profile !== "gaming" || c.score / gpu.score <= 1.6)
        && (profile !== "bureautique" || !c.x3d))
      .sort((a, b) => a.score - b.score)[0];
    if (cpuUp) { const nc = coolerFor(cpuUp), np = psuFor(gpu, cpuUp);
      const delta = (cpuUp.price - cpu.price) + (nc.price - cooler.price) + (np.price - psu.price);
      if (cost() + delta <= budget) { cpu = cpuUp; cooler = nc; psu = np; improved = true; continue; } }
    const coolUp = ALL_COOLERS.filter((c) => c.cap > cooler.cap).sort((a, b) => a.price - b.price)[0];
    if (coolUp && cost() - cooler.price + coolUp.price <= budget) { cooler = coolUp; improved = true; continue; }
  }
  return { cpu, gpu, mb, ram, ssd, psu, cooler, fans, box, total: cost(), over: cost() > budget };
}

/* ── Partage de config par lien ─────────────────────── */
const SHARE_ORDER = ["cpu", "gpu", "mb", "ram", "ssd", "psu", "cooler", "fans", "box", "res"];
function encodeConfig(s) {
  return SHARE_ORDER.map((k) => (k === "res" ? s.res : s[k].id)).join("~");
}
function readConfigFromUrl() {
  try {
    const h = (window.location.hash || "").replace(/^#/, "");
    const m = new URLSearchParams(h).get("c");
    if (!m) return null;
    const parts = m.split("~");
    if (parts.length !== SHARE_ORDER.length) return null;
    const [cpu, gpu, mb, ram, ssd, psu, cooler, fans, box, res] = parts;
    const find = (arr, id) => arr.find((x) => x.id === id);
    const out = {
      cpu: find(ALL_CPUS, cpu), gpu: find(ALL_GPUS, gpu), mb: find(ALL_MBS, mb),
      ram: find(ALL_RAMS, ram), ssd: find(ALL_SSDS, ssd), psu: find(ALL_PSUS, psu),
      cooler: find(ALL_COOLERS, cooler), fans: find(ALL_FANS, fans), box: find(ALL_CASES, box), res,
    };
    if (Object.values(out).some((v) => !v)) return null;
    return out;
  } catch { return null; }
}

// Résumé chiffré d'une config, pour le comparateur
function summarizeConfig(c) {
  const total = c.cpu.price + c.gpu.price + c.ram.price + c.ssd.price + c.psu.price + c.cooler.price + c.fans.price + c.box.price + c.mb.price;
  const score = computeScore(c.cpu, c.gpu, c.ram);
  const avg = (res) => Math.round(GAMES.reduce((s, g) => s + estimateFps(g, c.cpu, c.gpu, res), 0) / GAMES.length);
  return { total, score, fps1440: avg("1440p"), gpu: c.gpu, cpu: c.cpu, ram: c.ram, vram: c.gpu.vram, pro: c.gpu.pro || c.cpu.pro };
}

export default function App() {
  const [page, setPage] = useState("sim");
  const [editPart, setEditPart] = useState(null);
  const [cpu, setCpu] = useState(ALL_CPUS.find((c) => c.id === "7600"));
  const [gpu, setGpu] = useState(ALL_GPUS.find((g) => g.id === "5070"));
  const [ram, setRam] = useState(ALL_RAMS.find((r) => r.id === "r-fury32-6000"));
  const [ssd, setSsd] = useState(ALL_SSDS.find((s) => s.id === "s-p3plus1"));
  const [psu, setPsu] = useState(ALL_PSUS.find((p) => p.id === "p-rm750e"));
  const [cooler, setCooler] = useState(ALL_COOLERS.find((c) => c.id === "cl-peerless"));
  const [fans, setFans] = useState(ALL_FANS.find((f) => f.id === "f-stock"));
  const [box, setBox] = useState(ALL_CASES.find((c) => c.id === "c-3000d"));
  const [mb, setMb] = useState(ALL_MBS.find((m) => m.id === "mb-b650aorus"));
  const [res, setRes] = useState("1440p");
  const [shared, setShared] = useState(false);   // lien copié ?
  const [booting, setBooting] = useState(true);   // effet d'ouverture TV
  // Nuit locale = entre 20h et 7h. Sombre si la nuit tombe OU si le système est en sombre.
  const isNightNow = () => { const h = new Date().getHours(); return h >= 20 || h < 7; };
  const [dark, setDark] = useState(() => {
    try {
      const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      return sysDark || isNightNow();
    } catch { return isNightNow(); }
  });
  // Si l'utilisateur n'a pas encore choisi manuellement, on suit les changements de préférence système
  const darkManual = useRef(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => { if (!darkManual.current) setDark(e.matches || isNightNow()); };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  const toggleDark = () => { darkManual.current = true; setDark((d) => !d); };
  const [budget, setBudget] = useState("1000");
  const [profile, setProfile] = useState("gaming");
  const [suggestedTotal, setSuggestedTotal] = useState(null);
  const [justGenerated, setJustGenerated] = useState(false);

  const applyBudget = () => {
    const b = parseInt(budget, 10);
    if (!b || b < 100) return;
    const r = suggestBuild(b, profile);
    setCpu(r.cpu); setGpu(r.gpu); setMb(r.mb); setRam(r.ram); setSsd(r.ssd);
    setPsu(r.psu); setCooler(r.cooler); setFans(r.fans); setBox(r.box);
    const sc = computeScore(r.cpu, r.gpu, r.ram);
    setSuggestedTotal({ total: r.total, over: r.over, budget: b, score: sc });
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 2000);
  };

  // Charger une config partagée via l'URL, une seule fois au démarrage
  useEffect(() => {
    const c = readConfigFromUrl();
    if (c) { setCpu(c.cpu); setGpu(c.gpu); setMb(c.mb); setRam(c.ram); setSsd(c.ssd); setPsu(c.psu); setCooler(c.cooler); setFans(c.fans); setBox(c.box); setRes(c.res); }
    const t = setTimeout(() => setBooting(false), 1150);
    return () => clearTimeout(t);
  }, []);

  const shareConfig = async () => {
    const code = encodeConfig({ cpu, gpu, mb, ram, ssd, psu, cooler, fans, box, res });
    let url = code;
    try { window.location.hash = "c=" + code; url = window.location.href; } catch {}
    try {
      await navigator.clipboard.writeText(url);
      setShared(true); setTimeout(() => setShared(false), 2200);
    } catch {
      window.prompt("Copie ce lien pour partager ta config :", url);
    }
  };

  // Listes filtrées : seules les cartes mères du socket du CPU et la RAM du bon type
  const mbGroups = MB_GROUPS.filter((g) => g.items[0].socket === cpu.socket);
  // Toutes les fréquences restent visibles ; le diagnostic prévient si elle dépasse la plateforme
  const ramGroups = RAM_GROUPS.filter((g) => g.items[0].type === mb.ddr);
  // Changement de CPU : bascule automatiquement carte mère et RAM compatibles
  const handleCpu = (c) => {
    setCpu(c);
    if (c.socket !== mb.socket) {
      const nm = ALL_MBS.find((x) => x.socket === c.socket);
      setMb(nm);
      if (ram.type !== nm.ddr) setRam(ALL_RAMS.find((r) => r.type === nm.ddr && r.gb === ram.gb) || ALL_RAMS.find((r) => r.type === nm.ddr));
    }
  };
  const handleMb = (m) => {
    setMb(m);
    if (ram.type !== m.ddr) setRam(ALL_RAMS.find((r) => r.type === m.ddr && r.gb === ram.gb) || ALL_RAMS.find((r) => r.type === m.ddr));
  };

  const total = cpu.price + gpu.price + ram.price + ssd.price + psu.price + cooler.price + fans.price + box.price + mb.price;
  const bn = useMemo(() => bottleneck(cpu, gpu), [cpu, gpu]);
  const apps = useMemo(() => appSupport(cpu, gpu, ram), [cpu, gpu, ram]);
  const checks = useMemo(() => compatChecks({ cpu, gpu, ram, mb, psu, cooler, box, fans }), [cpu, gpu, ram, mb, psu, cooler, box, fans]);
  const globalScore = computeScore(cpu, gpu, ram);
  const hasBlocker = checks.some((c) => c.lvl === "bad");
  const isPro = gpu.pro || cpu.pro;
  const aiCaps = useMemo(() => aiCreation(cpu, gpu, ram), [cpu, gpu, ram]);
  const [compareA, setCompareA] = useState(null); // config figée pour comparaison
  const liveConfig = { cpu, gpu, ram, ssd, psu, cooler, fans, box, mb, res };
  const saveForCompare = () => setCompareA(summarizeConfig(liveConfig));
  // Ordre des usages selon le profil
  const appOrder = { gaming: ["Streaming","Bureautique"], workstation: ["3D","IA","Dev","Montage"], bureautique: ["Bureautique"] };
  const orderedApps = [...apps].sort((a, b) => {
    const key = (n) => { const arr = appOrder[profile] || []; const i = arr.findIndex((k) => n.includes(k)); return i === -1 ? 99 : i; };
    return key(a.name) - key(b.name);
  });

  if (page === "legal") return <div className={`app ${dark ? "dark" : ""}`}><style>{css}</style><LegalPage onBack={() => setPage("sim")} /></div>;
  if (page === "privacy") return <div className={`app ${dark ? "dark" : ""}`}><style>{css}</style><PrivacyPage onBack={() => setPage("sim")} /></div>;

  const picks = [
    { label: "CPU", kind: "cpu", item: cpu, spec: `${cpu.cores} cœurs · ${cpu.socket}${cpu.used ? " · occasion" : ""}` },
    { label: "GPU", kind: "gpu", item: gpu, spec: `${gpu.vram} Go${gpu.up ? " · " + gpu.up : ""}${gpu.upNext ? " · " + gpu.upNext + " à venir" : ""}${gpu.pro ? " · Pro" : ""}${gpu.used ? " · occasion" : ""}` },
    { label: "C. MÈRE", kind: "mb", item: mb, spec: `${mb.socket} · ${mb.ddr}${mb.used ? " · occasion" : ""}` },
    { label: "RAM", kind: "ram", item: ram, spec: ram.speed || ram.type },
    { label: "SSD", kind: "ssd", item: ssd, spec: null },
    { label: "ALIM", kind: "psu", item: psu, spec: `${psu.watts} W${psu.cert ? " · 80+ " + psu.cert : ""}` },
    { label: "REFROID.", kind: "cooler", item: cooler, spec: null },
    { label: "VENTILOS", kind: "fan", item: fans, spec: null },
    { label: "BOÎTIER", kind: "case", item: box, spec: null },
  ];

  return (
    <div className={`app prof-${profile} ${dark ? "dark" : ""}`}>
      <style>{css}</style>
      <button className="theme-btn" onClick={toggleDark} aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}>
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.7 6.7 0 0 0 10.5 10.5z"/></svg>
        )}
      </button>
      {booting && <div className="tv-boot" aria-hidden="true"><span className="tv-line" /><span className="tv-flash" /></div>}
      <div className="ambient" aria-hidden="true" />
      <header className="hero">
        <div className="brand"><span className="brand-name">Athos<span className="g">Builder</span></span><span className="brand-tag">simule, compare, assemble en un clic</span></div>
        <h1>Ton budget.<br /><span className="g">Ta config.</span></h1>
        <p className="sub">Entre une somme, obtiens une config complète et cohérente : compatibilité vérifiée, alimentation dimensionnée, FPS estimés jeu par jeu. Et chaque pièce reste modifiable.</p>
      </header>

      <div className="readout">
        <div>
          <span className="readout-label">Puissance du build</span>
          <div className="readout-score"><span className="g">{globalScore}</span><small>/100</small></div>
        </div>
        <div className="readout-price">
          <b className="mono">{total.toLocaleString("fr-FR")} €</b>
          <span>total estimé</span>
        </div>
      </div>

      <nav className="toc" aria-label="Sommaire">
        <a href="#s-budget">Générer</a><a href="#s-parts">Composants</a><a href="#s-compat">Compatibilité</a>
        <a href="#s-perf">{isPro ? "Calcul" : "Performances"}</a><a href="#s-ai">IA</a><a href="#s-uses">Usages</a><a href="#s-compare">Comparer</a>
      </nav>

      <section className="panel budget-panel" id="s-budget">
        <h2 className="panel-title">Génère ta config</h2>
        <p className="budget-sub">Choisis ton usage, entre ton budget, et la machine complète s'assemble : composants compatibles, alimentation dimensionnée, rien à corriger.</p>
        <div className="prof-switch" role="tablist" aria-label="Profil d'usage">
          {[["gaming","🎮 Gaming"],["workstation","🛠 Workstation"],["bureautique","💼 Bureautique"]].map(([id,lbl]) => (
            <button key={id} role="tab" aria-selected={profile===id} className={profile===id?"on":""} onClick={() => setProfile(id)}>{lbl}</button>
          ))}
        </div>
        <p className="prof-hint">{profile==="gaming" ? "Priorité au GPU et aux FPS." : profile==="workstation" ? "Priorité aux cœurs CPU, à la RAM et à la VRAM. Matériel pro inclus." : "Machine sobre, silencieuse et économique pour le quotidien."}</p>
        <div className="budget-row">
          <div className="budget-input">
            <input type="number" inputMode="numeric" min="100" step="50" value={budget}
              onChange={(e) => setBudget(e.target.value)} aria-label="Budget en euros" />
            <span className="budget-cur">€</span>
          </div>
          <button className={`budget-go ${justGenerated ? "done" : ""}`} onClick={applyBudget}>
            {justGenerated ? "✓ Config générée" : "Proposer une config"}
          </button>
        </div>
        {suggestedTotal && (
          <div className="budget-out">
            <div className="budget-figures">
              <span className="bf"><span className="bf-num mono">{suggestedTotal.score}<span className="bf-max">/100</span></span><span className="bf-lbl">puissance</span></span>
              <span className="bf"><span className="bf-num mono">{suggestedTotal.total.toLocaleString("fr-FR")} €</span><span className="bf-lbl">total</span></span>
            </div>
            {(suggestedTotal.over || suggestedTotal.total < suggestedTotal.budget * 0.8) && (
              <p className={`budget-result ${suggestedTotal.over ? "over" : ""}`}>
                {suggestedTotal.over
                  ? `Budget un peu juste : le minimum montable revient à ${suggestedTotal.total.toLocaleString("fr-FR")} €.`
                  : `Cet usage n'en demande pas plus.`}
              </p>
            )}
          </div>
        )}
      </section>

      {HAS_AFFILIATE && (
        <p className="disclosure">Liens d'affiliation : un achat via « Voir le prix » soutient le site, sans surcoût pour toi.</p>
      )}

      <section className="panel picker" id="s-parts">
        <h2 className="panel-title">Composants</h2>
        <div className="fields">
          <GroupSelect label="Processeur" groups={CPU_GROUPS} items={ALL_CPUS} value={cpu} onChange={handleCpu} searchable fmt={(i) => `${i.name} · ${i.cores}c · ${i.price} €`} />
          <GroupSelect label="Carte graphique" groups={GPU_GROUPS} items={ALL_GPUS} value={gpu} onChange={setGpu} searchable fmt={(i) => `${i.name} · ${i.vram} Go · ${i.price} €`} />
          <GroupSelect label={`Carte mère (compatibles ${cpu.socket})`} groups={mbGroups} items={ALL_MBS} value={mb} onChange={handleMb} fmt={(i) => `${i.name} · ${i.price} €`} />
          <GroupSelect label="Mémoire vive" groups={ramGroups} items={ALL_RAMS} value={ram} onChange={setRam} fmt={(i) => `${i.name} · ${i.price} €`} />
          <GroupSelect label="Stockage" groups={SSD_GROUPS} items={ALL_SSDS} value={ssd} onChange={setSsd} fmt={(i) => `${i.name} · ${i.price} €`} />
          <GroupSelect label="Alimentation" groups={PSU_GROUPS} items={ALL_PSUS} value={psu} onChange={setPsu} fmt={(i) => `${i.name} · ${i.price} €`} />
          <GroupSelect label="Refroidissement CPU" groups={COOLER_GROUPS} items={ALL_COOLERS} value={cooler} onChange={setCooler} fmt={(i) => `${i.name} · ${i.price} €`} />
          <GroupSelect label="Ventilation" groups={FAN_GROUPS} items={ALL_FANS} value={fans} onChange={setFans} fmt={(i) => `${i.name} · ${i.price} €`} />
          <GroupSelect label="Boîtier" groups={CASE_GROUPS} items={ALL_CASES} value={box} onChange={setBox} fmt={(i) => `${i.name} · ${i.price} €`} />
        </div>
        <ul className="picks">
          {picks.map((p) => (
            <li key={p.label}>
              <span className="pick-name">
                <Icon kind={p.kind} name={p.item.name} />
                <span className="pick-label">
                  <span className="pick-tag">{p.label}{p.spec ? " · " + p.spec : ""}</span>
                  <b>{p.item.name}</b>
                </span>
              </span>
              {p.item.price > 0 && <AffButton product={p.item} />}
            </li>
          ))}
        </ul>
        <div className="pcview-wrap">
          <span className="pick-tag" style={{ textAlign: "center", marginBottom: 8 }}>APERÇU DU MONTAGE · touche un composant pour le modifier</span>
          <PcView cpu={cpu} gpu={gpu} ram={ram} ssd={ssd} cooler={cooler} fans={fans} box={box} onPick={setEditPart} />
          {editPart && (
            <div className="edit-pop">
              {editPart === "gpu" && <GroupSelect label="Carte graphique" groups={GPU_GROUPS} items={ALL_GPUS} value={gpu} onChange={setGpu} fmt={(i) => `${i.name} · ${i.vram} Go · ${i.price} €`} />}
              {editPart === "cpucool" && <>
                <GroupSelect label="Processeur" groups={CPU_GROUPS} items={ALL_CPUS} value={cpu} onChange={handleCpu} fmt={(i) => `${i.name} · ${i.cores}c · ${i.price} €`} />
                <GroupSelect label="Refroidissement CPU" groups={COOLER_GROUPS} items={ALL_COOLERS} value={cooler} onChange={setCooler} fmt={(i) => `${i.name} · ${i.price} €`} />
              </>}
              {editPart === "ram" && <GroupSelect label="Mémoire vive" groups={ramGroups} items={ALL_RAMS} value={ram} onChange={setRam} fmt={(i) => `${i.name} · ${i.price} €`} />}
              {editPart === "ssd" && <GroupSelect label="Stockage" groups={SSD_GROUPS} items={ALL_SSDS} value={ssd} onChange={setSsd} fmt={(i) => `${i.name} · ${i.price} €`} />}
              {editPart === "mb" && <GroupSelect label={`Carte mère (compatibles ${cpu.socket})`} groups={mbGroups} items={ALL_MBS} value={mb} onChange={handleMb} fmt={(i) => `${i.name} · ${i.price} €`} />}
              {editPart === "psu" && <GroupSelect label="Alimentation" groups={PSU_GROUPS} items={ALL_PSUS} value={psu} onChange={setPsu} fmt={(i) => `${i.name} · ${i.price} €`} />}
              {editPart === "fans" && <GroupSelect label="Ventilation" groups={FAN_GROUPS} items={ALL_FANS} value={fans} onChange={setFans} fmt={(i) => `${i.name} · ${i.price} €`} />}
              {editPart === "box" && <GroupSelect label="Boîtier" groups={CASE_GROUPS} items={ALL_CASES} value={box} onChange={setBox} fmt={(i) => `${i.name} · ${i.price} €`} />}
              <button className="edit-close" onClick={() => setEditPart(null)}>OK, fermer</button>
            </div>
          )}
          <span className="tiny" style={{ textAlign: "center", margin: "8px auto 0", maxWidth: "none" }}>Schéma indicatif : la carte {gpu.name} (couleur marque), le refroidissement, la RAM et la ventilation s'adaptent à tes choix.</span>
        </div>
        <div className="totals">
          <div>
            <span className="mono big">{total.toLocaleString("fr-FR")} €</span>
            <span className="tiny">Budget estimé sur les prix moyens du marché. Cliquez pour voir le prix actuel. Les composants marqués « occasion » ne se vendent plus neufs.</span>
          </div>
          <div className="score-block">
            <span className="mono big copper">{globalScore}<span className="score-max">/100</span></span>
            <span className="tiny">puissance du build</span>
          </div>
        </div>
      </section>

      <section className={`panel diag ${hasBlocker ? "diag-cpu" : "diag-ok"}`} id="s-compat">
        <h2 className="panel-title">Compatibilité</h2>
        <ul className="compat">
          {checks.map((c, i) => (
            <li key={i} className={`c-${c.lvl}`}>
              <span className="dot">{c.lvl === "ok" ? "✓" : c.lvl === "warn" ? "!" : "✕"}</span>
              <span>{c.msg}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={`panel diag diag-${bn.type}`}>
        <h2 className="panel-title">Équilibre CPU / GPU</h2>
        <p className="diag-msg">{bn.msg}</p>
      </section>

      <section className="panel" id="s-perf">
       {isPro ? (
        <>
          <h2 className="panel-title">Puissance de calcul</h2>
          <p className="diag-msg" style={{marginBottom:14}}>Cette configuration vise la création et le calcul, pas le jeu, les FPS n'ont ici pas de sens. Ce qui compte : la VRAM et la puissance de calcul du GPU, les cœurs du CPU.</p>
          <ul className="compat">
            <li className="c-ok"><span className="dot">▤</span><span><b>{gpu.vram} Go de VRAM</b> : {gpu.vram>=48?"gros modèles IA, scènes 3D très lourdes, montage 8K":gpu.vram>=24?"IA, rendu 3D et montage 4K confortables":"suffisant pour la 3D et le montage courants"}.</span></li>
            {gpu.compute && <li className="c-ok"><span className="dot">⚡</span><span><b>Indice de calcul {gpu.compute}/100</b> : rendu, simulation et entraînement IA.</span></li>}
            <li className="c-ok"><span className="dot">◇</span><span><b>{cpu.cores} cœurs</b> : {cpu.cores>=24?"rendu multi-cœurs, compilation et virtualisation lourdes":cpu.cores>=12?"multitâche pro et rendu confortables":"bureautique et création légère"}.</span></li>
          </ul>
        </>
       ) : (
        <>
        <div className="bench-head">
          <h2 className="panel-title">Performances en jeu</h2>
          <div className="res-switch" role="tablist" aria-label="Résolution">
            {Object.keys(RES).map((r) => (
              <button key={r} role="tab" aria-selected={res === r} className={res === r ? "on" : ""} onClick={() => setRes(r)}>{r}</button>
            ))}
          </div>
        </div>
        <ul className="bench">
          {GAMES.map((g) => {
            const fps = estimateFps(g, cpu, gpu, res);
            const t = fpsTier(fps);
            const w = Math.min(100, (fps / 240) * 100);
            return (
              <li key={g.name}>
                <div className="bench-row">
                  <span className="game">{g.name}</span>
                  <span className={`fps mono ${t.cls}`}>{fps} FPS</span>
                </div>
                <div className="bar-track"><div className={`bar ${t.cls}`} style={{ width: `${w}%` }} /></div>
                <span className="tier">{t.label}</span>
              </li>
            );
          })}
        </ul>
        <p className="tiny note">Estimations indicatives basées sur des moyennes de benchmarks publics, réglages élevés, sans upscaling. Les FPS réels varient selon les pilotes, le refroidissement et les mises à jour des jeux.{gpu.up ? ` Upscaling actuel sur cette carte : ${gpu.up}.` : ""}{gpu.upNext ? ` ${gpu.upNext.replace(" à venir","")} est annoncé pour cette carte.` : ""}</p>
        </>
       )}
      </section>

      <section className="panel" id="s-ai">
        <h2 className="panel-title">IA &amp; création</h2>
        <ul className="compat">
          {aiCaps.map((c) => (
            <li key={c.name} className={c.lvl === "bad" ? "c-bad" : c.lvl === "ok" ? "c-warn" : "c-ok"}>
              <span className="dot">{c.lvl === "top" ? "★" : c.lvl === "good" ? "✓" : c.lvl === "ok" ? "~" : "✕"}</span>
              <span><b>{c.name}</b> : {c.txt}</span>
            </li>
          ))}
        </ul>
        <p className="tiny note">Estimations basées sur la VRAM, la mémoire et les cœurs. Les performances réelles dépendent des modèles, pilotes et logiciels utilisés.</p>
      </section>

      <section className="panel" id="s-uses">
        <h2 className="panel-title">Ce que ta machine fait tourner</h2>
        <ul className="apps">
          {orderedApps.map((a) => (
            <li key={a.name} className={a.ok ? "yes" : "no"}>
              <span className="check">{a.ok ? "✓" : "✕"}</span>
              <div>
                <span className="app-name">{a.name}</span>
                {!a.ok && <span className="app-need">Il te faut : {a.need}</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel" id="s-compare">
        <h2 className="panel-title">Comparer deux configs</h2>
        {!compareA ? (
          <>
            <p className="share-sub">Enregistre ta config actuelle, puis modifie tes composants : on affichera les deux côte à côte pour t'aider à choisir.</p>
            <button className="share-btn" onClick={saveForCompare}>⊕ Enregistrer cette config comme Config A</button>
          </>
        ) : (() => {
          const B = summarizeConfig(liveConfig);
          const A = compareA;
          const row = (label, va, vb, better, fmt) => {
            const wa = better === "low" ? va <= vb : va >= vb;
            const wb = better === "low" ? vb <= va : vb >= va;
            return (
              <tr>
                <th>{label}</th>
                <td className={wa && va !== vb ? "win" : ""}>{fmt(va)}</td>
                <td className={wb && va !== vb ? "win" : ""}>{fmt(vb)}</td>
              </tr>
            );
          };
          const euro = (n) => n.toLocaleString("fr-FR") + " €";
          return (
            <>
              <p className="share-sub">Config A = enregistrée · Config B = ta config actuelle. En vert, l'avantage de chaque ligne.</p>
              <div className="cmp-wrap">
                <table className="cmp">
                  <thead><tr><th></th><th>Config A</th><th>Config B</th></tr></thead>
                  <tbody>
                    <tr><th>Carte graphique</th><td>{A.gpu.name}</td><td>{B.gpu.name}</td></tr>
                    <tr><th>Processeur</th><td>{A.cpu.name}</td><td>{B.cpu.name}</td></tr>
                    {row("Prix total", A.total, B.total, "low", euro)}
                    {row("Puissance /100", A.score, B.score, "high", (v) => v)}
                    {(A.pro || B.pro)
                      ? <tr><th>FPS moyens 1440p</th><td>{A.pro ? "n/a" : A.fps1440}</td><td>{B.pro ? "n/a" : B.fps1440}</td></tr>
                      : row("FPS moyens 1440p", A.fps1440, B.fps1440, "high", (v) => v)}
                    {row("VRAM", A.vram, B.vram, "high", (v) => v + " Go")}
                  </tbody>
                </table>
              </div>
              <button className="share-btn" style={{ marginTop: 14 }} onClick={() => setCompareA(null)}>↺ Réinitialiser la comparaison</button>
            </>
          );
        })()}
      </section>

      <section className="panel share-panel">
        <h2 className="panel-title">Partager ta config</h2>
        <p className="share-sub">Ta configuration est prête ? Copie le lien : la personne qui l'ouvre retrouve exactement la même machine, prête à l'écran.</p>
        <button className="share-btn" onClick={shareConfig}>
          {shared ? "✓ Lien copié, colle-le où tu veux" : "⧉ Partager cette config par lien"}
        </button>
      </section>

      <footer className="foot">
        <nav className="foot-nav">
          <button onClick={() => setPage("legal")}>Mentions légales &amp; affiliation</button>
          <span aria-hidden="true">·</span>
          <button onClick={() => setPage("privacy")}>Confidentialité &amp; sécurité</button>
        </nav>
        <p>Athos Builder · aucun cookie, aucun traceur. Prix moyens constatés, à vérifier en boutique.</p>
      </footer>
    </div>
  );
}
