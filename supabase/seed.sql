insert into public.members (id,name,email,status,pay,extra) values
(1,'Sami Biqkaj','sami.biqkaj@example.ch','aktiv','paguar','{"role":"Kryetar","kanton":"Zürich","phone":"+41 79 000 00 01","joined":"12.03.2019","prof":"Inxhinier","dob":"04.02.1981"}'::jsonb),
(2,'Valton Rexha','valton.rexha@example.ch','aktiv','paguar','{"role":"Nënkryetar","kanton":"Zürich","phone":"+41 79 000 00 02","joined":"12.03.2019","prof":"Mësues","dob":"19.07.1985"}'::jsonb),
(3,'Egzont Demiri','egzont@vetvendosje.ch','aktiv','paguar','{"role":"Sekretar / Admin","kanton":"Zürich","phone":"+41 79 000 00 03","joined":"08.01.2021","prof":"Inxhinier softueri","dob":"—"}'::jsonb),
(4,'Arta Krasniqi','arta.k@example.ch','aktiv','paguar','{"role":"Sekretare e Financave","kanton":"Aargau","phone":"+41 79 000 00 04","joined":"20.05.2020","prof":"Llogaritare","dob":"11.09.1988"}'::jsonb),
(5,'Blerim Gashi','blerim.g@example.ch','aktiv','papaguar','{"role":"Anëtar","kanton":"Zürich","phone":"+41 79 000 00 05","joined":"03.02.2022","prof":"Elektricist","dob":"27.11.1990"}'::jsonb),
(6,'Fatlinda Berisha','fatlinda.b@example.ch','aktiv','paguar','{"role":"Anëtare","kanton":"Thurgau","phone":"+41 79 000 00 06","joined":"14.06.2022","prof":"Infermiere","dob":"02.04.1992"}'::jsonb),
(7,'Driton Morina','driton.m@example.ch','aktiv','papaguar','{"role":"Anëtar","kanton":"Zürich","phone":"+41 79 000 00 07","joined":"01.09.2023","prof":"Shofer","dob":"15.12.1987"}'::jsonb),
(8,'Leotrim Hoxha','leotrim.h@example.ch','aktiv','paguar','{"role":"Anëtar","kanton":"St. Gallen","phone":"+41 79 000 00 08","joined":"22.02.2021","prof":"Programues","dob":"30.08.1994"}'::jsonb),
(9,'Vjosa Salihu','vjosa.s@example.ch','aktiv','paguar','{"role":"Anëtare (studente)","kanton":"Zürich","phone":"+41 79 000 00 09","joined":"10.10.2023","prof":"Studente","dob":"05.05.2002","reduced":true}'::jsonb),
(10,'Ramadan Kelmendi','ramadan.k@example.ch','aktiv','liruar','{"role":"Anëtar (pensionist)","kanton":"Aargau","phone":"+41 79 000 00 10","joined":"01.01.2019","prof":"Pensionist","dob":"18.03.1955","exempt":true}'::jsonb),
(11,'Donjeta Bytyqi','donjeta.b@example.ch','joaktiv','papaguar','{"role":"Simpatizante","kanton":"Zürich","phone":"+41 79 000 00 11","joined":"07.07.2024","prof":"Studente","dob":"21.06.2001"}'::jsonb),
(12,'Florent Ahmeti','florent.a@example.ch','aktiv','papaguar','{"role":"Anëtar","kanton":"Schaffhausen","phone":"+41 79 000 00 12","joined":"18.11.2022","prof":"Kuzhinier","dob":"09.01.1989"}'::jsonb);

insert into public.events (id,title,public,rsvp,extra) values
(1,'Mbledhja e Rregullt e Pikës',false,'{1,2,3,4,6,8}'::bigint[],'{"date":"27.06.2026","time":"18:00","place":"Salla e Komunitetit, Zürich","type":"Mbledhje","max":60,"past":false}'::jsonb),
(2,'Festa e Flamurit — 28 Nëntori',true,'{1,2,3,5,6,8,9,12}'::bigint[],'{"date":"28.11.2026","time":"19:00","place":"Volkshaus, Zürich","type":"Manifestim","max":300,"past":false}'::jsonb),
(3,'Aksion Humanitar për Familjet',true,'{3,4,6}'::bigint[],'{"date":"12.07.2026","time":"10:00","place":"Qendra e Pikës, Zürich","type":"Aktivitet","max":40,"past":false}'::jsonb),
(4,'Manifestim për Pavarësinë',true,'{1,2,3,4,5,6,7,8,9,12}'::bigint[],'{"date":"17.02.2026","time":"17:00","place":"Sheshi Qendror, Zürich","type":"Manifestim","max":200,"past":true}'::jsonb);

insert into public.announcements (id,title,extra) values
(3,'Mbledhja e radhës — 27 qershor','{"body":"Mbledhja e rregullt e Pikës mbahet të shtunën, më 27 qershor, ora 18:00, në Sallën e Komunitetit.","date":"10.06.2026","pinned":true}'::jsonb),
(2,'Pagesa e anëtarësisë 2026','{"body":"Kuota vjetore prej CHF 150 mund të paguhet online ose në dy këste. Afati i parë: 31 janar.","date":"02.06.2026","pinned":true}'::jsonb),
(1,'Mirëserdhët në platformën digjitale','{"body":"Pika jonë tani ka platformën e saj digjitale për menaxhimin e anëtarësisë dhe eventeve.","date":"28.05.2026","pinned":false}'::jsonb);

insert into public.polls (id,question,status,yes,no,abstain,voted,extra) values
(1,'A duhet të organizojmë tubim publik në Zürich HB?','aktiv',8,2,1,'{1,2,4,6,8,9,3,7,10,11,5}'::bigint[],'{"deadline":"30.06.2026"}'::jsonb),
(2,'A jeni dakord me draftin e rregullores së re për diasporën?','mbyllur',10,1,2,'{1,2,3,4,5,6,7,8,9,10,11,12}'::bigint[],'{"deadline":"15.06.2026"}'::jsonb),
(3,'A duhet Pika të kontribuojë financiarisht për aksionin humanitar?','aktiv',5,0,0,'{1,2,3,4,9}'::bigint[],'{"deadline":"25.07.2026"}'::jsonb);

insert into public.applications (id,name,email,status,extra) values
(1,'Arbresha Dida','arbresha.d@gmail.com','aplikim','{"phone":"+41 76 111 22 33","kanton":"Zürich","prof":"Mësuese","dob":"14.03.1994","note":"Dua të kontribuoj aktivisht në organizatë dhe të ndihmoj me edukim.","applied":"20.06.2026","referredBy":null}'::jsonb),
(2,'Mentor Osmani','mentor.o@gmail.com','aprovuar','{"phone":"+41 79 222 33 44","kanton":"Aargau","prof":"Arkitekt","dob":"05.11.1988","note":"Kam qenë anëtar i organizatës në Kosovë. Tani jetoj në Aargau.","applied":"18.06.2026","referredBy":"Blerim Gashi","approvedDate":"21.06.2026"}'::jsonb),
(3,'Lirije Rama','lirije.r@gmail.com','pret_pagesen','{"phone":"+41 76 333 44 55","kanton":"Zürich","prof":"Studente","dob":"22.08.2003","note":"","applied":"15.06.2026","referredBy":"Fatlinda Berisha","approvedDate":"17.06.2026"}'::jsonb),
(4,'Kushtrim Aliu','kushtrim.a@gmail.com','aktiv','{"phone":"+41 79 444 55 66","kanton":"Thurgau","prof":"Mekanik","dob":"07.01.1986","note":"Isha pjesë e degës në Bern për 3 vjet.","applied":"10.06.2026","referredBy":null,"approvedDate":"12.06.2026","paidDate":"14.06.2026"}'::jsonb),
(5,'Shqipe Bytyqi','shqipe.b@gmail.com','refuzuar','{"phone":"+41 76 555 66 77","kanton":"Zürich","prof":"Infermiere","dob":"30.04.1991","note":"Dëshiroj të ndihmoj me organizimin e eventeve.","applied":"05.06.2026","referredBy":null}'::jsonb),
(6,'Erjon Hyseni','erjon.h@gmail.com','aplikim','{"phone":"+41 79 666 77 88","kanton":"St. Gallen","prof":"Shofer","dob":"19.09.1983","note":"","applied":"22.06.2026","referredBy":null}'::jsonb);

insert into public.donations (id,amount,member_id,extra) values
(5,100,1,'{"from":"Sami Biqkaj","date":"05.06.2026","msg":"Për fushatën zgjedhore"}'::jsonb),
(4,50,4,'{"from":"Arta Krasniqi","date":"10.06.2026","msg":"Për aksionin humanitar"}'::jsonb),
(3,30,8,'{"from":"Leotrim Hoxha","date":"01.06.2026","msg":""}'::jsonb),
(2,20,9,'{"from":"Vjosa Salihu","date":"28.05.2026","msg":""}'::jsonb),
(1,50,5,'{"from":"Blerim Gashi","date":"20.05.2026","msg":"Vullnetarisht"}'::jsonb);
