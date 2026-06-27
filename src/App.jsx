import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Users, CreditCard, Calendar, Megaphone, Settings, LayoutDashboard,
  User, FileText, Download, Search, Plus, LogOut, Bell, CheckCircle2,
  Clock, XCircle, ShieldCheck, Archive, FileDown, Send, HardDriveDownload,
  Building2, Mail, Phone, MapPin, ChevronRight, ChevronLeft, Filter, BadgeCheck, X,
  CalendarCheck, CalendarX, Newspaper, KeyRound, Activity,
  ChevronDown, Zap, Target, Video, Star, MessageSquare, Image as ImageIcon,
  Heart, BarChart2, TrendingUp, UserPlus, ThumbsUp, ThumbsDown, Globe, Grid,
  Banknote, ClipboardList, QrCode, BellRing, ClipboardCheck, LineChart,
  UserCheck, Cake, AlertCircle, RefreshCw, Menu,
  BookOpen, Flag, Flame, Scroll, GraduationCap
} from "lucide-react";

const C = {
  red:"#E2231A",redDark:"#B5170F",ink:"#171210",inkSoft:"#5A524E",
  paper:"#EDECE8",card:"#FFFFFF",line:"rgba(23,18,16,0.08)",
  green:"#1E8A4C",amber:"#B97A10",redStat:"#C8342B",sidebar:"#1C1410",
};
const css = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
.vv*,.vv *{box-sizing:border-box}
.vv{font-family:'Inter',system-ui,sans-serif;color:#171210;background:#EDECE8;min-height:100vh;-webkit-font-smoothing:antialiased}
.vv .display{font-family:'Archivo',system-ui,sans-serif}
.vv button{font-family:inherit;cursor:pointer;border:none}
.vv input,.vv select,.vv textarea{font-family:inherit}
.vv ::placeholder{color:#A39D99}
.vv-emblem{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#E2231A,#B5170F);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-family:'Archivo';letter-spacing:-1px;flex-shrink:0;box-shadow:0 4px 12px rgba(226,35,26,.30)}
.vv-emblem.lg{width:68px;height:68px;font-size:27px}
.vv-login{display:flex;min-height:100vh}
.vv-login-hero{flex:1;background:linear-gradient(150deg,#D91E16 0%,#8C1009 100%);color:#fff;padding:52px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
.vv-login-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 75% 15%,rgba(255,255,255,.13) 0%,transparent 55%)}
.vv-login-hero::after{content:"!";position:absolute;right:-24px;bottom:-90px;font-family:'Archivo';font-weight:900;font-size:440px;line-height:1;color:rgba(255,255,255,.05)}
.vv-login-panel{width:460px;background:#EDECE8;padding:56px 48px;display:flex;flex-direction:column;justify-content:center}
.vv-rolecard{text-align:left;background:#fff;border:1.5px solid rgba(23,18,16,.08);border-radius:16px;padding:18px 20px;display:flex;align-items:center;gap:14px;width:100%;transition:all .18s;box-shadow:0 2px 8px rgba(23,18,16,.05)}
.vv-rolecard:hover{border-color:#E2231A;transform:translateY(-2px);box-shadow:0 10px 32px rgba(226,35,26,.14)}
.vv-shell{display:flex;min-height:100vh}
.vv-side{width:256px;background:linear-gradient(180deg,#1C1410 0%,#120D09 100%);color:#fff;padding:20px 14px;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;scrollbar-width:none}
.vv-side::-webkit-scrollbar{display:none}
.vv-nav-section{font-size:10px;font-weight:700;color:rgba(255,255,255,.22);text-transform:uppercase;letter-spacing:.12em;padding:16px 12px 5px;margin-top:4px}
.vv-nav{background:none;color:rgba(255,255,255,.60);display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;width:100%;text-align:left;font-size:13.5px;font-weight:500;transition:all .15s}
.vv-nav:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.95)}
.vv-nav.active{background:linear-gradient(135deg,#E2231A,#B5170F);color:#fff;font-weight:600;box-shadow:0 4px 18px rgba(226,35,26,.30)}
.vv-main{flex:1;min-width:0}
.vv-top{background:rgba(237,236,232,.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(23,18,16,.08);padding:14px 32px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.vv-content{padding:32px;max-width:1200px}
.vv-card{background:#fff;border:1px solid rgba(23,18,16,.07);border-radius:18px;box-shadow:0 1px 3px rgba(23,18,16,.04),0 6px 20px rgba(23,18,16,.05)}
.vv-card-accent{background:linear-gradient(135deg,#E2231A,#8C1009);border:none;border-radius:18px;color:#fff;box-shadow:0 8px 32px rgba(226,35,26,.28)}
.vv-btn{background:linear-gradient(135deg,#E2231A,#C01C14);color:#fff;border-radius:10px;padding:9px 18px;font-weight:600;font-size:14px;display:inline-flex;align-items:center;gap:8px;transition:all .15s;box-shadow:0 2px 8px rgba(226,35,26,.28)}
.vv-btn:hover{background:linear-gradient(135deg,#C91C13,#A01610);box-shadow:0 5px 18px rgba(226,35,26,.38);transform:translateY(-1px)}
.vv-btn:active{transform:translateY(0);box-shadow:0 2px 6px rgba(226,35,26,.20)}
.vv-btn.ghost{background:#fff;color:#171210;border:1.5px solid rgba(23,18,16,.12);box-shadow:0 1px 4px rgba(23,18,16,.06)}
.vv-btn.ghost:hover{background:#F5F4F0;border-color:rgba(23,18,16,.22);transform:translateY(-1px);box-shadow:0 4px 12px rgba(23,18,16,.08)}
.vv-btn.dark{background:linear-gradient(135deg,#2A211C,#171210);box-shadow:0 2px 8px rgba(23,18,16,.28)}
.vv-btn.grn{background:linear-gradient(135deg,#22A057,#1A7A3F);box-shadow:0 2px 8px rgba(30,138,76,.28)}
.vv-btn.grn:hover{box-shadow:0 5px 18px rgba(30,138,76,.38);transform:translateY(-1px)}
.vv-chip{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:3px 10px;border-radius:999px;letter-spacing:.01em}
.vv-th{text-align:left;font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;color:#6E6460;font-weight:700;padding:11px 16px;border-bottom:1px solid rgba(23,18,16,.07);background:#FAFAF7}
.vv-td{padding:13px 16px;border-bottom:1px solid rgba(23,18,16,.06);font-size:14px;vertical-align:middle}
.vv-row{transition:background .1s}
.vv-row:hover{background:#F8F7F3}
.vv-row:last-child td{border-bottom:none}
.vv-input{width:100%;border:1.5px solid rgba(23,18,16,.11);border-radius:10px;padding:10px 14px;font-size:14px;background:#fff;outline:none;transition:all .15s;box-shadow:0 1px 3px rgba(23,18,16,.04)}
.vv-input:focus{border-color:#E2231A;box-shadow:0 0 0 3px rgba(226,35,26,.10)}
.vv-overlay{position:fixed;inset:0;background:rgba(23,18,16,.52);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:50;padding:20px}
.vv-modal{background:#fff;border-radius:22px;width:100%;max-width:520px;max-height:90vh;overflow:auto;box-shadow:0 30px 90px rgba(23,18,16,.22),0 4px 16px rgba(23,18,16,.10)}
.vv-eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:#E2231A}
.vv-stat{font-family:'Archivo';font-weight:800;font-size:30px;line-height:1}
.vv-link{color:#E2231A;font-weight:600;background:none;padding:0;font-size:13px;transition:opacity .12s;cursor:pointer}
.vv-link:hover{opacity:.72}
.vv-toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#2A211C,#171210);color:#fff;padding:13px 22px;border-radius:14px;font-size:14px;font-weight:500;z-index:60;box-shadow:0 14px 44px rgba(0,0,0,.26);display:flex;align-items:center;gap:10px;white-space:nowrap;animation:toastIn .25s cubic-bezier(.34,1.56,.64,1)}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(14px) scale(.94)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes drawLine{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.vv-content>*{animation:fadeUp .2s ease both}
.vv-bar{transform-box:fill-box;transform-origin:bottom;animation:barGrow .7s cubic-bezier(.4,0,.2,1) both}
.vv-icon-box{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.vv-hamburger{display:none;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;padding:7px;border-radius:10px;transition:background .15s;flex-shrink:0}
.vv-hamburger:hover{background:rgba(23,18,16,.08)}
.vv--dark .vv-hamburger:hover{background:rgba(255,255,255,.08)}
.vv-mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.44);z-index:39;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);animation:fadeIn .2s ease}
@media(max-width:820px){
  .vv-side{position:fixed;top:0;left:0;bottom:0;height:100vh;z-index:40;transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1)}
  .vv-side.open{transform:translateX(0);box-shadow:8px 0 40px rgba(0,0,0,.28)}
  .vv-hamburger{display:flex!important}
  .vv-mob-overlay{display:block}
  .vv-content{padding:20px}
}
.vv--dark{background:#111009;color:#EDE9E3}
.vv--dark .vv-card{background:#1C1813;border-color:rgba(255,255,255,.07);box-shadow:0 1px 3px rgba(0,0,0,.3),0 6px 20px rgba(0,0,0,.2)}
.vv--dark .vv-side{background:linear-gradient(180deg,#0E0B08 0%,#080604 100%)}
.vv--dark .vv-top{background:rgba(17,16,9,.85);border-bottom-color:rgba(255,255,255,.07)}
.vv--dark .vv-nav{color:rgba(255,255,255,.50)}
.vv--dark .vv-nav:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.9)}
.vv--dark .vv-nav.active{background:linear-gradient(135deg,#E2231A,#B5170F)}
.vv--dark .vv-nav-section{color:rgba(255,255,255,.18)}
.vv--dark .vv-th{background:#161310;color:#7A7370;border-bottom-color:rgba(255,255,255,.06)}
.vv--dark .vv-td{border-bottom-color:rgba(255,255,255,.05)}
.vv--dark .vv-row:hover{background:#242018}
.vv--dark .vv-input{background:#1C1813;border-color:rgba(255,255,255,.12);color:#EDE9E3;box-shadow:none}
.vv--dark .vv-input:focus{border-color:#E2231A;box-shadow:0 0 0 3px rgba(226,35,26,.15)}
.vv--dark .vv-btn.ghost{background:#1C1813;color:#EDE9E3;border-color:rgba(255,255,255,.12)}
.vv--dark .vv-btn.ghost:hover{background:#242018}
.vv--dark .vv-modal{background:#1C1813;color:#EDE9E3}
.vv--dark .vv-overlay{background:rgba(0,0,0,.65)}
.vv--dark .vv-rolecard{background:#1C1813;border-color:rgba(255,255,255,.08)}
.vv--dark .vv-rolecard:hover{border-color:#E2231A}
.vv--dark .vv-login-panel{background:#111009}
.vv--dark .vv-icon-box{opacity:.9}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes spin{to{transform:rotate(360deg)}}
.vv-skeleton{border-radius:8px;background:linear-gradient(90deg,#ece9e4 25%,#e2dfd9 50%,#ece9e4 75%);background-size:200% 100%;animation:shimmer 1.5s ease-in-out infinite}
.vv--dark .vv-skeleton{background:linear-gradient(90deg,#232018 25%,#2a261f 50%,#232018 75%);background-size:200% 100%}
.vv-offline{background:#1C1410;color:#EDE9E3;padding:9px 20px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;justify-content:center}
.vv-chat-btn{position:fixed;bottom:24px;right:24px;z-index:60;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#E2231A,#B5170F);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 24px rgba(226,35,26,.40);transition:all .18s}
.vv-chat-btn:hover{transform:scale(1.08);box-shadow:0 8px 32px rgba(226,35,26,.50)}
.vv-chat-panel{position:fixed;bottom:88px;right:24px;z-index:61;width:320px;background:#fff;border-radius:20px;box-shadow:0 24px 80px rgba(23,18,16,.22),0 4px 16px rgba(23,18,16,.10);display:flex;flex-direction:column;overflow:hidden;animation:fadeUp .2s ease both;max-height:460px}
.vv--dark .vv-chat-panel{background:#1C1813}
.vv-chat-msg{padding:8px 12px;border-radius:14px;font-size:13px;max-width:80%;line-height:1.45}
.vv-chat-msg.mine{background:linear-gradient(135deg,#E2231A,#B5170F);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
.vv-chat-msg.theirs{background:#F0EDE8;color:#171210;align-self:flex-start;border-bottom-left-radius:4px}
.vv--dark .vv-chat-msg.theirs{background:#2A2520;color:#EDE9E3}
.vv-shortcut-badge{display:inline-flex;align-items:center;background:rgba(23,18,16,.07);border:1px solid rgba(23,18,16,.12);border-radius:5px;padding:1px 6px;font-size:10px;font-weight:700;font-family:monospace;color:#5A524E;margin-left:4px}
.vv-pull-bar{position:fixed;top:0;left:0;right:0;z-index:70;display:flex;align-items:center;justify-content:center;gap:8px;background:#fff;padding:10px 20px;box-shadow:0 4px 20px rgba(0,0,0,.12);font-size:13px;font-weight:600;transition:transform .25s cubic-bezier(.4,0,.2,1)}
.vv--dark .vv-pull-bar{background:#1C1813}
.vv-spin{animation:spin .7s linear infinite}
@keyframes scanLine{0%,100%{top:6px}50%{top:calc(100% - 8px)}}
.vv-scanner{position:relative;background:#0a0806;border-radius:16px;overflow:hidden;aspect-ratio:1;max-width:240px;margin:0 auto;box-shadow:0 8px 32px rgba(0,0,0,.4)}
.vv-scanner-line{position:absolute;left:8px;right:8px;height:2px;background:linear-gradient(90deg,transparent,#E2231A 30%,#E2231A 70%,transparent);animation:scanLine 2.2s ease-in-out infinite;box-shadow:0 0 8px #E2231A}
.vv-scanner-corner{position:absolute;width:22px;height:22px;border-color:#E2231A;border-style:solid;border-width:0}
@keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}
.vv-live-dot{width:7px;height:7px;border-radius:50%;background:#E2231A;display:inline-block;flex-shrink:0;animation:livePulse 1.2s ease-in-out infinite}
.vv-bar-fill{transition:width .65s cubic-bezier(.4,0,.2,1)}
.vv-search-results{position:absolute;top:calc(100% + 8px);left:0;min-width:320px;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(23,18,16,.16),0 4px 12px rgba(23,18,16,.08);z-index:55;overflow:hidden;animation:fadeUp .15s ease both}
.vv-search-row{padding:10px 14px;display:flex;gap:10px;align-items:center;cursor:pointer;border-bottom:1px solid rgba(23,18,16,.06);transition:background .1s}
.vv-search-row:last-child{border-bottom:none}
.vv-search-row:hover{background:#F8F7F3}
.vv--dark .vv-search-results{background:#1C1813}
.vv--dark .vv-search-row:hover{background:#242018}
.vv--dark .vv-search-row{border-bottom-color:rgba(255,255,255,.06)}
.vv-notif-panel{position:absolute;top:calc(100% + 8px);right:0;width:348px;background:#fff;border-radius:18px;box-shadow:0 24px 80px rgba(23,18,16,.18),0 4px 16px rgba(23,18,16,.08);z-index:50;overflow:hidden;animation:fadeUp .18s ease both}
.vv-notif-item{padding:12px 16px;border-bottom:1px solid rgba(23,18,16,.06);display:flex;gap:12px;align-items:flex-start;cursor:pointer;transition:background .1s}
.vv-notif-item:last-child{border-bottom:none}
.vv-notif-item:hover{background:#F8F7F3}
.vv-notif-item.unread{border-left:3px solid #E2231A;padding-left:13px}
.vv--dark .vv-notif-panel{background:#1C1813;box-shadow:0 24px 80px rgba(0,0,0,.45),0 4px 16px rgba(0,0,0,.3)}
.vv--dark .vv-notif-item{border-bottom-color:rgba(255,255,255,.06)}
.vv--dark .vv-notif-item:hover{background:#242018}
.ob-root{min-height:100vh;background:linear-gradient(160deg,#F5F4F0 0%,#EDECE8 100%);display:flex;align-items:center;justify-content:center;padding:20px}
.ob-wrap{width:100%;max-width:520px;display:flex;flex-direction:column;align-items:center;gap:24px}
.ob-card{background:#fff;border-radius:24px;width:100%;box-shadow:0 4px 24px rgba(23,18,16,.08),0 1px 3px rgba(23,18,16,.06);overflow:hidden}
.ob-card-hero{background:linear-gradient(150deg,#D91E16 0%,#8C1009 100%);padding:36px 36px 32px;position:relative;overflow:hidden}
.ob-card-hero::after{content:"!";position:absolute;right:-20px;bottom:-80px;font-family:'Archivo',sans-serif;font-weight:900;font-size:280px;line-height:1;color:rgba(255,255,255,.06);pointer-events:none}
.ob-card-body{padding:32px 36px}
.ob-steps{display:flex;gap:6px;align-items:center}
.ob-step-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3);transition:all .25s ease}
.ob-step-dot.active{background:#fff;width:24px;border-radius:4px}
.ob-feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px}
.ob-feature{background:#F8F7F3;border-radius:14px;padding:16px;border:1px solid rgba(23,18,16,.06)}
@keyframes obPop{0%{transform:scale(.7);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
.ob-done-icon{animation:obPop .5s cubic-bezier(.34,1.56,.64,1) both}
.meso-opt{width:100%;text-align:left;padding:12px 16px;border-radius:10px;border:1.5px solid rgba(23,18,16,.12);background:#fff;font-size:14px;font-weight:500;cursor:pointer;transition:all .18s;margin-bottom:8px}
.meso-opt:hover:not(:disabled){border-color:rgba(226,35,26,.4);background:#FDE8E7;color:#B5170F}
.meso-opt.correct{border-color:#1E8A4C!important;background:#E7F4ED!important;color:#1E8A4C!important;font-weight:700}
.meso-opt.wrong{border-color:#E2231A!important;background:#FDE8E7!important;color:#B5170F!important;font-weight:700}
.meso-opt:disabled{cursor:default}
@keyframes mesoFact{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:translateY(0)}}
.meso-fact{animation:mesoFact .25s ease both}
`;

const KUOTA=150;
const FINANCE_TARGET_YEAR=1800;
const DONATION_TARGET=500;
const ELECTION_DATE=new Date("2026-10-04T07:00:00");

const seedMembers=[
  {id:1,name:"Sami Biqkaj",role:"Kryetar",status:"aktiv",pay:"paguar",kanton:"Zürich",email:"sami.biqkaj@example.ch",phone:"+41 79 000 00 01",joined:"12.03.2019",prof:"Inxhinier",dob:"04.02.1981"},
  {id:2,name:"Valton Rexha",role:"Nënkryetar",status:"aktiv",pay:"paguar",kanton:"Zürich",email:"valton.rexha@example.ch",phone:"+41 79 000 00 02",joined:"12.03.2019",prof:"Mësues",dob:"19.07.1985"},
  {id:3,name:"Egzont Demiri",role:"Sekretar / Admin",status:"aktiv",pay:"paguar",kanton:"Zürich",email:"egzont@noxera.ch",phone:"+41 79 000 00 03",joined:"08.01.2021",prof:"Inxhinier softueri",dob:"—"},
  {id:4,name:"Arta Krasniqi",role:"Sekretare e Financave",status:"aktiv",pay:"paguar",kanton:"Aargau",email:"arta.k@example.ch",phone:"+41 79 000 00 04",joined:"20.05.2020",prof:"Llogaritare",dob:"11.09.1988"},
  {id:5,name:"Blerim Gashi",role:"Anëtar",status:"aktiv",pay:"papaguar",kanton:"Zürich",email:"blerim.g@example.ch",phone:"+41 79 000 00 05",joined:"03.02.2022",prof:"Elektricist",dob:"27.11.1990"},
  {id:6,name:"Fatlinda Berisha",role:"Anëtare",status:"aktiv",pay:"paguar",kanton:"Thurgau",email:"fatlinda.b@example.ch",phone:"+41 79 000 00 06",joined:"14.06.2022",prof:"Infermiere",dob:"02.04.1992"},
  {id:7,name:"Driton Morina",role:"Anëtar",status:"aktiv",pay:"papaguar",kanton:"Zürich",email:"driton.m@example.ch",phone:"+41 79 000 00 07",joined:"01.09.2023",prof:"Shofer",dob:"15.12.1987"},
  {id:8,name:"Leotrim Hoxha",role:"Anëtar",status:"aktiv",pay:"paguar",kanton:"St. Gallen",email:"leotrim.h@example.ch",phone:"+41 79 000 00 08",joined:"22.02.2021",prof:"Programues",dob:"30.08.1994"},
  {id:9,name:"Vjosa Salihu",role:"Anëtare (studente)",status:"aktiv",pay:"paguar",kanton:"Zürich",email:"vjosa.s@example.ch",phone:"+41 79 000 00 09",joined:"10.10.2023",prof:"Studente",dob:"05.05.2002",reduced:true},
  {id:10,name:"Ramadan Kelmendi",role:"Anëtar (pensionist)",status:"aktiv",pay:"liruar",kanton:"Aargau",email:"ramadan.k@example.ch",phone:"+41 79 000 00 10",joined:"01.01.2019",prof:"Pensionist",dob:"18.03.1955",exempt:true},
  {id:11,name:"Donjeta Bytyqi",role:"Simpatizante",status:"joaktiv",pay:"papaguar",kanton:"Zürich",email:"donjeta.b@example.ch",phone:"+41 79 000 00 11",joined:"07.07.2024",prof:"Studente",dob:"21.06.2001"},
  {id:12,name:"Florent Ahmeti",role:"Anëtar",status:"aktiv",pay:"papaguar",kanton:"Schaffhausen",email:"florent.a@example.ch",phone:"+41 79 000 00 12",joined:"18.11.2022",prof:"Kuzhinier",dob:"09.01.1989"},
];
const seedEvents=[
  {id:1,title:"Mbledhja e Rregullt e Pikës",date:"27.06.2026",time:"18:00",place:"Salla e Komunitetit, Winterthur",type:"Mbledhje",public:false,max:60,rsvp:[1,2,3,4,6,8],past:false},
  {id:2,title:"Festa e Flamurit — 28 Nëntori",date:"28.11.2026",time:"19:00",place:"Eulachhalle, Winterthur",type:"Manifestim",public:true,max:300,rsvp:[1,2,3,5,6,8,9,12],past:false},
  {id:3,title:"Aksion Humanitar për Familjet",date:"12.07.2026",time:"10:00",place:"Qendra e Pikës, Winterthur",type:"Aktivitet",public:true,max:40,rsvp:[3,4,6],past:false},
  {id:4,title:"Manifestim për Pavarësinë",date:"17.02.2026",time:"17:00",place:"Sheshi Qendror, Zürich",type:"Manifestim",public:true,max:200,rsvp:[1,2,3,4,5,6,7,8,9,12],past:true},
];
const seedAnnouncements=[
  {id:1,title:"Mbledhja e radhës — 27 qershor",body:"Mbledhja e rregullt e Pikës mbahet të shtunën, më 27 qershor, ora 18:00, në Sallën e Komunitetit.",date:"10.06.2026",pinned:true},
  {id:2,title:"Pagesa e anëtarësisë 2026",body:"Kuota vjetore prej CHF 150 mund të paguhet online ose në dy këste. Afati i parë: 31 janar.",date:"02.06.2026",pinned:true},
  {id:3,title:"Mirëserdhët në platformën digjitale",body:"Pika jonë tani ka platformën e saj digjitale për menaxhimin e anëtarësisë dhe eventeve.",date:"28.05.2026",pinned:false},
];
const seedDocs=[
  {id:1,name:"Statuti i Lëvizjes VETËVENDOSJE!",type:"PDF",size:"1.2 MB",date:"01.01.2026"},
  {id:2,name:"Manifesti",type:"PDF",size:"640 KB",date:"01.01.2026"},
  {id:3,name:"Kushtetuta e Republikës së Kosovës",type:"PDF",size:"2.1 MB",date:"01.01.2026"},
  {id:4,name:"Draft Rregullorja për Mërgatën",type:"PDF",size:"880 KB",date:"15.03.2026"},
  {id:5,name:"Procesverbal — Mbledhja 28.03.2026",type:"PDF",size:"210 KB",date:"28.03.2026"},
];
const seedNews=[
  {id:1,title:"Njoftim zyrtar nga vetevendosje.org",date:"14.06.2026"},
  {id:2,title:"Aktivitete të diasporës",date:"11.06.2026"},
  {id:3,title:"Deklaratë e Kryesisë qendrore",date:"07.06.2026"},
];
const seedLog=[
  {id:1,who:"Egzont Demiri",action:"Shtoi anëtarin e ri «Florent Ahmeti»",date:"10.06.2026 14:22"},
  {id:2,who:"Arta Krasniqi",action:"Shënoi pagesë cash për «Fatlinda Berisha»",date:"08.06.2026 19:05"},
  {id:3,who:"Sami Biqkaj",action:"Publikoi njoftimin «Mbledhja e radhës»",date:"10.06.2026 09:10"},
  {id:4,who:"Egzont Demiri",action:"Krijoi eventin «Festa e Flamurit»",date:"02.06.2026 11:48"},
];
const seedApplications=[
  {id:1,name:"Arbresha Dida",email:"arbresha.d@gmail.com",phone:"+41 76 111 22 33",kanton:"Zürich",prof:"Mësuese",dob:"14.03.1994",note:"Dua të kontribuoj aktivisht në organizatë dhe të ndihmoj me edukim.",applied:"20.06.2026",status:"aplikim",referredBy:null},
  {id:2,name:"Mentor Osmani",email:"mentor.o@gmail.com",phone:"+41 79 222 33 44",kanton:"Aargau",prof:"Arkitekt",dob:"05.11.1988",note:"Kam qenë anëtar i organizatës në Kosovë. Tani jetoj në Aargau.",applied:"18.06.2026",status:"aprovuar",referredBy:"Blerim Gashi",approvedDate:"21.06.2026"},
  {id:3,name:"Lirije Rama",email:"lirije.r@gmail.com",phone:"+41 76 333 44 55",kanton:"Zürich",prof:"Studente",dob:"22.08.2003",note:"",applied:"15.06.2026",status:"pret_pagesen",referredBy:"Fatlinda Berisha",approvedDate:"17.06.2026"},
  {id:4,name:"Kushtrim Aliu",email:"kushtrim.a@gmail.com",phone:"+41 79 444 55 66",kanton:"Thurgau",prof:"Mekanik",dob:"07.01.1986",note:"Isha pjesë e degës në Bern për 3 vjet.",applied:"10.06.2026",status:"aktiv",referredBy:null,approvedDate:"12.06.2026",paidDate:"14.06.2026"},
  {id:5,name:"Shqipe Bytyqi",email:"shqipe.b@gmail.com",phone:"+41 76 555 66 77",kanton:"Zürich",prof:"Infermiere",dob:"30.04.1991",note:"Dëshiroj të ndihmoj me organizimin e eventeve.",applied:"05.06.2026",status:"refuzuar",referredBy:null},
  {id:6,name:"Erjon Hyseni",email:"erjon.h@gmail.com",phone:"+41 79 666 77 88",kanton:"St. Gallen",prof:"Shofer",dob:"19.09.1983",note:"",applied:"22.06.2026",status:"aplikim",referredBy:null},
];
const VOTE_STATUS_CONFIG={
  pa_kontaktuar:{label:"Pa kontaktuar",bg:"#F3F2EF",color:"#5A524E"},
  i_kontaktuar:{label:"I kontaktuar",bg:"#FEF3C7",color:"#92400E"},
  konfirmuar:{label:"Do të votojë",bg:"#E7F4ED",color:"#1E8A4C"},
  ka_votuar:{label:"Ka votuar ✓",bg:"#E2231A",color:"#fff"},
};
const INITIAL_VOTE_STATUSES={1:"ka_votuar",2:"ka_votuar",3:"konfirmuar",4:"konfirmuar",5:"i_kontaktuar",6:"konfirmuar",7:"pa_kontaktuar",8:"konfirmuar",9:"ka_votuar",10:"i_kontaktuar",11:"pa_kontaktuar",12:"pa_kontaktuar"};
const ELECTION_VOLUNTEERS=[
  {id:1,name:"Sami Biqkaj",zone:"Winterthur Qendër",task:"Koordinator kryesor",confirmed:true},
  {id:3,name:"Egzont Demiri",zone:"Winterthur Nord",task:"Transport votuesish",confirmed:true},
  {id:4,name:"Arta Krasniqi",zone:"Winterthur Süd",task:"Pikë informacioni",confirmed:true},
  {id:9,name:"Vjosa Salihu",zone:"Zürich HB",task:"Shpërndarje materialesh",confirmed:true},
  {id:null,name:"Arbresha Gjakova",zone:"Aargau",task:"Kontakt telefonik",confirmed:false},
];
const ELECTION_MATERIALS=[
  {name:"Poster A3 — Voto LVV!",type:"PDF",size:"2.4 MB"},
  {name:"Flyer A5 — Si të votojë diaspora",type:"PDF",size:"980 KB"},
  {name:"Udhëzues votimi me postë",type:"PDF",size:"1.1 MB"},
  {name:"Banner social media (1080x1080)",type:"PNG",size:"3.2 MB"},
  {name:"Story Instagram — Votova!",type:"PNG",size:"1.8 MB"},
  {name:"Mesazh WhatsApp — template",type:"TXT",size:"2 KB"},
];
const MOBILIZATION_TEMPLATE="Të nderuar anëtarë të Pikës Winterthur,\n\nZgjedhjet parlamentare të Kosovës do të mbahen më 4 tetor 2026.\n\n🗳️ SI TË VOTOSH NGA ZVICRA:\n• Regjistrohu online: evz.rks-gov.net deri më 15 shtator\n• Voto me postë ose personalisht\n\n💪 Çdo votë nga diaspora ka rëndësi!\n\nKontakt: Sami Biqkaj +41 79 111 22 33\n— Lëvizja VETËVENDOSJE! Pika Winterthur";
const seedRequests=[
  {id:"q1",from:"Blerim Gashi",email:"blerim.g@example.ch",type:"Pyetje për pagesën",msg:"Si mund ta paguaj kuotën në dy këste?",date:"15.06.2026 10:22",status:"pret",reply:""},
  {id:"q2",from:"Driton Morina",email:"driton.m@example.ch",type:"Ndryshim të dhënash",msg:"Numri im i ri i telefonit është +41 78 999 11 22.",date:"14.06.2026 18:05",status:"u_pergjigj",reply:"Të dhënat u përditësuan. Faleminderit!"},
  {id:"q3",from:"Donjeta Bytyqi",email:"donjeta.b@example.ch",type:"Pyetje për anëtarësinë",msg:"Dëshiroj të bëhem anëtare aktive. Çfarë duhet të bëj?",date:"12.06.2026 09:14",status:"pret",reply:""},
  {id:"q4",from:"Florent Ahmeti",email:"florent.a@example.ch",type:"Sugjerim",msg:"Do të ishte mirë nëse platforma do të kishte seksion për artin shqiptar.",date:"10.06.2026 14:50",status:"mbyllur",reply:"Faleminderit! E kemi shënuar."},
];
const ARCHIVE_PHOTOS=[
  {id:1,title:"Festa e Flamurit — Eulachhalle 2025",date:"28.11.2025",count:42},
  {id:2,title:"Manifestim për Pavarësinë — Zürich 2026",date:"17.02.2026",count:28},
  {id:3,title:"Mbledhja vjetore e Pikës — 2025",date:"15.03.2025",count:15},
  {id:4,title:"Aksion humanitar — dhjetor 2025",date:"10.12.2025",count:20},
  {id:5,title:"Themelimi i Pikës Winterthur — 2018",date:"12.03.2018",count:7},
];
const ARCHIVE_DOCS=[
  {id:1,name:"Procesverbal — Mbledhja 28.03.2026",date:"28.03.2026",size:"210 KB"},
  {id:2,name:"Procesverbal — Mbledhja 15.01.2026",date:"15.01.2026",size:"185 KB"},
  {id:3,name:"Raporti vjetor 2025",date:"20.01.2026",size:"1.4 MB"},
  {id:4,name:"Raporti vjetor 2024",date:"18.01.2025",size:"1.2 MB"},
];
const seedDonations=[
  {id:1,from:"Sami Biqkaj",amount:100,date:"05.06.2026",msg:"Për fushatën zgjedhore"},
  {id:2,from:"Arta Krasniqi",amount:50,date:"10.06.2026",msg:"Për aksionin humanitar"},
  {id:3,from:"Leotrim Hoxha",amount:30,date:"01.06.2026",msg:""},
  {id:4,from:"Vjosa Salihu",amount:20,date:"28.05.2026",msg:""},
  {id:5,from:"Blerim Gashi",amount:50,date:"20.05.2026",msg:"Vullnetarisht"},
];
const seedPolls=[
  {id:1,question:"A duhet të organizojmë tubim publik në Winterthur HB?",yes:8,no:2,abstain:1,deadline:"30.06.2026",status:"aktiv",voted:[1,2,4,6,8,9,3,7,10,11,5]},
  {id:2,question:"A jeni dakord me draftin e rregullores së re për diasporën?",yes:10,no:1,abstain:2,deadline:"15.06.2026",status:"mbyllur",voted:[1,2,3,4,5,6,7,8,9,10,11,12]},
  {id:3,question:"A duhet Pika të kontribuojë financiarisht për aksionin humanitar?",yes:5,no:0,abstain:0,deadline:"25.07.2026",status:"aktiv",voted:[1,2,3,4,9]},
];
const FINANCE_MONTHS=[
  {m:"Jan",collected:750},{m:"Shk",collected:450},{m:"Mar",collected:300},
  {m:"Pri",collected:150},{m:"Maj",collected:150},{m:"Qer",collected:0},
];
const CANTON_DATA=[
  {kanton:"Zürich",count:7},{kanton:"Aargau",count:2},{kanton:"Thurgau",count:1},
  {kanton:"St. Gallen",count:1},{kanton:"Schaffhausen",count:1},
];
const seedReferrals=[
  {id:1,name:"Egzont Demiri",code:"WTH-ED03",referred:3,names:["Vjosa Salihu","Florent Ahmeti","Donjeta Bytyqi"]},
  {id:2,name:"Sami Biqkaj",code:"WTH-SB01",referred:2,names:["Blerim Gashi","Leotrim Hoxha"]},
  {id:3,name:"Valton Rexha",code:"WTH-VR02",referred:2,names:["Driton Morina","Fatlinda Berisha"]},
  {id:4,name:"Arta Krasniqi",code:"WTH-AK04",referred:1,names:["Ramadan Kelmendi"]},
  {id:5,name:"Leotrim Hoxha",code:"WTH-LH08",referred:1,names:["Vjosa Salihu"]},
  {id:6,name:"Vjosa Salihu",code:"WTH-VS09",referred:0,names:[]},
  {id:7,name:"Blerim Gashi",code:"WTH-BG05",referred:0,names:[]},
];
const GROWTH_DATA=[
  {year:"2018",count:4},{year:"2019",count:8},{year:"2020",count:14},
  {year:"2021",count:19},{year:"2022",count:24},{year:"2023",count:27},
  {year:"2024",count:29},{year:"2025",count:31},{year:"2026",count:32},
];
const seedMinutes=[
  {id:1,title:"Mbledhja e rregullt — 28.03.2026",date:"28.03.2026",place:"Salla e Komunitetit, Winterthur",present:[1,2,3,4,6,8,9],decisions:["U miratua buxheti për Q2 2026","U planifikua Festa e Flamurit"],status:"final"},
  {id:2,title:"Mbledhja e jashtëzakonshme — 15.01.2026",date:"15.01.2026",place:"Online (Zoom)",present:[1,2,3,4],decisions:["U aprovua statuti i ri i Pikës","U vendos kuota vjetore CHF 150"],status:"final"},
  {id:3,title:"Mbledhja e rregullt — 12.11.2025",date:"12.11.2025",place:"Salla e Komunitetit, Winterthur",present:[1,2,3,4,5,6,8],decisions:["U raportuan financat e Q3","U planifikua aksioni humanitar"],status:"final"},
];
const CHECKIN_EVENT_ID=1;

const TASK_COLS=["todo","doing","done"];
const TASK_COL_LABELS={"todo":"Të bëra","doing":"Duke bërë","done":"Bërë"};
const TASK_COL_COLORS={"todo":C.inkSoft,"doing":C.amber,"done":C.green};
const PRIORITY_CFG={e_larte:{label:"E lartë",bg:"#FEE2E2",color:"#C8342B"},mesatare:{label:"Mesatare",bg:"#FEF3C7",color:"#92400E"},e_ulet:{label:"E ulët",bg:"#E7F4ED",color:"#1E8A4C"}};
const seedTasks=[
  {id:1,title:"Përgatit axhendën e mbledhjes 27 qershor",assignee:3,priority:"e_larte",col:"todo",due:"25.06.2026",note:"Dërgo tek anëtarët 48h para"},
  {id:2,title:"Mbledh kuotat e papaguara — qershor",assignee:4,priority:"e_larte",col:"doing",due:"30.06.2026",note:""},
  {id:3,title:"Porosit materialet për Festën e Flamurit",assignee:1,priority:"mesatare",col:"todo",due:"01.10.2026",note:"Poster A3, flyer, banderola"},
  {id:4,title:"Rifresko listën e kontakteve WhatsApp",assignee:3,priority:"e_ulet",col:"doing",due:"05.07.2026",note:""},
  {id:5,title:"Dërgo ftesa për mbledhjen",assignee:2,priority:"e_larte",col:"done",due:"10.06.2026",note:""},
  {id:6,title:"Regjistro anëtarët e rinj në sistem",assignee:3,priority:"mesatare",col:"done",due:"08.06.2026",note:"3 anëtarë të rinj"},
  {id:7,title:"Përgatit raportin financiar Q2",assignee:4,priority:"mesatare",col:"todo",due:"15.07.2026",note:""},
  {id:8,title:"Organizoi transport për zgjedhjet",assignee:1,priority:"e_larte",col:"todo",due:"01.10.2026",note:"Min. 2 makina"},
];


function payChip(pay) {
  if(pay==="paguar") return <span className="vv-chip" style={{background:"#E7F4ED",color:"#1E8A4C"}}><CheckCircle2 size={11}/>Paguar</span>;
  if(pay==="liruar") return <span className="vv-chip" style={{background:"#EEF2FF",color:"#4338CA"}}><ShieldCheck size={11}/>Liruar</span>;
  return <span className="vv-chip" style={{background:"#FEF3C7",color:"#92400E"}}><Clock size={11}/>Papaguar</span>;
}
function statusChip(s) {
  if(s==="aktiv") return <span className="vv-chip" style={{background:"#E7F4ED",color:"#1E8A4C"}}><CheckCircle2 size={11}/>Aktiv</span>;
  return <span className="vv-chip" style={{background:"#F3F2EF",color:"#5A524E"}}><XCircle size={11}/>Joaktiv</span>;
}
function reqChip(s) {
  if(s==="pret") return <span className="vv-chip" style={{background:"#FEF3C7",color:"#92400E"}}><Clock size={11}/>Pret</span>;
  if(s==="u_pergjigj") return <span className="vv-chip" style={{background:"#E7F4ED",color:"#1E8A4C"}}><CheckCircle2 size={11}/>U përgjigj</span>;
  return <span className="vv-chip" style={{background:"#F3F2EF",color:"#5A524E"}}><XCircle size={11}/>Mbyllur</span>;
}


const WaIcon=()=>(
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function waLink(text){return `https://wa.me/?text=${encodeURIComponent(text)}`;}
function WaBtn({text,label="WhatsApp",style={}}){
  return(
    <a href={waLink(text)} target="_blank" rel="noopener noreferrer"
      style={{display:"inline-flex",alignItems:"center",gap:7,background:"#25D366",color:"#fff",borderRadius:10,padding:"9px 16px",fontWeight:600,fontSize:14,textDecoration:"none",boxShadow:"0 2px 8px rgba(37,211,102,.30)",transition:"all .15s",...style}}
      onMouseEnter={e=>{e.currentTarget.style.background="#1ebe5d";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="#25D366";e.currentTarget.style.transform="translateY(0)";}}>
      <WaIcon/>{label}
    </a>
  );
}
function useToast(){
  const [state,setState]=useState(null);
  function show(msg,onUndo=null){
    setState({msg,onUndo});
    setTimeout(()=>setState(s=>s?.msg===msg?null:s),3000);
  }
  return[state,show];
}
function Toast({msg}){
  const text=msg?.msg??msg;
  const undo=msg?.onUndo;
  if(!text)return null;
  return(
    <div className="vv-toast">
      <CheckCircle2 size={16}/>{text}
      {undo&&<button onClick={()=>{undo();}} style={{marginLeft:14,background:"rgba(255,255,255,.18)",border:"1.5px solid rgba(255,255,255,.35)",borderRadius:7,color:"#fff",padding:"3px 10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Anulo</button>}
    </div>
  );
}
function useLocalState(key,def){
  const [val,setVal]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):def;}catch{return def;}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(val));}catch{}},[key,val]);
  return[val,setVal];
}
function useOnline(){
  const [online,setOnline]=useState(()=>navigator.onLine);
  useEffect(()=>{
    const on=()=>setOnline(true);const off=()=>setOnline(false);
    window.addEventListener("online",on);window.addEventListener("offline",off);
    return()=>{window.removeEventListener("online",on);window.removeEventListener("offline",off);};
  },[]);
  return online;
}
function getUpcomingBirthdays(members,days=14){
  const today=new Date();
  return members
    .filter(m=>m.dob&&m.dob!=="—")
    .map(m=>{
      const[d,mo]=m.dob.split(".");
      const bday=new Date(today.getFullYear(),parseInt(mo)-1,parseInt(d));
      if(bday<today)bday.setFullYear(bday.getFullYear()+1);
      return{...m,daysUntil:Math.ceil((bday-today)/864e5),bdayStr:`${d}.${mo}`};
    })
    .filter(m=>m.daysUntil<=days)
    .sort((a,b)=>a.daysUntil-b.daysUntil);
}
function shareEventCard(ev){
  const html=`<!DOCTYPE html><html lang="sq"><head><meta charset="utf-8"><title>${ev.title}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#f3f2ef;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;font-family:'Inter',sans-serif}
.card{width:540px;height:540px;background:linear-gradient(150deg,#E2231A 0%,#8C1009 100%);border-radius:28px;padding:48px;color:#fff;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;print-color-adjust:exact;-webkit-print-color-adjust:exact;box-shadow:0 24px 80px rgba(226,35,26,.35)}
.bg{position:absolute;right:-40px;bottom:-80px;font-family:'Archivo';font-weight:900;font-size:320px;line-height:1;color:rgba(255,255,255,.06)}
.label{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;opacity:.72;margin-bottom:8px}
.title{font-family:'Archivo';font-weight:900;font-size:38px;line-height:1.1;letter-spacing:-1px;max-width:420px}
.meta{display:flex;flex-direction:column;gap:8px}
.meta-row{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:600;opacity:.9}
.logo{font-family:'Archivo';font-weight:900;font-size:18px;opacity:.85}
.btn{margin-top:20px;background:linear-gradient(135deg,#E2231A,#C01C14);color:#fff;border:none;border-radius:12px;padding:12px 22px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Inter';box-shadow:0 4px 18px rgba(226,35,26,.35)}
@media print{.btn{display:none}}</style></head>
<body>
<div class="card">
  <div class="bg">!</div>
  <div><div class="label">VETËVENDOSJE! · Pika Winterthur</div>
  <div class="title">${ev.title}</div></div>
  <div class="meta">
    <div class="meta-row">📅 ${ev.date} · ${ev.time}</div>
    <div class="meta-row">📍 ${ev.place}</div>
    <div class="meta-row">👥 ${ev.rsvp.length} të regjistruar · ${ev.public?"Event publik":"Event i brendshëm"}</div>
  </div>
  <div class="logo">LËVIZJA VETËVENDOSJE!</div>
</div>
<button class="btn" onclick="window.print()">📥 Shkarko / Printo kartën</button>
</body></html>`;
  const w=window.open("","_blank","width=640,height=720");
  w.document.write(html);w.document.close();
}
function exportCSV(rows,filename){
  if(!rows.length)return;
  const keys=Object.keys(rows[0]);
  const lines=[
    keys.join(";"),
    ...rows.map(r=>keys.map(k=>`"${String(r[k]??"").replace(/"/g,'""')}"`).join(";"))
  ].join("\n");
  const blob=new Blob(["﻿"+lines],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();
  document.body.removeChild(a);URL.revokeObjectURL(url);
}
function Modal({open,onClose,title,children,width=520}){
  if(!open)return null;
  return(
    <div className="vv-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="vv-modal" style={{maxWidth:width}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 24px 0"}}>
          <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:20,margin:0}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><X size={22}/></button>
        </div>
        <div style={{padding:"18px 24px 24px"}}>{children}</div>
      </div>
    </div>
  );
}
function Card({children,p=20,style={}}){return<div className="vv-card" style={{padding:p,...style}}>{children}</div>;}
function SectionTitle({title,sub,action}){
  const t=useT();
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
      <div>
        <h1 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:24,margin:0}}>{t(title)}</h1>
        {sub&&<p style={{color:C.inkSoft,margin:"4px 0 0",fontSize:14}}>{t(sub)}</p>}
      </div>
      {action}
    </div>
  );
}
function Field({icon,label,value}){
  return(
    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
      <div style={{color:C.inkSoft,marginTop:2,flexShrink:0}}>{icon}</div>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:C.inkSoft,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</div>
        <div style={{fontSize:14,color:C.ink,marginTop:2}}>{value||"—"}</div>
      </div>
    </div>
  );
}
const LangCtx=React.createContext("sq");
const useT=()=>{
  const lang=React.useContext(LangCtx);
  return (key)=>{
    if(lang==="sq")return key;
    return DE[key]??key;
  };
};
const DE={
  /* nav — member */"Kreu":"Übersicht","Profili im":"Mein Profil","Faturat":"Rechnungen","Eventet":"Veranstaltungen","Njoftimet":"Mitteilungen","Karta digjitale":"Digitale Karte","Dono":"Spenden","Sondazhet":"Umfragen",
  /* nav — admin */"Paneli":"Dashboard","Anëtarët":"Mitglieder","Pagesat":"Zahlungen","Financat":"Finanzen","Rritja":"Wachstum","Kalendari":"Kalender","Zgjedhjet":"Wahlen","Rekrutimi":"Rekrutierung","Harta":"Karte","Komunikimi":"Kommunikation","Donacionet":"Spenden","Kujtesat":"Erinnerungen","Procesverbalet":"Protokolle","Kërkesat":"Anfragen","Arkiva":"Archiv","Cilësimet":"Einstellungen","Detyrat":"Aufgaben",
  /* sidebar sections */"Anëtar":"Mitglied","Pjesëmarrja":"Teilnahme","Kontributi":"Beitrag","Kryesore":"Hauptmenü","Aktiviteti":"Aktivitäten","Politika":"Politik","Organizimi":"Organisation","Sistemi":"System",
  /* section titles */"Paneli kryesor":"Dashboard","Historia e pagesave të anëtarësisë":"Mitgliedsbeitrag-Geschichte","Të gjitha ngjarjet e Pikës":"Alle Veranstaltungen","Tabela Kanban e Pikës":"Kanban-Aufgaben","Rritja e anëtarësisë":"Mitgliederwachstum","Shpërndarja sipas kantonit":"Verteilung nach Kanton","Rekrutimi dhe referimi":"Rekrutierung & Empfehlungen","Komunikimi":"Kommunikation","Cilësimet":"Einstellungen","Arkiva":"Archiv","Sondazhet":"Umfragen","Donacionet":"Spenden","Kujtesat automatike":"Automatische Erinnerungen","Procesverbalet":"Protokolle","Kërkesat":"Anfragen","Zgjedhjet":"Wahlen","Financat":"Finanzen","Eventet":"Veranstaltungen","Check-in i eventit":"Event Check-in","Anëtarët":"Mitglieder","Pagesat":"Zahlungen","Karta digjitale":"Digitale Karte","Profili im":"Mein Profil","Njoftimet":"Mitteilungen","Faturat":"Rechnungen","Dono":"Spenden",
  /* stat labels */"Anëtarë total":"Mitglieder gesamt","Anëtarë aktivë":"Aktive Mitglieder","Kuota paguar":"Beitrag bezahlt","Eventet e ardhshme":"Kommende Events","Kuota vjetore":"Jahresbeitrag","Pagesa 2026":"Zahlung 2026","Anëtar prej":"Mitglied seit","Arkëtuar YTD":"Einnahmen YTD","Target vjetor":"Jahresziel","Progresi":"Fortschritt","Anëtarë 2026":"Mitglieder 2026","Rritja këtë vit":"Wachstum dieses Jahr","Themeluar":"Gegründet","Kantone të përfaqësuara":"Vertretene Kantone","Kantoni me më shumë":"Stärkster Kanton","Anëtarë gjithsej":"Mitglieder gesamt","Gjithsej kërkesa":"Anfragen gesamt","Presin përgjigje":"Warten auf Antwort","U përgjigj":"Beantwortet","Total referime":"Empfehlungen gesamt","Rekrutues aktivë":"Aktive Werber","Rekrutues kryesor":"Top-Werber","Kanë ardhur":"Anwesend","Mungojnë":"Fehlend","Të regjistruar":"Registriert","Gjithsej":"Gesamt","Presin":"Warten","Donacioni mesatar":"Ø Spende","Donacioni më i madh":"Größte Spende","Të bëra":"Zu tun","Duke bërë":"In Arbeit","Bërë":"Erledigt",
  /* buttons */"Shto anëtar":"Mitglied +","Krijo event":"Event +","Shto detyrë":"Aufgabe +","Dil":"Abmelden","Paguaj tani":"Jetzt zahlen","Paguaj":"Bezahlen","Konfirmo pagesën me TWINT":"Mit TWINT bestätigen","Konfirmo pagesën me PostFinance":"Mit PostFinance bestätigen",
  /* roles */"Admin":"Admin","Anëtar":"Mitglied","Sekretar / Admin":"Sekretär / Admin",
  /* login */"Mirëserdhët":"Willkommen","Hyni në platformë":"Plattform-Login","Zgjidhni rolin tuaj për të vazhduar":"Wählen Sie Ihre Rolle","Administrator":"Administrator","Apliko për anëtarësim":"Mitgliedschaft beantragen","Hyni si Blerim Gashi (demo)":"Als Blerim Gashi einloggen (Demo)","Qasje e plotë — Egzont Demiri":"Vollzugriff — Egzont Demiri","Formulari publik i aplikimit":"Öffentliches Antragsformular",
};

function useInstallPrompt(){
  const [prompt,setPrompt]=useState(null);
  useEffect(()=>{
    const h=e=>{e.preventDefault();setPrompt(e);};
    window.addEventListener("beforeinstallprompt",h);
    window.addEventListener("appinstalled",()=>setPrompt(null));
    return()=>window.removeEventListener("beforeinstallprompt",h);
  },[]);
  async function install(){
    if(!prompt)return;
    prompt.prompt();
    await prompt.userChoice;
    setPrompt(null);
  }
  return[!!prompt,install];
}

function InstallBanner(){
  const[canInstall,install]=useInstallPrompt();
  const[dismissed,setDismissed]=useState(()=>localStorage.getItem("vv-pwa-dismissed")==="1");
  function dismiss(){localStorage.setItem("vv-pwa-dismissed","1");setDismissed(true);}
  if(!canInstall||dismissed)return null;
  return(
    <div style={{background:"linear-gradient(90deg,#E2231A 0%,#8C1009 100%)",color:"#fff",padding:"10px 20px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",position:"sticky",top:0,zIndex:20}}>
      <Zap size={15} style={{flexShrink:0}}/>
      <span style={{flex:1,fontWeight:500,fontSize:13,minWidth:180}}>Instalo VV Winterthur në celularin tënd — akses i shpejtë!</span>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={install} style={{background:"rgba(255,255,255,.20)",border:"1.5px solid rgba(255,255,255,.50)",borderRadius:8,color:"#fff",padding:"6px 14px",fontWeight:700,fontSize:13,cursor:"pointer"}}>
          ⬇ Instalo
        </button>
        <button onClick={dismiss} style={{background:"none",border:"none",color:"rgba(255,255,255,.72)",cursor:"pointer",padding:"4px 6px",fontSize:12,fontWeight:500}}>
          Jo tani
        </button>
      </div>
    </div>
  );
}

function useCountUp(target,duration=900){
  const num=typeof target==="number"?target:parseFloat(String(target).replace(/[^0-9.]/g,""));
  const isNum=!isNaN(num)&&num>0;
  const [val,setVal]=useState(isNum?0:target);
  useEffect(()=>{
    if(!isNum){setVal(target);return;}
    let start=null;
    const step=ts=>{
      if(!start)start=ts;
      const p=Math.min((ts-start)/duration,1);
      const ease=1-Math.pow(1-p,3);
      setVal(Math.round(ease*num));
      if(p<1)requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[target]);
  if(!isNum)return target;
  const prefix=String(target).match(/^[^0-9]*/)[0];
  const suffix=String(target).match(/[^0-9]*$/)[0];
  return `${prefix}${val}${suffix}`;
}

function StatCard({label,value,color=C.ink,icon,sub,accent,delay=0}){
  const t=useT();
  const iconBg=color===C.green?"rgba(30,138,76,.12)":color===C.amber?"rgba(185,122,16,.12)":color===C.redStat||color===C.red?"rgba(226,35,26,.12)":"rgba(23,18,16,.07)";
  const animated=useCountUp(value);
  return(
    <Card style={{position:"relative",overflow:"hidden",animation:`fadeUp .3s ease ${delay}ms both`}}>
      {accent&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${color},${color}88)`}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div className="vv-eyebrow">{t(label)}</div>
          <div className="vv-stat display" style={{color,marginTop:8,fontSize:32}}>{animated}</div>
          {sub&&<div style={{fontSize:12,color:C.inkSoft,marginTop:5}}>{sub}</div>}
        </div>
        {icon&&<div className="vv-icon-box" style={{background:iconBg,color}}>{icon}</div>}
      </div>
    </Card>
  );
}


function Login({onLogin,lang="sq",onLangToggle,onBack}){
  const t=useT();
  return(
    <div className="vv-login">
      <div className="vv-login-hero">
        <div>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:40}}>
            <div className="vv-emblem lg">VV</div>
            <div>
              <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:22,letterSpacing:"-0.5px"}}>VETËVENDOSJE!</div>
              <div style={{opacity:.8,fontSize:14}}>Pika Winterthur — Zvicër</div>
            </div>
          </div>
          <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:52,lineHeight:1.0,letterSpacing:"-2px",maxWidth:420}}>Platforma Digjitale e Pikës</div>
          <p style={{opacity:.82,marginTop:22,fontSize:16,lineHeight:1.65,maxWidth:380}}>Menaxhimi i anëtarësisë, eventeve, komunikimit dhe mobilizimit politik — nga një vend.</p>
          <div style={{display:"flex",gap:16,marginTop:28}}>
            {[["32","Anëtarë"],["19","Evente"],["4 tet","Zgjedhjet"]].map(([v,l])=>(
              <div key={l} style={{background:"rgba(255,255,255,.12)",borderRadius:12,padding:"10px 16px",backdropFilter:"blur(8px)"}}>
                <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:22}}>{v}</div>
                <div style={{fontSize:12,opacity:.75,marginTop:1}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{opacity:.7,fontSize:13}}>Lëvizja VETËVENDOSJE! © 2026</div>
      </div>
      <div className="vv-login-panel">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          {onBack?<button onClick={onBack} className="vv-btn ghost" style={{fontSize:13,padding:"6px 12px",fontWeight:600,display:"flex",alignItems:"center",gap:5}}><ChevronLeft size={15}/>Kthehu</button>:<div/>}
          <button onClick={onLangToggle} className="vv-btn ghost" style={{fontSize:13,padding:"6px 12px",fontWeight:700}}>
            {lang==="sq"?"🇦🇱 Shqip":"🇩🇪 Deutsch"}
          </button>
        </div>
        <div style={{marginBottom:32}}>
          <div className="vv-eyebrow" style={{marginBottom:8}}>{t("Mirëserdhët")}</div>
          <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:26,margin:"0 0 6px"}}>{t("Hyni në platformë")}</h2>
          <p style={{color:C.inkSoft,fontSize:14,margin:0}}>{t("Zgjidhni rolin tuaj për të vazhduar")}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <button className="vv-rolecard" onClick={()=>onLogin("member")}>
            <div className="vv-emblem"><User size={17}/></div>
            <div><div style={{fontWeight:700,fontSize:15}}>{t("Anëtar")}</div><div style={{fontSize:13,color:C.inkSoft,marginTop:2}}>{t("Hyni si Blerim Gashi (demo)")}</div></div>
            <ChevronRight size={18} style={{marginLeft:"auto",color:C.inkSoft}}/>
          </button>
          <button className="vv-rolecard" onClick={()=>onLogin("admin")}>
            <div className="vv-emblem" style={{background:C.ink}}><ShieldCheck size={17}/></div>
            <div><div style={{fontWeight:700,fontSize:15}}>{t("Administrator")}</div><div style={{fontSize:13,color:C.inkSoft,marginTop:2}}>{t("Qasje e plotë — Egzont Demiri")}</div></div>
            <ChevronRight size={18} style={{marginLeft:"auto",color:C.inkSoft}}/>
          </button>
          <button className="vv-rolecard" onClick={()=>onLogin("apply")} style={{borderStyle:"dashed"}}>
            <div className="vv-emblem" style={{background:C.green}}><UserPlus size={17}/></div>
            <div><div style={{fontWeight:700,fontSize:15}}>{t("Apliko për anëtarësim")}</div><div style={{fontSize:13,color:C.inkSoft,marginTop:2}}>{t("Formulari publik i aplikimit")}</div></div>
            <ChevronRight size={18} style={{marginLeft:"auto",color:C.inkSoft}}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplyForm({onBack}){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",email:"",phone:"",kanton:"Zürich",prof:"",dob:"",note:""});
  const [toast,showToast]=useToast();
  function set(k,v){setForm(f=>({...f,[k]:v}));}
  if(step===2) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.paper,padding:20}}>
      <div style={{maxWidth:460,width:"100%",textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"#E7F4ED",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><CheckCircle2 size={34} color={C.green}/></div>
        <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:26,marginBottom:10}}>Aplikimi u dërgua!</h2>
        <p style={{color:C.inkSoft,lineHeight:1.6,marginBottom:24}}>Faleminderit, <b>{form.name}</b>! Kërkesa juaj u regjistrua. Kryesia e Pikës do t'ju kontaktojë brenda 3–5 ditëve pune në <b>{form.email}</b>.</p>
        <button className="vv-btn ghost" onClick={onBack}>← Kthehu</button>
      </div>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",background:C.paper,padding:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{maxWidth:500,width:"100%"}}>
        <button className="vv-btn ghost" onClick={onBack} style={{marginBottom:20,fontSize:13}}>← Kthehu</button>
        <Card p={32}>
          <div className="vv-eyebrow" style={{marginBottom:6}}>Hapi 1 nga 1</div>
          <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:22,marginBottom:20}}>Apliko për anëtarësim</h2>
          <div style={{display:"grid",gap:14}}>
            {[["Emri dhe mbiemri *","name","text"],["Email *","email","email"],["Telefon","phone","tel"],["Profesioni","prof","text"],["Datëlindja","dob","text"]].map(([lbl,k,t])=>(
              <div key={k}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:5}}>{lbl}</label>
              <input className="vv-input" type={t} placeholder={lbl.replace(" *","")} value={form[k]} onChange={e=>set(k,e.target.value)}/></div>
            ))}
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:5}}>Kantoni</label>
            <select className="vv-input" value={form.kanton} onChange={e=>set("kanton",e.target.value)}>
              {["Zürich","Aargau","Thurgau","St. Gallen","Schaffhausen","Bern","Basel","Tun"].map(k=><option key={k}>{k}</option>)}
            </select></div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:5}}>Shënim (opsional)</label>
            <textarea className="vv-input" rows={3} value={form.note} onChange={e=>set("note",e.target.value)} placeholder="Pse dëshironi të anëtarësoheni?"/></div>
          </div>
          <button className="vv-btn" style={{width:"100%",justifyContent:"center",marginTop:20}} onClick={()=>{if(!form.name||!form.email){showToast("Plotëso fushat e detyrueshme");return;}setStep(2);}}>
            <Send size={15}/>Dërgo aplikimin
          </button>
        </Card>
      </div>
      <Toast msg={toast}/>
    </div>
  );
}

function PublicHome({onLogin,onApply}){
  const pubEvents=seedEvents.filter(e=>e.public&&!e.past);
  const [menuOpen,setMenuOpen]=useState(false);
  return(
    <div style={{fontFamily:"'Inter',sans-serif",color:"#171210",background:"#EDECE8",minHeight:"100vh"}}>
      <style>{`
        .ph-nav{position:sticky;top:0;z-index:30;background:rgba(237,236,232,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid rgba(23,18,16,.08);padding:0 5vw;display:flex;align-items:center;justify-content:space-between;height:64px}
        .ph-hero{background:linear-gradient(150deg,#D91E16 0%,#8C1009 100%);color:#fff;padding:96px 5vw 80px;position:relative;overflow:hidden}
        .ph-hero::after{content:"!";position:absolute;right:-40px;bottom:-120px;font-family:'Archivo',sans-serif;font-weight:900;font-size:500px;line-height:1;color:rgba(255,255,255,.05);pointer-events:none}
        .ph-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 80% 0%,rgba(255,255,255,.12),transparent 60%)}
        .ph-section{padding:72px 5vw}
        .ph-grid{display:grid;gap:20px}
        @media(min-width:700px){.ph-grid-2{grid-template-columns:1fr 1fr}.ph-grid-3{grid-template-columns:1fr 1fr 1fr}}
        .ph-card{background:#fff;border-radius:18px;padding:24px;border:1px solid rgba(23,18,16,.07);box-shadow:0 1px 4px rgba(23,18,16,.05),0 6px 20px rgba(23,18,16,.04)}
        .ph-stat{text-align:center;background:rgba(255,255,255,.15);border-radius:14px;padding:20px 16px;backdrop-filter:blur(8px)}
        .ph-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:5px 14px;font-size:12px;font-weight:700;letter-spacing:.06em;color:#fff;margin-bottom:20px}
        .ph-btn-pri{display:inline-flex;align-items:center;gap:8px;background:#fff;color:#E2231A;border:none;border-radius:12px;padding:13px 26px;font-weight:700;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.18);transition:all .15s}
        .ph-btn-pri:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.22)}
        .ph-btn-sec{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.15);color:#fff;border:1.5px solid rgba(255,255,255,.40);border-radius:12px;padding:13px 26px;font-weight:600;font-size:15px;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;text-decoration:none}
        .ph-btn-sec:hover{background:rgba(255,255,255,.25)}
        .ph-nav-link{color:#5A524E;font-weight:500;font-size:14px;background:none;border:none;cursor:pointer;padding:4px 8px;transition:color .12s;font-family:'Inter',sans-serif;text-decoration:none}
        .ph-nav-link:hover{color:#E2231A}
        .ph-footer{background:#1C1410;color:rgba(255,255,255,.7);padding:48px 5vw;font-size:13px}
        .ph-chip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;letter-spacing:.01em}
      `}</style>

      {/* Navbar */}
      <nav className="ph-nav">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#E2231A,#B5170F)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:15}}>VV</div>
          <div>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:13,lineHeight:1}}>VETËVENDOSJE!</div>
            <div style={{fontSize:11,color:"#5A524E"}}>Pika Winterthur</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <a href="#eventet" className="ph-nav-link" style={{display:"none"}}>Eventet</a>
          <button onClick={onApply} className="ph-nav-link">Apliko</button>
          <button onClick={onLogin} style={{background:"linear-gradient(135deg,#E2231A,#B5170F)",color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:"0 2px 8px rgba(226,35,26,.30)"}}>Hyr →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="ph-hero">
        <div style={{maxWidth:720,position:"relative",zIndex:1}}>
          <div className="ph-badge"><span>🇦🇱</span>Lëvizja VETËVENDOSJE! · Zvicër</div>
          <h1 style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:"clamp(36px,6vw,68px)",lineHeight:1.02,letterSpacing:"-2px",marginBottom:22}}>Pika Winterthur<br/>Bashkë për Kosovën</h1>
          <p style={{fontSize:18,lineHeight:1.65,opacity:.88,marginBottom:36,maxWidth:540}}>Organizata jonë bashkon shqiptarët e Winterthur-it dhe rajonit në mbështetje të Lëvizjes VETËVENDOSJE! dhe zhvillimit demokratik të Kosovës.</p>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            <button className="ph-btn-pri" onClick={onApply}><UserPlus size={16}/>Bëhu anëtar</button>
            <button className="ph-btn-sec" onClick={onLogin}>Hyr në platformë →</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:56,maxWidth:600,position:"relative",zIndex:1}}>
          {[["32","Anëtarë"],["2018","Themeluar"],["4 Tet","Zgjedhjet"],["CHF 150","Kuota vjetore"]].map(([v,l])=>(
            <div key={l} className="ph-stat">
              <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:24,lineHeight:1}}>{v}</div>
              <div style={{fontSize:11,opacity:.72,marginTop:4,fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rreth nesh */}
      <section className="ph-section" style={{background:"#fff"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#E2231A",marginBottom:8}}>Rreth organizatës</div>
          <div style={{display:"grid",gap:24}} className="ph-grid ph-grid-2">
            <div>
              <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:32,letterSpacing:"-1px",marginBottom:16,lineHeight:1.15}}>Kush jemi ne?</h2>
              <p style={{color:"#5A524E",lineHeight:1.75,fontSize:15,marginBottom:14}}>Pika Winterthur është dega lokale e Lëvizjes VETËVENDOSJE! në Zvicër. Veprojmë në Winterthur dhe rajonin e Zürich-ut, duke mobilizuar diasporën shqiptare për zgjedhjet dhe çështjet demokratike të Kosovës.</p>
              <p style={{color:"#5A524E",lineHeight:1.75,fontSize:15}}>Organizojmë mbledhje të rregullta, manifesime, aktivitete kulturore dhe humanitare — gjithmonë me synim forcimin e lidhjes mes diasporës dhe atdheut.</p>
            </div>
            <div style={{display:"grid",gap:14}}>
              {[["🗳️ Mobilizim zgjedhor","Ndihmojmë anëtarët të regjistrohen dhe votojnë nga Zvicra."],["🤝 Solidaritet","Organizojmë aksione humanitare dhe mbështetje për familjet."],["🎓 Kulturë & Edukim","Evente kulturore, debate dhe formim politik për brezin e ri."],["📢 Zë i Diasporës","Përfaqësojmë interesat e shqiptarëve të Winterthur-it."]].map(([t,d])=>(
                <div key={t} className="ph-card" style={{display:"flex",gap:14,alignItems:"flex-start",padding:"16px 18px"}}>
                  <span style={{fontSize:22,flexShrink:0}}>{t.split(" ")[0]}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{t.slice(3)}</div>
                    <div style={{fontSize:13,color:"#5A524E",lineHeight:1.5}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eventet publike */}
      {pubEvents.length>0&&(
        <section id="eventet" className="ph-section">
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#E2231A",marginBottom:8}}>Aktivitetet</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
              <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:28,letterSpacing:"-1px"}}>Eventet e ardhshme</h2>
              <button onClick={onApply} style={{background:"none",border:"none",color:"#E2231A",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Regjistrohu →</button>
            </div>
            <div className="ph-grid ph-grid-3" style={{display:"grid"}}>
              {pubEvents.map(ev=>(
                <div key={ev.id} className="ph-card">
                  <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                    <span className="ph-chip" style={{background:"#FEE2E2",color:"#C8342B"}}>{ev.type}</span>
                    <span className="ph-chip" style={{background:"#EDE9FF",color:"#6B21A8"}}>Publik</span>
                  </div>
                  <div style={{fontWeight:700,fontSize:16,marginBottom:10,lineHeight:1.3}}>{ev.title}</div>
                  <div style={{fontSize:13,color:"#5A524E",display:"flex",flexDirection:"column",gap:5}}>
                    <span>📅 {ev.date} · {ev.time}</span>
                    <span>📍 {ev.place}</span>
                    <span>👥 {ev.rsvp.length} të regjistruar</span>
                  </div>
                  <button onClick={onApply} style={{marginTop:14,width:"100%",background:"#171210",color:"#fff",border:"none",borderRadius:10,padding:"9px",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Regjistrohu</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Njoftime */}
      <section className="ph-section" style={{background:"#fff"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",color:"#E2231A",marginBottom:8}}>Lajme</div>
          <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:28,letterSpacing:"-1px",marginBottom:24}}>Njoftimet e fundit</h2>
          <div style={{display:"grid",gap:14}}>
            {seedAnnouncements.map(a=>(
              <div key={a.id} className="ph-card" style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                {a.pinned&&<span style={{flexShrink:0,background:"#E2231A",color:"#fff",borderRadius:8,padding:"4px 8px",fontSize:11,fontWeight:700,marginTop:2}}>📌</span>}
                <div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{a.title}</div>
                  <div style={{color:"#5A524E",fontSize:14,lineHeight:1.6}}>{a.body}</div>
                  <div style={{fontSize:12,color:"#9A938F",marginTop:6}}>{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background:"linear-gradient(135deg,#E2231A,#8C1009)",color:"#fff",padding:"72px 5vw",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:400,color:"rgba(255,255,255,.04)",pointerEvents:"none",userSelect:"none",lineHeight:1}}>!</div>
        <div style={{position:"relative",zIndex:1}}>
          <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,52px)",letterSpacing:"-1.5px",marginBottom:16}}>Bëhu pjesë e lëvizjes</h2>
          <p style={{fontSize:17,opacity:.88,marginBottom:36,maxWidth:480,margin:"0 auto 36px"}}>Bashkohu me 32 anëtarët e Pikës Winterthur. Apliko tani — kryesia do të të kontaktojë brenda 3–5 ditëve.</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="ph-btn-pri" onClick={onApply}><UserPlus size={16}/>Apliko për anëtarësim</button>
            <button className="ph-btn-sec" onClick={onLogin}>Hyr si anëtar →</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ph-footer">
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gap:32}} className="ph-grid ph-grid-3">
          <div>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:16,color:"#fff",marginBottom:8}}>VETËVENDOSJE!</div>
            <div style={{marginBottom:4}}>Pika Winterthur — Zvicër</div>
            <div style={{opacity:.55,fontSize:12}}>Themeluar 2018</div>
          </div>
          <div>
            <div style={{fontWeight:700,color:"rgba(255,255,255,.9)",marginBottom:10,fontSize:13}}>Kontakt</div>
            <div>📧 winterthur@vetevendosje.org</div>
            <div style={{marginTop:4}}>📍 Winterthur, Kanton Zürich</div>
          </div>
          <div>
            <div style={{fontWeight:700,color:"rgba(255,255,255,.9)",marginBottom:10,fontSize:13}}>Lëvizja</div>
            <a href="https://vetevendosje.org" target="_blank" rel="noopener noreferrer" style={{color:"rgba(255,255,255,.7)",display:"block",marginBottom:4,textDecoration:"none",fontSize:13}}>vetevendosje.org</a>
            <a href="https://evz.rks-gov.net" target="_blank" rel="noopener noreferrer" style={{color:"rgba(255,255,255,.7)",display:"block",textDecoration:"none",fontSize:13}}>Regjistrohu për votim →</a>
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.08)",marginTop:36,paddingTop:20,textAlign:"center",opacity:.45,fontSize:12}}>
          © 2026 Lëvizja VETËVENDOSJE! Pika Winterthur · Të gjitha të drejtat të rezervuara
        </div>
      </footer>
    </div>
  );
}


const SEARCH_TYPE={
  member:{icon:<User size={13}/>,label:"Anëtar",color:"#1E8A4C",bg:"#E7F4ED"},
  event:{icon:<Calendar size={13}/>,label:"Event",color:"#6B21A8",bg:"#EDE9FF"},
  news:{icon:<Newspaper size={13}/>,label:"Njoftim",color:"#5A524E",bg:"#F3F2EF"},
};
function GlobalSearch({role,setTab,members,events,announcements}){
  const [q,setQ]=useState("");
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const h=()=>ref.current?.focus();
    window.addEventListener("vv-search-focus",h);
    return()=>window.removeEventListener("vv-search-focus",h);
  },[]);
  const results=useMemo(()=>{
    const lq=q.trim().toLowerCase();
    if(lq.length<2)return[];
    const out=[];
    if(role==="admin"&&members){
      members.filter(m=>m.name.toLowerCase().includes(lq)||m.email.toLowerCase().includes(lq)||m.kanton.toLowerCase().includes(lq))
        .slice(0,3).forEach(m=>out.push({id:`m${m.id}`,type:"member",label:m.name,sub:`${m.role} · ${m.kanton}`,tab:"members"}));
    }
    events?.filter(e=>e.title.toLowerCase().includes(lq)||e.place.toLowerCase().includes(lq))
      .slice(0,3).forEach(e=>out.push({id:`e${e.id}`,type:"event",label:e.title,sub:`${e.date} · ${e.place}`,tab:"events"}));
    announcements?.filter(a=>a.title.toLowerCase().includes(lq)||a.body.toLowerCase().includes(lq))
      .slice(0,2).forEach(a=>out.push({id:`a${a.id}`,type:"news",label:a.title,sub:a.body.slice(0,55)+"…",tab:role==="admin"?"comms":"news"}));
    return out;
  },[q,role,members,events,announcements]);
  function pick(tab){setTab(tab);setQ("");setOpen(false);}
  return(
    <div style={{position:"relative"}} ref={ref}>
      <div style={{position:"relative",display:"flex",alignItems:"center"}}>
        <Search size={14} style={{position:"absolute",left:10,color:"#A39D99",pointerEvents:"none",zIndex:1}}/>
        <input className="vv-input" style={{paddingLeft:30,fontSize:13,height:36,width:200,borderRadius:10}}
          placeholder="Kërko…" value={q}
          onChange={e=>{setQ(e.target.value);setOpen(true);}}
          onFocus={()=>setOpen(true)}
          onBlur={()=>setTimeout(()=>setOpen(false),160)}/>
      </div>
      {open&&q.trim().length>=2&&(
        <div className="vv-search-results">
          {results.length===0
            ?<div style={{padding:"14px 16px",fontSize:13,color:"#5A524E",textAlign:"center"}}>Asnjë rezultat për «{q}»</div>
            :results.map(r=>{
              const cfg=SEARCH_TYPE[r.type];
              return(
                <div key={r.id} className="vv-search-row" onMouseDown={()=>pick(r.tab)}>
                  <div style={{width:30,height:30,borderRadius:8,background:cfg.bg,color:cfg.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cfg.icon}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.label}</div>
                    <div style={{fontSize:12,color:"#5A524E",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.sub}</div>
                  </div>
                  <span style={{fontSize:11,fontWeight:700,color:cfg.color,background:cfg.bg,padding:"2px 8px",borderRadius:999,flexShrink:0}}>{cfg.label}</span>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

function SkeletonCard({rows=2,h1=28,style={}}){
  return(
    <div className="vv-card" style={{padding:20,...style}}>
      <div className="vv-skeleton" style={{height:11,width:"38%",marginBottom:14,borderRadius:6}}/>
      <div className="vv-skeleton" style={{height:h1,width:"62%",marginBottom:10,borderRadius:8}}/>
      {Array.from({length:rows}).map((_,i)=>(
        <div key={i} className="vv-skeleton" style={{height:10,width:`${70-i*12}%`,marginBottom:8,borderRadius:6}}/>
      ))}
    </div>
  );
}
function useRefresh(onDone){
  const [refreshing,setRefreshing]=useState(false);
  const [pull,setPull]=useState(0);
  const startY=useRef(0);
  const cur=useRef(0);
  const busy=useRef(false);
  const doRef=useRef(null);
  function trigger(){
    if(busy.current)return;
    busy.current=true;
    setRefreshing(true);
    setPull(0);
    setTimeout(()=>{busy.current=false;setRefreshing(false);onDone?.();},1400);
  }
  doRef.current=trigger;
  useEffect(()=>{
    const ts=e=>{if(window.scrollY>10)return;startY.current=e.touches[0].clientY;};
    const tm=e=>{
      if(!startY.current)return;
      const d=e.touches[0].clientY-startY.current;
      if(d>0){cur.current=d;setPull(Math.min(1,d/72));}
    };
    const te=()=>{if(cur.current>62)doRef.current();else setPull(0);startY.current=0;cur.current=0;};
    window.addEventListener("touchstart",ts,{passive:true});
    window.addEventListener("touchmove",tm,{passive:true});
    window.addEventListener("touchend",te);
    return()=>{window.removeEventListener("touchstart",ts);window.removeEventListener("touchmove",tm);window.removeEventListener("touchend",te);};
  },[]);
  return{refreshing,pull,trigger};
}

function BirthdaysWidget({members}){
  const bdays=getUpcomingBirthdays(members,14);
  if(!bdays.length)return null;
  return(
    <Card style={{marginBottom:20,padding:"14px 18px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <Cake size={16} color={C.red}/><span style={{fontWeight:700,fontSize:14}}>Ditëlindjet e ardhshme</span>
        <span className="vv-chip" style={{background:"#FEE2E2",color:C.redStat,marginLeft:4}}>{bdays.length}</span>
      </div>
      <div style={{display:"grid",gap:8}}>
        {bdays.map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:10}}>
            <div className="vv-emblem" style={{width:30,height:30,fontSize:12}}>{m.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{m.name}</div>
              <div style={{fontSize:12,color:C.inkSoft}}>{m.bdayStr}</div>
            </div>
            <span className="vv-chip" style={{background:m.daysUntil===0?"#FEE2E2":m.daysUntil<=3?"#FEF3C7":"#F3F2EF",color:m.daysUntil===0?C.redStat:m.daysUntil<=3?"#92400E":C.inkSoft,fontSize:11}}>
              {m.daysUntil===0?"Sot! 🎂":`${m.daysUntil} ditë`}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

const seedMessages=[
  {id:1,from:5,to:"admin",text:"Mirëdita! Si mund ta paguaj kuotën me TWINT?",time:"10:24",date:"19.06.2026",read:true},
  {id:2,from:"admin",to:5,text:"Mirëdita Blerim! Shko tek Faturat → Paguaj → zgjidh TWINT.",time:"10:31",date:"19.06.2026",read:true},
  {id:3,from:5,to:"admin",text:"Faleminderit shumë! 👍",time:"10:35",date:"19.06.2026",read:true},
  {id:4,from:7,to:"admin",text:"A mund ta ndryshoj adresën time të emailit?",time:"15:42",date:"20.06.2026",read:false},
  {id:5,from:9,to:"admin",text:"Kur është mbledhja e radhës?",time:"09:15",date:"21.06.2026",read:false},
];
function ChatWidget({role,meId,members}){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState(seedMessages);
  const [text,setText]=useState("");
  const endRef=useRef(null);
  const unread=msgs.filter(m=>m.to==="admin"&&!m.read).length;
  const convMsgs=role==="member"
    ?msgs.filter(m=>(m.from===meId&&m.to==="admin")||(m.from==="admin"&&m.to===meId))
    :msgs;
  function send(){
    if(!text.trim())return;
    const newMsg={id:Date.now(),from:role==="admin"?"admin":meId,to:role==="admin"?meId:"admin",text:text.trim(),time:new Date().toLocaleTimeString("sq-AL",{hour:"2-digit",minute:"2-digit"}),date:"21.06.2026",read:false};
    setMsgs(p=>[...p,newMsg]);setText("");
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50);
  }
  function openChat(){
    setOpen(true);
    setMsgs(p=>p.map(m=>({...m,read:true})));
    setTimeout(()=>endRef.current?.scrollIntoView(),60);
  }
  return(
    <>
      <button className="vv-chat-btn" onClick={open?()=>setOpen(false):openChat} title="Mesazhet">
        <MessageSquare size={22}/>
        {!open&&unread>0&&<span style={{position:"absolute",top:4,right:4,background:"#fff",color:C.red,borderRadius:999,fontSize:10,fontWeight:900,width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>{unread}</span>}
      </button>
      {open&&(
        <div className="vv-chat-panel">
          <div style={{padding:"14px 16px 10px",borderBottom:"1px solid rgba(23,18,16,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontWeight:700,fontSize:14}}>{role==="admin"?"Mesazhet e anëtarëve":"Kontakto Administratorin"}</div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><X size={16}/></button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px",display:"flex",flexDirection:"column",gap:8,maxHeight:320}}>
            {convMsgs.map(m=>{
              const isMine=role==="admin"?m.from==="admin":m.from===meId;
              const sender=m.from==="admin"?"Egzont (Admin)":members.find(x=>x.id===m.from)?.name.split(" ")[0]||"Anëtar";
              return(
                <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:isMine?"flex-end":"flex-start",gap:2}}>
                  {role==="admin"&&!isMine&&<div style={{fontSize:10,color:C.inkSoft,marginLeft:4}}>{sender}</div>}
                  <div className={`vv-chat-msg ${isMine?"mine":"theirs"}`}>{m.text}</div>
                  <div style={{fontSize:10,color:C.inkSoft,opacity:.7,margin:"0 4px"}}>{m.time}</div>
                </div>
              );
            })}
            <div ref={endRef}/>
          </div>
          <div style={{padding:"10px 12px",borderTop:"1px solid rgba(23,18,16,.07)",display:"flex",gap:8}}>
            <input className="vv-input" style={{fontSize:13,height:36}} placeholder="Shkruaj mesazh…"
              value={text} onChange={e=>setText(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send()}/>
            <button className="vv-btn" style={{padding:"6px 12px",flexShrink:0}} onClick={send}><Send size={14}/></button>
          </div>
        </div>
      )}
    </>
  );
}

const seedNotifs=[
  {id:1,type:"payment",title:"Blerim Gashi — kuota pa paguar",body:"Anëtari nuk ka paguar kuotën 2026 (CHF 150)",time:"2 orë",read:false},
  {id:2,type:"event",title:"Mbledhja e radhës nesër",body:"27 qershor ora 18:00 · Salla e Komunitetit, Winterthur",time:"5 orë",read:false},
  {id:3,type:"member",title:"Anëtar i ri — Donjeta Bytyqi",body:"Aplikimi u pranua dhe anëtarja u aktivizua",time:"1 ditë",read:false},
  {id:4,type:"poll",title:"Sondazh i ri aktiv",body:"«A duhet tubim në Winterthur HB?» · afati 30.06.2026",time:"2 ditë",read:true},
  {id:5,type:"request",title:"Kërkesë nga Blerim Gashi",body:"«Si mund ta paguaj kuotën në dy këste?»",time:"3 ditë",read:true},
  {id:6,type:"payment",title:"Arta Krasniqi — pagesa e marrë",body:"CHF 150 paguar me transfertë bankare",time:"5 ditë",read:true},
];
const seedMemberNotifs=[
  {id:1,type:"payment",title:"Kuota 2026 — papaguar",body:"Pagesa jote e anëtarësisë CHF 150 pret konfirmim. Transfero te IBAN-i i pikës.",time:"tani",read:false},
  {id:2,type:"poll",title:"Sondazh aktiv — vota mungon",body:"«A duhet Pika të kontribuojë për aksionin humanitar?» · afati 25.07.2026",time:"1 ditë",read:false},
  {id:3,type:"event",title:"Event nesër — Mbledhja e Rregullt",body:"27 qershor ora 18:00 · Salla e Komunitetit, Winterthur",time:"5 orë",read:true},
  {id:4,type:"request",title:"Kërkesa jote pret përgjigje",body:"«Si mund ta paguaj kuotën në dy këste?» — pret përgjigje nga kryesia",time:"12 ditë",read:true},
];
const NOTIF_CFG={
  payment:{icon:<CreditCard size={15}/>,bg:"#FEE2E2",color:"#C8342B"},
  event:{icon:<Calendar size={15}/>,bg:"#EDE9FF",color:"#6B21A8"},
  member:{icon:<UserPlus size={15}/>,bg:"#E7F4ED",color:"#1E8A4C"},
  poll:{icon:<ClipboardList size={15}/>,bg:"#FEF3C7",color:"#92400E"},
  request:{icon:<MessageSquare size={15}/>,bg:"#F0F9FF",color:"#0369A1"},
};
function NotifPanel({notifs,onMarkAll,onRead}){
  const unread=notifs.filter(n=>!n.read).length;
  return(
    <div className="vv-notif-panel">
      <div style={{padding:"14px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(23,18,16,.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontWeight:700,fontSize:15}}>Njoftimet</span>
          {unread>0&&<span style={{background:C.red,color:"#fff",borderRadius:999,fontSize:11,fontWeight:700,padding:"2px 7px"}}>{unread}</span>}
        </div>
        {unread>0&&<button onClick={onMarkAll} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.red,fontWeight:600,padding:0}}>Shëno të gjitha ✓</button>}
      </div>
      <div style={{maxHeight:390,overflowY:"auto"}}>
        {notifs.map(n=>{
          const cfg=NOTIF_CFG[n.type]??NOTIF_CFG.request;
          return(
            <div key={n.id} className={`vv-notif-item${n.read?"":" unread"}`} onClick={()=>onRead(n.id)}>
              <div style={{width:34,height:34,borderRadius:10,background:cfg.bg,color:cfg.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{cfg.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:n.read?500:700,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.title}</div>
                <div style={{fontSize:12,color:C.inkSoft,lineHeight:1.4}}>{n.body}</div>
                <div style={{fontSize:11,color:C.inkSoft,marginTop:4,opacity:.65}}>{n.time} më parë</div>
              </div>
              {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:C.red,flexShrink:0,marginTop:5}}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Shell({role,tab,setTab,onLogout,children,adminTabs,memberTabs,dark,onToggleDark,lang,onLangToggle,members,events,announcements,meId}){
  const t=useT();
  const [sideOpen,setSideOpen]=useState(false);
  const [notifOpen,setNotifOpen]=useState(false);
  const [notifs,setNotifs]=useState(role==="member"?seedMemberNotifs:seedNotifs);
  const [syncedAt,setSyncedAt]=useState(new Date());
  const unreadCt=notifs.filter(n=>!n.read).length;
  const {refreshing,pull,trigger}=useRefresh(()=>setSyncedAt(new Date()));
  const online=useOnline();
  const tabs=role==="admin"?adminTabs:memberTabs;
  function navTo(key){setTab(key);setSideOpen(false);}
  function markAll(){setNotifs(prev=>prev.map(n=>({...n,read:true})));}
  function markRead(id){setNotifs(prev=>prev.map(n=>n.id===id?{...n,read:true}:n));}
  return(
    <div className="vv-shell">
      {(refreshing||pull>0.15)&&(
        <div className="vv-pull-bar" style={{transform:`translateY(${refreshing||pull>=1?0:-4}px)`}}>
          <RefreshCw size={15} className={refreshing?"vv-spin":""} color={C.red}/>
          <span style={{color:C.ink}}>{refreshing?"Duke sinkronizuar…":pull>=1?"Lësho për të rifreskuar":"Zvarrit poshtë…"}</span>
        </div>
      )}
      {sideOpen&&<div className="vv-mob-overlay" onClick={()=>setSideOpen(false)}/>}
      <aside className={`vv-side${sideOpen?" open":""}`}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",marginBottom:18}}>
          <div className="vv-emblem">VV</div>
          <div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,fontFamily:"'Archivo',sans-serif",color:"#fff"}}>VETËVENDOSJE!</div><div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Pika Winterthur</div></div>
          <button className="vv-hamburger" onClick={()=>setSideOpen(false)} style={{color:"rgba(255,255,255,.55)"}}><X size={18}/></button>
        </div>
        {tabs.map((tb,i)=>(
          <React.Fragment key={tb.key}>
            {tb.section&&<div className="vv-nav-section">{t(tb.section)}</div>}
            <button className={`vv-nav${tab===tb.key?" active":""}`} onClick={()=>navTo(tb.key)}>
              {tb.icon}{t(tb.label)}
            </button>
          </React.Fragment>
        ))}
        <div style={{marginTop:"auto",paddingTop:16}}>
          <button className="vv-nav" onClick={onLogout}><LogOut size={16}/>Dil</button>
        </div>
      </aside>
      <ChatWidget role={role} meId={meId} members={members}/>
      <div className="vv-main">
        {!online&&<div className="vv-offline"><AlertCircle size={14}/>Jeni offline — të dhënat mund të mos jenë aktuale</div>}
        <InstallBanner/>
        <header className="vv-top">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button className="vv-hamburger" onClick={()=>setSideOpen(true)} style={{color:C.ink}}><Menu size={21}/></button>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:16,color:C.ink}}>{t(tabs.find(tb=>tb.key===tab)?.label||"")}</div>
          </div>
          <GlobalSearch role={role} setTab={setTab} members={members} events={events} announcements={announcements}/>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:11,color:C.inkSoft,display:"flex",alignItems:"center",gap:4,opacity:.7}}>
              <span>{syncedAt.toLocaleTimeString("sq-AL",{hour:"2-digit",minute:"2-digit"})}</span>
            </div>
            <button onClick={trigger} className="vv-btn ghost" style={{padding:"7px 10px",borderRadius:10}} title="Rifresko" disabled={refreshing}>
              <RefreshCw size={14} className={refreshing?"vv-spin":""}/>
            </button>
            <button onClick={onLangToggle} className="vv-btn ghost" style={{padding:"6px 11px",fontSize:13,borderRadius:10,fontWeight:700,letterSpacing:".02em"}} title="Ndrysho gjuhën / Sprache wechseln">
              {lang==="sq"?"🇦🇱 SQ":"🇩🇪 DE"}
            </button>
            <button onClick={onToggleDark} className="vv-btn ghost" style={{padding:"7px 11px",fontSize:13,borderRadius:10}} title={dark?"Mënyrë e ndritshme":"Mënyrë e errët"}>
              {dark?"☀":"🌙"}
            </button>
            <div style={{position:"relative"}}>
              <button className="vv-btn ghost" style={{padding:"7px 11px",fontSize:13,borderRadius:10,position:"relative"}} onClick={()=>setNotifOpen(o=>!o)}>
                <Bell size={15}/>
                {unreadCt>0&&<span style={{position:"absolute",top:5,right:5,width:8,height:8,borderRadius:"50%",background:C.red,border:"2px solid #fff"}}/>}
              </button>
              {notifOpen&&(
                <>
                  <div style={{position:"fixed",inset:0,zIndex:49}} onClick={()=>setNotifOpen(false)}/>
                  <NotifPanel notifs={notifs} onMarkAll={markAll} onRead={markRead}/>
                </>
              )}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:9,background:"#fff",border:"1.5px solid rgba(23,18,16,.09)",borderRadius:12,padding:"6px 12px 6px 8px",boxShadow:"0 1px 4px rgba(23,18,16,.06)"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.red},#8C1009)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12}}>{role==="admin"?"E":"B"}</div>
              <div style={{lineHeight:1.2}}>
                <div style={{fontSize:13,fontWeight:600}}>{role==="admin"?"Egzont D.":"Blerim G."}</div>
                <div style={{fontSize:11,color:C.inkSoft}}>{role==="admin"?"Admin":"Anëtar"}</div>
              </div>
            </div>
          </div>
        </header>
        <div className="vv-content">
          {refreshing?(
            <div style={{animation:"fadeUp .2s ease"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:20}}>
                {[1,2,3,4].map(i=><SkeletonCard key={i}/>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
                <SkeletonCard rows={4} h1={14}/>
                <SkeletonCard rows={3} h1={14}/>
              </div>
            </div>
          ):children}
        </div>
      </div>
    </div>
  );
}


function MemberHome({me,events,announcements,polls}){
  const upcoming=events.filter(e=>!e.past&&e.rsvp.includes(me.id));
  const myRef=seedReferrals.find(r=>r.name===me.name)||{code:"WTH-XX",referred:0,names:[]};
  const hasVoted=polls&&polls.some(p=>p.voted.includes(me.id));
  const hasEvent=events.some(e=>e.rsvp.includes(me.id));
  const hasReferred=myRef.referred>0;
  const progressItems=[
    {label:"Profili i plotësuar",done:!!(me.phone&&me.email)},
    {label:"Kuota e paguar",done:me.pay==="paguar"},
    {label:"Regjistruar në event",done:hasEvent},
    {label:"Votuar në sondazh",done:hasVoted},
    {label:"Dhuruar donacion",done:false},
    {label:"Referuar një mik",done:hasReferred},
  ];
  const doneCount=progressItems.filter(p=>p.done).length;
  const waShare=`https://wa.me/?text=${encodeURIComponent(`Bashkoju Lëvizjes VETËVENDOSJE! Pika Winterthur 🦅\nRegjistrohu me kodin tim: ${myRef.code}\n👉 vv-winterthur.ch`)}`;
  return(
    <div>
      <SectionTitle title={`Mirëmëngjesi, ${me.name.split(" ")[0]}!`} sub="Lëvizja VETËVENDOSJE! — Pika Winterthur"/>
      <ElectionCountdown compact/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Statusi" value="Aktiv" color={C.green} icon={<CheckCircle2 size={28}/>}/>
        <StatCard label="Pagesa 2026" value={me.pay==="paguar"?"Paguar":"Papaguar"} color={me.pay==="paguar"?C.green:C.amber} icon={<CreditCard size={28}/>}/>
        <StatCard label="Eventet tim" value={upcoming.length} icon={<Calendar size={28}/>}/>
      </div>

      {/* Progress anëtari */}
      <div className="vv-card" style={{padding:"18px 20px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div style={{fontWeight:700,fontSize:14}}>Progresi im si anëtar</div>
          <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:18,color:doneCount===progressItems.length?C.green:C.ink}}>{doneCount}/{progressItems.length}</div>
        </div>
        <div style={{height:6,borderRadius:3,background:"rgba(23,18,16,.08)",marginBottom:14,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:3,background:doneCount===progressItems.length?C.green:C.red,width:`${(doneCount/progressItems.length)*100}%`,transition:"width .5s ease"}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 20px"}}>
          {progressItems.map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}>
              <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,background:p.done?"#E7F4ED":"#F3F2EF",border:`1.5px solid ${p.done?"#6EE7A0":"rgba(23,18,16,.15)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {p.done?<CheckCircle2 size={10} color={C.green}/>:<div style={{width:5,height:5,borderRadius:"50%",background:"#C0BDB8"}}/>}
              </div>
              <span style={{color:p.done?C.ink:C.inkSoft}}>{p.label}</span>
            </div>
          ))}
        </div>
        {doneCount===progressItems.length&&<div style={{marginTop:14,background:"linear-gradient(135deg,#E7F4ED,#C8EBD7)",borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:700,color:C.green,display:"flex",alignItems:"center",gap:8}}><Star size={14}/>Anëtar plotësisht aktiv — faleminderit për kontributin!</div>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{display:"grid",gap:20}}>
          <Card>
            <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Njoftimet e fundit</div>
            {announcements.slice(0,3).map(a=>(
              <div key={a.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.line}`}}>
                {a.pinned&&<span className="vv-chip" style={{background:C.red,color:"#fff",fontSize:11,marginBottom:6}}>Ngjitur</span>}
                <div style={{fontWeight:600,fontSize:14}}>{a.title}</div>
                <div style={{fontSize:13,color:C.inkSoft,marginTop:3}}>{a.body.slice(0,80)}…</div>
                <div style={{fontSize:12,color:C.inkSoft,marginTop:4}}>{a.date}</div>
              </div>
            ))}
          </Card>
          {/* Referimi */}
          <Card>
            <div style={{fontWeight:700,fontSize:15,marginBottom:14,display:"flex",alignItems:"center",gap:8}}><UserPlus size={16} color={C.red}/>Referimi im</div>
            <div style={{background:"#F8F7F3",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:C.inkSoft,marginBottom:4}}>Kodi im i referimit</div>
                <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:20,letterSpacing:".05em",color:C.ink}}>{myRef.code}</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:28,color:myRef.referred>0?C.green:C.inkSoft,lineHeight:1}}>{myRef.referred}</div>
                <div style={{fontSize:11,color:C.inkSoft}}>të referuar</div>
              </div>
            </div>
            {myRef.names.length>0&&<div style={{fontSize:12,color:C.inkSoft,marginBottom:12}}>Referuat: {myRef.names.join(", ")}</div>}
            <a href={waShare} target="_blank" rel="noreferrer" className="vv-btn" style={{display:"flex",justifyContent:"center",background:"#25D366",fontSize:13}}>
              <Globe size={14}/>Fto me WhatsApp
            </a>
          </Card>
        </div>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Eventet e ardhshme</div>
          {upcoming.length===0?<div style={{color:C.inkSoft,fontSize:13}}>Nuk jeni regjistruar në asnjë event.</div>:upcoming.slice(0,4).map(e=>(
            <div key={e.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
              <div style={{fontWeight:600,fontSize:13}}>{e.title}</div>
              <div style={{fontSize:12,color:C.inkSoft,marginTop:2}}>{e.date} · {e.time}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function MemberProfile({me}){
  return(
    <div>
      <SectionTitle title="Profili im"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:20}}>
        <Card style={{textAlign:"center"}}>
          <div className="vv-emblem lg" style={{margin:"0 auto 14px"}}>{me.name[0]}</div>
          <div style={{fontWeight:700,fontSize:16}}>{me.name}</div>
          <div style={{color:C.inkSoft,fontSize:13,marginTop:4}}>{me.role}</div>
          <div style={{marginTop:12}}>{statusChip(me.status)}</div>
          <div style={{marginTop:8}}>{payChip(me.pay)}</div>
          <div style={{marginTop:16,fontSize:12,color:C.inkSoft}}>Anëtar që nga {me.joined}</div>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Të dhënat personale</div>
          <div style={{display:"grid",gap:16}}>
            <Field icon={<Mail size={15}/>} label="Email" value={me.email}/>
            <Field icon={<Phone size={15}/>} label="Telefon" value={me.phone}/>
            <Field icon={<MapPin size={15}/>} label="Kantoni" value={me.kanton}/>
            <Field icon={<Building2 size={15}/>} label="Profesioni" value={me.prof}/>
            <Field icon={<Cake size={15}/>} label="Datëlindja" value={me.dob}/>
          </div>
          <button className="vv-btn ghost" style={{marginTop:20,fontSize:13}}><KeyRound size={14}/>Kërko ndryshim të dhënash</button>
        </Card>
      </div>
    </div>
  );
}

function PaymentModal({open,onClose,me,amount,onPaid}){
  const [method,setMethod]=useState("twint");
  const [done,setDone]=useState(false);
  const ref=`${me.name} 2026`;
  const iban="CH56 0483 5088 1234 1000 0";
  const methods=[
    {key:"twint",label:"TWINT",color:"#FF6900"},
    {key:"postfinance",label:"PostFinance Pay",color:"#FDBB00"},
    {key:"iban",label:"Transfertë bankare",color:C.inkSoft},
  ];
  function confirm(){setDone(true);setTimeout(()=>{onPaid();onClose();setDone(false);},1800);}
  return(
    <Modal open={open} onClose={onClose} title="Paguaj kuotën 2026" width={480}>
      {done?(
        <div style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"#E7F4ED",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle2 size={36} color={C.green}/></div>
          <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:22,marginBottom:8}}>Pagesa u konfirmua!</div>
          <div style={{color:C.inkSoft,fontSize:14}}>CHF {amount} — {ref}</div>
        </div>
      ):(
        <div style={{display:"grid",gap:16}}>
          <div style={{display:"flex",gap:8}}>
            {methods.map(m=>(
              <button key={m.key} onClick={()=>setMethod(m.key)}
                style={{flex:1,padding:"9px 6px",borderRadius:10,border:`2px solid ${method===m.key?m.color:"rgba(23,18,16,.10)"}`,background:method===m.key?m.color+"18":"#fff",fontWeight:700,fontSize:12,color:method===m.key?m.color:C.inkSoft,cursor:"pointer",transition:"all .15s",textAlign:"center"}}>
                {m.label}
              </button>
            ))}
          </div>

          {method==="twint"&&(
            <div style={{textAlign:"center"}}>
              <div style={{background:"#FF690018",borderRadius:16,padding:"28px 20px",marginBottom:12}}>
                <div style={{fontWeight:800,fontSize:18,color:"#FF6900",fontFamily:"'Archivo',sans-serif",marginBottom:16}}>TWINT</div>
                <div style={{background:"#fff",borderRadius:12,padding:16,display:"inline-block",boxShadow:"0 4px 20px rgba(0,0,0,.12)"}}>
                  <svg width="140" height="140" viewBox="0 0 7 7">
                    <rect width="7" height="7" fill="white"/>
                    {[[0,0],[1,0],[2,0],[4,0],[5,0],[6,0],[0,1],[2,1],[4,1],[6,1],[0,2],[1,2],[2,2],[4,2],[5,2],[6,2],
                      [0,3],[3,3],[6,3],[0,4],[1,4],[2,4],[4,4],[6,4],[0,5],[2,5],[3,5],[4,5],[6,5],[0,6],[1,6],[2,6],[4,6],[5,6],[6,6],[3,1],[3,2],[3,4],[3,5]]
                      .map(([x,y],i)=><rect key={i} x={x} y={y} width="1" height="1" fill="#111"/>)}
                  </svg>
                </div>
                <div style={{fontSize:13,color:"#FF6900",fontWeight:600,marginTop:14}}>Skano me aplikacionin TWINT</div>
                <div style={{fontSize:12,color:C.inkSoft,marginTop:4}}>CHF {amount} · {ref}</div>
              </div>
              <div style={{fontSize:12,color:C.inkSoft,marginBottom:12}}>Pas pagesës klikoni butonin më poshtë</div>
              <button className="vv-btn" style={{width:"100%",justifyContent:"center",background:"#FF6900",boxShadow:"0 4px 16px rgba(255,105,0,.30)"}} onClick={confirm}>
                <CheckCircle2 size={15}/>Konfirmo pagesën me TWINT
              </button>
            </div>
          )}

          {method==="postfinance"&&(
            <div style={{textAlign:"center"}}>
              <div style={{background:"#FDBB0018",borderRadius:16,padding:"28px 20px",marginBottom:12}}>
                <div style={{fontWeight:800,fontSize:28,color:"#C89800",fontFamily:"'Archivo',sans-serif",letterSpacing:"-1px"}}>Post<span style={{color:"#FDBB00"}}>Finance</span></div>
                <div style={{fontSize:13,color:C.inkSoft,marginTop:12,lineHeight:1.6}}>Pagesë nëpërmjet <b>PostFinance E-Finance</b><br/>ose <b>PostFinance App</b></div>
                <div style={{background:"#fff",borderRadius:10,padding:"14px",marginTop:16,textAlign:"left"}}>
                  <div style={{fontSize:11,color:C.inkSoft,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>Detajet e pagesës</div>
                  {[["IBAN",iban],["Përfituesi","VETËVENDOSJE! Pika Winterthur"],["Shuma",`CHF ${amount}`],["Referenca",ref]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"5px 0",borderBottom:`1px solid ${C.line}`}}>
                      <span style={{color:C.inkSoft}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="vv-btn" style={{width:"100%",justifyContent:"center",background:"#C89800",boxShadow:"0 4px 16px rgba(200,152,0,.25)"}} onClick={confirm}>
                <CheckCircle2 size={15}/>Konfirmo pagesën me PostFinance
              </button>
            </div>
          )}

          {method==="iban"&&(
            <div>
              <div style={{background:C.paper,borderRadius:14,padding:20,marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>Detajet e transfertës bankare</div>
                {[["Banka","PostFinance AG"],["IBAN",iban],["BIC/SWIFT","POFICHBEXXX"],["Përfituesi","VETËVENDOSJE! Winterthur"],["Shuma",`CHF ${amount}`],["Referenca / Mesazhi",ref]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.line}`}}>
                    <span style={{fontSize:12,color:C.inkSoft,fontWeight:600}}>{l}</span>
                    <span style={{fontSize:13,fontWeight:700,color:C.ink,fontFamily:l==="IBAN"||l==="BIC/SWIFT"?"monospace":"inherit"}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{fontSize:12,color:C.inkSoft,marginBottom:12,lineHeight:1.6}}>Pas transfertës (1–3 ditë pune), klikoni butonin për të njoftuar kryesinë.</div>
              <button className="vv-btn ghost" style={{width:"100%",justifyContent:"center"}} onClick={confirm}>
                <Send size={14}/>E kam bërë transfertën — njofto kryesinë
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function MemberInvoices({me}){
  const [payOpen,setPayOpen]=useState(false);
  const [paid2026,setPaid2026]=useState(me.pay==="paguar");
  const [toast,showToast]=useToast();
  const amount=me.reduced?75:me.exempt?0:150;
  const invoices=[
    {id:"F-2026-005",date:"01.01.2026",desc:"Kuota vjetore 2026",amount,status:paid2026?"paguar":"papaguar"},
    {id:"F-2025-005",date:"01.01.2025",desc:"Kuota vjetore 2025",amount:150,status:"paguar"},
    {id:"F-2024-005",date:"01.01.2024",desc:"Kuota vjetore 2024",amount:150,status:"paguar"},
  ];
  return(
    <div>
      <SectionTitle title="Faturat" sub="Historia e pagesave të anëtarësisë"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Kuota vjetore" value={`CHF ${amount}`} icon={<Banknote size={26}/>}/>
        <StatCard label="Pagesa 2026" value={paid2026?"Paguar":"Papaguar"} color={paid2026?C.green:C.amber}/>
        <StatCard label="Anëtar prej" value={me.joined} sub="Data e regjistrimit"/>
      </div>
      <Card p={0} style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th className="vv-th">Nr. Faturës</th><th className="vv-th">Data</th>
            <th className="vv-th">Përshkrimi</th><th className="vv-th">Shuma</th>
            <th className="vv-th">Statusi</th><th className="vv-th"></th>
          </tr></thead>
          <tbody>{invoices.map(inv=>(
            <tr className="vv-row" key={inv.id}>
              <td className="vv-td" style={{fontWeight:600,fontFamily:"monospace",fontSize:13}}>{inv.id}</td>
              <td className="vv-td" style={{color:C.inkSoft}}>{inv.date}</td>
              <td className="vv-td">{inv.desc}</td>
              <td className="vv-td" style={{fontWeight:700}}>CHF {inv.amount}</td>
              <td className="vv-td">{payChip(inv.status)}</td>
              <td className="vv-td">
                {inv.status==="papaguar"&&!me.exempt&&(
                  <button className="vv-btn" style={{fontSize:12,padding:"6px 14px"}} onClick={()=>setPayOpen(true)}>
                    Paguaj
                  </button>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </Card>

      {!paid2026&&!me.exempt&&(
        <div style={{marginTop:16,background:"linear-gradient(135deg,#FFF7ED,#FEF3C7)",border:"1.5px solid #FCD34D",borderRadius:14,padding:"18px 20px",display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:10,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <AlertCircle size={22} color="#92400E"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:"#92400E"}}>Kuota 2026 nuk është paguar</div>
            <div style={{fontSize:13,color:"#92400E",marginTop:3,opacity:.85}}>Paguaj online me TWINT, PostFinance ose transfertë bankare</div>
          </div>
          <button className="vv-btn" style={{background:"#92400E",boxShadow:"0 4px 14px rgba(146,64,14,.30)",whiteSpace:"nowrap"}} onClick={()=>setPayOpen(true)}>
            <CreditCard size={14}/>Paguaj tani
          </button>
        </div>
      )}

      <PaymentModal open={payOpen} onClose={()=>setPayOpen(false)} me={me} amount={amount}
        onPaid={()=>{setPaid2026(true);showToast("✓ Pagesa u regjistrua! Faleminderit!");}}/>
      <Toast msg={toast}/>
    </div>
  );
}

function MemberEvents({me,events,onRsvpChange}){
  const [toast,showToast]=useToast();
  function toggle(ev){
    const has=ev.rsvp.includes(me.id);
    onRsvpChange(ev.id,has?ev.rsvp.filter(x=>x!==me.id):[...ev.rsvp,me.id]);
    showToast(has?"U çregjistruat nga eventi.":"U regjistruat me sukses!");
  }
  return(
    <div>
      <SectionTitle title="Eventet" sub="Të gjitha ngjarjet e Pikës"/>
      <div style={{display:"grid",gap:14}}>
        {events.map(ev=>{
          const reg=ev.rsvp.includes(me.id);
          return(
            <Card key={ev.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
                    <span className="vv-chip" style={{background:C.paper,color:C.inkSoft,fontSize:11}}>{ev.type}</span>
                    {ev.public&&<span className="vv-chip" style={{background:"#EEF2FF",color:"#4338CA",fontSize:11}}>Publik</span>}
                    {ev.past&&<span className="vv-chip" style={{background:C.paper,color:C.inkSoft,fontSize:11}}>I kaluar</span>}
                  </div>
                  <div style={{fontWeight:700,fontSize:16}}>{ev.title}</div>
                  <div style={{display:"flex",gap:16,marginTop:8,flexWrap:"wrap"}}>
                    <Field icon={<Calendar size={14}/>} label="Data" value={`${ev.date} · ${ev.time}`}/>
                    <Field icon={<MapPin size={14}/>} label="Vendi" value={ev.place}/>
                    <Field icon={<Users size={14}/>} label="Regjistruar" value={`${ev.rsvp.length} / ${ev.max}`}/>
                  </div>
                </div>
                {!ev.past&&(
                  <button className={`vv-btn${reg?" ghost":""}`} onClick={()=>toggle(ev)}>
                    {reg?<><CalendarX size={15}/>Çregjistrohu</>:<><CalendarCheck size={15}/>Regjistrohu</>}
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      <Toast msg={toast}/>
    </div>
  );
}

function MemberNews({announcements,docs,news}){
  const [tab,setTab]=useState("njoftimet");
  return(
    <div>
      <SectionTitle title="Informacioni"/>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["njoftimet","Njoftimet"],["dokumentet","Dokumentet"],["lajmet","Lajmet nga QQ"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.line}`,background:tab===k?C.ink:"#fff",color:tab===k?"#fff":C.ink,fontWeight:600,fontSize:13}}>{l}</button>
        ))}
      </div>
      {tab==="njoftimet"&&<div style={{display:"grid",gap:12}}>{announcements.map(a=>(
        <Card key={a.id}>
          {a.pinned&&<span className="vv-chip" style={{background:C.red,color:"#fff",fontSize:11,display:"inline-flex",marginBottom:8}}>Ngjitur</span>}
          <div style={{fontWeight:700,fontSize:15}}>{a.title}</div>
          <div style={{color:C.inkSoft,fontSize:13,marginTop:6,lineHeight:1.5}}>{a.body}</div>
          <div style={{fontSize:12,color:C.inkSoft,marginTop:8}}>{a.date}</div>
        </Card>
      ))}</div>}
      {tab==="dokumentet"&&<Card p={0} style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Dokumenti</th><th className="vv-th">Tipi</th><th className="vv-th">Madhësia</th><th className="vv-th">Data</th><th className="vv-th"></th></tr></thead>
          <tbody>{docs.map(d=>(
            <tr className="vv-row" key={d.id}>
              <td className="vv-td" style={{fontWeight:600}}>{d.name}</td>
              <td className="vv-td"><span className="vv-chip" style={{background:C.paper}}>{d.type}</span></td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.size}</td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.date}</td>
              <td className="vv-td"><button className="vv-link"><Download size={13}/> Shkarko</button></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>}
      {tab==="lajmet"&&<div style={{display:"grid",gap:12}}>{news.map(n=>(
        <Card key={n.id} style={{display:"flex",gap:12,alignItems:"center"}}>
          <Newspaper size={20} color={C.red}/>
          <div><div style={{fontWeight:600,fontSize:14}}>{n.title}</div><div style={{fontSize:12,color:C.inkSoft,marginTop:3}}>{n.date}</div></div>
          <ChevronRight size={16} style={{marginLeft:"auto",color:C.inkSoft}}/>
        </Card>
      ))}</div>}
    </div>
  );
}

function MemberDonate({me}){
  const [donations,setDonations]=useState(seedDonations);
  const [amount,setAmount]=useState("");
  const [msg,setMsg]=useState("");
  const [toast,showToast]=useToast();
  const total=donations.reduce((s,d)=>s+d.amount,0);
  const pct=Math.min(100,Math.round(total/DONATION_TARGET*100));
  function donate(e){
    e.preventDefault();
    const amt=parseFloat(amount);
    if(!amt||amt<5){showToast("Shuma minimale është CHF 5");return;}
    setDonations(prev=>[{id:Date.now(),from:me.name,amount:amt,date:"21.06.2026",msg},...prev]);
    setAmount("");setMsg("");
    showToast(`Faleminderit! CHF ${amt} u regjistrua.`);
  }
  return(
    <div>
      <SectionTitle title="Dono" sub="Mbështetni veprimtarinë e Pikës"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <Card>
          <div className="vv-eyebrow" style={{marginBottom:8}}>Progresi i fushatës</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span className="vv-stat display" style={{color:C.red}}>CHF {total}</span>
            <span style={{color:C.inkSoft,fontSize:14}}>nga CHF {DONATION_TARGET}</span>
          </div>
          <div style={{background:C.paper,borderRadius:999,height:12,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",background:C.red,borderRadius:999,transition:"width .4s"}}/>
          </div>
          <div style={{fontSize:12,color:C.inkSoft,marginTop:6}}>{pct}% e arritur</div>
        </Card>
        <Card>
          <form onSubmit={donate} style={{display:"grid",gap:12}}>
            <div className="vv-eyebrow" style={{marginBottom:4}}>Bëj një dhuratë</div>
            <div style={{display:"flex",gap:8}}>{[10,20,50,100].map(v=>(
              <button key={v} type="button" onClick={()=>setAmount(String(v))} className={`vv-btn${amount==v?"":" ghost"}`} style={{flex:1,justifyContent:"center",fontSize:13,padding:"7px 0"}}>{v}</button>
            ))}</div>
            <input className="vv-input" type="number" min="5" step="5" placeholder="Shuma (CHF)" value={amount} onChange={e=>setAmount(e.target.value)}/>
            <input className="vv-input" placeholder="Mesazh (opsional)" value={msg} onChange={e=>setMsg(e.target.value)}/>
            <button className="vv-btn" type="submit" style={{justifyContent:"center"}}><Heart size={15}/>Dono tani</button>
          </form>
        </Card>
      </div>
      <Card p={0} style={{overflow:"hidden"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.line}`,fontWeight:700,fontSize:14}}>Donatorët e fundit</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Donatori</th><th className="vv-th">Shuma</th><th className="vv-th">Data</th><th className="vv-th">Mesazhi</th></tr></thead>
          <tbody>{donations.map(d=>(
            <tr className="vv-row" key={d.id}>
              <td className="vv-td" style={{fontWeight:600}}>{d.from}</td>
              <td className="vv-td"><b>CHF {d.amount}</b></td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.date}</td>
              <td className="vv-td" style={{color:C.inkSoft,fontSize:13}}>{d.msg||"—"}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      <Toast msg={toast}/>
    </div>
  );
}

function MemberPolls({me,polls,setPolls}){
  const [toast,showToast]=useToast();
  function vote(pid,choice){
    setPolls(prev=>prev.map(p=>{
      if(p.id!==pid)return p;
      if(p.voted.includes(me.id))return p;
      return{...p,[choice]:p[choice]+1,voted:[...p.voted,me.id]};
    }));
    showToast("Vota juaj u regjistrua!");
  }
  return(
    <div>
      <SectionTitle title="Sondazhet" sub="Votoni për vendimet e Pikës"/>
      <div style={{display:"grid",gap:16}}>
        {polls.map(p=>{
          const voted=p.voted.includes(me.id);
          const total=p.yes+p.no+p.abstain||1;
          const isLive=p.status==="aktiv";
          return(
            <Card key={p.id}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                <span className="vv-chip" style={{background:isLive?"#E7F4ED":"#F3F2EF",color:isLive?C.green:C.inkSoft}}>{isLive?"Aktiv":"Mbyllur"}</span>
                {isLive&&(
                  <span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#FEE2E2",padding:"3px 8px",borderRadius:999}}>
                    <span className="vv-live-dot"/>
                    <span style={{fontSize:11,fontWeight:700,color:C.redStat,letterSpacing:".06em"}}>LIVE</span>
                  </span>
                )}
                <span style={{fontSize:12,color:C.inkSoft,marginLeft:"auto"}}>Afati: {p.deadline}</span>
              </div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>{p.question}</div>
              {(voted||!isLive)?(
                <div style={{display:"grid",gap:10}}>
                  {[["Po",p.yes,"#E7F4ED",C.green],["Jo",p.no,"#FEE2E2",C.redStat],["Abstinoj",p.abstain,"#F3F2EF",C.inkSoft]].map(([l,v,bg,cl])=>(
                    <div key={l}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:13,fontWeight:600}}>{l}</span>
                        <span style={{fontSize:13,color:C.inkSoft,fontVariantNumeric:"tabular-nums"}}>{v} <span style={{opacity:.65}}>({Math.round(v/total*100)}%)</span></span>
                      </div>
                      <div style={{background:C.paper,borderRadius:999,height:9,overflow:"hidden"}}>
                        <div className="vv-bar-fill" style={{width:`${v/total*100}%`,height:"100%",background:cl,borderRadius:999}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{fontSize:12,color:C.inkSoft,marginTop:2,display:"flex",alignItems:"center",gap:6}}>
                    {voted&&<><CheckCircle2 size={12} style={{color:C.green}}/><span>Keni votuar ·</span></>}
                    <span style={{fontVariantNumeric:"tabular-nums"}}>{total} vota gjithsej</span>
                    {isLive&&<span className="vv-live-dot" style={{marginLeft:4}}/>}
                  </div>
                </div>
              ):(
                <div style={{display:"flex",gap:8}}>
                  <button className="vv-btn" style={{flex:1,justifyContent:"center",background:C.green}} onClick={()=>vote(p.id,"yes")}><ThumbsUp size={14}/>Po</button>
                  <button className="vv-btn" style={{flex:1,justifyContent:"center",background:C.redStat}} onClick={()=>vote(p.id,"no")}><ThumbsDown size={14}/>Jo</button>
                  <button className="vv-btn ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>vote(p.id,"abstain")}>Abstinoj</button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      <Toast msg={toast}/>
    </div>
  );
}

function printMemberCard(me){
  const year=new Date().getFullYear();
  const id=`WTH-${String(me.id).padStart(3,"0")}`;
  const html=`<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Kartela — ${me.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#f0efec;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:20px;padding:32px}
h1{font-family:'Archivo',sans-serif;font-size:15px;color:#5A524E;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
p{font-size:13px;color:#9A938F;margin-bottom:24px}
.cards{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
.card{width:340px;height:215px;border-radius:18px;padding:24px;position:relative;overflow:hidden;color:#fff;print-color-adjust:exact;-webkit-print-color-adjust:exact}
.front{background:linear-gradient(135deg,#E2231A 0%,#8B0F0A 100%);box-shadow:0 12px 40px rgba(226,35,26,.35)}
.front::before{content:"";position:absolute;right:-20px;top:-20px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.07)}
.front::after{content:"";position:absolute;right:10px;bottom:-50px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.05)}
.back{background:linear-gradient(135deg,#1C1410,#0E0B08);box-shadow:0 12px 40px rgba(0,0,0,.35)}
.logo{font-family:'Archivo',sans-serif;font-weight:900;font-size:16px;letter-spacing:-.5px;position:relative}
.sub{font-size:10px;opacity:.65;text-align:right;line-height:1.4;position:relative}
.row{display:flex;justify-content:space-between;align-items:flex-start}
.name-label{font-size:11px;opacity:.65;margin-bottom:4px;margin-top:26px;letter-spacing:.04em}
.name{font-family:'Archivo',sans-serif;font-size:22px;font-weight:800;letter-spacing:-.5px;position:relative}
.role{font-size:12px;opacity:.78;margin-top:5px;position:relative}
.footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto;position:relative;padding-top:16px}
.valid-label{font-size:9px;opacity:.55;letter-spacing:.05em}
.valid-val{font-size:13px;font-weight:700;margin-top:2px}
.id-box{background:rgba(255,255,255,.14);border-radius:7px;padding:5px 11px;text-align:center}
.id-label{font-size:9px;opacity:.6;letter-spacing:.05em}
.id-val{font-size:13px;font-weight:700;margin-top:2px}
.mag{background:rgba(255,255,255,.07);height:36px;margin:-24px -24px 18px;display:flex;align-items:center;padding-left:18px}
.stripe{width:180px;height:7px;background:rgba(0,0,0,.55);border-radius:3px}
.info-row{display:flex;gap:0;margin-bottom:16px}
.info-item{flex:1}
.info-lbl{font-size:9px;opacity:.45;letter-spacing:.05em;margin-bottom:3px}
.info-val{font-size:13px;font-weight:700}
.qr-box{background:rgba(255,255,255,.08);border-radius:10px;padding:12px;text-align:center}
.qr-grid{display:grid;grid-template-columns:repeat(7,10px);grid-template-rows:repeat(7,10px);gap:1px;width:fit-content;margin:0 auto 6px}
.qr-cell{width:10px;height:10px;border-radius:1px}
.qr-dark{background:rgba(255,255,255,.7)}
.qr-light{background:transparent}
.qr-lbl{font-size:9px;opacity:.4;letter-spacing:.05em}
.url{font-size:9px;opacity:.35;text-align:center;margin-top:10px;letter-spacing:.03em}
.btn{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#E2231A,#B5170F);color:#fff;border:none;border-radius:10px;padding:10px 20px;font-family:'Inter',sans-serif;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(226,35,26,.35);margin-top:8px}
@media print{body{background:white;padding:16px}h1,p,.btn{display:none}.cards{gap:16px}}
</style></head><body>
<h1>Kartela e Anëtarësisë — VETËVENDOSJE!</h1>
<p>Klikoni "Printo / Ruaj si PDF" për ta shkarkuar</p>
<div class="cards">
  <div class="card front">
    <div class="row"><div class="logo">VETËVENDOSJE!</div><div class="sub">Pika Winterthur<br>Zvicër</div></div>
    <div style="position:relative">
      <div class="name-label">ANËTAR</div>
      <div class="name">${me.name}</div>
      <div class="role">${me.role}</div>
    </div>
    <div class="footer">
      <div><div class="valid-label">VLEFSHMËRIA</div><div class="valid-val">31.12.${year}</div></div>
      <div class="id-box"><div class="id-label">ID</div><div class="id-val">${id}</div></div>
    </div>
  </div>
  <div class="card back">
    <div class="mag"><div class="stripe"></div></div>
    <div class="info-row">
      <div class="info-item"><div class="info-lbl">KANTONI</div><div class="info-val">${me.kanton}</div></div>
      <div class="info-item"><div class="info-lbl">ANËTAR QË NGA</div><div class="info-val">${me.joined}</div></div>
    </div>
    <div class="qr-box">
      <div class="qr-grid">${[1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1].map(v=>`<div class="qr-cell ${v?"qr-dark":"qr-light"}"></div>`).join("")}</div>
      <div class="qr-lbl">KOD QR PËR VERIFIKIM · ${id}</div>
    </div>
    <div class="url">lëvizjavetëvendosje.org</div>
  </div>
</div>
<button class="btn" onclick="window.print()">🖨 Printo / Ruaj si PDF</button>
</body></html>`;
  const w=window.open("","_blank","width=820,height=620");
  w.document.write(html);
  w.document.close();
}

function MemberCard({me}){
  const [flipped,setFlipped]=useState(false);
  const [toast,showToast]=useToast();
  const year=new Date().getFullYear();
  const cardStyle={
    width:"100%",maxWidth:420,borderRadius:20,padding:"28px 28px 24px",
    fontFamily:"'Archivo',sans-serif",position:"relative",overflow:"hidden",cursor:"pointer",
    userSelect:"none",
  };
  return(
    <div>
      <SectionTitle title="Karta digjitale" sub="Kartela juaj e anëtarësisë VETËVENDOSJE!"/>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
        <div onClick={()=>setFlipped(f=>!f)} title="Klik për të kthyer kartën">
          {!flipped?(
            <div style={{...cardStyle,background:"linear-gradient(135deg,#E2231A 0%,#8B0F0A 100%)",color:"#fff",minHeight:220,boxShadow:"0 16px 48px rgba(226,35,26,.30)"}}>
              <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
              <div style={{position:"absolute",right:20,bottom:-40,width:220,height:220,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
                <div style={{fontWeight:900,fontSize:18,letterSpacing:"-0.5px"}}>VETËVENDOSJE!</div>
                <div style={{fontSize:11,opacity:.7,textAlign:"right"}}>Pika Winterthur<br/>Zvicër</div>
              </div>
              <div style={{marginTop:28,position:"relative"}}>
                <div style={{fontSize:13,opacity:.7,marginBottom:4,fontFamily:"'Inter',sans-serif"}}>ANËTAR</div>
                <div style={{fontSize:24,fontWeight:800,letterSpacing:"-0.5px"}}>{me.name}</div>
                <div style={{fontSize:13,opacity:.8,marginTop:6,fontFamily:"'Inter',sans-serif"}}>{me.role}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:24,position:"relative"}}>
                <div>
                  <div style={{fontSize:10,opacity:.6,fontFamily:"'Inter',sans-serif"}}>VLEFSHMËRIA</div>
                  <div style={{fontSize:14,fontWeight:700}}>31.12.{year}</div>
                </div>
                <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"6px 12px"}}>
                  <div style={{fontSize:10,opacity:.7,fontFamily:"'Inter',sans-serif"}}>ID</div>
                  <div style={{fontSize:14,fontWeight:700}}>WTH-{String(me.id).padStart(3,"0")}</div>
                </div>
              </div>
            </div>
          ):(
            <div style={{...cardStyle,background:C.ink,color:"#fff",minHeight:220,boxShadow:"0 16px 48px rgba(0,0,0,.28)"}}>
              <div style={{background:"rgba(255,255,255,0.06)",height:44,margin:"-28px -28px 20px",display:"flex",alignItems:"center",paddingLeft:20}}>
                <div style={{width:200,height:8,background:"rgba(0,0,0,0.6)",borderRadius:4}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,opacity:.5,fontFamily:"'Inter',sans-serif",marginBottom:4}}>KANTONI</div>
                  <div style={{fontSize:14,fontWeight:700}}>{me.kanton}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,opacity:.5,fontFamily:"'Inter',sans-serif",marginBottom:4}}>ANËTAR QË NGA</div>
                  <div style={{fontSize:14,fontWeight:700}}>{me.joined}</div>
                </div>
              </div>
              <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px",textAlign:"center"}}>
                <div style={{display:"inline-block",borderRadius:8,overflow:"hidden",border:"3px solid rgba(255,255,255,.15)"}}>
                  <MemberQR id={me.id} size={100} bg="#171210" fg="rgba(255,255,255,0.88)"/>
                </div>
                <div style={{fontSize:10,opacity:.45,marginTop:8,fontFamily:"'Inter',sans-serif",letterSpacing:".06em"}}>WTH-{String(me.id).padStart(3,"0")} · KODI QR</div>
              </div>
              <div style={{fontSize:11,opacity:.4,textAlign:"center",marginTop:12,fontFamily:"'Inter',sans-serif"}}>lëvizjavetëvendosje.org</div>
            </div>
          )}
        </div>
        <div style={{textAlign:"center",color:C.inkSoft,fontSize:13}}>Klikoni kartën për të parë anën tjetër</div>
        <div style={{display:"flex",gap:10}}>
          <button className="vv-btn" style={{fontSize:13}} onClick={()=>printMemberCard(me)}><Download size={14}/>Shkarko / Printo PDF</button>
          <WaBtn text={`Kartela ime e anëtarësisë VETËVENDOSJE! Pika Winterthur\n👤 ${me.name}\n🆔 WTH-${String(me.id).padStart(3,"0")}\n📍 ${me.kanton}`} label="Ndaj WhatsApp" style={{fontSize:13,padding:"9px 16px",borderRadius:10}}/>
        </div>
        <Card style={{maxWidth:420,width:"100%"}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Detajet e anëtarësisë</div>
          <div style={{display:"grid",gap:10}}>
            <Field icon={<BadgeCheck size={15}/>} label="Statusi" value="Aktiv"/>
            <Field icon={<CreditCard size={15}/>} label="Pagesa 2026" value={me.pay==="paguar"?"CHF 150 — Paguar":"Papaguar"}/>
            <Field icon={<MapPin size={15}/>} label="Kantoni" value={me.kanton}/>
            <Field icon={<Calendar size={15}/>} label="Vlefshmëria" value={`01.01.${year} – 31.12.${year}`}/>
          </div>
        </Card>
      </div>
    </div>
  );
}


function memberQRMatrix(memberId){
  const N=21;
  let seed=(Math.abs(memberId)*2654435761+1013904223)>>>0;
  const rand=()=>{seed=Math.imul(seed,1664525)+1013904223>>>0;return seed/4294967296;};
  const m=Array.from({length:N},()=>Array.from({length:N},()=>rand()>0.5?1:0));
  const finder=(row,col)=>{
    for(let i=0;i<7;i++)for(let j=0;j<7;j++){
      if(row+i>=N||col+j>=N)return;
      m[row+i][col+j]=(i===0||i===6||j===0||j===6||(i>=2&&i<=4&&j>=2&&j<=4))?1:0;
    }
    for(let k=0;k<=7;k++){if(row+7<N&&col+k<N)m[row+7][col+k]=0;if(row+k<N&&col+7<N)m[row+k][col+7]=0;}
  };
  finder(0,0);finder(0,N-7);finder(N-7,0);
  for(let i=8;i<N-8;i++){m[6][i]=i%2===0?1:0;m[i][6]=i%2===0?1:0;}
  return m;
}
function MemberQR({id,size=128,bg="#fff",fg="#171210"}){
  const m=useMemo(()=>memberQRMatrix(id),[id]);
  const N=m.length,cell=size/N;
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill={bg} rx={4}/>
      {m.flatMap((row,r)=>row.map((v,c)=>v
        ?<rect key={`${r}-${c}`} x={c*cell+.3} y={r*cell+.3} width={cell-.6} height={cell-.6} fill={fg} rx={cell*.12}/>
        :null).filter(Boolean))}
    </svg>
  );
}

function useCountdown(target){
  const calc=()=>{
    const diff=Math.max(0,target-Date.now());
    return{days:Math.floor(diff/864e5),hours:Math.floor(diff/36e5)%24,minutes:Math.floor(diff/6e4)%60,seconds:Math.floor(diff/1e3)%60,done:diff<=0};
  };
  const [v,setV]=useState(calc);
  useEffect(()=>{const id=setInterval(()=>setV(calc()),1000);return()=>clearInterval(id);},[]);
  return v;
}

function ElectionCountdown({compact=false}){
  const {days,hours,minutes,seconds,done}=useCountdown(ELECTION_DATE);
  const start=new Date("2026-01-01").getTime();
  const end=ELECTION_DATE.getTime();
  const pct=Math.min(100,Math.round((Date.now()-start)/(end-start)*100));
  if(done) return(
    <div className="vv-card-accent" style={{padding:20,marginBottom:20,textAlign:"center"}}>
      <div style={{fontSize:22,fontWeight:800,fontFamily:"'Archivo',sans-serif"}}>🗳️ Zgjedhjet kanë filluar!</div>
    </div>
  );
  const units=compact
    ?[["Ditë",days],["Orë",hours],["Min",minutes],["Sek",seconds]]
    :[["Ditë",days],["Orë",hours],["Minuta",minutes],["Sekonda",seconds]];
  return(
    <div className="vv-card-accent" style={{padding:compact?16:24,marginBottom:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:-20,top:-30,fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:160,lineHeight:1,color:"rgba(255,255,255,.06)",pointerEvents:"none",userSelect:"none"}}>4.10</div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:compact?10:14}}>
        <span style={{fontSize:compact?11:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",opacity:.75}}>🗳 Zgjedhjet parlamentare · Kosovë</span>
      </div>
      {!compact&&<div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:20,marginBottom:14,letterSpacing:"-0.5px"}}>4 Tetor 2026 — Voto nga Zvicra!</div>}
      <div style={{display:"grid",gridTemplateColumns:`repeat(4,1fr)`,gap:compact?8:12,marginBottom:compact?10:16}}>
        {units.map(([l,v])=>(
          <div key={l} style={{textAlign:"center",background:"rgba(255,255,255,.15)",borderRadius:compact?10:14,padding:compact?"10px 4px":"16px 8px",backdropFilter:"blur(4px)"}}>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:compact?26:38,lineHeight:1,letterSpacing:"-1px"}}>{String(v).padStart(2,"0")}</div>
            <div style={{fontSize:10,opacity:.72,marginTop:4,textTransform:"uppercase",letterSpacing:".08em"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:compact?0:12}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,opacity:.72,marginBottom:5}}>
          <span>Jan 2026</span><span style={{fontWeight:600}}>{pct}% e rrugës</span><span>4 Tet 2026</span>
        </div>
        <div style={{background:"rgba(255,255,255,.18)",borderRadius:999,height:5,overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:"rgba(255,255,255,.85)",borderRadius:999,transition:"width 1s"}}/>
        </div>
      </div>
      {!compact&&(
        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <WaBtn text={MOBILIZATION_TEMPLATE} label="Mobilizo anëtarët" style={{flex:1,justifyContent:"center",minWidth:160}}/>
          <a href="https://evz.rks-gov.net" target="_blank" rel="noopener noreferrer"
            style={{flex:1,minWidth:140,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,background:"rgba(255,255,255,.18)",color:"#fff",borderRadius:10,padding:"9px 16px",fontWeight:600,fontSize:14,textDecoration:"none",border:"1.5px solid rgba(255,255,255,.35)"}}>
            <Globe size={14}/>Regjistrohu të votosh
          </a>
        </div>
      )}
    </div>
  );
}

function generateReport(members,events){
  const now=new Date();
  const dateStr=now.toLocaleDateString("sq-AL",{day:"2-digit",month:"long",year:"numeric"});
  const paid=members.filter(m=>m.pay==="paguar");
  const unpaid=members.filter(m=>m.pay==="papaguar"&&!m.exempt);
  const exempt=members.filter(m=>m.exempt);
  const active=members.filter(m=>m.status==="aktiv");
  const collected=paid.length*KUOTA;
  const finTotal=FINANCE_MONTHS.reduce((s,m)=>s+m.collected,0);
  const upcoming=events.filter(e=>!e.past);
  const memberRows=members.map(m=>`
    <tr>
      <td>${m.name}</td><td>${m.role}</td><td>${m.kanton}</td>
      <td>${m.status==="aktiv"?"✓ Aktiv":"Joaktiv"}</td>
      <td style="color:${m.exempt?"#4338CA":m.pay==="paguar"?"#1E8A4C":"#B97A10"};font-weight:600">
        ${m.exempt?"Liruar":m.pay==="paguar"?"Paguar ✓":"Papaguar"}
      </td>
      <td>${m.joined}</td>
    </tr>`).join("");
  const eventRows=upcoming.map(e=>`
    <tr><td>${e.title}</td><td>${e.date} · ${e.time}</td><td>${e.place}</td><td>${e.rsvp.length}/${e.max}</td></tr>`).join("");
  const finRows=FINANCE_MONTHS.map(m=>`
    <tr><td>${m.m} 2026</td><td>CHF ${m.collected}</td>
    <td><div style="background:#eee;border-radius:4px;height:8px"><div style="background:#1E8A4C;height:8px;border-radius:4px;width:${Math.round(m.collected/Math.max(...FINANCE_MONTHS.map(x=>x.collected),1)*100)}%"></div></div></td></tr>`).join("");
  const html=`<!DOCTYPE html><html lang="sq"><head><meta charset="utf-8">
<title>Raport Mujor — VV Pika Winterthur</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#f3f2ef;color:#171210;padding:32px;font-size:14px}
.header{background:linear-gradient(135deg,#E2231A,#8C1009);color:#fff;border-radius:18px;padding:32px 36px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start;print-color-adjust:exact;-webkit-print-color-adjust:exact}
.logo{font-family:'Archivo',sans-serif;font-weight:900;font-size:28px;letter-spacing:-1px}
.subtitle{opacity:.8;font-size:14px;margin-top:4px}
.meta{text-align:right;opacity:.85;font-size:13px;line-height:1.6}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.stat{background:#fff;border-radius:14px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.stat-val{font-family:'Archivo',sans-serif;font-weight:800;font-size:28px;margin:4px 0}
.stat-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#6E6460}
.stat-sub{font-size:12px;color:#9A938F;margin-top:2px}
.section{background:#fff;border-radius:14px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.section h2{font-family:'Archivo',sans-serif;font-weight:800;font-size:17px;margin-bottom:16px;color:#171210}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#6E6460;font-weight:700;padding:8px 12px;border-bottom:1px solid #e8e6e2;background:#fafaf7}
td{padding:10px 12px;border-bottom:1px solid #f0ede8;font-size:13px}
tr:last-child td{border-bottom:none}
.print-btn{position:fixed;bottom:24px;right:24px;background:linear-gradient(135deg,#E2231A,#C01C14);color:#fff;border:none;border-radius:12px;padding:12px 22px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(226,35,26,.35);font-family:'Inter',sans-serif}
.footer{text-align:center;color:#9A938F;font-size:12px;margin-top:24px}
@media print{.print-btn{display:none}body{padding:16px}@page{margin:1.5cm}}
</style></head><body>
<div class="header">
  <div><div class="logo">VETËVENDOSJE!</div><div class="subtitle">Lëvizja — Pika Winterthur, Zvicër</div></div>
  <div class="meta"><b>Raport Mujor</b><br>${dateStr}<br>Gjeneruar nga sistemi</div>
</div>
<div class="stats">
  <div class="stat"><div class="stat-lbl">Anëtarë gjithsej</div><div class="stat-val" style="color:#E2231A">${members.length}</div><div class="stat-sub">${active.length} aktivë</div></div>
  <div class="stat"><div class="stat-lbl">Kanë paguar</div><div class="stat-val" style="color:#1E8A4C">${paid.length}</div><div class="stat-sub">${unpaid.length} papaguar</div></div>
  <div class="stat"><div class="stat-lbl">Arkëtuar 2026</div><div class="stat-val" style="color:#1E8A4C">CHF ${collected}</div><div class="stat-sub">Target CHF ${FINANCE_TARGET_YEAR}</div></div>
  <div class="stat"><div class="stat-lbl">Evente aktive</div><div class="stat-val">${upcoming.length}</div><div class="stat-sub">Në planifikim</div></div>
</div>
<div class="section"><h2>Lista e anëtarëve</h2>
<table><thead><tr><th>Emri</th><th>Roli</th><th>Kantoni</th><th>Statusi</th><th>Pagesa</th><th>Anëtar që nga</th></tr></thead>
<tbody>${memberRows}</tbody></table></div>
<div class="section"><h2>Eventet e ardhshme (${upcoming.length})</h2>
<table><thead><tr><th>Titulli</th><th>Data</th><th>Vendi</th><th>Regjistruar</th></tr></thead>
<tbody>${eventRows||"<tr><td colspan='4' style='color:#9A938F;padding:20px;text-align:center'>Nuk ka evente të planifikuara</td></tr>"}</tbody></table></div>
<div class="section"><h2>Arkëtimet mujore 2026</h2>
<table><thead><tr><th>Muaji</th><th>Arkëtuar</th><th>Progresi</th></tr></thead>
<tbody>${finRows}</tbody></table>
<div style="margin-top:14px;font-size:13px;color:#5A524E">Gjithsej arkëtuar YTD: <b>CHF ${finTotal}</b> nga target <b>CHF ${FINANCE_TARGET_YEAR}</b> (${Math.round(finTotal/FINANCE_TARGET_YEAR*100)}%)</div>
</div>
<div class="footer">Raport i gjeneruar automatikisht nga Platforma Digjitale e Pikës Winterthur · VETËVENDOSJE! · ${dateStr}</div>
<button class="print-btn" onclick="window.print()">🖨 Printo / Ruaj si PDF</button>
</body></html>`;
  const w=window.open("","_blank","width=960,height=820");
  w.document.write(html);
  w.document.close();
}

function AdminHome({members,events}){
  const paid=members.filter(m=>m.pay==="paguar").length;
  const unpaid=members.filter(m=>m.pay==="papaguar").length;
  const active=members.filter(m=>m.status==="aktiv").length;
  const upcoming=events.filter(e=>!e.past);
  return(
    <div>
      <SectionTitle title="Paneli kryesor" sub={`Pika Winterthur · ${new Date().toLocaleDateString("sq-AL")}`} action={
        <button className="vv-btn ghost" onClick={()=>generateReport(members,events)}>
          <FileDown size={15}/>Gjenero Raport PDF
        </button>
      }/>
      <ElectionCountdown/>
      <BirthdaysWidget members={members}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Anëtarë total" value={members.length} color={C.red} icon={<Users size={28}/>} delay={0}/>
        <StatCard label="Anëtarë aktivë" value={active} color={C.green} icon={<CheckCircle2 size={28}/>} delay={80}/>
        <StatCard label="Kuota paguar" value={paid} color={C.green} icon={<CreditCard size={28}/>} sub={`${unpaid} papaguar`} delay={160}/>
        <StatCard label="Eventet e ardhshme" value={upcoming.length} icon={<Calendar size={28}/>} delay={240}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Progresi i kuotave 2026</div>
          <div style={{fontSize:13,color:C.inkSoft,marginBottom:14}}>CHF {paid*KUOTA} nga CHF {members.filter(m=>!m.exempt).length*KUOTA} target</div>
          <div style={{background:C.paper,borderRadius:999,height:14,overflow:"hidden",marginBottom:8}}>
            <div style={{width:`${paid/members.filter(m=>!m.exempt).length*100}%`,height:"100%",background:C.green,borderRadius:999}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
            <span style={{color:C.green,fontWeight:600}}>{paid} paguan</span>
            <span style={{color:C.amber,fontWeight:600}}>{unpaid} papaguar</span>
            <span style={{color:C.inkSoft}}>{members.filter(m=>m.exempt).length} liruar</span>
          </div>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Log aktiviteti</div>
          {seedLog.map(l=>(
            <div key={l.id} style={{padding:"9px 0",borderBottom:`1px solid ${C.line}`,fontSize:13}}>
              <div style={{fontWeight:600,color:C.ink}}>{l.who}</div>
              <div style={{color:C.inkSoft,marginTop:2}}>{l.action}</div>
              <div style={{fontSize:11,color:C.inkSoft,marginTop:2}}>{l.date}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function AdminMembers({members,setMembers,events=[],polls=[]}){
  const [search,setSearch]=useState("");
  const [filterPay,setFilterPay]=useState("");
  const [filterStatus,setFilterStatus]=useState("");
  const [sel,setSel]=useState(null);
  const [addOpen,setAddOpen]=useState(false);
  const [newM,setNewM]=useState({name:"",email:"",phone:"",kanton:"Zürich",prof:"",role:"Anëtar",dob:""});
  const [toast,showToast]=useToast();
  const filtered=useMemo(()=>members.filter(m=>{
    if(search&&!m.name.toLowerCase().includes(search.toLowerCase())&&!m.email.toLowerCase().includes(search.toLowerCase()))return false;
    if(filterPay&&m.pay!==filterPay)return false;
    if(filterStatus&&m.status!==filterStatus)return false;
    return true;
  }),[members,search,filterPay,filterStatus]);
  function togglePay(id){
    const m=members.find(x=>x.id===id);
    const prev=m?.pay;
    setMembers(p=>p.map(x=>x.id===id?{...x,pay:x.pay==="paguar"?"papaguar":"paguar"}:x));
    showToast(`Pagesa e ${m?.name} u ndryshua!`,()=>setMembers(p=>p.map(x=>x.id===id?{...x,pay:prev}:x)));
  }
  function addMember(e){
    e.preventDefault();
    if(!newM.name||!newM.email){showToast("Plotëso emrin dhe emailin");return;}
    const nm={...newM,id:Date.now(),status:"aktiv",pay:"papaguar",joined:new Date().toLocaleDateString("de-CH")};
    setMembers(prev=>[...prev,nm]);
    setAddOpen(false);
    setNewM({name:"",email:"",phone:"",kanton:"Zürich",prof:"",role:"Anëtar",dob:""});
    showToast(`${nm.name} u shtua!`);
  }
  return(
    <div>
      <SectionTitle title="Anëtarët" sub={`${members.length} anëtarë gjithsej`} action={
        <div style={{display:"flex",gap:8}}>
          <button className="vv-btn ghost" onClick={()=>exportCSV(members.map(m=>({
            "Emri":m.name,"Email":m.email,"Telefon":m.phone||"","Roli":m.role,
            "Kantoni":m.kanton,"Statusi":m.status,"Pagesa":m.pay,
            "Profesioni":m.prof||"","Anëtar që nga":m.joined,
          })),"anetaret-vv-winterthur.csv")}>
            <Download size={14}/>CSV
          </button>
          <button className="vv-btn" onClick={()=>setAddOpen(true)}><Plus size={15}/>Shto anëtar</button>
        </div>
      }/>
      <Card style={{marginBottom:16,display:"flex",gap:10,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.inkSoft}}/>
          <input className="vv-input" style={{paddingLeft:32}} placeholder="Kërko anëtar…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="vv-input" style={{width:150}} value={filterPay} onChange={e=>setFilterPay(e.target.value)}>
          <option value="">Të gjitha pagesat</option><option value="paguar">Paguar</option><option value="papaguar">Papaguar</option><option value="liruar">Liruar</option>
        </select>
        <select className="vv-input" style={{width:150}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">Të gjitha statuset</option><option value="aktiv">Aktiv</option><option value="joaktiv">Joaktiv</option>
        </select>
      </Card>
      <Card p={0} style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            <th className="vv-th">Emri</th><th className="vv-th">Roli</th><th className="vv-th">Kantoni</th>
            <th className="vv-th">Statusi</th><th className="vv-th">Pagesa</th><th className="vv-th">Veprimi</th>
          </tr></thead>
          <tbody>{filtered.map(m=>(
            <tr className="vv-row" key={m.id} style={{cursor:"pointer"}} onClick={()=>setSel(m)}>
              <td className="vv-td"><div style={{fontWeight:600}}>{m.name}</div><div style={{fontSize:12,color:C.inkSoft}}>{m.email}</div></td>
              <td className="vv-td" style={{color:C.inkSoft,fontSize:13}}>{m.role}</td>
              <td className="vv-td" style={{color:C.inkSoft}}>{m.kanton}</td>
              <td className="vv-td">{statusChip(m.status)}</td>
              <td className="vv-td">{payChip(m.pay)}</td>
              <td className="vv-td" onClick={e=>e.stopPropagation()}>
                {!m.exempt&&<button className="vv-link" onClick={()=>togglePay(m.id)}>{m.pay==="paguar"?"Shëno papaguar":"Shëno paguar"}</button>}
              </td>
            </tr>
          ))}
          {filtered.length===0&&<tr><td colSpan={6} className="vv-td" style={{textAlign:"center",color:C.inkSoft,padding:32}}>Nuk u gjet asnjë anëtar.</td></tr>}
          </tbody>
        </table>
      </Card>
      <Modal open={!!sel} onClose={()=>setSel(null)} title="Detajet e anëtarit">
        {sel&&<div style={{display:"grid",gap:14}}>
          <div style={{textAlign:"center",paddingBottom:16,borderBottom:`1px solid ${C.line}`}}>
            <div className="vv-emblem lg" style={{margin:"0 auto 10px"}}>{sel.name[0]}</div>
            <div style={{fontWeight:700,fontSize:18}}>{sel.name}</div>
            <div style={{color:C.inkSoft,fontSize:14}}>{sel.role}</div>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10}}>{statusChip(sel.status)}{payChip(sel.pay)}</div>
          </div>
          <Field icon={<Mail size={15}/>} label="Email" value={sel.email}/>
          <Field icon={<Phone size={15}/>} label="Telefon" value={sel.phone}/>
          <Field icon={<MapPin size={15}/>} label="Kantoni" value={sel.kanton}/>
          <Field icon={<Building2 size={15}/>} label="Profesioni" value={sel.prof}/>
          <Field icon={<Calendar size={15}/>} label="Anëtar që nga" value={sel.joined}/>
          <div style={{paddingTop:12,borderTop:`1px solid ${C.line}`,marginTop:4}}>
            <div style={{fontSize:11,fontWeight:700,color:C.inkSoft,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>Statistika</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[["Evente",events.filter(e=>e.rsvp?.includes(sel.id)).length,Calendar],["Sondazhe",polls.filter(p=>p.voted?.includes(sel.id)).length,ClipboardList],["Rol",sel.role==="Anëtar"||sel.role==="Anëtare"?"Anëtar":"Kryesi",ShieldCheck]].map(([l,v,Icon])=>(
                <div key={l} style={{background:C.paper,borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
                  <Icon size={16} color={C.inkSoft} style={{marginBottom:4}}/>
                  <div style={{fontWeight:800,fontSize:18,fontFamily:"'Archivo'"}}>{v}</div>
                  <div style={{fontSize:10,color:C.inkSoft,fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>}
      </Modal>
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Shto anëtar të ri">
        <form onSubmit={addMember} style={{display:"grid",gap:12}}>
          {[["Emri dhe mbiemri *","name"],["Email *","email"],["Telefon","phone"],["Profesioni","prof"],["Datëlindja","dob"]].map(([lbl,k])=>(
            <div key={k}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>{lbl}</label>
            <input className="vv-input" placeholder={lbl.replace(" *","")} value={newM[k]} onChange={e=>setNewM(f=>({...f,[k]:e.target.value}))}/></div>
          ))}
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Kantoni</label>
          <select className="vv-input" value={newM.kanton} onChange={e=>setNewM(f=>({...f,kanton:e.target.value}))}>
            {["Zürich","Aargau","Thurgau","St. Gallen","Schaffhausen","Bern"].map(k=><option key={k}>{k}</option>)}
          </select></div>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Roli</label>
          <select className="vv-input" value={newM.role} onChange={e=>setNewM(f=>({...f,role:e.target.value}))}>
            {["Anëtar","Anëtare","Simpatizant","Vullnetar","Kryetar","Nënkryetar","Sekretar"].map(r=><option key={r}>{r}</option>)}
          </select></div>
          <button type="submit" className="vv-btn" style={{justifyContent:"center",marginTop:4}}><UserPlus size={15}/>Shto anëtarin</button>
        </form>
      </Modal>
      <Toast msg={toast}/>
    </div>
  );
}

function AdminPayments({members,setMembers}){
  const [toast,showToast]=useToast();
  const paid=members.filter(m=>m.pay==="paguar");
  const unpaid=members.filter(m=>m.pay==="papaguar"&&!m.exempt);
  const exempt=members.filter(m=>m.exempt);
  const total=paid.length*KUOTA;
  function togglePay(id){setMembers(prev=>prev.map(m=>m.id===id?{...m,pay:m.pay==="paguar"?"papaguar":"paguar"}:m));showToast("Pagesa u ndryshua!");}
  return(
    <div>
      <SectionTitle title="Pagesat" sub="Menaxhimi i kuotave të anëtarësisë 2026" action={
        <button className="vv-btn ghost" onClick={()=>exportCSV(members.map(m=>({
          "Emri":m.name,"Email":m.email,"Kantoni":m.kanton,
          "Statusi pagesës":m.exempt?"Liruar":m.pay==="paguar"?"Paguar":"Papaguar",
          "Shuma CHF":m.exempt?0:m.pay==="paguar"?KUOTA:0,
          "Anëtar që nga":m.joined,
        })),"pagesat-2026-vv-winterthur.csv")}>
          <Download size={14}/>Eksporto CSV
        </button>
      }/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Të arkëtuara" value={`CHF ${total}`} color={C.green} icon={<Banknote size={26}/>}/>
        <StatCard label="Kanë paguar" value={paid.length} color={C.green} icon={<CheckCircle2 size={26}/>}/>
        <StatCard label="Nuk kanë paguar" value={unpaid.length} color={C.amber} icon={<Clock size={26}/>}/>
        <StatCard label="Të liruar" value={exempt.length} icon={<ShieldCheck size={26}/>}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {unpaid.length>0&&<Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14,color:C.amber}}>Kanë kuotë të papaguar ({unpaid.length})</div>
          {unpaid.map(m=>(
            <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
              <div><div style={{fontWeight:600,fontSize:14}}>{m.name}</div><div style={{fontSize:12,color:C.inkSoft}}>{m.email}</div></div>
              <button className="vv-btn" style={{fontSize:12,padding:"6px 12px"}} onClick={()=>togglePay(m.id)}><CheckCircle2 size={13}/>Shëno paguar</button>
            </div>
          ))}
        </Card>}
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14,color:C.green}}>Kanë paguar ({paid.length})</div>
          {paid.map(m=>(
            <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
              <div><div style={{fontWeight:600,fontSize:14}}>{m.name}</div><div style={{fontSize:12,color:C.inkSoft}}>CHF {KUOTA}</div></div>
              <button className="vv-link" onClick={()=>togglePay(m.id)}>Anullo</button>
            </div>
          ))}
        </Card>
      </div>
      <Toast msg={toast}/>
    </div>
  );
}


function AdminEvents({events,setEvents,members}){
  const [addOpen,setAddOpen]=useState(false);
  const [selEv,setSelEv]=useState(null);
  const [toast,showToast]=useToast();
  const [form,setForm]=useState({title:"",date:"",time:"18:00",place:"",type:"Mbledhje",public:false,max:60});
  function setF(k,v){setForm(f=>({...f,[k]:v}));}
  function addEvent(e){
    e.preventDefault();
    if(!form.title||!form.date){showToast("Plotëso titullin dhe datën");return;}
    setEvents(prev=>[...prev,{...form,id:Date.now(),rsvp:[],past:false}]);
    setAddOpen(false);
    setForm({title:"",date:"",time:"18:00",place:"",type:"Mbledhje",public:false,max:60});
    showToast("Eventi u krijua!");
  }
  return(
    <div>
      <SectionTitle title="Eventet" sub={`${events.length} evente gjithsej`} action={
        <button className="vv-btn" onClick={()=>setAddOpen(true)}><Plus size={15}/>Krijo event</button>
      }/>
      <div style={{display:"grid",gap:14}}>
        {events.map(ev=>(
          <Card key={ev.id} style={{cursor:"pointer"}} onClick={()=>setSelEv(ev)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <span className="vv-chip" style={{background:C.paper,color:C.inkSoft,fontSize:11}}>{ev.type}</span>
                  {ev.public&&<span className="vv-chip" style={{background:"#EEF2FF",color:"#4338CA",fontSize:11}}>Publik</span>}
                  {ev.past&&<span className="vv-chip" style={{background:C.paper,color:C.inkSoft,fontSize:11}}>I kaluar</span>}
                </div>
                <div style={{fontWeight:700,fontSize:16}}>{ev.title}</div>
                <div style={{display:"flex",gap:20,marginTop:8,flexWrap:"wrap"}}>
                  <Field icon={<Calendar size={14}/>} label="Data" value={`${ev.date} · ${ev.time}`}/>
                  <Field icon={<MapPin size={14}/>} label="Vendi" value={ev.place}/>
                  <Field icon={<Users size={14}/>} label="Regjistruar" value={`${ev.rsvp.length} / ${ev.max}`}/>
                </div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                <button className="vv-btn ghost" style={{padding:"7px 10px",fontSize:12,borderRadius:8}} onClick={()=>shareEventCard(ev)} title="Gjenero kartë sociale">
                  <ImageIcon size={14}/>
                </button>
                <WaBtn
                  text={`📅 ${ev.title}\n🕐 ${ev.date} · ${ev.time}\n📍 ${ev.place}\n\nRegjistrohu: kontakto kryesinë e Pikës Winterthur`}
                  label=""
                  style={{padding:"7px 10px",fontSize:13,borderRadius:8}}
                />
                <ChevronRight size={18} color={C.inkSoft}/>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Krijo event të ri">
        <form onSubmit={addEvent} style={{display:"grid",gap:12}}>
          {[["Titulli *","title"],["Data *","date"],["Ora","time"],["Vendi","place"]].map(([lbl,k])=>(
            <div key={k}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>{lbl}</label>
            <input className="vv-input" placeholder={lbl.replace(" *","")} value={form[k]} onChange={e=>setF(k,e.target.value)}/></div>
          ))}
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Tipi</label>
          <select className="vv-input" value={form.type} onChange={e=>setF("type",e.target.value)}>
            {["Mbledhje","Manifestim","Aktivitet","Trajnim","Tjetër"].map(t=><option key={t}>{t}</option>)}
          </select></div>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Kapaciteti maksimal</label>
          <input className="vv-input" type="number" min="1" value={form.max} onChange={e=>setF("max",+e.target.value)}/></div>
          <label style={{display:"flex",gap:10,alignItems:"center",fontSize:14,cursor:"pointer"}}>
            <input type="checkbox" checked={form.public} onChange={e=>setF("public",e.target.checked)}/>
            Event publik (i dukshëm për të gjithë)
          </label>
          <button type="submit" className="vv-btn" style={{justifyContent:"center",marginTop:4}}><Plus size={15}/>Krijo eventin</button>
        </form>
      </Modal>
      {selEv&&<Modal open={!!selEv} onClose={()=>setSelEv(null)} title={selEv.title} width={600}>
        <div style={{display:"grid",gap:14}}>
          <div style={{display:"flex",gap:8}}>
            <span className="vv-chip" style={{background:C.paper,color:C.inkSoft}}>{selEv.type}</span>
            {selEv.public&&<span className="vv-chip" style={{background:"#EEF2FF",color:"#4338CA"}}>Publik</span>}
          </div>
          <Field icon={<Calendar size={15}/>} label="Data dhe ora" value={`${selEv.date} · ${selEv.time}`}/>
          <Field icon={<MapPin size={15}/>} label="Vendi" value={selEv.place}/>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:C.inkSoft,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Të regjistruar ({selEv.rsvp.length}/{selEv.max})</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {selEv.rsvp.map(rid=>{const m=members.find(x=>x.id===rid);return m?<span key={rid} className="vv-chip" style={{background:C.paper}}>{m.name}</span>:null;})}
              {selEv.rsvp.length===0&&<span style={{color:C.inkSoft,fontSize:13}}>Asnjë i regjistruar.</span>}
            </div>
          </div>
        </div>
      </Modal>}
      <Toast msg={toast}/>
    </div>
  );
}

function AdminComms({members,announcements,setAnnouncements}){
  const [tab,setTab]=useState("njoftimet");
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({title:"",body:"",pinned:false});
  const [emailDraft,setEmailDraft]=useState({subject:"",body:""});
  const [sent,setSent]=useState(false);
  const [toast,showToast]=useToast();
  function addAnnouncement(e){
    e.preventDefault();
    if(!form.title||!form.body){showToast("Plotëso titullin dhe tekstin");return;}
    const today=new Date().toLocaleDateString("de-CH");
    setAnnouncements(prev=>[{...form,id:Date.now(),date:today},...prev]);
    setOpen(false);setForm({title:"",body:"",pinned:false});
    showToast("Njoftimi u publikua!");
  }
  function sendEmail(e){
    e.preventDefault();
    if(!emailDraft.subject||!emailDraft.body){showToast("Plotëso subjektin dhe mesazhin");return;}
    setSent(true);showToast(`Email u dërgua tek ${members.filter(m=>m.status==="aktiv").length} anëtarë!`);
    setTimeout(()=>setSent(false),4000);
  }
  return(
    <div>
      <SectionTitle title="Komunikimi"/>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["njoftimet","Njoftimet"],["email","Email anëtarëve"],["dokumentet","Dokumentet"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.line}`,background:tab===k?C.ink:"#fff",color:tab===k?"#fff":C.ink,fontWeight:600,fontSize:13}}>{l}</button>
        ))}
      </div>
      {tab==="njoftimet"&&<div>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
          <button className="vv-btn" onClick={()=>setOpen(true)}><Plus size={15}/>Publiko njoftim</button>
        </div>
        <div style={{display:"grid",gap:12}}>
          {announcements.map(a=>(
            <Card key={a.id} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                {a.pinned&&<span className="vv-chip" style={{background:C.red,color:"#fff",fontSize:11,display:"inline-flex",marginBottom:6}}>Ngjitur</span>}
                <div style={{fontWeight:700,fontSize:15}}>{a.title}</div>
                <div style={{color:C.inkSoft,fontSize:13,marginTop:4,lineHeight:1.5}}>{a.body}</div>
                <div style={{fontSize:12,color:C.inkSoft,marginTop:6}}>{a.date}</div>
              </div>
              <WaBtn text={`🔔 ${a.title}\n\n${a.body}\n\n— Lëvizja VETËVENDOSJE! Pika Winterthur`} label="Ndaj" style={{fontSize:12,padding:"6px 12px",borderRadius:8,whiteSpace:"nowrap"}}/>
            </Card>
          ))}
        </div>
        <Modal open={open} onClose={()=>setOpen(false)} title="Publiko njoftim">
          <form onSubmit={addAnnouncement} style={{display:"grid",gap:12}}>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Titulli *</label>
            <input className="vv-input" placeholder="Titulli i njoftimit" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Teksti *</label>
            <textarea className="vv-input" rows={4} placeholder="Teksti i njoftimit…" value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} style={{resize:"vertical"}}/></div>
            <label style={{display:"flex",gap:10,alignItems:"center",fontSize:14,cursor:"pointer"}}>
              <input type="checkbox" checked={form.pinned} onChange={e=>setForm(f=>({...f,pinned:e.target.checked}))}/>
              Ngjit njoftimin (shfaq në krye)
            </label>
            <button type="submit" className="vv-btn" style={{justifyContent:"center"}}><Megaphone size={15}/>Publiko</button>
          </form>
        </Modal>
      </div>}
      {tab==="email"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Dërgoni email tek anëtarët</div>
          <form onSubmit={sendEmail} style={{display:"grid",gap:12}}>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Destinatarët</label>
            <select className="vv-input"><option>Të gjithë anëtarët aktivë ({members.filter(m=>m.status==="aktiv").length})</option><option>Vetëm anëtarët me kuotë të papaguar</option><option>Vetëm kryesia</option></select></div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Subjekti</label>
            <input className="vv-input" placeholder="Subjekti i emailit" value={emailDraft.subject} onChange={e=>setEmailDraft(d=>({...d,subject:e.target.value}))}/></div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Mesazhi</label>
            <textarea className="vv-input" rows={6} placeholder="Teksti i emailit…" value={emailDraft.body} onChange={e=>setEmailDraft(d=>({...d,body:e.target.value}))} style={{resize:"vertical"}}/></div>
            <button type="submit" className="vv-btn" style={{justifyContent:"center"}} disabled={sent}>
              <Send size={15}/>{sent?"U dërgua!":"Dërgo emailin"}
            </button>
          </form>
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Pamja paraprake</div>
            <div style={{background:C.paper,borderRadius:10,padding:16}}>
              <div style={{fontWeight:600,fontSize:14,marginBottom:6}}>{emailDraft.subject||"(pa subjekt)"}</div>
              <div style={{fontSize:13,color:C.inkSoft,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{emailDraft.body||"(pa tekst)"}</div>
              <div style={{marginTop:16,paddingTop:12,borderTop:`1px solid ${C.line}`,fontSize:12,color:C.inkSoft}}>
                — Lëvizja VETËVENDOSJE! Pika Winterthur
              </div>
            </div>
          </Card>
          <Card style={{border:"1.5px solid #25D36630",background:"#F0FFF5"}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><WaIcon/></div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"#166534"}}>Dërgoje edhe si mesazh WhatsApp</div>
                <div style={{fontSize:13,color:"#166534",opacity:.8,marginTop:3,marginBottom:12}}>Hap WhatsApp dhe ngjit mesazhin te grupi i Pikës</div>
                <WaBtn
                  text={emailDraft.body?`${emailDraft.subject}\n\n${emailDraft.body}\n\n— VETËVENDOSJE! Pika Winterthur`:"Plotëso mesazhin fillimisht…"}
                  label="Hap në WhatsApp"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>}
      {tab==="dokumentet"&&<Card p={0} style={{overflow:"hidden"}}>
        <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.line}`}}>
          <div style={{fontWeight:700}}>Dokumentet e Pikës</div>
          <button className="vv-btn" style={{fontSize:13,padding:"7px 14px"}}><Plus size={14}/>Ngarko</button>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Emri</th><th className="vv-th">Tipi</th><th className="vv-th">Madhësia</th><th className="vv-th">Data</th><th className="vv-th"></th></tr></thead>
          <tbody>{seedDocs.map(d=>(
            <tr className="vv-row" key={d.id}>
              <td className="vv-td" style={{fontWeight:600}}><FileText size={14} style={{marginRight:8,color:C.inkSoft}}/>{d.name}</td>
              <td className="vv-td"><span className="vv-chip" style={{background:C.paper}}>{d.type}</span></td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.size}</td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.date}</td>
              <td className="vv-td"><button className="vv-link"><Download size={13}/> Shkarko</button></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>}
      <Toast msg={toast}/>
    </div>
  );
}

function AdminSettings({members}){
  const [org,setOrg]=useState({name:"Lëvizja VETËVENDOSJE!",pike:"Pika Winterthur",city:"Winterthur",canton:"Zürich",email:"winterthur@vetevendosje.org",phone:"+41 79 111 22 33",kuota:KUOTA});
  const [toast,showToast]=useToast();
  function save(e){e.preventDefault();showToast("Cilësimet u ruajtën!");}
  return(
    <div>
      <SectionTitle title="Cilësimet"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Të dhënat e organizatës</div>
          <form onSubmit={save} style={{display:"grid",gap:12}}>
            {[["Emri i lëvizjes","name"],["Emri i pikës","pike"],["Qyteti","city"],["Kantoni","canton"],["Email kontakti","email"],["Telefon","phone"]].map(([lbl,k])=>(
              <div key={k}><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>{lbl}</label>
              <input className="vv-input" value={org[k]} onChange={e=>setOrg(o=>({...o,[k]:e.target.value}))}/></div>
            ))}
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Kuota vjetore (CHF)</label>
            <input className="vv-input" type="number" value={org.kuota} onChange={e=>setOrg(o=>({...o,kuota:+e.target.value}))}/></div>
            <button type="submit" className="vv-btn" style={{justifyContent:"center",marginTop:4}}>Ruaj cilësimet</button>
          </form>
        </Card>
        <div style={{display:"grid",gap:16,alignContent:"start"}}>
          <Card>
            <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Statistikat e sistemit</div>
            <div style={{display:"grid",gap:10}}>
              <Field icon={<Users size={15}/>} label="Total anëtarë" value={members.length}/>
              <Field icon={<CheckCircle2 size={15}/>} label="Anëtarë aktivë" value={members.filter(m=>m.status==="aktiv").length}/>
              <Field icon={<CreditCard size={15}/>} label="Kanë paguar" value={members.filter(m=>m.pay==="paguar").length}/>
              <Field icon={<Activity size={15}/>} label="Versioni" value="v1.4.0 — Demo"/>
            </div>
          </Card>
          <Card>
            <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Eksporto të dhënat</div>
            <div style={{display:"grid",gap:8}}>
              <button className="vv-btn ghost" style={{justifyContent:"center"}}><Download size={14}/>Lista e anëtarëve (CSV)</button>
              <button className="vv-btn ghost" style={{justifyContent:"center"}}><FileDown size={14}/>Raporti i pagesave (PDF)</button>
              <button className="vv-btn ghost" style={{justifyContent:"center"}}><HardDriveDownload size={14}/>Backup i plotë (JSON)</button>
            </div>
          </Card>
        </div>
      </div>
      <Toast msg={toast}/>
    </div>
  );
}


function AdminElections({members}){
  const [voteStatuses,setVoteStatuses]=useState(INITIAL_VOTE_STATUSES);
  const [tab,setTab]=useState("mobilizimi");
  const [emailOpen,setEmailOpen]=useState(false);
  const [emailText,setEmailText]=useState(MOBILIZATION_TEMPLATE);
  const [toast,showToast]=useToast();
  const [countdown,setCountdown]=useState({d:0,h:0,m:0,s:0});
  useEffect(()=>{
    const tick=()=>{
      const diff=ELECTION_DATE-new Date();
      if(diff<=0){setCountdown({d:0,h:0,m:0,s:0});return;}
      const d=Math.floor(diff/86400000),rem=diff%86400000;
      const h=Math.floor(rem/3600000),rem2=rem%3600000;
      const m=Math.floor(rem2/60000),s=Math.floor((rem2%60000)/1000);
      setCountdown({d,h,m,s});
    };
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[]);
  function changeStatus(id,st){setVoteStatuses(prev=>({...prev,[id]:st}));showToast("Statusi u ndryshua!");}
  const counts=Object.fromEntries(Object.entries(VOTE_STATUS_CONFIG).map(([k])=>[k,Object.values(voteStatuses).filter(v=>v===k).length]));
  return(
    <div>
      <SectionTitle title="Zgjedhjet" sub="Zgjedhjet parlamentare të Kosovës — 4 tetor 2026"/>
      <div style={{background:"linear-gradient(135deg,#E2231A,#8B0F0A)",borderRadius:16,padding:"24px 28px",color:"#fff",marginBottom:24}}>
        <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:28}}>
          {countdown.d}d {countdown.h}h {countdown.m}m {countdown.s}s
        </div>
        <div style={{opacity:.8,marginTop:4}}>deri në hapjen e qendrave të votimit · 4 tetor 2026</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {Object.entries(VOTE_STATUS_CONFIG).map(([k,cfg])=>(
          <Card key={k}><div className="vv-eyebrow" style={{marginBottom:6}}>{cfg.label}</div>
          <div className="vv-stat display" style={{color:cfg.color==="rgba(23,18,16,0.10)"?C.ink:cfg.color}}>{counts[k]||0}</div></Card>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["mobilizimi","Mobilizimi"],["vullnetaret","Vullnetarët"],["materialet","Materialet"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.line}`,background:tab===k?C.ink:"#fff",color:tab===k?"#fff":C.ink,fontWeight:600,fontSize:13}}>{l}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <WaBtn text={MOBILIZATION_TEMPLATE} label="WhatsApp grup" style={{fontSize:13,padding:"8px 14px"}}/>
          <button className="vv-btn" onClick={()=>setEmailOpen(true)}><Send size={14}/>Email mobilizimi</button>
        </div>
      </div>
      {tab==="mobilizimi"&&<Card p={0} style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Anëtari</th><th className="vv-th">Kantoni</th><th className="vv-th">Statusi</th><th className="vv-th">Ndrysho</th></tr></thead>
          <tbody>{members.map(m=>{
            const st=voteStatuses[m.id]||"pa_kontaktuar";
            const cfg=VOTE_STATUS_CONFIG[st];
            return(
              <tr className="vv-row" key={m.id}>
                <td className="vv-td"><div style={{fontWeight:600}}>{m.name}</div><div style={{fontSize:12,color:C.inkSoft}}>{m.email}</div></td>
                <td className="vv-td" style={{color:C.inkSoft}}>{m.kanton}</td>
                <td className="vv-td"><span className="vv-chip" style={{background:cfg.bg,color:cfg.color}}>{cfg.label}</span></td>
                <td className="vv-td">
                  <select value={st} onChange={e=>changeStatus(m.id,e.target.value)} style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:`1px solid ${C.line}`,background:"#fff",cursor:"pointer"}}>
                    {Object.entries(VOTE_STATUS_CONFIG).map(([k,c])=><option key={k} value={k}>{c.label}</option>)}
                  </select>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </Card>}
      {tab==="vullnetaret"&&<Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Vullnetarët e fushatës</div>
        <div style={{display:"grid",gap:10}}>
          {ELECTION_VOLUNTEERS.map((v,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:v.confirmed?C.green:C.paper,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {v.confirmed?<CheckCircle2 size={16} color="#fff"/>:<Clock size={16} color={C.inkSoft}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>{v.name}</div>
                <div style={{fontSize:12,color:C.inkSoft}}>{v.zone} · {v.task}</div>
              </div>
              <span className="vv-chip" style={{background:v.confirmed?"#E7F4ED":"#FEF3C7",color:v.confirmed?C.green:"#92400E"}}>
                {v.confirmed?"Konfirmuar":"Pret"}
              </span>
            </div>
          ))}
        </div>
      </Card>}
      {tab==="materialet"&&<Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Materialet e fushatës</div>
        <div style={{display:"grid",gap:10}}>
          {ELECTION_MATERIALS.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
              <div style={{width:36,height:36,borderRadius:8,background:C.paper,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {m.type==="PDF"?<FileText size={18} color={C.red}/>:m.type==="PNG"?<ImageIcon size={18} color="#4338CA"/>:<FileText size={18} color={C.inkSoft}/>}
              </div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{m.name}</div><div style={{fontSize:12,color:C.inkSoft}}>{m.type} · {m.size}</div></div>
              <button className="vv-btn ghost" style={{fontSize:12,padding:"6px 12px"}}><Download size={13}/>Shkarko</button>
            </div>
          ))}
        </div>
      </Card>}
      <Modal open={emailOpen} onClose={()=>setEmailOpen(false)} title="Email mobilizimi" width={600}>
        <div style={{display:"grid",gap:14}}>
          <textarea className="vv-input" rows={12} value={emailText} onChange={e=>setEmailText(e.target.value)} style={{resize:"vertical",fontFamily:"monospace",fontSize:13}}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button className="vv-btn ghost" onClick={()=>setEmailOpen(false)}>Anulo</button>
            <button className="vv-btn" onClick={()=>{setEmailOpen(false);showToast(`Email mobilizimi u dërgua tek ${members.length} anëtarë!`);}}><Send size={14}/>Dërgo tek të gjithë</button>
          </div>
        </div>
      </Modal>
      <Toast msg={toast}/>
    </div>
  );
}

function AdminRequests(){
  const [requests,setRequests]=useState(seedRequests);
  const [open,setOpen]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [filter,setFilter]=useState("");
  const [toast,showToast]=useToast();
  const detail=requests.find(r=>r.id===open);
  const filtered=filter?requests.filter(r=>r.status===filter):requests;
  function sendReply(e){
    e.preventDefault();
    setRequests(prev=>prev.map(r=>r.id===open?{...r,status:"u_pergjigj",reply:replyText}:r));
    setOpen(null);setReplyText("");showToast("✓ Përgjigjja u dërgua!");
  }
  function closeReq(id){setRequests(prev=>prev.map(r=>r.id===id?{...r,status:"mbyllur"}:r));setOpen(null);showToast("Kërkesa u mbyll.");}
  return(
    <div>
      <SectionTitle title="Kërkesat" sub={`${requests.filter(r=>r.status==="pret").length} presin përgjigje`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Gjithsej" value={requests.length} icon={<MessageSquare size={24}/>}/>
        <StatCard label="Presin" value={requests.filter(r=>r.status==="pret").length} color={C.amber} icon={<Clock size={24}/>}/>
        <StatCard label="U përgjigj" value={requests.filter(r=>r.status==="u_pergjigj").length} color={C.green} icon={<CheckCircle2 size={24}/>}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["","Të gjitha"],["pret","Presin"],["u_pergjigj","U përgjigj"],["mbyllur","Mbyllur"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${C.line}`,background:filter===k?C.ink:"#fff",color:filter===k?"#fff":C.inkSoft,fontWeight:600,fontSize:13}}>{l}</button>
        ))}
      </div>
      <Card p={0} style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Nga</th><th className="vv-th">Lloji</th><th className="vv-th">Data</th><th className="vv-th">Statusi</th><th className="vv-th"></th></tr></thead>
          <tbody>{filtered.map(r=>(
            <tr className="vv-row" key={r.id} style={{cursor:"pointer"}} onClick={()=>{setOpen(r.id);setReplyText(r.reply);}}>
              <td className="vv-td"><div style={{fontWeight:600}}>{r.from}</div><div style={{fontSize:12,color:C.inkSoft}}>{r.email}</div></td>
              <td className="vv-td" style={{color:C.inkSoft}}>{r.type}</td>
              <td className="vv-td" style={{color:C.inkSoft,fontSize:13}}>{r.date}</td>
              <td className="vv-td">{reqChip(r.status)}</td>
              <td className="vv-td"><button className="vv-link">Shiko →</button></td>
            </tr>
          ))}
          {filtered.length===0&&<tr><td colSpan={5} className="vv-td" style={{textAlign:"center",color:C.inkSoft,padding:32}}>Nuk ka kërkesa.</td></tr>}
          </tbody>
        </table>
      </Card>
      {detail&&<Modal open={!!open} onClose={()=>setOpen(null)} title={detail.type}>
        <div style={{display:"grid",gap:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            {reqChip(detail.status)}
            <span style={{fontSize:12,color:C.inkSoft}}>{detail.date}</span>
          </div>
          <div style={{background:C.paper,borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontWeight:700}}>{detail.from}</div>
            <div style={{fontSize:12,color:C.inkSoft}}>{detail.email}</div>
          </div>
          <div style={{fontSize:14,lineHeight:1.6,color:C.ink}}>{detail.msg}</div>
          {detail.status!=="mbyllur"&&<form onSubmit={sendReply} style={{display:"grid",gap:10}}>
            <div style={{fontSize:12,fontWeight:700,color:C.inkSoft,textTransform:"uppercase",letterSpacing:".05em"}}>{detail.status==="u_pergjigj"?"Përgjigja e dërguar":"Shkruaj përgjigje"}</div>
            <textarea className="vv-input" rows={3} placeholder="Shkruani përgjigjen…" value={replyText} onChange={e=>setReplyText(e.target.value)} required style={{resize:"vertical"}}/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button type="button" className="vv-btn ghost" style={{fontSize:13}} onClick={()=>closeReq(detail.id)}>Mbyll pa përgjigje</button>
              <button type="submit" className="vv-btn" style={{fontSize:13}}><Send size={14}/>Dërgo</button>
            </div>
          </form>}
          {detail.status==="mbyllur"&&detail.reply&&<div style={{fontSize:14,color:C.inkSoft,fontStyle:"italic"}}>"{detail.reply}"</div>}
        </div>
      </Modal>}
      <Toast msg={toast}/>
    </div>
  );
}

function AdminArchive(){
  const [tab,setTab]=useState("fotot");
  return(
    <div>
      <SectionTitle title="Arkiva" sub="Historia dhe materialet e Pikës"/>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[["fotot","Fotot"],["dokumentet","Procesverbalet"],["aniversaret","Përvjetorët"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${C.line}`,background:tab===k?C.ink:"#fff",color:tab===k?"#fff":C.ink,fontWeight:600,fontSize:13}}>{l}</button>
        ))}
      </div>
      {tab==="fotot"&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {ARCHIVE_PHOTOS.map(p=>(
          <Card key={p.id} style={{cursor:"pointer",overflow:"hidden"}}>
            <div style={{background:`linear-gradient(135deg,${C.red}22,${C.red}11)`,borderRadius:8,height:120,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
              <ImageIcon size={36} color={C.red} opacity={0.5}/>
            </div>
            <div style={{fontWeight:600,fontSize:14}}>{p.title}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:12,color:C.inkSoft}}>{p.date}</span>
              <span style={{fontSize:12,color:C.inkSoft}}>{p.count} foto</span>
            </div>
          </Card>
        ))}
      </div>}
      {tab==="dokumentet"&&<Card p={0} style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Dokumenti</th><th className="vv-th">Data</th><th className="vv-th">Madhësia</th><th className="vv-th"></th></tr></thead>
          <tbody>{ARCHIVE_DOCS.map(d=>(
            <tr className="vv-row" key={d.id}>
              <td className="vv-td" style={{fontWeight:600}}>{d.name}</td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.date}</td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.size}</td>
              <td className="vv-td"><button className="vv-link"><Download size={13}/> Shkarko</button></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>}
      {tab==="aniversaret"&&<div style={{display:"grid",gap:12}}>
        {[
          {month:"Shkurt",day:"17",title:"Pavarësia e Kosovës",year:"2008",type:"kombëtare"},
          {month:"Mars",day:"12",title:"Themelimi i Pikës Winterthur",year:"2018",type:"pike"},
          {month:"Prill",day:"4",title:"Dita e Kushtetutës",year:"2009",type:"kombëtare"},
          {month:"Nëntor",day:"28",title:"Dita e Flamurit",year:"1912",type:"kombëtare"},
          {month:"Dhjetor",day:"9",title:"Dita e Luftëtarit",year:"1942",type:"kombëtare"},
        ].map((a,i)=>(
          <Card key={i} style={{display:"flex",gap:16,alignItems:"center"}}>
            <div style={{textAlign:"center",minWidth:60,background:a.type==="pike"?C.red:C.ink,borderRadius:10,padding:"8px 12px",color:"#fff"}}>
              <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:22}}>{a.day}</div>
              <div style={{fontSize:11,opacity:.8}}>{a.month}</div>
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>{a.title}</div>
              <div style={{fontSize:13,color:C.inkSoft,marginTop:2}}>Që nga viti {a.year}</div>
              <span className="vv-chip" style={{background:a.type==="pike"?"#FFEFEE":C.paper,color:a.type==="pike"?C.red:C.inkSoft,marginTop:6}}>{a.type==="pike"?"Pika":"Kombëtare"}</span>
            </div>
          </Card>
        ))}
      </div>}
    </div>
  );
}


function AdminDonations(){
  const [donations,setDonations]=useState(seedDonations);
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({from:"",amount:"",msg:""});
  const [toast,showToast]=useToast();
  const total=donations.reduce((s,d)=>s+d.amount,0);
  const pct=Math.min(100,Math.round(total/DONATION_TARGET*100));
  function add(e){
    e.preventDefault();
    const amt=parseFloat(form.amount);
    if(!form.from||!amt){showToast("Plotëso fushat");return;}
    setDonations(prev=>[{id:Date.now(),from:form.from,amount:amt,date:"21.06.2026",msg:form.msg},...prev]);
    setOpen(false);setForm({from:"",amount:"",msg:""});showToast("Donacioni u regjistrua!");
  }
  return(
    <div>
      <SectionTitle title="Donacionet" action={
        <div style={{display:"flex",gap:8}}>
          <button className="vv-btn ghost" onClick={()=>exportCSV(donations.map(d=>({
            "Donatori":d.from,"Shuma CHF":d.amount,"Data":d.date,"Mesazhi":d.msg||"",
          })),"donacionet-vv-winterthur.csv")}><Download size={14}/>CSV</button>
          <button className="vv-btn" onClick={()=>setOpen(true)}><Plus size={15}/>Regjistro donacion</button>
        </div>
      }/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:20,marginBottom:20}}>
        <Card>
          <div className="vv-eyebrow" style={{marginBottom:8}}>Progresi i fushatës</div>
          <div className="vv-stat display" style={{color:C.red,marginBottom:4}}>CHF {total}</div>
          <div style={{fontSize:13,color:C.inkSoft,marginBottom:12}}>nga CHF {DONATION_TARGET} target</div>
          <div style={{background:C.paper,borderRadius:999,height:12,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",background:C.red,borderRadius:999}}/>
          </div>
          <div style={{fontSize:12,color:C.inkSoft,marginTop:6}}>{pct}% e arritur · {donations.length} donatorë</div>
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <StatCard label="Donacioni mesatar" value={`CHF ${Math.round(total/donations.length)}`} icon={<Heart size={24}/>}/>
          <StatCard label="Donacioni më i madh" value={`CHF ${Math.max(...donations.map(d=>d.amount))}`} color={C.red} icon={<Star size={24}/>}/>
        </div>
      </div>
      <Card p={0} style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Donatori</th><th className="vv-th">Shuma</th><th className="vv-th">Data</th><th className="vv-th">Mesazhi</th></tr></thead>
          <tbody>{donations.map(d=>(
            <tr className="vv-row" key={d.id}>
              <td className="vv-td" style={{fontWeight:600}}>{d.from}</td>
              <td className="vv-td"><b style={{color:C.red}}>CHF {d.amount}</b></td>
              <td className="vv-td" style={{color:C.inkSoft}}>{d.date}</td>
              <td className="vv-td" style={{color:C.inkSoft,fontSize:13}}>{d.msg||"—"}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      <Modal open={open} onClose={()=>setOpen(false)} title="Regjistro donacion">
        <form onSubmit={add} style={{display:"grid",gap:12}}>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Emri i donatorit *</label>
          <input className="vv-input" placeholder="Emri" value={form.from} onChange={e=>setForm(f=>({...f,from:e.target.value}))}/></div>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Shuma (CHF) *</label>
          <input className="vv-input" type="number" min="5" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></div>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Mesazhi (opsional)</label>
          <input className="vv-input" placeholder="Mesazhi i donatorit" value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))}/></div>
          <button type="submit" className="vv-btn" style={{justifyContent:"center"}}><Heart size={14}/>Regjistro</button>
        </form>
      </Modal>
      <Toast msg={toast}/>
    </div>
  );
}

function AdminPolls({polls,setPolls}){
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({question:"",deadline:""});
  const [toast,showToast]=useToast();
  function createPoll(e){
    e.preventDefault();
    if(!form.question||!form.deadline){showToast("Plotëso pyetjen dhe afatin");return;}
    setPolls(prev=>[...prev,{id:Date.now(),question:form.question,yes:0,no:0,abstain:0,deadline:form.deadline,status:"aktiv",voted:[]}]);
    setOpen(false);setForm({question:"",deadline:""});showToast("Sondazhi u krijua!");
  }
  function closePoll(id){setPolls(prev=>prev.map(p=>p.id===id?{...p,status:"mbyllur"}:p));showToast("Sondazhi u mbyll.");}
  const activeCt=polls.filter(p=>p.status==="aktiv").length;
  return(
    <div>
      <SectionTitle title="Sondazhet" action={<button className="vv-btn" onClick={()=>setOpen(true)}><Plus size={15}/>Krijo sondazh</button>}/>
      {activeCt>0&&(
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#FEE2E2",border:"1px solid rgba(226,35,26,.18)",borderRadius:12,padding:"8px 16px",marginBottom:20,fontSize:13,fontWeight:600,color:C.redStat}}>
          <span className="vv-live-dot"/>
          {activeCt} sondazh aktiv — rezultatet përditësohen live
        </div>
      )}
      <div style={{display:"grid",gap:14}}>
        {polls.map(p=>{
          const total=p.yes+p.no+p.abstain||1;
          const isLive=p.status==="aktiv";
          return(
            <Card key={p.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                    <span className="vv-chip" style={{background:isLive?"#E7F4ED":"#F3F2EF",color:isLive?C.green:C.inkSoft}}>{isLive?"Aktiv":"Mbyllur"}</span>
                    {isLive&&(
                      <span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#FEE2E2",padding:"3px 8px",borderRadius:999}}>
                        <span className="vv-live-dot"/>
                        <span style={{fontSize:11,fontWeight:700,color:C.redStat,letterSpacing:".06em"}}>LIVE</span>
                      </span>
                    )}
                  </div>
                  <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{p.question}</div>
                  <div style={{fontSize:12,color:C.inkSoft}}>Afati: {p.deadline} · <span style={{fontVariantNumeric:"tabular-nums"}}>{total}</span> vota</div>
                </div>
                {isLive&&<button className="vv-btn ghost" style={{fontSize:12,padding:"6px 12px",flexShrink:0,marginLeft:12}} onClick={()=>closePoll(p.id)}>Mbyll</button>}
              </div>
              <div style={{display:"grid",gap:10}}>
                {[["Po",p.yes,C.green],["Jo",p.no,C.redStat],["Abstinoj",p.abstain,C.inkSoft]].map(([l,v,cl])=>(
                  <div key={l}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,fontWeight:600}}>{l}</span>
                      <span style={{fontSize:13,color:C.inkSoft,fontVariantNumeric:"tabular-nums"}}>{v} <span style={{opacity:.65}}>({Math.round(v/total*100)}%)</span></span>
                    </div>
                    <div style={{background:C.paper,borderRadius:999,height:9,overflow:"hidden"}}>
                      <div className="vv-bar-fill" style={{width:`${v/total*100}%`,height:"100%",background:cl,borderRadius:999}}/>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title="Krijo sondazh">
        <form onSubmit={createPoll} style={{display:"grid",gap:12}}>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Pyetja *</label>
          <textarea className="vv-input" rows={3} placeholder="A duhet…?" value={form.question} onChange={e=>setForm(f=>({...f,question:e.target.value}))} style={{resize:"vertical"}}/></div>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Afati *</label>
          <input className="vv-input" placeholder="dd.mm.yyyy" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></div>
          <button type="submit" className="vv-btn" style={{justifyContent:"center"}}><ClipboardList size={14}/>Krijo sondazhin</button>
        </form>
      </Modal>
      <Toast msg={toast}/>
    </div>
  );
}

function AdminFinance(){
  const total=FINANCE_MONTHS.reduce((s,m)=>s+m.collected,0);
  const maxVal=Math.max(...FINANCE_MONTHS.map(m=>m.collected),1);
  const W=480,H=200,pad=40;
  const barW=(W-pad*2)/FINANCE_MONTHS.length;
  return(
    <div>
      <SectionTitle title="Financat" sub="Arkëtimet e kuotave 2026"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Arkëtuar YTD" value={`CHF ${total}`} color={C.green} icon={<Banknote size={26}/>}/>
        <StatCard label="Target vjetor" value={`CHF ${FINANCE_TARGET_YEAR}`} icon={<Target size={26}/>}/>
        <StatCard label="Progresi" value={`${Math.round(total/FINANCE_TARGET_YEAR*100)}%`} color={C.red} icon={<TrendingUp size={26}/>}/>
      </div>
      <Card style={{marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Arkëtimet mujore (CHF)</div>
        <svg width="100%" viewBox={`0 0 ${W} ${H+40}`} style={{overflow:"visible"}}>
          {FINANCE_MONTHS.map((m,i)=>{
            const bh=Math.round((m.collected/maxVal)*(H-20));
            const x=pad+i*barW+barW*0.15;
            const bw=barW*0.7;
            const y=H-bh+10;
            const delay=i*80;
            return(
              <g key={m.m}>
                <rect x={x} y={y} width={bw} height={bh} fill={m.collected>0?C.red:"#E5E4E0"} rx={4}
                  className="vv-bar" style={{animationDelay:`${delay}ms`}}/>
                {m.collected>0&&<text x={x+bw/2} y={y-6} textAnchor="middle" fontSize={11} fill={C.inkSoft}
                  style={{opacity:0,animation:`fadeUp .3s ease ${delay+500}ms both`}}>{m.collected}</text>}
                <text x={x+bw/2} y={H+28} textAnchor="middle" fontSize={12} fill={C.inkSoft}>{m.m}</text>
              </g>
            );
          })}
          <line x1={pad} y1={H+10} x2={W-pad} y2={H+10} stroke={C.line} strokeWidth={1}/>
        </svg>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Detajet mujore</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Muaji</th><th className="vv-th">Arkëtuar</th><th className="vv-th">Progresi</th></tr></thead>
          <tbody>{FINANCE_MONTHS.map(m=>(
            <tr className="vv-row" key={m.m}>
              <td className="vv-td" style={{fontWeight:600}}>{m.m} 2026</td>
              <td className="vv-td"><b style={{color:m.collected>0?C.green:C.inkSoft}}>CHF {m.collected}</b></td>
              <td className="vv-td" style={{width:200}}>
                <div style={{background:C.paper,borderRadius:999,height:8}}>
                  <div style={{width:`${m.collected/FINANCE_TARGET_YEAR*100*6}%`,height:"100%",background:C.green,borderRadius:999,maxWidth:"100%"}}/>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

function AdminCalendar(){
  const [month,setMonth]=useState(5);
  const year=2026;
  const months=["Janar","Shkurt","Mars","Prill","Maj","Qershor","Korrik","Gusht","Shtator","Tetor","Nëntor","Dhjetor"];
  const daysInMonth=(m,y)=>new Date(y,m+1,0).getDate();
  const firstDay=(m,y)=>(new Date(y,m,1).getDay()+6)%7;
  const days=daysInMonth(month,year);
  const startDay=firstDay(month,year);
  const cells=[];
  for(let i=0;i<startDay;i++)cells.push(null);
  for(let d=1;d<=days;d++)cells.push(d);
  const eventsThisMonth=seedEvents.filter(ev=>{
    const [d,m,y]=ev.date.split(".").map(Number);
    return m-1===month&&y===year;
  });
  function eventsOnDay(d){return eventsThisMonth.filter(ev=>+ev.date.split(".")[0]===d);}
  return(
    <div>
      <SectionTitle title="Kalendari" sub={`${months[month]} ${year}`} action={
        <div style={{display:"flex",gap:8}}>
          <button className="vv-btn ghost" style={{padding:"7px 12px"}} onClick={()=>setMonth(m=>Math.max(0,m-1))}>←</button>
          <button className="vv-btn ghost" style={{padding:"7px 12px"}} onClick={()=>setMonth(m=>Math.min(11,m+1))}>→</button>
        </div>
      }/>
      <Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:0}}>
          {["Hë","Ma","Më","En","Pr","Sh","Di"].map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:12,fontWeight:700,color:C.inkSoft,padding:"8px 4px",borderBottom:`1px solid ${C.line}`}}>{d}</div>
          ))}
          {cells.map((d,i)=>{
            const evs=d?eventsOnDay(d):[];
            const isToday=d===21&&month===5&&year===2026;
            return(
              <div key={i} style={{minHeight:80,padding:"6px 8px",borderRight:`1px solid ${C.line}`,borderBottom:`1px solid ${C.line}`,background:isToday?"#FFF5F5":"#fff"}}>
                {d&&<div style={{fontWeight:isToday?700:400,fontSize:13,color:isToday?C.red:C.ink,marginBottom:4}}>{d}</div>}
                {evs.map(ev=>(
                  <div key={ev.id} style={{background:C.red,color:"#fff",fontSize:10,borderRadius:4,padding:"2px 5px",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.title}</div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function AdminMap(){
  const maxCount=Math.max(...CANTON_DATA.map(c=>c.count));
  return(
    <div>
      <SectionTitle title="Harta e anëtarëve" sub="Shpërndarja sipas kantonit"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Kantone të përfaqësuara" value={CANTON_DATA.length} icon={<MapPin size={26}/>}/>
        <StatCard label="Kantoni me më shumë" value={CANTON_DATA[0].kanton} icon={<Globe size={26}/>}/>
        <StatCard label="Anëtarë gjithsej" value={seedMembers.length} color={C.red} icon={<Users size={26}/>}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>Shpërndarja sipas kantonit</div>
          <div style={{display:"grid",gap:12}}>
            {CANTON_DATA.map(c=>(
              <div key={c.kanton}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontWeight:600,fontSize:14}}>{c.kanton}</span>
                  <span style={{fontSize:14,color:C.inkSoft}}>{c.count} anëtarë</span>
                </div>
                <div style={{background:C.paper,borderRadius:999,height:10}}>
                  <div style={{width:`${c.count/maxCount*100}%`,height:"100%",background:C.red,borderRadius:999}}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Detajet</div>
          {CANTON_DATA.map(c=>(
            <div key={c.kanton} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:28,height:28,borderRadius:6,background:C.red,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700}}>{c.kanton.slice(0,2)}</div>
                <span style={{fontWeight:600,fontSize:14}}>{c.kanton}</span>
              </div>
              <span className="vv-chip" style={{background:C.red,color:"#fff"}}>{c.count}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function AdminRecruitment(){
  return(
    <div>
      <SectionTitle title="Rekrutimi" sub="Gjurmimi i rekrutimit dhe referimeve"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Total referime" value={seedReferrals.reduce((s,r)=>s+r.referred,0)} icon={<UserPlus size={26}/>} color={C.green}/>
        <StatCard label="Rekrutues aktivë" value={seedReferrals.filter(r=>r.referred>0).length} icon={<Users size={26}/>}/>
        <StatCard label="Rekrutues kryesor" value={seedReferrals[0].name.split(" ")[0]} icon={<Star size={26}/>} color={C.red}/>
      </div>
      <Card p={0} style={{overflow:"hidden",marginBottom:20}}>
        <div style={{padding:"14px 16px",fontWeight:700,borderBottom:`1px solid ${C.line}`}}>Rekrutuesit dhe kodet e referimit</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Anëtari</th><th className="vv-th">Kodi</th><th className="vv-th">Referime</th><th className="vv-th">Kush u referua</th></tr></thead>
          <tbody>{seedReferrals.map(r=>(
            <tr className="vv-row" key={r.id}>
              <td className="vv-td" style={{fontWeight:600}}>{r.name}</td>
              <td className="vv-td"><code style={{background:C.paper,padding:"2px 8px",borderRadius:6,fontSize:12}}>{r.code}</code></td>
              <td className="vv-td">
                <span className="vv-chip" style={{background:r.referred>0?C.red:C.paper,color:r.referred>0?"#fff":C.inkSoft}}>{r.referred}</span>
              </td>
              <td className="vv-td" style={{fontSize:13,color:C.inkSoft}}>{r.names.length>0?r.names.join(", "):"—"}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Top rekrutuesit</div>
        {seedReferrals.filter(r=>r.referred>0).sort((a,b)=>b.referred-a.referred).map((r,i)=>(
          <div key={r.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:i===0?C.red:C.paper,color:i===0?"#fff":C.inkSoft,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{i+1}</div>
            <div style={{flex:1,fontWeight:600}}>{r.name}</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span className="vv-chip" style={{background:"#E7F4ED",color:C.green}}>{r.referred} anëtarë</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}


function AdminCheckin({members,events}){
  const ev=events.find(e=>e.id===CHECKIN_EVENT_ID)||events[0];
  const [checkedIn,setCheckedIn]=useState(ev?[...ev.rsvp]:[]);
  const [search,setSearch]=useState("");
  const [mode,setMode]=useState("list"); // "list" | "qr"
  const [qrInput,setQrInput]=useState("");
  const [lastScan,setLastScan]=useState(null); // {member, ok}
  const [toast,showToast]=useToast();
  const qrRef=useRef(null);

  function toggle(id){
    setCheckedIn(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
    const m=members.find(x=>x.id===id);
    showToast(checkedIn.includes(id)?`${m?.name} u largua.`:`${m?.name} u konfirmua!`);
  }
  function scanQR(raw){
    const code=raw.trim().toUpperCase();
    const m=members.find(x=>`WTH-${String(x.id).padStart(3,"0")}`===code||String(x.id)===raw.trim());
    if(!m){setLastScan({member:null,ok:false,code});setQrInput("");return;}
    if(!checkedIn.includes(m.id))setCheckedIn(prev=>[...prev,m.id]);
    setLastScan({member:m,ok:true});
    setQrInput("");
    showToast(`✓ ${m.name} u konfirmua me QR!`);
    setTimeout(()=>setLastScan(null),3000);
  }

  const filtered=members.filter(m=>!search||m.name.toLowerCase().includes(search.toLowerCase()));
  return(
    <div>
      <SectionTitle title="Check-in i eventit" sub={ev?.title||"Nuk ka event aktiv"}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Të regjistruar" value={ev?.rsvp.length||0} icon={<CalendarCheck size={24}/>}/>
        <StatCard label="Kanë ardhur" value={checkedIn.length} color={C.green} icon={<UserCheck size={24}/>}/>
        <StatCard label="Mungojnë" value={(ev?.rsvp.length||0)-checkedIn.length} color={C.amber} icon={<Clock size={24}/>}/>
      </div>

      {/* Mode tabs */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["list","📋 Lista"],["qr","📷 QR Scanner"]].map(([k,l])=>(
          <button key={k} onClick={()=>{setMode(k);setLastScan(null);setTimeout(()=>qrRef.current?.focus(),100);}}
            className={`vv-btn${mode===k?"":" ghost"}`} style={{fontSize:13,padding:"7px 16px"}}>
            {l}
          </button>
        ))}
      </div>

      {mode==="qr"?(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <Card>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:12,color:C.inkSoft}}>Drejtoje kamerën drejt kodit QR</div>
              <div className="vv-scanner">
                <div className="vv-scanner-line"/>
                {/* Corner brackets */}
                {[["top:8px","left:8px","borderTopWidth:3px","borderLeftWidth:3px"],
                  ["top:8px","right:8px","borderTopWidth:3px","borderRightWidth:3px"],
                  ["bottom:8px","left:8px","borderBottomWidth:3px","borderLeftWidth:3px"],
                  ["bottom:8px","right:8px","borderBottomWidth:3px","borderRightWidth:3px"]
                ].map((corners,i)=>(
                  <div key={i} className="vv-scanner-corner" style={Object.fromEntries(corners.map(s=>{const[k,v]=s.split(":");return[k,v];}))}/>
                ))}
                {/* Preview QR codes of members */}
                <div style={{display:"flex",flexWrap:"wrap",gap:2,padding:16,justifyContent:"center",alignItems:"center",height:"100%",opacity:.15}}>
                  {members.slice(0,4).map(m=><MemberQR key={m.id} id={m.id} size={48} bg="transparent" fg="#fff"/>)}
                </div>
              </div>
            </div>
            {/* Simulated scan input */}
            <div style={{marginTop:4}}>
              <div style={{fontSize:12,color:C.inkSoft,marginBottom:6,textAlign:"center"}}>Ose shtyp ID-në manualisht (p.sh. WTH-005)</div>
              <div style={{display:"flex",gap:8}}>
                <input ref={qrRef} className="vv-input" placeholder="WTH-001" value={qrInput}
                  onChange={e=>setQrInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&qrInput&&scanQR(qrInput)}
                  style={{fontFamily:"'Archivo',monospace",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase"}}/>
                <button className="vv-btn" onClick={()=>qrInput&&scanQR(qrInput)} style={{padding:"9px 14px",flexShrink:0}}><QrCode size={15}/></button>
              </div>
            </div>
            {lastScan&&(
              <div style={{marginTop:14,padding:"14px 16px",borderRadius:12,background:lastScan.ok?"#E7F4ED":"#FEE2E2",border:`1px solid ${lastScan.ok?"#1E8A4C33":"#E2231A33"}`,display:"flex",alignItems:"center",gap:12}}>
                {lastScan.ok
                  ?<><CheckCircle2 size={22} color={C.green} style={{flexShrink:0}}/>
                    <div><div style={{fontWeight:700,fontSize:14,color:C.green}}>{lastScan.member.name}</div>
                    <div style={{fontSize:12,color:C.inkSoft}}>Check-in i suksesshëm ✓</div></div></>
                  :<><XCircle size={22} color={C.redStat} style={{flexShrink:0}}/>
                    <div><div style={{fontWeight:700,fontSize:14,color:C.redStat}}>Kodi i panjohur</div>
                    <div style={{fontSize:12,color:C.inkSoft}}>«{lastScan.code}» — nuk u gjet</div></div></>
                }
              </div>
            )}
          </Card>
          <Card>
            <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Të skanuar ({checkedIn.length})</div>
            <div style={{display:"grid",gap:8,maxHeight:400,overflowY:"auto"}}>
              {members.filter(m=>checkedIn.includes(m.id)).map(m=>(
                <div key={m.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:10,background:"#E7F4ED"}}>
                  <CheckCircle2 size={16} color={C.green} style={{flexShrink:0}}/>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{m.name}</div><div style={{fontSize:11,color:C.inkSoft}}>WTH-{String(m.id).padStart(3,"0")}</div></div>
                  <MemberQR id={m.id} size={36} bg="#E7F4ED" fg="#1E8A4C"/>
                </div>
              ))}
              {checkedIn.length===0&&<div style={{color:C.inkSoft,fontSize:13,textAlign:"center",padding:20}}>Asnjë i skanuar akoma</div>}
            </div>
          </Card>
        </div>
      ):(
        <Card>
          {ev&&<div style={{marginBottom:16,padding:"12px 14px",background:C.paper,borderRadius:10}}>
            <div style={{fontWeight:700}}>{ev.title}</div>
            <div style={{fontSize:13,color:C.inkSoft,marginTop:4}}>{ev.date} · {ev.time} · {ev.place}</div>
          </div>}
          <div style={{position:"relative",marginBottom:14}}>
            <Search size={14} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:C.inkSoft}}/>
            <input className="vv-input" style={{paddingLeft:32}} placeholder="Kërko anëtar…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div style={{display:"grid",gap:8}}>
            {filtered.map(m=>{
              const came=checkedIn.includes(m.id);
              const registered=ev?.rsvp.includes(m.id);
              return(
                <div key={m.id} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 14px",borderRadius:10,background:came?"#E7F4ED":registered?C.paper:"#fff",border:`1px solid ${came?"#1E8A4C22":C.line}`}}>
                  <div className="vv-emblem" style={{width:34,height:34,fontSize:13,background:came?C.green:C.ink}}>{m.name[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:14}}>{m.name}</div>
                    <div style={{fontSize:12,color:C.inkSoft}}>{m.kanton} · {registered?"I regjistruar":"Jo i regjistruar"}</div>
                  </div>
                  <button onClick={()=>toggle(m.id)} className={`vv-btn${came?" ghost":""}`} style={{fontSize:12,padding:"6px 12px",background:came?"#fff":C.green,color:came?C.green:"#fff",border:came?`1px solid ${C.green}`:"none"}}>
                    {came?<><CheckCircle2 size={13}/>Ishte</>:<><Plus size={13}/>Check in</>}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      <Toast msg={toast}/>
    </div>
  );
}

function AdminProcessverbal(){
  const [minutes,setMinutes]=useState(seedMinutes);
  const [open,setOpen]=useState(false);
  const [sel,setSel]=useState(null);
  const [form,setForm]=useState({title:"",date:"",place:"",decisions:[""]});
  const [toast,showToast]=useToast();
  function addDecision(){setForm(f=>({...f,decisions:[...f.decisions,""]}));}
  function setDecision(i,v){setForm(f=>({...f,decisions:f.decisions.map((d,j)=>j===i?v:d)}));}
  function saveMinutes(e){
    e.preventDefault();
    if(!form.title||!form.date){showToast("Plotëso titullin dhe datën");return;}
    setMinutes(prev=>[{id:Date.now(),title:form.title,date:form.date,place:form.place,present:[],decisions:form.decisions.filter(Boolean),status:"draft"},...prev]);
    setOpen(false);setForm({title:"",date:"",place:"",decisions:[""]});showToast("Procesverbali u ruajt!");
  }
  return(
    <div>
      <SectionTitle title="Procesverbalet" sub="Procesverbalet e mbledhjeve" action={<button className="vv-btn" onClick={()=>setOpen(true)}><Plus size={15}/>Krijo procesverbal</button>}/>
      <div style={{display:"grid",gap:14}}>
        {minutes.map(m=>(
          <Card key={m.id} style={{cursor:"pointer"}} onClick={()=>setSel(m)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <span className="vv-chip" style={{background:m.status==="final"?"#E7F4ED":"#FEF3C7",color:m.status==="final"?C.green:"#92400E"}}>{m.status==="final"?"Final":"Draft"}</span>
                </div>
                <div style={{fontWeight:700,fontSize:15}}>{m.title}</div>
                <div style={{fontSize:13,color:C.inkSoft,marginTop:4}}>{m.date} · {m.place}</div>
                <div style={{fontSize:12,color:C.inkSoft,marginTop:4}}>{m.present.length} pjesëmarrës · {m.decisions.length} vendime</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="vv-btn ghost" style={{fontSize:12,padding:"6px 10px"}} onClick={e=>{e.stopPropagation();showToast("Shkarkohet PDF…")}}><Download size={13}/>PDF</button>
                <ChevronRight size={18} color={C.inkSoft}/>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!sel} onClose={()=>setSel(null)} title={sel?.title||""} width={600}>
        {sel&&<div style={{display:"grid",gap:14}}>
          <div style={{display:"flex",gap:8}}>
            <span className="vv-chip" style={{background:sel.status==="final"?"#E7F4ED":"#FEF3C7",color:sel.status==="final"?C.green:"#92400E"}}>{sel.status==="final"?"Final":"Draft"}</span>
          </div>
          <Field icon={<Calendar size={15}/>} label="Data" value={sel.date}/>
          <Field icon={<MapPin size={15}/>} label="Vendi" value={sel.place}/>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:C.inkSoft,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Vendimet</div>
            {sel.decisions.map((d,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:`1px solid ${C.line}`}}>
                <div style={{width:22,height:22,borderRadius:4,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
                <div style={{fontSize:14}}>{d}</div>
              </div>
            ))}
          </div>
        </div>}
      </Modal>
      <Modal open={open} onClose={()=>setOpen(false)} title="Krijo procesverbal" width={580}>
        <form onSubmit={saveMinutes} style={{display:"grid",gap:12}}>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Titulli *</label>
          <input className="vv-input" placeholder="Mbledhja e rregullt — dd.mm.yyyy" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Data *</label>
            <input className="vv-input" placeholder="dd.mm.yyyy" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Vendi</label>
            <input className="vv-input" placeholder="Salla…" value={form.place} onChange={e=>setForm(f=>({...f,place:e.target.value}))}/></div>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <label style={{fontSize:13,fontWeight:600}}>Vendimet</label>
              <button type="button" className="vv-link" onClick={addDecision}><Plus size={12}/>Shto</button>
            </div>
            {form.decisions.map((d,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                <div style={{width:22,height:22,borderRadius:4,background:C.paper,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
                <input className="vv-input" placeholder={`Vendimi ${i+1}…`} value={d} onChange={e=>setDecision(i,e.target.value)}/>
              </div>
            ))}
          </div>
          <button type="submit" className="vv-btn" style={{justifyContent:"center"}}><ClipboardCheck size={14}/>Ruaj procesverbalin</button>
        </form>
      </Modal>
      <Toast msg={toast}/>
    </div>
  );
}

function AdminReminders({members}){
  const unpaid=members.filter(m=>m.pay==="papaguar"&&!m.exempt);
  const [sent,setSent]=useState([]);
  const [toast,showToast]=useToast();
  function sendReminder(id){
    setSent(prev=>[...prev,id]);
    const m=members.find(x=>x.id===id);
    showToast(`Kujtesa u dërgua tek ${m?.name}!`);
  }
  function sendAll(){
    setSent(unpaid.map(m=>m.id));
    showToast(`Kujtesat u dërguan tek ${unpaid.length} anëtarë!`);
  }
  const upcoming=seedEvents.filter(e=>!e.past);
  const unregistered=members.filter(m=>upcoming[0]&&!upcoming[0].rsvp.includes(m.id));
  return(
    <div>
      <SectionTitle title="Kujtesat automatike" sub="Dërgo kujtesat dhe njoftime"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div style={{fontWeight:700,fontSize:15}}>Kujtesë pagese</div>
              <div style={{fontSize:13,color:C.inkSoft,marginTop:2}}>{unpaid.length} anëtarë nuk kanë paguar</div>
            </div>
            {unpaid.length>0&&<button className="vv-btn" style={{fontSize:12,padding:"7px 14px"}} onClick={sendAll}><BellRing size={13}/>Dërgo të gjithëve</button>}
          </div>
          {unpaid.length===0?<div style={{color:C.green,fontSize:14,display:"flex",gap:8,alignItems:"center"}}><CheckCircle2 size={16}/>Të gjithë kanë paguar!</div>:
          <div style={{display:"grid",gap:8}}>
            {unpaid.map(m=>(
              <div key={m.id} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.line}`}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{m.name}</div>
                  <div style={{fontSize:12,color:C.inkSoft}}>{m.email}</div>
                </div>
                {sent.includes(m.id)?
                  <span className="vv-chip" style={{background:"#E7F4ED",color:C.green}}><CheckCircle2 size={11}/>Dërguar</span>:
                  <button className="vv-btn ghost" style={{fontSize:12,padding:"5px 10px"}} onClick={()=>sendReminder(m.id)}><Bell size={13}/>Kujtesë</button>
                }
              </div>
            ))}
          </div>}
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Kujtesë eventi</div>
          {upcoming.slice(0,2).map(ev=>(
            <div key={ev.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.line}`}}>
              <div style={{fontWeight:600,fontSize:14}}>{ev.title}</div>
              <div style={{fontSize:12,color:C.inkSoft,marginTop:3}}>{ev.date} · {ev.rsvp.length} të regjistruar</div>
              <button className="vv-btn ghost" style={{fontSize:12,padding:"5px 10px",marginTop:8}} onClick={()=>showToast(`Kujtesë u dërgua për "${ev.title}"!`)}><Bell size={13}/>Kujto të gjithë</button>
            </div>
          ))}
          {upcoming.length===0&&<div style={{color:C.inkSoft,fontSize:13}}>Nuk ka evente të ardhshme.</div>}
        </Card>
      </div>
      <Card>
        <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>Kujtesat e planifikuara</div>
        <div style={{display:"grid",gap:10}}>
          {[
            {type:"Pagesa",desc:"Kujtesë kuota papaguar — dërguar automatikisht çdo 1 të muajit",next:"01.07.2026",icon:<CreditCard size={16}/>},
            {type:"Mbledhja",desc:`Kujtesë 24h para eventit: "${upcoming[0]?.title||"-"}"`,next:upcoming[0]?.date||"-",icon:<Calendar size={16}/>},
            {type:"Ditëlindja",desc:"Urime ditëlindja automatike për anëtarët",next:"Gjatë gjithë vitit",icon:<Cake size={16}/>},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.line}`}}>
              <div style={{width:36,height:36,borderRadius:8,background:C.paper,display:"flex",alignItems:"center",justifyContent:"center",color:C.red}}>{r.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>{r.type}</div>
                <div style={{fontSize:12,color:C.inkSoft,marginTop:2}}>{r.desc}</div>
              </div>
              <div style={{fontSize:12,color:C.inkSoft,textAlign:"right"}}>
                <div style={{fontWeight:600,color:C.ink}}>Radhës</div>
                <div>{r.next}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminGrowth(){
  const maxCount=Math.max(...GROWTH_DATA.map(d=>d.count));
  const W=560,H=180,padX=40,padY=20;
  const pts=GROWTH_DATA.map((d,i)=>{
    const x=padX+i*(W-padX*2)/(GROWTH_DATA.length-1);
    const y=padY+(1-d.count/maxCount)*(H-padY*2)+padY;
    return[x,y,d];
  });
  const poly=pts.map(([x,y])=>`${x},${y}`).join(" ");
  const area=[`${pts[0][0]},${H}`,poly,`${pts[pts.length-1][0]},${H}`].join(" ");
  const newThisYear=GROWTH_DATA[GROWTH_DATA.length-1].count-GROWTH_DATA[GROWTH_DATA.length-2].count;
  return(
    <div>
      <SectionTitle title="Rritja e anëtarësisë" sub="Evoluimi historik i Pikës Winterthur"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        <StatCard label="Anëtarë 2026" value={GROWTH_DATA[GROWTH_DATA.length-1].count} color={C.red} icon={<Users size={26}/>}/>
        <StatCard label="Rritja këtë vit" value={`+${newThisYear}`} color={C.green} icon={<TrendingUp size={26}/>}/>
        <StatCard label="Themeluar" value="2018" icon={<Calendar size={26}/>} sub={`${GROWTH_DATA.length} vjet aktivë`}/>
      </div>
      <Card style={{marginBottom:20}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Rritja vjetore (2018–2026)</div>
        <svg width="100%" viewBox={`0 0 ${W} ${H+40}`} style={{overflow:"visible"}}>
          <defs>
            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.red} stopOpacity="0.15"/>
              <stop offset="100%" stopColor={C.red} stopOpacity="0.01"/>
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#growthGrad)" style={{opacity:0,animation:"fadeUp .6s ease .8s both"}}/>
          <polyline points={poly} fill="none" stroke={C.red} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
            pathLength="1" strokeDasharray="1" strokeDashoffset="1"
            style={{animation:"drawLine 1.2s cubic-bezier(.4,0,.2,1) .1s forwards"}}/>
          {pts.map(([x,y,d],i)=>(
            <g key={i} style={{opacity:0,animation:`fadeUp .3s ease ${200+i*80}ms both`}}>
              <circle cx={x} cy={y} r={5} fill={C.red} stroke="#fff" strokeWidth={2.5}/>
              <text x={x} y={H+32} textAnchor="middle" fontSize={11} fill={C.inkSoft}>{d.year}</text>
              <text x={x} y={y-12} textAnchor="middle" fontSize={11} fill={C.red} fontWeight="700">{d.count}</text>
            </g>
          ))}
          <line x1={padX} y1={H} x2={W-padX} y2={H} stroke={C.line} strokeWidth={1}/>
        </svg>
      </Card>
      <Card p={0} style={{overflow:"hidden"}}>
        <div style={{padding:"14px 16px",fontWeight:700,borderBottom:`1px solid ${C.line}`}}>Historiku vjetor</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr><th className="vv-th">Viti</th><th className="vv-th">Anëtarë</th><th className="vv-th">Rritja</th><th className="vv-th">Progresi</th></tr></thead>
          <tbody>{[...GROWTH_DATA].reverse().map((d,i,arr)=>{
            const prev=arr[i+1];
            const delta=prev?d.count-prev.count:0;
            return(
              <tr className="vv-row" key={d.year}>
                <td className="vv-td" style={{fontWeight:600}}>{d.year}</td>
                <td className="vv-td"><b>{d.count}</b></td>
                <td className="vv-td">{prev?<span className="vv-chip" style={{background:delta>0?"#E7F4ED":"#F3F2EF",color:delta>0?C.green:C.inkSoft}}>{delta>0?"+":""}{delta}</span>:"—"}</td>
                <td className="vv-td" style={{width:180}}>
                  <div style={{background:C.paper,borderRadius:999,height:8}}>
                    <div style={{width:`${d.count/maxCount*100}%`,height:"100%",background:C.red,borderRadius:999}}/>
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </Card>
    </div>
  );
}


function AdminTasks({members}){
  const [tasks,setTasks]=useState(seedTasks);
  const [open,setOpen]=useState(false);
  const [detail,setDetail]=useState(null);
  const [toast,showToast]=useToast();
  const [form,setForm]=useState({title:"",assignee:"",priority:"mesatare",due:"",note:"",col:"todo"});
  const [drag,setDrag]=useState(null);

  function move(id,col){
    setTasks(prev=>prev.map(t=>t.id===id?{...t,col}:t));
    showToast(col==="done"?"✓ Detyra u kompletua!":"Detyra u zhvendos.");
  }
  function addTask(e){
    e.preventDefault();
    if(!form.title){showToast("Shkruaj titullin");return;}
    setTasks(prev=>[...prev,{...form,id:Date.now(),assignee:+form.assignee||null}]);
    setOpen(false);
    setForm({title:"",assignee:"",priority:"mesatare",due:"",note:"",col:"todo"});
    showToast("Detyra u shtua!");
  }
  function deleteTask(id){
    setTasks(prev=>prev.filter(t=>t.id!==id));
    setDetail(null);
    showToast("Detyra u fshi.");
  }

  const colCounts=Object.fromEntries(TASK_COLS.map(c=>[c,tasks.filter(t=>t.col===c).length]));

  return(
    <div>
      <SectionTitle title="Detyrat" sub="Tabela Kanban e Pikës"
        action={<button className="vv-btn" onClick={()=>setOpen(true)}><Plus size={15}/>Shto detyrë</button>}/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        {TASK_COLS.map(c=>(
          <StatCard key={c} label={TASK_COL_LABELS[c]} value={colCounts[c]} color={TASK_COL_COLORS[c]}/>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,alignItems:"start"}}>
        {TASK_COLS.map(col=>{
          const colTasks=tasks.filter(t=>t.col===col);
          const colColor=TASK_COL_COLORS[col];
          return(
            <div key={col}
              onDragOver={e=>{e.preventDefault();e.currentTarget.style.outline=`2px dashed ${colColor}`;}}
              onDragLeave={e=>{e.currentTarget.style.outline="none";}}
              onDrop={e=>{e.currentTarget.style.outline="none";if(drag&&drag!==col)move(drag.id,col);setDrag(null);}}
              style={{borderRadius:16,background:"rgba(23,18,16,.04)",padding:12,minHeight:160}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:colColor}}/>
                  <span style={{fontWeight:700,fontSize:14}}>{TASK_COL_LABELS[col]}</span>
                </div>
                <span className="vv-chip" style={{background:"rgba(23,18,16,.07)",color:C.inkSoft}}>{colTasks.length}</span>
              </div>
              <div style={{display:"grid",gap:9}}>
                {colTasks.map(t=>{
                  const assignee=members.find(m=>m.id===t.assignee);
                  const pcfg=PRIORITY_CFG[t.priority];
                  return(
                    <div key={t.id}
                      draggable
                      onDragStart={()=>setDrag({id:t.id,col})}
                      onDragEnd={()=>setDrag(null)}
                      onClick={()=>setDetail(t)}
                      style={{background:"#fff",borderRadius:12,padding:"12px 14px",cursor:"pointer",
                        border:`1px solid rgba(23,18,16,.07)`,
                        boxShadow:"0 1px 4px rgba(23,18,16,.06)",
                        transition:"transform .12s, box-shadow .12s",
                        borderLeft:`3px solid ${pcfg.color}`}}
                      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(23,18,16,.10)";}}
                      onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 1px 4px rgba(23,18,16,.06)";}}>
                      <div style={{fontWeight:600,fontSize:13,marginBottom:8,lineHeight:1.4}}>{t.title}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                        <span className="vv-chip" style={{background:pcfg.bg,color:pcfg.color,fontSize:10}}>{pcfg.label}</span>
                        {assignee&&<div style={{display:"flex",gap:5,alignItems:"center"}}>
                          <div style={{width:20,height:20,borderRadius:"50%",background:C.red,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700}}>{assignee.name[0]}</div>
                          <span style={{fontSize:11,color:C.inkSoft}}>{assignee.name.split(" ")[0]}</span>
                        </div>}
                      </div>
                      {t.due&&<div style={{fontSize:10,color:C.inkSoft,marginTop:6}}>📅 {t.due}</div>}
                    </div>
                  );
                })}
                {colTasks.length===0&&(
                  <div style={{textAlign:"center",padding:"24px 0",color:C.inkSoft,fontSize:13,borderRadius:10,border:`1.5px dashed rgba(23,18,16,.12)`}}>
                    Asnjë detyrë
                  </div>
                )}
              </div>
              {col!=="done"&&<button onClick={()=>{setForm(f=>({...f,col}));setOpen(true);}}
                style={{width:"100%",marginTop:10,padding:"8px",borderRadius:8,border:`1.5px dashed rgba(23,18,16,.15)`,background:"none",color:C.inkSoft,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=colColor;e.currentTarget.style.color=colColor;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(23,18,16,.15)";e.currentTarget.style.color=C.inkSoft;}}>
                + Shto këtu
              </button>}
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {detail&&<Modal open={!!detail} onClose={()=>setDetail(null)} title={detail.title}>
        <div style={{display:"grid",gap:14}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <span className="vv-chip" style={{background:PRIORITY_CFG[detail.priority].bg,color:PRIORITY_CFG[detail.priority].color}}>{PRIORITY_CFG[detail.priority].label} prioritet</span>
            <span className="vv-chip" style={{background:"rgba(23,18,16,.07)",color:C.ink}}>{TASK_COL_LABELS[detail.col]}</span>
          </div>
          {detail.assignee&&<Field icon={<User size={15}/>} label="Caktuar tek" value={members.find(m=>m.id===detail.assignee)?.name||"—"}/>}
          {detail.due&&<Field icon={<Calendar size={15}/>} label="Afati" value={detail.due}/>}
          {detail.note&&<div style={{background:C.paper,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.inkSoft,lineHeight:1.6}}>{detail.note}</div>}
          <div style={{borderTop:`1px solid ${C.line}`,paddingTop:14}}>
            <div style={{fontSize:12,fontWeight:700,color:C.inkSoft,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Zhvendos tek</div>
            <div style={{display:"flex",gap:8}}>
              {TASK_COLS.filter(c=>c!==detail.col).map(c=>(
                <button key={c} className="vv-btn ghost" style={{flex:1,justifyContent:"center",fontSize:13}}
                  onClick={()=>{move(detail.id,c);setDetail(null);}}>
                  {TASK_COL_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>deleteTask(detail.id)} style={{background:"none",border:"none",color:"#C8342B",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",padding:0}}>Fshi detyrën</button>
        </div>
      </Modal>}

      {/* Add modal */}
      <Modal open={open} onClose={()=>setOpen(false)} title="Shto detyrë të re">
        <form onSubmit={addTask} style={{display:"grid",gap:12}}>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Titulli *</label>
          <input className="vv-input" placeholder="Psh. Përgatit axhendën…" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Kolona</label>
            <select className="vv-input" value={form.col} onChange={e=>setForm(f=>({...f,col:e.target.value}))}>
              {TASK_COLS.map(c=><option key={c} value={c}>{TASK_COL_LABELS[c]}</option>)}
            </select></div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Prioriteti</label>
            <select className="vv-input" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
              {Object.entries(PRIORITY_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Cakto tek</label>
            <select className="vv-input" value={form.assignee} onChange={e=>setForm(f=>({...f,assignee:e.target.value}))}>
              <option value="">— Pa caktuar</option>
              {members.filter(m=>m.status==="aktiv").map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
            </select></div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Afati</label>
            <input className="vv-input" placeholder="dd.mm.yyyy" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))}/></div>
          </div>
          <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:4}}>Shënim</label>
          <textarea className="vv-input" rows={2} placeholder="Detaje shtesë…" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} style={{resize:"vertical"}}/></div>
          <button type="submit" className="vv-btn" style={{justifyContent:"center"}}><Plus size={14}/>Shto detyrën</button>
        </form>
      </Modal>

      <Toast msg={toast}/>
    </div>
  );
}

const memberTabs=[
  {key:"home",label:"Kreu",icon:<LayoutDashboard size={15}/>,section:"Anëtar"},
  {key:"profile",label:"Profili im",icon:<User size={15}/>},
  {key:"card",label:"Karta digjitale",icon:<BadgeCheck size={15}/>},
  {key:"invoices",label:"Faturat",icon:<CreditCard size={15}/>},
  {key:"events",label:"Eventet",icon:<Calendar size={15}/>,section:"Pjesëmarrja"},
  {key:"news",label:"Njoftimet",icon:<Newspaper size={15}/>},
  {key:"polls",label:"Sondazhet",icon:<ClipboardList size={15}/>},
  {key:"donate",label:"Dono",icon:<Heart size={15}/>,section:"Kontributi"},
  {key:"card",label:"Karta ime",icon:<QrCode size={15}/>},
  {key:"messages",label:"Mesazhe",icon:<MessageSquare size={15}/>},
  {key:"minutes",label:"Procesverbale",icon:<Scroll size={15}/>},
  {key:"meso",label:"Mëso",icon:<BookOpen size={15}/>,section:"Edukimi"},
];
const adminTabs=[
  {key:"home",label:"Paneli",icon:<LayoutDashboard size={15}/>,section:"Kryesore"},
  {key:"members",label:"Anëtarët",icon:<Users size={15}/>},
  {key:"onboarding",label:"Onboarding",icon:<UserPlus size={15}/>},
  {key:"payments",label:"Pagesat",icon:<CreditCard size={15}/>},
  {key:"finance",label:"Financat",icon:<BarChart2 size={15}/>},
  {key:"growth",label:"Rritja",icon:<LineChart size={15}/>},
  {key:"events",label:"Eventet",icon:<Calendar size={15}/>,section:"Aktiviteti"},
  {key:"calendar",label:"Kalendari",icon:<CalendarCheck size={15}/>},
  {key:"checkin",label:"Check-in",icon:<UserCheck size={15}/>},
  {key:"elections",label:"Zgjedhjet",icon:<Zap size={15}/>,section:"Politika"},
  {key:"recruitment",label:"Rekrutimi",icon:<UserPlus size={15}/>},
  {key:"map",label:"Harta",icon:<MapPin size={15}/>},
  {key:"tasks",label:"Detyrat",icon:<ClipboardCheck size={15}/>,section:"Organizimi"},
  {key:"comms",label:"Komunikimi",icon:<Megaphone size={15}/>},
  {key:"polls",label:"Sondazhet",icon:<ClipboardList size={15}/>},
  {key:"donations",label:"Donacionet",icon:<Heart size={15}/>},
  {key:"reminders",label:"Kujtesat",icon:<BellRing size={15}/>},
  {key:"processverbal",label:"Procesverbalet",icon:<ClipboardCheck size={15}/>,section:"Arkiva"},
  {key:"requests",label:"Kërkesat",icon:<MessageSquare size={15}/>},
  {key:"archive",label:"Arkiva",icon:<Archive size={15}/>},
  {key:"settings",label:"Cilësimet",icon:<Settings size={15}/>,section:"Sistemi"},
];

export default function App(){
  const [role,setRole]=useState(null);
  const [tab,setTab]=useState("home");
  const [members,setMembers]=useLocalState("vv-members",seedMembers);
  const [events,setEvents]=useLocalState("vv-events",seedEvents);
  const [announcements,setAnnouncements]=useLocalState("vv-announcements",seedAnnouncements);
  const [polls,setPolls]=useLocalState("vv-polls",seedPolls);
  const [dark,setDark]=useState(false);
  const [lang,setLang]=useState("sq");
  const [showLogin,setShowLogin]=useState(false);
  const [showOnboarding,setShowOnboarding]=useState(false);

  useEffect(()=>{
    const h=e=>{
      if(["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName))return;
      if(e.key==="d"){setDark(d=>!d);}
      if(e.key==="/"||e.key==="k"){e.preventDefault();window.dispatchEvent(new CustomEvent("vv-search-focus"));}
      if(e.key==="l"){setLang(l=>l==="sq"?"de":"sq");}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[]);

  useEffect(()=>{
    const id=setInterval(()=>{
      setPolls(prev=>prev.map(p=>{
        if(p.status!=="aktiv")return p;
        const r=Math.random();
        if(r<0.45)return{...p,yes:p.yes+1};
        if(r<0.70)return{...p,no:p.no+1};
        if(r<0.82)return{...p,abstain:p.abstain+1};
        return p;
      }));
    },3500);
    return()=>clearInterval(id);
  },[]);

  function handleLogin(r){
    if(r==="apply"){setRole("apply");return;}
    if(r==="member") setShowOnboarding(true);
    setRole(r);
    setTab("home");
  }
  function handleLogout(){setRole(null);setTab("home");setShowLogin(false);}
  function handleRsvpChange(eventId,newRsvp){setEvents(prev=>prev.map(e=>e.id===eventId?{...e,rsvp:newRsvp}:e));}

  if(!role&&!showLogin) return <PublicHome onLogin={()=>setShowLogin(true)} onApply={()=>setRole("apply")}/>;
  if(!role&&showLogin) return <LangCtx.Provider value={lang}><div className={`vv${dark?" vv--dark":""}`}><style>{css}</style><Login onLogin={handleLogin} lang={lang} onLangToggle={()=>setLang(l=>l==="sq"?"de":"sq")} onBack={()=>setShowLogin(false)}/></div></LangCtx.Provider>;
  if(role==="apply") return <LangCtx.Provider value={lang}><div className={`vv${dark?" vv--dark":""}`}><style>{css}</style><ApplyForm onBack={()=>{setRole(null);setShowLogin(false);}}/></div></LangCtx.Provider>;

  const me=role==="member"?members.find(m=>m.id===5)||members[4]:members.find(m=>m.id===3)||members[2];

  if(role==="member"&&showOnboarding) return(
    <LangCtx.Provider value={lang}>
      <div className={`vv${dark?" vv--dark":""}`}>
        <style>{css}</style>
        <OnboardingFlow
          me={me}
          onDone={()=>setShowOnboarding(false)}
          onSavePhone={(phone)=>setMembers(prev=>prev.map(m=>m.id===5?{...m,phone}:m))}
        />
      </div>
    </LangCtx.Provider>
  );

  function renderMemberTab(){
    switch(tab){
      case"home": return <MemberHome me={me} events={events} announcements={announcements} polls={polls}/>;
      case"profile": return <MemberProfile me={me}/>;
      case"invoices": return <MemberInvoices me={me}/>;
      case"events": return <MemberEvents me={me} events={events} onRsvpChange={handleRsvpChange}/>;
      case"news": return <MemberNews announcements={announcements} docs={seedDocs} news={seedNews}/>;
      case"card": return <MemberCard me={me}/>;
      case"donate": return <MemberDonate me={me}/>;
      case"polls": return <MemberPolls me={me} polls={polls} setPolls={setPolls}/>;
      case"messages": return <MemberMessages me={me}/>;
      case"minutes": return <MemberMinutes members={members}/>;
      case"meso": return <MemberMeso/>;
      default: return <MemberHome me={me} events={events} announcements={announcements} polls={polls}/>;
    }
  }

  function renderAdminTab(){
    switch(tab){
      case"home": return <AdminHome members={members} events={events}/>;
      case"members": return <AdminMembers members={members} setMembers={setMembers} events={events} polls={polls}/>;
      case"onboarding": return <AdminOnboarding/>;
      case"payments": return <AdminPayments members={members} setMembers={setMembers}/>;
      case"finance": return <AdminFinance/>;
      case"events": return <AdminEvents events={events} setEvents={setEvents} members={members}/>;
      case"calendar": return <AdminCalendar/>;
      case"checkin": return <AdminCheckin members={members} events={events}/>;
      case"tasks": return <AdminTasks members={members}/>;
      case"comms": return <AdminComms members={members} announcements={announcements} setAnnouncements={setAnnouncements}/>;
      case"elections": return <AdminElections members={members}/>;
      case"polls": return <AdminPolls polls={polls} setPolls={setPolls}/>;
      case"donations": return <AdminDonations/>;
      case"recruitment": return <AdminRecruitment/>;
      case"map": return <AdminMap/>;
      case"processverbal": return <AdminProcessverbal/>;
      case"reminders": return <AdminReminders members={members}/>;
      case"growth": return <AdminGrowth/>;
      case"requests": return <AdminRequests/>;
      case"archive": return <AdminArchive/>;
      case"settings": return <AdminSettings members={members}/>;
      default: return <AdminHome members={members} events={events}/>;
    }
  }

  return(
    <LangCtx.Provider value={lang}>
      <div className={`vv${dark?" vv--dark":""}`}>
        <style>{css}</style>
        <Shell
          role={role} tab={tab} setTab={setTab} onLogout={handleLogout}
          adminTabs={adminTabs} memberTabs={memberTabs}
          dark={dark} onToggleDark={()=>setDark(d=>!d)}
          lang={lang} onLangToggle={()=>setLang(l=>l==="sq"?"de":"sq")}
          members={members} events={events} announcements={announcements}
          meId={role==="member"?5:3}
        >
          {role==="member"?renderMemberTab():renderAdminTab()}
        </Shell>
      </div>
    </LangCtx.Provider>
  );
}

function OnboardingFlow({me,onDone,onSavePhone}){
  const TOTAL=4;
  const [step,setStep]=useState(0);
  const [phone,setPhone]=useState(me.phone||"");

  const next=()=>step<TOTAL-1?setStep(s=>s+1):onDone();
  const prev=()=>setStep(s=>Math.max(s-1,0));

  const features=[
    {icon:<Calendar size={20} color={C.red}/>,title:"Eventet",desc:"Regjistrohu në aktivitete dhe takime të pikës."},
    {icon:<BarChart2 size={20} color={C.red}/>,title:"Sondazhet",desc:"Voto në sondazhet e organizatës."},
    {icon:<Newspaper size={20} color={C.red}/>,title:"Njoftimet",desc:"Qëndro i informuar me lajme nga pika."},
    {icon:<Heart size={20} color={C.red}/>,title:"Donacionet",desc:"Mbaj zhvillimin e organizatës financiarisht."},
  ];

  const Dots=({override})=>(
    <div className="ob-steps" style={{marginBottom:28}}>
      {Array.from({length:TOTAL}).map((_,i)=>(
        <div key={i} className={`ob-step-dot${i===step?" active":""}`}
          style={override&&i===step?{background:override,width:24,borderRadius:4}:undefined}/>
      ))}
    </div>
  );

  const Hero=({stepNum,title,sub})=>(
    <div className="ob-card-hero">
      <Dots/>
      <div style={{color:"rgba(255,255,255,.65)",fontSize:11,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",marginBottom:8}}>Hapi {stepNum} nga {TOTAL}</div>
      <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:26,color:"#fff",lineHeight:1.1,marginBottom:sub?8:0}}>{title}</h2>
      {sub&&<p style={{color:"rgba(255,255,255,.75)",fontSize:13,lineHeight:1.55,position:"relative",zIndex:1,margin:0}}>{sub}</p>}
    </div>
  );

  return(
    <div className="ob-root">
      <div className="ob-wrap">
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="vv-emblem">VV</div>
          <div>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:13,lineHeight:1}}>VETËVENDOSJE!</div>
            <div style={{fontSize:11,color:C.inkSoft}}>Pika Winterthur</div>
          </div>
        </div>

        <div className="ob-card">

          {step===0&&<>
            <div className="ob-card-hero">
              <Dots/>
              <div style={{color:"rgba(255,255,255,.65)",fontSize:11,fontWeight:700,letterSpacing:".09em",textTransform:"uppercase",marginBottom:8}}>Hapi 1 nga {TOTAL}</div>
              <h1 style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:30,color:"#fff",lineHeight:1.05,marginBottom:10}}>Mirë se erdhe,<br/>{me.name.split(" ")[0]}!</h1>
              <p style={{color:"rgba(255,255,255,.8)",fontSize:14,lineHeight:1.6,position:"relative",zIndex:1,margin:0}}>Jeni anëtar i ri i Pikës Winterthur. Ja çfarë ju pret në platformë.</p>
            </div>
            <div className="ob-card-body">
              <div className="ob-feature-grid">
                {features.map(f=>(
                  <div key={f.title} className="ob-feature">
                    <div style={{marginBottom:8}}>{f.icon}</div>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{f.title}</div>
                    <div style={{color:C.inkSoft,fontSize:12,lineHeight:1.5}}>{f.desc}</div>
                  </div>
                ))}
              </div>
              <button className="vv-btn" style={{width:"100%",justifyContent:"center"}} onClick={next}>
                Fillo<ChevronRight size={15}/>
              </button>
            </div>
          </>}

          {step===1&&<>
            <Hero stepNum={2} title="Konfirmo profilin" sub="Verifikoni të dhënat tuaja bazike."/>
            <div className="ob-card-body">
              <div style={{display:"grid",gap:12,marginBottom:24}}>
                {[[User,"Emri i plotë",me.name],[Mail,"Email",me.email],[MapPin,"Kantoni",me.kanton]].map(([Icon,lbl,val])=>(
                  <div key={lbl}>
                    <div style={{fontSize:11,fontWeight:600,color:C.inkSoft,marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>{lbl}</div>
                    <div style={{display:"flex",alignItems:"center",gap:10,background:"#F8F7F3",borderRadius:10,padding:"11px 14px",border:`1px solid ${C.line}`}}>
                      <Icon size={14} color={C.inkSoft}/>
                      <span style={{fontSize:14,color:C.inkSoft,flex:1}}>{val}</span>
                      <BadgeCheck size={14} color={C.green}/>
                    </div>
                  </div>
                ))}
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.inkSoft,marginBottom:5,textTransform:"uppercase",letterSpacing:".07em"}}>Numri i telefonit</div>
                  <div style={{display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:10,border:`1.5px solid ${C.line}`,padding:"2px 14px 2px 10px"}}>
                    <Phone size={14} color={C.inkSoft}/>
                    <input className="vv-input" style={{border:"none",background:"transparent",padding:"9px 0",flex:1,fontSize:14}} type="tel" placeholder="+41 XX XXX XX XX" value={phone} onChange={e=>setPhone(e.target.value)}/>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="vv-btn ghost" style={{flex:1,justifyContent:"center"}} onClick={prev}><ChevronLeft size={15}/>Kthehu</button>
                <button className="vv-btn" style={{flex:2,justifyContent:"center"}} onClick={()=>{onSavePhone&&onSavePhone(phone);next();}}>Konfirmo<ChevronRight size={15}/></button>
              </div>
            </div>
          </>}

          {step===2&&<>
            <Hero stepNum={3} title="Kuota e anëtarësimit" sub="Kontributi juaj mban organizatën aktive."/>
            <div className="ob-card-body">
              <div style={{background:"linear-gradient(135deg,#E7F4ED,#D5EEE1)",border:"1px solid rgba(30,138,76,.15)",borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{width:44,height:44,borderRadius:12,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Banknote size={22} color="#fff"/>
                </div>
                <div>
                  <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:28,color:C.green,lineHeight:1}}>CHF 150</div>
                  <div style={{fontSize:12,color:C.inkSoft,marginTop:2}}>Kuota vjetore · 2026</div>
                </div>
                <div style={{marginLeft:"auto",background:me.pay==="papaguar"?"#FEF3C7":"#E7F4ED",border:`1px solid ${me.pay==="papaguar"?"#F59E0B":"#6EE7A0"}`,borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,color:me.pay==="papaguar"?"#92400E":C.green}}>{me.pay==="papaguar"?"Papaguar":"Paguar ✓"}</div>
              </div>
              <div style={{background:"#F8F7F3",borderRadius:12,padding:"16px 18px",marginBottom:16,border:`1px solid ${C.line}`}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:C.inkSoft,marginBottom:12}}>Transfertë bankare</div>
                {[["IBAN","CH56 0483 5012 3456 7800 9"],["Përfituesi","VV Pika Winterthur"],["Qëllimi",`Kuota 2026 – ${me.name}`],["Shuma","CHF 150.00"]].map(([lbl,val])=>(
                  <div key={lbl} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"6px 0",borderBottom:`1px solid ${C.line}`}}>
                    <span style={{fontSize:12,color:C.inkSoft,fontWeight:600}}>{lbl}</span>
                    <span style={{fontSize:12,fontWeight:700,textAlign:"right",maxWidth:"62%"}}>{val}</span>
                  </div>
                ))}
              </div>
              <p style={{fontSize:12,color:C.inkSoft,lineHeight:1.55,marginBottom:20,display:"flex",gap:6,alignItems:"flex-start"}}>
                <AlertCircle size={13} style={{flexShrink:0,marginTop:1}}/>
                <span>Mund të paguani edhe me para në dorë në takimin e radhës ose me QR-kod. Administratori do t'ju konfirmojë pagesën.</span>
              </p>
              <div style={{display:"flex",gap:10}}>
                <button className="vv-btn ghost" style={{flex:1,justifyContent:"center"}} onClick={prev}><ChevronLeft size={15}/>Kthehu</button>
                <button className="vv-btn" style={{flex:2,justifyContent:"center"}} onClick={next}>E kuptova<ChevronRight size={15}/></button>
              </div>
            </div>
          </>}

          {step===3&&(
            <div className="ob-card-body" style={{textAlign:"center",padding:"52px 36px"}}>
              <div className="ob-done-icon" style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#E7F4ED,#C8EBD7)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
                <CheckCircle2 size={42} color={C.green}/>
              </div>
              <div className="ob-steps" style={{justifyContent:"center",marginBottom:24}}>
                {Array.from({length:TOTAL}).map((_,i)=>(
                  <div key={i} className={`ob-step-dot${i===step?" active":""}`}
                    style={{background:i===step?"#1E8A4C":"rgba(30,138,76,.25)",width:i===step?24:8,borderRadius:i===step?4:50}}/>
                ))}
              </div>
              <h2 style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:28,marginBottom:10}}>Gati, {me.name.split(" ")[0]}!</h2>
              <p style={{color:C.inkSoft,lineHeight:1.65,fontSize:14,marginBottom:32,maxWidth:320,margin:"0 auto 32px"}}>
                Mirë se erdhe në familjen e Pikës Winterthur. Platforma është gati — eksploroni eventet, votoni në sondazhe dhe qëndroni të lidhur.
              </p>
              <button className="vv-btn" style={{justifyContent:"center",paddingLeft:28,paddingRight:28}} onClick={onDone}>
                <Zap size={15}/>Hyr në platformë
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const OB_STAGES=[
  {key:"aplikim",label:"Aplikim",color:C.amber,bg:"#FEF3C7",border:"#F59E0B"},
  {key:"aprovuar",label:"Aprovuar",color:"#7C3AED",bg:"#EDE9FE",border:"#A78BFA"},
  {key:"pret_pagesen",label:"Pret pagesën",color:"#0369A1",bg:"#E0F2FE",border:"#38BDF8"},
  {key:"aktiv",label:"Aktiv",color:C.green,bg:"#E7F4ED",border:"#6EE7A0"},
  {key:"refuzuar",label:"Refuzuar",color:"#9F1239",bg:"#FFE4E6",border:"#FDA4AF"},
];
function obStage(key){return OB_STAGES.find(s=>s.key===key)||OB_STAGES[0];}

function AdminOnboarding(){
  const [apps,setApps]=useState(seedApplications);
  const [selected,setSelected]=useState(null);
  const [filter,setFilter]=useState("all");
  const [toast,showToast]=useToast();

  const counts=Object.fromEntries(OB_STAGES.map(s=>[s.key,apps.filter(a=>a.status===s.key).length]));
  const stageOrder=["aplikim","aprovuar","pret_pagesen","aktiv"];

  function move(id,newStatus){
    const today=new Date().toLocaleDateString("de-CH");
    setApps(prev=>prev.map(a=>a.id===id?{...a,status:newStatus,
      approvedDate:newStatus==="aprovuar"?today:a.approvedDate,
      paidDate:newStatus==="aktiv"?today:a.paidDate,
    }:a));
    setSelected(s=>s&&s.id===id?{...s,status:newStatus,
      approvedDate:newStatus==="aprovuar"?today:s.approvedDate,
      paidDate:newStatus==="aktiv"?today:s.paidDate,
    }:s);
    const labels={aprovuar:"Aplikimi u aprovua",pret_pagesen:"U shënua si pret pagesën",aktiv:"Anëtari u aktivizua",refuzuar:"Aplikimi u refuzua",aplikim:"U kthye në aplikim"};
    showToast(labels[newStatus]||"Statusi u ndryshua");
  }

  const visible=filter==="all"?apps.filter(a=>a.status!=="refuzuar"):apps.filter(a=>a.status===filter);

  const ACTIONS={
    aplikim:[{label:"Aprovo",cls:"grn",next:"aprovuar"},{label:"Refuzo",cls:"ghost",next:"refuzuar"}],
    aprovuar:[{label:"Email mirëseardhjeje",cls:"ghost",fn:(a)=>showToast(`Email u dërgua tek ${a.email}`)},{label:"Konfirmo dërgim kuotë",cls:"grn",next:"pret_pagesen"}],
    pret_pagesen:[{label:"Konfirmo pagesën ✓",cls:"grn",next:"aktiv"}],
    aktiv:[],
    refuzuar:[{label:"Rishiko",cls:"ghost",next:"aplikim"}],
  };

  const sel=selected?apps.find(a=>a.id===selected.id)||selected:null;

  return(
    <div style={{padding:24,maxWidth:1100,margin:"0 auto"}}>
      <SectionTitle title="Onboarding i anëtarëve të rinj" sub="Pipeline i aplikimeve dhe integrimit"/>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {[
          ["Aktive gjithsej",counts.aplikim+counts.aprovuar+counts.pret_pagesen,C.ink,"#F3F2EF"],
          ["Presin aprovim",counts.aplikim,C.amber,"#FEF3C7"],
          ["Pret pagesën",counts.pret_pagesen,"#0369A1","#E0F2FE"],
          ["U onboarduan",counts.aktiv,C.green,"#E7F4ED"],
        ].map(([lbl,val,col,bg])=>(
          <div key={lbl} style={{background:bg,borderRadius:14,padding:"16px 18px",border:`1px solid ${col}22`}}>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:col,marginBottom:6}}>{lbl}</div>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:32,color:col,lineHeight:1}}>{val}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {[["all","Të gjitha",null],["aplikim","Aplikim",counts.aplikim],["aprovuar","Aprovuar",counts.aprovuar],["pret_pagesen","Pret pagesën",counts.pret_pagesen],["aktiv","Aktiv",counts.aktiv],["refuzuar","Refuzuar",counts.refuzuar]].map(([k,l,c])=>(
          <button key={k} onClick={()=>setFilter(k)}
            style={{padding:"5px 14px",borderRadius:999,fontSize:12,fontWeight:600,border:"1.5px solid",
              borderColor:filter===k?C.red:"rgba(23,18,16,.12)",
              background:filter===k?C.red:"transparent",
              color:filter===k?"#fff":C.inkSoft,cursor:"pointer"}}>
            {l}{c!==null&&c!==undefined?" ("+c+")":""}
          </button>
        ))}
      </div>

      {/* Application rows */}
      <div style={{display:"grid",gap:8}}>
        {visible.length===0&&<div style={{textAlign:"center",padding:"40px",color:C.inkSoft,fontSize:14}}>Nuk ka aplikime.</div>}
        {visible.map(app=>{
          const st=obStage(app.status);
          const initials=app.name.split(" ").map(w=>w[0]).join("").slice(0,2);
          return(
            <div key={app.id} className="vv-card" style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}
              onClick={()=>setSelected(app)}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(23,18,16,.10)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
              <div style={{width:40,height:40,borderRadius:"50%",background:st.bg,border:`2px solid ${st.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:st.color,flexShrink:0}}>{initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14}}>{app.name}</div>
                <div style={{fontSize:12,color:C.inkSoft,marginTop:2}}>{app.prof} · {app.kanton} · {app.applied}</div>
              </div>
              {app.referredBy&&<div style={{fontSize:11,color:C.inkSoft,display:"flex",alignItems:"center",gap:4,flexShrink:0,whiteSpace:"nowrap"}}><UserPlus size={11}/>{app.referredBy}</div>}
              <div style={{background:st.bg,color:st.color,border:`1px solid ${st.border}`,borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:700,flexShrink:0,whiteSpace:"nowrap"}}>{st.label}</div>
              <ChevronRight size={15} color={C.inkSoft} style={{flexShrink:0}}/>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {sel&&(
        <Modal title={sel.name} onClose={()=>setSelected(null)}>
          <div style={{display:"grid",gap:20}}>

            {/* Pipeline progress */}
            <div>
              <div className="vv-eyebrow" style={{marginBottom:12}}>Faza e onboardingut</div>
              <div style={{display:"flex",alignItems:"center"}}>
                {stageOrder.map((sk,i)=>{
                  const s=obStage(sk);
                  const done=stageOrder.indexOf(sel.status)>=i&&sel.status!=="refuzuar";
                  return(
                    <React.Fragment key={sk}>
                      <div style={{textAlign:"center",flex:1}}>
                        <div style={{width:30,height:30,borderRadius:"50%",margin:"0 auto 5px",display:"flex",alignItems:"center",justifyContent:"center",background:done?s.color:"#E8E7E3",border:`2px solid ${done?s.color:"#D0CFC9"}`}}>
                          {done?<CheckCircle2 size={14} color="#fff"/>:<div style={{width:8,height:8,borderRadius:"50%",background:"#C0BDB8"}}/>}
                        </div>
                        <div style={{fontSize:10,fontWeight:600,color:done?s.color:C.inkSoft}}>{s.label}</div>
                      </div>
                      {i<stageOrder.length-1&&<div style={{height:2,flex:"0 0 16px",background:stageOrder.indexOf(sel.status)>i&&sel.status!=="refuzuar"?C.green:"#E0DFD9",marginBottom:14}}/>}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Personal info grid */}
            <div style={{background:"#F8F7F3",borderRadius:14,padding:"16px 18px"}}>
              <div className="vv-eyebrow" style={{marginBottom:12}}>Të dhënat personale</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 20px"}}>
                {[[Mail,"Email",sel.email],[Phone,"Telefon",sel.phone],[MapPin,"Kantoni",sel.kanton],[User,"Profesioni",sel.prof],[Cake,"Datëlindja",sel.dob],[CalendarCheck,"Aplikoi",sel.applied]].map(([Icon,lbl,val])=>(
                  <div key={lbl} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                    <Icon size={13} color={C.inkSoft} style={{marginTop:3,flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:10,color:C.inkSoft,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>{lbl}</div>
                      <div style={{fontSize:13,fontWeight:600,marginTop:1}}>{val||"—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral */}
            {sel.referredBy&&(
              <div style={{display:"flex",alignItems:"center",gap:10,background:"#E7F4ED",borderRadius:12,padding:"10px 14px",border:"1px solid #6EE7A044"}}>
                <UserPlus size={15} color={C.green}/>
                <span style={{fontSize:13,fontWeight:600,color:C.green}}>Referuar nga <b>{sel.referredBy}</b></span>
              </div>
            )}

            {/* Note */}
            {sel.note&&(
              <div>
                <div className="vv-eyebrow" style={{marginBottom:6}}>Arsyeja e aplikimit</div>
                <div style={{background:"#F8F7F3",borderRadius:12,padding:"12px 14px",fontSize:13,lineHeight:1.65,color:C.ink,fontStyle:"italic",borderLeft:`3px solid ${C.red}`}}>"{sel.note}"</div>
              </div>
            )}

            {/* Payment details — show when approved/waiting */}
            {(sel.status==="aprovuar"||sel.status==="pret_pagesen")&&(
              <div style={{background:"#E0F2FE",borderRadius:14,padding:"14px 16px",border:"1px solid #38BDF844"}}>
                <div className="vv-eyebrow" style={{color:"#0369A1",marginBottom:10}}>Detajet e pagesës — CHF 150</div>
                {[["IBAN","CH56 0483 5012 3456 7800 9"],["Përfituesi","VV Pika Winterthur"],["Qëllimi",`Kuota 2026 – ${sel.name}`],["Shuma","CHF 150.00"]].map(([lbl,val])=>(
                  <div key={lbl} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(3,105,161,.1)"}}>
                    <span style={{fontSize:12,color:"#0369A1",fontWeight:600}}>{lbl}</span>
                    <span style={{fontSize:12,fontWeight:700}}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Onboarding checklist */}
            <div>
              <div className="vv-eyebrow" style={{marginBottom:10}}>Kronologjia</div>
              {[
                {label:"Aplikimi u dërgua",date:sel.applied,done:true},
                {label:"Aprovuar nga kryesia",date:sel.approvedDate,done:!!sel.approvedDate},
                {label:"Email mirëseardhjeje u dërgua",date:sel.approvedDate,done:!!sel.approvedDate},
                {label:"Detajet e pagesës u dërguan",date:sel.approvedDate,done:!!sel.approvedDate},
                {label:"Pagesa e kuotës u konfirmua",date:sel.paidDate,done:!!sel.paidDate},
                {label:"Hyrje në platformë e aktivizuar",date:sel.paidDate,done:sel.status==="aktiv"},
              ].map((ev,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"5px 0",borderBottom:i<5?`1px solid ${C.line}`:"none"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:ev.done?C.green:"#E8E7E3",display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                    {ev.done?<CheckCircle2 size={11} color="#fff"/>:<div style={{width:6,height:6,borderRadius:"50%",background:"#C0BDB8"}}/>}
                  </div>
                  <div style={{flex:1}}>
                    <span style={{fontSize:13,fontWeight:ev.done?600:400,color:ev.done?C.ink:C.inkSoft}}>{ev.label}</span>
                    {ev.done&&ev.date&&<span style={{fontSize:11,color:C.inkSoft,marginLeft:8}}>{ev.date}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            {ACTIONS[sel.status]&&ACTIONS[sel.status].length>0&&(
              <div style={{display:"flex",gap:10,flexWrap:"wrap",paddingTop:8,borderTop:`1px solid ${C.line}`}}>
                {ACTIONS[sel.status].map(act=>(
                  <button key={act.label} className={`vv-btn${act.cls===" ghost"?" ghost":act.cls==="ghost"?" ghost":act.cls==="grn"?" grn":""}`}
                    onClick={()=>{act.next?move(sel.id,act.next):act.fn&&act.fn(sel);}}>
                    {act.label}
                  </button>
                ))}
              </div>
            )}

          </div>
        </Modal>
      )}
      <Toast msg={toast}/>
    </div>
  );
}

/* ─── MESO SEED DATA ─────────────────────────────────────────────────────── */
const MESO_EVENTS=[
  // VV
  {id:1,cat:"vv",day:10,month:2,year:2005,title:"Themelimi i LVV",desc:"Albin Kurti themelon Lëvizjen VETËVENDOSJE! në Prishtinë si lëvizje qytetare për pavarësi dhe vetëvendosje të plotë."},
  {id:2,cat:"vv",day:1,month:2,year:2010,title:"Hyrja e parë në Kuvend",desc:"LVV hyn për herë të parë në Kuvendin e Kosovës me 10 deputetë pas suksesit në zgjedhjet parlamentare."},
  {id:3,cat:"vv",day:24,month:1,year:2014,title:"Aksioni i gazit lotsjellës",desc:"Deputetët e VV-së lëshojnë gaz lotsjellës në sallën e Kuvendit kundër marrëveshjes Beograd–Prishtinë, duke e bllokuar ratifikimin."},
  {id:4,cat:"vv",day:6,month:10,year:2019,title:"Fitoi zgjedhjet 2019",desc:"LVV del partia e parë në zgjedhjet parlamentare me 26% të votave — rezultat historik deri në atë kohë."},
  {id:5,cat:"vv",day:14,month:2,year:2021,title:"Fitoi zgjedhjet me 58%",desc:"VV fiton shumicë absolute historike — 58% e votave, fitore e paprecedentë në historinë politike të Kosovës."},
  {id:6,cat:"vv",day:22,month:3,year:2021,title:"Albin Kurti betohet Kryeministër",desc:"Albin Kurti betohet si Kryeministër i Kosovës për herë të dytë, duke formuar Qeverinë Kurti II me koalicion të qëndrueshëm."},
  // Kosova
  {id:7,cat:"ks",day:28,month:11,year:1443,title:"Skënderbeu kthehet në Shqipëri",desc:"Gjergj Kastrioti dezerton nga ushtria osmane në Betejën e Nishit dhe çliron Krujën — fillimi i rezistencës 25-vjeçare kundër Perandorisë Osmane."},
  {id:8,cat:"ks",day:5,month:3,year:1998,title:"Beteja e Prekaz — Rënia e Jasharajve",desc:"Forcat serbe sulmojnë familjen Jashari në Prekaz. Adem Jashari bie me gjithë familjen duke refuzuar kapitullimin. UÇK del hapur — fillimi i luftës çlirimtare."},
  {id:9,cat:"ks",day:15,month:1,year:1999,title:"Masakra e Reçakut",desc:"45 civilë shqiptarë u masakruan nga forcat policore serbe në fshatin Reçak — ngjarje që shpejtoi ndërhyrjen humanitare të NATO-s."},
  {id:10,cat:"ks",day:24,month:3,year:1999,title:"NATO fillon bombardimet",desc:"NATO nis Operacionin 'Allied Force' kundër Jugosllavisë — 78 ditë bombardimesh për të ndalur gjenocidin ndaj shqiptarëve të Kosovës."},
  {id:11,cat:"ks",day:10,month:6,year:1999,title:"Rezoluta 1244 e OKB-së",desc:"Këshilli i Sigurimit miraton Rezolutën 1244. Forcat ushtarake serbe tërhiqen nga Kosova. Kosova kalon nën administrimin e UNMIK-ut."},
  {id:12,cat:"ks",day:12,month:6,year:1999,title:"KFOR hyn në Kosovë",desc:"Forcat ndërkombëtare të NATO-s hyjnë në Kosovë — fillim i një faqeje të re pas dekadash shtypjeje dhe luftës çlirimtare."},
  {id:13,cat:"ks",day:17,month:2,year:2008,title:"Shpallja e Pavarësisë së Kosovës",desc:"Kuvendi i Kosovës shpall Pavarësinë e plotë. Kosova bëhet shteti i ri në Europë — i njohur nga mbi 100 vende anëtare të OKB-së."},
  {id:14,cat:"ks",day:9,month:4,year:2008,title:"Kushtetuta e Kosovës hyn në fuqi",desc:"Kushtetuta e Republikës së Kosovës hyn në fuqi, duke garantuar të drejtat themelore dhe pavarësinë institucionale të shtetit të ri."},
  {id:15,cat:"ks",day:28,month:11,year:1912,title:"Dita e Flamurit — 28 Nëntori",desc:"Data e shpalljes së Pavarësisë festohet edhe nga shqiptarët e Kosovës si Ditë e Flamurit Kombëtar Shqiptar."},
  // Shqipëria
  {id:16,cat:"al",day:28,month:11,year:1912,title:"Shpallja e Pavarësisë",desc:"Ismail Qemali ngre flamurin kuqezi në Vlorë dhe shpall Pavarësinë e Shqipërisë — dita e festës kombëtare, 28 Nëntori."},
  {id:17,cat:"al",day:29,month:11,year:1944,title:"Çlirimi i Shqipërisë",desc:"Shqipëria çlirohet plotësisht nga pushtimi nazifashist. Dita e Çlirimit festohet si ditë kombëtare."},
  {id:18,cat:"al",day:11,month:1,year:1946,title:"Republika Popullore e Shqipërisë",desc:"Shpallohet zyrtarisht Republika Popullore e Shqipërisë. Fillon periudha e regjimit komunist nën Enver Hoxhën, njëri nga më të izoluarit në botë."},
  {id:19,cat:"al",day:11,month:12,year:1990,title:"Themelimi i Partisë Demokratike",desc:"Studentët themelojnë Partinë Demokratike — fillimi i lëvizjes kundërkomuniste dhe tranzicionit demokratik në Shqipëri."},
  {id:20,cat:"al",day:20,month:2,year:1991,title:"Rrëzimi i bustit të Hoxhës",desc:"Protestuesit rrëzojnë bustin e Enver Hoxhës në sheshin kryesor të Tiranës — imazhi ikonik i rënies së komunizmit shqiptar."},
  {id:21,cat:"al",day:22,month:3,year:1992,title:"Zgjedhjet e para demokratike",desc:"Partia Demokratike fiton zgjedhjet e para pluraliste të lira. Fillon zyrtarisht tranzicioni demokratik i Shqipërisë."},
  {id:22,cat:"al",day:28,month:11,year:1998,title:"Kushtetuta e re e Shqipërisë",desc:"Shqipëria miraton Kushtetutën e re përmes referendumit kombëtar — themeli ligjor i demokracisë moderne shqiptare."},
];

const MESO_FIGURES=[
  {id:1,name:"Gjergj Kastrioti Skënderbeu",years:"~1405 – 1468",role:"Hero kombëtar",cat:"al",desc:"Bashkoi principatat shqiptare dhe bëri mur mbrojtës të Europës kundër Perandorisë Osmane për 25 vjet. Nofka 'Skënderbeu' i dhënë nga osmanët vetë."},
  {id:2,name:"Ismail Qemali",years:"1844 – 1919",role:"Pavarësia e Shqipërisë",cat:"al",desc:"Patrioti që ngriti flamurin kuqezi në Vlorë më 28 nëntor 1912 dhe shpalli Pavarësinë — themelues i shtetit shqiptar modern."},
  {id:3,name:"Naim Frashëri",years:"1846 – 1900",role:"Poeti kombëtar",cat:"al",desc:"Poeti i madh rilindas. Vepra 'Bagëti e Bujqësia' dhe 'Histori e Skënderbeut' janë kulm i letërsisë shqipe. Vëllai i Sami dhe Abdylit Frashëri."},
  {id:4,name:"Sami Frashëri",years:"1850 – 1904",role:"Ideologu i Rilindjes",cat:"al",desc:"Enciklopedist, gjuhëtar dhe ideologu kryesor i Lëvizjes Kombëtare. Autor i 'Shqipëria — ç'ka qenë, ç'është e ç'do të bëhetë'."},
  {id:5,name:"Fan S. Noli",years:"1882 – 1965",role:"Klerik · Politikan · Patriot",cat:"al",desc:"Peshkop Ortodoks, shkrimtar dhe politikan. Kreu 'Revolucionin e Qershorit' 1924. Themelues i Kishës Ortodokse Autoqefale Shqiptare."},
  {id:6,name:"Adem Jashari",years:"1955 – 1998",role:"Komandant legjendë i UÇK-ut",cat:"ks",desc:"Ra bashkë me 58 anëtarë të familjes në Prekaz, duke refuzuar kapitullimin. Simbol i pakompromisit dhe i lirisë së Kosovës — 'Epopeja e Jasharajve'."},
  {id:7,name:"Ibrahim Rugova",years:"1944 – 2006",role:"Presidenti i parë i Kosovës",cat:"ks",desc:"Lideri historik i LDK-së dhe i rezistencës paqësore gjatë viteve '90. Presidenti i parë i Kosovës së pavarur — 'Gandi i Ballkanit'."},
  {id:8,name:"Albin Kurti",years:"1975 –",role:"Kryetar LVV · Kryeministër",cat:"vv",desc:"Themelues i Lëvizjes VETËVENDOSJE! dhe Kryeministër i Kosovës. Ndërtoi lëvizjen nga rezistenca qytetare në parti qeverisëse me 58% të votave."},
];

const CAT_META={
  vv:{label:"VETËVENDOSJE!",color:C.red,bg:"#FDE8E7",border:"rgba(226,35,26,.2)",Icon:Flame},
  ks:{label:"Kosova",color:"#0369A1",bg:"#E0F2FE",border:"rgba(3,105,161,.2)",Icon:Flag},
  al:{label:"Shqipëria",color:"#7C3AED",bg:"#EDE9FE",border:"rgba(124,58,237,.2)",Icon:Scroll},
};
const KUIZ_PYETJET=[
  {q:"Në cilin vit u themelua Lëvizja VETËVENDOSJE!?",o:["2003","2005","2007","2010"],a:"2005"},
  {q:"Kush shpalli Pavarësinë e Shqipërisë më 28 nëntor 1912?",o:["Fan Noli","Naim Frashëri","Ismail Qemali","Sami Frashëri"],a:"Ismail Qemali"},
  {q:"Kur u shpall Pavarësia e Kosovës?",o:["10 qershor 1999","28 nëntor 2006","17 shkurt 2008","1 janar 2010"],a:"17 shkurt 2008"},
  {q:"Sa % votash mori VV në zgjedhjet e shkurtit 2021?",o:["42%","50%","58%","71%"],a:"58%"},
  {q:"Cili lider historik quhej 'Gandi i Ballkanit'?",o:["Adem Jashari","Ibrahim Rugova","Albin Kurti","Ismail Qemali"],a:"Ibrahim Rugova"},
  {q:"Kur filluan bombardimet e NATO-s kundër Jugosllavisë?",o:["15 janar 1999","10 shkurt 1999","24 mars 1999","5 prill 1999"],a:"24 mars 1999"},
  {q:"Çfarë ndodhi më 20 shkurt 1991 në Tiranë?",o:["Zgjedhjet e para","Themelimi i PD-së","Rrëzimi i bustit të Hoxhës","Shpallja e Kushtetutës"],a:"Rrëzimi i bustit të Hoxhës"},
  {q:"Sa vjet rezistoi Skënderbeu kundër pushtimit osman?",o:["10 vjet","15 vjet","25 vjet","35 vjet"],a:"25 vjet"},
  {q:"Kur ra Adem Jashari bashkë me familjen në Prekaz?",o:["15 janar 1998","5 mars 1998","24 mars 1999","28 nëntor 1997"],a:"5 mars 1998"},
  {q:"Cila është vepra kryesore e Naim Frashërit?",o:["Bagëti e Bujqësia","Himni i Flamurit","Fjala e Lirisë","Kanga e Sprasme"],a:"Bagëti e Bujqësia"},
  {q:"Kur u fut gazi lotsjellës në Kuvend nga deputetët e VV-së?",o:["2012","2013","2014","2015"],a:"2014"},
  {q:"Sa deputetë fitoi LVV në zgjedhjet e para parlamentare 2010?",o:["7","10","14","18"],a:"10"},
];

function MemberMeso(){
  const MONTHS=["","janar","shkurt","mars","prill","maj","qershor","korrik","gusht","shtator","tetor","nëntor","dhjetor"];
  const today=new Date();
  const td=today.getDate(),tm=today.getMonth()+1,ty=today.getFullYear();
  const todayEvents=MESO_EVENTS.filter(e=>e.day===td&&e.month===tm);

  // Next historical date countdown
  const nextEv=(()=>{
    const future=[...MESO_EVENTS].filter(e=>e.month*100+e.day>tm*100+td).sort((a,b)=>(a.month*100+a.day)-(b.month*100+b.day));
    const ev=future[0]||[...MESO_EVENTS].sort((a,b)=>(a.month*100+a.day)-(b.month*100+b.day))[0];
    const d=new Date(ty+(future.length?0:1),ev.month-1,ev.day);
    return{ev,days:Math.ceil((d-today)/86400000)};
  })();

  // Main tabs
  const [mainTab,setMainTab]=useState("ngjarjet");
  // Events tab state
  const [catF,setCatF]=useState("all");
  const [expanded,setExpanded]=useState(new Set());
  const [read,setRead]=useState(new Set());
  const [factEv,setFactEv]=useState(null);
  // Figure modal
  const [figSel,setFigSel]=useState(null);
  // Quiz state
  const [quizQs,setQuizQs]=useState([]);
  const [qi,setQi]=useState(0);
  const [score,setScore]=useState(0);
  const [picked,setPicked]=useState(null);
  const [done,setDone]=useState(false);

  function startQuiz(){
    const shuffled=[...KUIZ_PYETJET].sort(()=>Math.random()-.5).slice(0,6);
    setQuizQs(shuffled);setQi(0);setScore(0);setPicked(null);setDone(false);
  }
  function pickAnswer(o){
    if(picked)return;
    setPicked(o);
    const correct=o===quizQs[qi].a;
    if(correct)setScore(s=>s+1);
    setTimeout(()=>{
      if(qi+1>=quizQs.length){setDone(true);}
      else{setQi(q=>q+1);setPicked(null);}
    },1400);
  }
  function showFact(){
    const pool=catF==="all"?MESO_EVENTS:MESO_EVENTS.filter(e=>e.cat===catF);
    setFactEv(pool[Math.floor(Math.random()*pool.length)]);
  }
  function toggleExpand(id){
    setExpanded(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
    setRead(s=>{const n=new Set(s);n.add(id);return n;});
  }

  const evVisible=catF==="all"?MESO_EVENTS:MESO_EVENTS.filter(e=>e.cat===catF);
  const figVisible=catF==="all"?MESO_FIGURES:MESO_FIGURES.filter(f=>f.cat===catF);
  const CATS=[{k:"all",l:"Të gjitha"},{k:"vv",l:"VV"},{k:"ks",l:"Kosova"},{k:"al",l:"Shqipëria"}];
  const MAIN_TABS=[{k:"ngjarjet",l:"Ngjarjet"},{k:"figura",l:"Figura"},{k:"kuiz",l:"Kuiz"}];

  return(
    <div style={{padding:24,maxWidth:900,margin:"0 auto"}}>
      <SectionTitle title="Mëso" sub="Historia e lëvizjes, e Kosovës dhe e kombit shqiptar"/>

      {/* Sot në histori */}
      {todayEvents.length>0&&(
        <div style={{background:"linear-gradient(135deg,#D91E16,#8C1009)",borderRadius:18,padding:"22px 26px",marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,bottom:-60,fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:200,lineHeight:1,color:"rgba(255,255,255,.06)",pointerEvents:"none"}}>!</div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>Sot në histori · {td} {MONTHS[tm]}</div>
          {todayEvents.map(e=>{
            const m=CAT_META[e.cat];
            return(<div key={e.id}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                <span style={{background:"rgba(255,255,255,.18)",borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:700,color:"#fff"}}>{m.label}</span>
                <span style={{color:"rgba(255,255,255,.6)",fontSize:12}}>{e.year} · {ty-e.year} vjet më parë</span>
              </div>
              <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:20,color:"#fff",marginBottom:4}}>{e.title}</div>
              <div style={{color:"rgba(255,255,255,.8)",fontSize:13,lineHeight:1.6}}>{e.desc}</div>
            </div>);
          })}
        </div>
      )}

      {/* Countdown to next date */}
      <div className="vv-card" style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
        <div style={{width:44,height:44,borderRadius:12,background:"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Calendar size={20} color={C.amber}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:C.inkSoft,marginBottom:2}}>Data tjetër historike</div>
          <div style={{fontWeight:700,fontSize:14}}>{nextEv.ev.title}</div>
          <div style={{fontSize:12,color:C.inkSoft}}>{nextEv.ev.day} {MONTHS[nextEv.ev.month]} · {nextEv.ev.year}</div>
        </div>
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:32,color:C.amber,lineHeight:1}}>{nextEv.days}</div>
          <div style={{fontSize:11,color:C.inkSoft}}>ditë</div>
        </div>
      </div>

      {/* Main tab switcher */}
      <div style={{display:"flex",gap:6,marginBottom:20}}>
        {MAIN_TABS.map(({k,l})=>(
          <button key={k} onClick={()=>setMainTab(k)} style={{padding:"8px 22px",borderRadius:999,fontSize:13,fontWeight:600,border:"1.5px solid",cursor:"pointer",
            borderColor:mainTab===k?C.red:"rgba(23,18,16,.12)",background:mainTab===k?C.red:"transparent",color:mainTab===k?"#fff":C.inkSoft}}>
            {l}
          </button>
        ))}
      </div>

      {/* ── NGJARJET ── */}
      {mainTab==="ngjarjet"&&(<>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {CATS.map(({k,l})=>(
            <button key={k} onClick={()=>{setCatF(k);setFactEv(null);}} style={{padding:"5px 14px",borderRadius:999,fontSize:12,fontWeight:600,border:"1.5px solid",cursor:"pointer",
              borderColor:catF===k?"rgba(23,18,16,.4)":"rgba(23,18,16,.1)",background:catF===k?C.ink:"transparent",color:catF===k?"#fff":C.inkSoft}}>
              {l}
            </button>
          ))}
          <button onClick={showFact} style={{marginLeft:"auto",padding:"5px 14px",borderRadius:999,fontSize:12,fontWeight:600,border:"1.5px solid",cursor:"pointer",borderColor:"rgba(23,18,16,.1)",background:"transparent",color:C.inkSoft,display:"flex",alignItems:"center",gap:6}}>
            <Zap size={12}/> Fakt i rastit
          </button>
          <div style={{fontSize:12,color:C.inkSoft}}>{read.size}/{MESO_EVENTS.length} lexuar</div>
        </div>

        {/* Progress bar */}
        <div style={{height:4,borderRadius:2,background:"rgba(23,18,16,.08)",marginBottom:18,overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:2,background:C.red,width:`${(read.size/MESO_EVENTS.length)*100}%`,transition:"width .4s ease"}}/>
        </div>

        {/* Random fact spotlight */}
        {factEv&&(
          <div className="meso-fact vv-card" style={{padding:"16px 20px",marginBottom:16,border:`2px solid ${CAT_META[factEv.cat].border}`,background:CAT_META[factEv.cat].bg}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <Zap size={13} color={CAT_META[factEv.cat].color}/>
              <span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:CAT_META[factEv.cat].color}}>Fakt i rastit</span>
              <button onClick={()=>setFactEv(null)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.inkSoft}}><X size={14}/></button>
            </div>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:15,marginBottom:4}}>{factEv.title}</div>
            <div style={{fontSize:12,color:C.inkSoft,marginBottom:6}}>{factEv.day} {MONTHS[factEv.month]} {factEv.year}</div>
            <div style={{fontSize:13,color:C.ink,lineHeight:1.65}}>{factEv.desc}</div>
          </div>
        )}

        {/* Event cards */}
        <div style={{display:"grid",gap:10}}>
          {evVisible.map(ev=>{
            const meta=CAT_META[ev.cat];
            const IconC=meta.Icon;
            const isOpen=expanded.has(ev.id);
            const isRead=read.has(ev.id);
            return(
              <div key={ev.id} className="vv-card" style={{padding:"16px 20px",cursor:"pointer",border:isOpen?`1.5px solid ${meta.border}`:"",transition:"border .2s"}} onClick={()=>toggleExpand(ev.id)}>
                <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:38,height:38,borderRadius:10,background:meta.bg,border:`1px solid ${meta.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <IconC size={16} color={meta.color}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{background:meta.bg,color:meta.color,border:`1px solid ${meta.border}`,borderRadius:999,padding:"1px 8px",fontSize:10,fontWeight:700}}>{meta.label}</span>
                      <span style={{fontSize:12,color:C.inkSoft}}>{ev.day} {MONTHS[ev.month]} {ev.year}</span>
                      {isRead&&<span style={{marginLeft:"auto",fontSize:11,color:C.green,fontWeight:600,display:"flex",alignItems:"center",gap:3}}><CheckCircle2 size={11}/>Lexuar</span>}
                    </div>
                    <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:14,color:C.ink}}>{ev.title}</div>
                    {isOpen&&<div style={{fontSize:13,color:C.inkSoft,lineHeight:1.65,marginTop:8}}>{ev.desc}</div>}
                  </div>
                  <ChevronDown size={15} color={C.inkSoft} style={{flexShrink:0,transition:"transform .2s",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}/>
                </div>
              </div>
            );
          })}
        </div>
      </>)}

      {/* ── FIGURA ── */}
      {mainTab==="figura"&&(<>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {CATS.map(({k,l})=>(
            <button key={k} onClick={()=>setCatF(k)} style={{padding:"5px 14px",borderRadius:999,fontSize:12,fontWeight:600,border:"1.5px solid",cursor:"pointer",
              borderColor:catF===k?"rgba(23,18,16,.4)":"rgba(23,18,16,.1)",background:catF===k?C.ink:"transparent",color:catF===k?"#fff":C.inkSoft}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>
          {figVisible.map(fig=>{
            const meta=CAT_META[fig.cat];
            return(
              <div key={fig.id} className="vv-card" style={{padding:"18px 20px",cursor:"pointer"}}
                onClick={()=>setFigSel(fig)}
                onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(23,18,16,.12)"}
                onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:meta.bg,border:`2px solid ${meta.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <GraduationCap size={20} color={meta.color}/>
                  </div>
                  <div>
                    <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:14,lineHeight:1.2,marginBottom:2}}>{fig.name}</div>
                    <div style={{fontSize:11,color:C.inkSoft}}>{fig.years}</div>
                  </div>
                </div>
                <div style={{background:meta.bg,color:meta.color,border:`1px solid ${meta.border}`,borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:700,display:"inline-block",marginBottom:10}}>{fig.role}</div>
                <div style={{fontSize:12,color:C.inkSoft,lineHeight:1.6}}>{fig.desc}</div>
                <div style={{marginTop:12,fontSize:12,color:C.red,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>Lexo më shumë <ChevronRight size={12}/></div>
              </div>
            );
          })}
        </div>
        {figSel&&(()=>{const meta=CAT_META[figSel.cat];return(
          <Modal title={figSel.name} onClose={()=>setFigSel(null)}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:20}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:meta.bg,border:`3px solid ${meta.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <GraduationCap size={28} color={meta.color}/>
              </div>
              <div>
                <div style={{fontSize:12,color:C.inkSoft,marginBottom:4}}>{figSel.years}</div>
                <div style={{background:meta.bg,color:meta.color,border:`1px solid ${meta.border}`,borderRadius:8,padding:"4px 12px",fontSize:12,fontWeight:700,display:"inline-block"}}>{figSel.role}</div>
              </div>
            </div>
            <div style={{fontSize:14,color:C.ink,lineHeight:1.75}}>{figSel.desc}</div>
            <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${C.line}`}}>
              <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:C.inkSoft,marginBottom:10}}>Ngjarje të lidhura</div>
              {MESO_EVENTS.filter(e=>e.cat===figSel.cat).slice(0,3).map(e=>(
                <div key={e.id} style={{fontSize:13,padding:"6px 0",borderBottom:`1px solid ${C.line}`,color:C.inkSoft}}>
                  <span style={{fontWeight:600,color:C.ink}}>{e.title}</span> · {e.day} {MONTHS[e.month]} {e.year}
                </div>
              ))}
            </div>
          </Modal>
        );})()}
      </>)}

      {/* ── KUIZ ── */}
      {mainTab==="kuiz"&&(<>
        {quizQs.length===0&&(
          <div style={{textAlign:"center",padding:"48px 24px"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"#FDE8E7",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <BookOpen size={32} color={C.red}/>
            </div>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:24,marginBottom:10}}>Kuiz historik</div>
            <div style={{color:C.inkSoft,fontSize:14,lineHeight:1.65,maxWidth:340,margin:"0 auto 28px"}}>6 pyetje nga historia e VV-së, Kosovës dhe Shqipërisë. Sa mirë e njeh historinë?</div>
            <button className="vv-btn" style={{justifyContent:"center",paddingLeft:32,paddingRight:32}} onClick={startQuiz}><Zap size={15}/>Fillo kuizin</button>
          </div>
        )}
        {quizQs.length>0&&!done&&(()=>{
          const q=quizQs[qi];
          return(
            <div style={{maxWidth:560,margin:"0 auto"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:600,color:C.inkSoft}}>Pyetja {qi+1} nga {quizQs.length}</span>
                <span style={{fontSize:13,fontWeight:700,color:C.green}}>{score} ✓</span>
              </div>
              <div style={{height:6,borderRadius:3,background:"rgba(23,18,16,.08)",marginBottom:24,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:3,background:C.red,width:`${(qi/quizQs.length)*100}%`,transition:"width .4s"}}/>
              </div>
              <div className="vv-card" style={{padding:"24px"}}>
                <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:18,marginBottom:24,lineHeight:1.35}}>{q.q}</div>
                {q.o.map(o=>{
                  let cls="meso-opt";
                  if(picked){if(o===q.a)cls+=" correct";else if(o===picked)cls+=" wrong";}
                  return(<button key={o} className={cls} disabled={!!picked} onClick={()=>pickAnswer(o)}>{o}</button>);
                })}
              </div>
            </div>
          );
        })()}
        {done&&(
          <div style={{textAlign:"center",padding:"48px 24px"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:score>=5?"#E7F4ED":"#FEF3C7",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <Star size={36} color={score>=5?C.green:C.amber}/>
            </div>
            <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:900,fontSize:32,marginBottom:6}}>{score}/{quizQs.length}</div>
            <div style={{fontSize:15,color:C.inkSoft,marginBottom:8}}>
              {score===quizQs.length?"Perfekt! Historiani i pikës 🏆":score>=4?"Shumë mirë! Vazhdo kështu.":score>=2?"Mirë, por ka vend për tu përmirësuar.":"Lexo seksionin 'Ngjarjet' dhe provo sërish!"}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:24,flexWrap:"wrap"}}>
              <button className="vv-btn" onClick={startQuiz}><RefreshCw size={14}/>Provo sërish</button>
              <button className="vv-btn ghost" onClick={()=>{setQuizQs([]);setDone(false);}}>Kthehu</button>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

const MSG_TYPES=["Pyetje për pagesën","Pyetje për anëtarësinë","Sugjerim","Kërkesë informacioni","Tjetër"];
const seedMemberRequests=[
  {id:"q1",type:"Pyetje për pagesën",msg:"Si mund ta paguaj kuotën në dy këste?",date:"15.06.2026 10:22",status:"pret",reply:""},
];
function MemberMessages({me}){
  const [reqs,setReqs]=useState(seedMemberRequests);
  const [type,setType]=useState(MSG_TYPES[0]);
  const [msg,setMsg]=useState("");
  const [toast,showToast]=useToast();

  function send(){
    if(!msg.trim())return;
    const now=new Date();
    const d=`${now.toLocaleDateString("de-CH")} ${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
    setReqs(prev=>[{id:Date.now().toString(),type,msg:msg.trim(),date:d,status:"pret",reply:""},
      ...prev]);
    setMsg("");
    showToast("Mesazhi u dërgua te kryesia ✓");
  }

  const STATUS={pret:{label:"Pret",bg:"#FEF3C7",color:C.amber},u_pergjigj:{label:"U përgjigj",bg:"#E7F4ED",color:C.green},mbyllur:{label:"Mbyllur",bg:"#F3F2EF",color:C.inkSoft}};

  return(
    <div style={{padding:24,maxWidth:720,margin:"0 auto"}}>
      <SectionTitle title="Mesazhe me kryesinë" sub="Dërgo pyetje ose kërkesa direkt te ekipi i pikës"/>

      {/* Form */}
      <div className="vv-card" style={{padding:"20px 24px",marginBottom:24}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:14,display:"flex",alignItems:"center",gap:8}}><MessageSquare size={15} color={C.red}/>Mesazh i ri</div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".07em",color:C.inkSoft,marginBottom:6}}>Lloji</div>
          <select className="vv-input" value={type} onChange={e=>setType(e.target.value)} style={{width:"100%"}}>
            {MSG_TYPES.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".07em",color:C.inkSoft,marginBottom:6}}>Mesazhi</div>
          <textarea className="vv-input" rows={3} style={{width:"100%",resize:"vertical"}} placeholder="Shkruaj mesazhin tënd këtu…" value={msg} onChange={e=>setMsg(e.target.value)}/>
        </div>
        <button className="vv-btn" onClick={send} disabled={!msg.trim()}><Send size={14}/>Dërgo</button>
      </div>

      {/* History */}
      <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Historiku i mesazheve</div>
      {reqs.length===0?<div style={{color:C.inkSoft,fontSize:14,textAlign:"center",padding:32}}>Nuk ke dërguar asnjë mesazh ende.</div>:(
        <div style={{display:"grid",gap:12}}>
          {reqs.map(r=>{
            const s=STATUS[r.status]||STATUS.pret;
            return(
              <div key={r.id} className="vv-card" style={{padding:"16px 20px"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{r.type}</div>
                    <div style={{fontSize:11,color:C.inkSoft}}>{r.date}</div>
                  </div>
                  <div style={{background:s.bg,color:s.color,borderRadius:999,padding:"3px 10px",fontSize:11,fontWeight:700,flexShrink:0}}>{s.label}</div>
                </div>
                <div style={{fontSize:13,color:C.inkSoft,lineHeight:1.65,background:"#F8F7F3",borderRadius:10,padding:"10px 12px",borderLeft:`3px solid ${C.line}`}}>{r.msg}</div>
                {r.reply&&(
                  <div style={{marginTop:10,fontSize:13,lineHeight:1.65,background:"#E7F4ED",borderRadius:10,padding:"10px 12px",borderLeft:`3px solid #6EE7A0`}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.green,marginBottom:4}}>Përgjigja e kryesisë</div>
                    {r.reply}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Toast msg={toast}/>
    </div>
  );
}

function MemberMinutes({members}){
  const [sel,setSel]=useState(null);
  const [toast,showToast]=useToast();
  return(
    <div style={{padding:24,maxWidth:800,margin:"0 auto"}}>
      <SectionTitle title="Procesverbalet" sub="Vendimet dhe raportet e mbledhjeve të pikës"/>
      <div style={{display:"grid",gap:14}}>
        {seedMinutes.map(m=>(
          <div key={m.id} className="vv-card" style={{padding:"18px 22px",cursor:"pointer"}}
            onClick={()=>setSel(m)}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(23,18,16,.1)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:"#EDE9FE",border:"1px solid rgba(124,58,237,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Scroll size={20} color="#7C3AED"/>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5,flexWrap:"wrap"}}>
                  <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:800,fontSize:15}}>{m.title}</div>
                  <div style={{background:"#E7F4ED",color:C.green,borderRadius:999,padding:"2px 10px",fontSize:11,fontWeight:700}}>{m.status==="final"?"Final":"Draft"}</div>
                </div>
                <div style={{fontSize:12,color:C.inkSoft,display:"flex",gap:14,flexWrap:"wrap"}}>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Calendar size={11}/>{m.date}</span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={11}/>{m.place}</span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Users size={11}/>{m.present.length} të pranishëm</span>
                </div>
                <div style={{marginTop:8,fontSize:12,color:C.inkSoft}}>
                  <span style={{fontWeight:600}}>Vendime:</span> {m.decisions.join(" · ")}
                </div>
              </div>
              <ChevronRight size={15} color={C.inkSoft} style={{flexShrink:0,marginTop:4}}/>
            </div>
          </div>
        ))}
      </div>

      {sel&&(
        <Modal title={sel.title} onClose={()=>setSel(null)}>
          <div style={{display:"grid",gap:18}}>
            <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
              <Field icon={<Calendar size={14}/>} label="Data" value={sel.date}/>
              <Field icon={<MapPin size={14}/>} label="Vendi" value={sel.place}/>
            </div>
            <div>
              <div className="vv-eyebrow" style={{marginBottom:10}}>Të pranishëm ({sel.present.length})</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {sel.present.map(id=>{
                  const mb=members.find(x=>x.id===id);
                  return mb?(
                    <div key={id} style={{background:"#F3F2EF",borderRadius:999,padding:"4px 12px",fontSize:12,fontWeight:600}}>{mb.name}</div>
                  ):null;
                })}
              </div>
            </div>
            <div>
              <div className="vv-eyebrow" style={{marginBottom:10}}>Vendimet e mbledhjes</div>
              {sel.decisions.map((d,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"8px 0",borderBottom:i<sel.decisions.length-1?`1px solid ${C.line}`:"none"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"#E7F4ED",border:"1.5px solid #6EE7A0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <CheckCircle2 size={12} color={C.green}/>
                  </div>
                  <span style={{fontSize:13,lineHeight:1.6,paddingTop:2}}>{d}</span>
                </div>
              ))}
            </div>
            <div style={{paddingTop:4,borderTop:`1px solid ${C.line}`,display:"flex",gap:10}}>
              <button className="vv-btn ghost" onClick={()=>showToast("PDF u dërgua në email tënd ✓")}><Download size={14}/>Shkarko PDF</button>
              <button className="vv-btn ghost" onClick={()=>showToast("Procesverbali u nda me WhatsApp ✓")}><Globe size={14}/>Ndaj</button>
            </div>
          </div>
        </Modal>
      )}
      <Toast msg={toast}/>
    </div>
  );
}
