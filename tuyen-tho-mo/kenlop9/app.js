'use strict';

const SUBJECTS={
  math:{name:'Toán',icon:'∑',topics:[['sqrt','Căn thức'],['radical','Biến đổi căn thức'],['function','Hàm số & đồ thị'],['system','Phương trình & hệ'],['inequality','Bất phương trình'],['probability','Xác suất'],['statistics','Thống kê'],['polygon','Đa giác đều'],['solid','Khối trụ • nón • cầu'],['triangle','Tam giác'],['circle','Đường tròn']]},
  literature:{name:'Ngữ văn',icon:'V',topics:[['reading','Đọc hiểu'],['writing','Nghị luận xã hội'],['literary','Nghị luận văn học']]},
  english:{name:'Tiếng Anh',icon:'EN',topics:[['phonetics','Phát âm & trọng âm'],['tenses','Thì & dạng động từ'],['passive','Câu bị động'],['relative','Mệnh đề quan hệ'],['conditional','Câu điều kiện'],['vocab','Từ vựng & từ loại'],['communication','Giao tiếp'],['reading','Đọc hiểu'],['writing','Viết biến đổi câu']]},
  physics:{name:'Vật lí',icon:'Ω',topics:[['ohm','Điện trở & định luật Ôm'],['circuit','Mạch nối tiếp/song song'],['power','Công suất điện'],['energy','Điện năng'],['joule','Jun–Len-xơ']]},
  chemistry:{name:'Hóa học',icon:'H₂',topics:[['oxide','Oxit'],['acid','Axit'],['base','Bazơ'],['salt','Muối'],['exchange','Phản ứng trao đổi']]},
  biology:{name:'Sinh học',icon:'DNA',topics:[['genetics','Di truyền'],['variation','Biến dị'],['ecology','Sinh thái']]},
  history:{name:'Lịch sử',icon:'LS',topics:[['vietnam','Lịch sử Việt Nam'],['world','Lịch sử thế giới']]},
  geography:{name:'Địa lí',icon:'ĐL',topics:[['population','Dân cư'],['economy','Kinh tế'],['regions','Các vùng kinh tế']]},
  civics:{name:'GDCD',icon:'CD',topics:[['law','Pháp luật'],['rights','Quyền & nghĩa vụ'],['ethics','Đạo đức công dân']]},
  informatics:{name:'Tin học',icon:'IT',topics:[['algorithm','Thuật toán'],['data','Dữ liệu'],['digital','Kĩ năng số']]},
  chinese:{name:'Tiếng Trung',icon:'中',topics:[['vocab','Từ vựng'],['grammar','Ngữ pháp'],['reading','Đọc hiểu']]},
  french:{name:'Tiếng Pháp',icon:'FR',topics:[['vocab','Từ vựng'],['grammar','Ngữ pháp'],['reading','Đọc hiểu']]}
};

const GROUPS={
  entrance:{name:'Thi vào 10',subjects:['math','literature','english']},
  science:{name:'KHTN',subjects:['physics','chemistry','biology']},
  social:{name:'KHXH',subjects:['history','geography','civics']},
  other:{name:'Khác',subjects:['informatics','chinese','french']}
};

const SUBJECT_META={
  math:{status:'ready',badge:'Sẵn sàng',source:'TS10 Quảng Ninh'},
  literature:{status:'official',badge:'Tự luận',source:'TS10 QN • 120 phút'},
  english:{status:'ready',badge:'Sẵn sàng',source:'TS10 Quảng Ninh'},
  physics:{status:'ready',badge:'Sẵn sàng',source:'QN • KHTN'},
  chemistry:{status:'ready',badge:'Sẵn sàng',source:'QN • KHTN'},
  biology:{status:'official',badge:'Đang chuẩn hóa',source:'Cấu trúc QN'},
  history:{status:'official',badge:'Đang chuẩn hóa',source:'Cấu trúc QN'},
  geography:{status:'official',badge:'Đang chuẩn hóa',source:'Cấu trúc QN'},
  civics:{status:'curriculum',badge:'Theo CT lớp 9',source:'Chương trình lớp 9'},
  informatics:{status:'official',badge:'Đang chuẩn hóa',source:'Cấu trúc QN'},
  chinese:{status:'official',badge:'Đang chuẩn hóa',source:'TS10 Quảng Ninh'},
  french:{status:'official',badge:'Đang chuẩn hóa',source:'TS10 Quảng Ninh'}
};

function Q(id,topic,text,options,answer,explain){return{id:id,topic:topic,text:text,options:options,answer:answer,explain:explain};}

const BANK={
math:[
Q('m1','sqrt','Điều kiện để √(x − 3) có nghĩa là:',['x > 3','x ≥ 3','x ≤ 3','x ≠ 3'],1,'Dưới dấu căn phải không âm: x − 3 ≥ 0.'),
Q('m2','sqrt','Giá trị của √49 là:',['±7','7','−7','49'],1,'√49 là căn bậc hai số học nên bằng 7.'),
Q('m3','sqrt','Với a là số thực, √(a²) bằng:',['a','−a','|a|','a²'],2,'√(a²)=|a| vì căn bậc hai số học không âm.'),
Q('m4','radical','Rút gọn √75 được:',['15√5','5√3','3√5','25√3'],1,'√75=√(25×3)=5√3.'),
Q('m5','radical','√12 + √27 bằng:',['5√3','3√3','5√2','√39'],0,'√12=2√3 và √27=3√3.'),
Q('m6','radical','1/(√x − 2) xác định khi:',['x≥0','x>4','x≥0 và x≠4','x≠4'],2,'Cần x≥0 và mẫu khác 0, tức x≠4.'),
Q('m7','system','Nghiệm của hệ x+y=5; x−y=1 là:',['(2;3)','(3;2)','(4;1)','(1;4)'],1,'Cộng hai phương trình được 2x=6, suy ra x=3; y=2.'),
Q('m8','system','Hệ x+y=4; 2x+2y=8 có:',['Vô nghiệm','Một nghiệm','Vô số nghiệm','Hai nghiệm'],2,'Phương trình thứ hai là 2 lần phương trình thứ nhất.'),
Q('m9','system','Nếu 2x+y=7 và x−y=2 thì x bằng:',['2','3','4','5'],1,'Cộng hai phương trình: 3x=9 nên x=3.'),
Q('m10','triangle','Trong tam giác vuông, sin của góc nhọn bằng:',['cạnh kề/cạnh huyền','cạnh đối/cạnh huyền','cạnh đối/cạnh kề','cạnh huyền/cạnh đối'],1,'sin A = cạnh đối chia cạnh huyền.'),
Q('m11','triangle','Tam giác vuông có cạnh huyền 5, cạnh đối góc A là 3. sin A bằng:',['3/4','4/5','3/5','5/3'],2,'sin A=3/5.'),
Q('m12','triangle','Tam giác vuông có hai cạnh góc vuông 6 và 8. Cạnh huyền là:',['10','12','14','15'],0,'Theo Pitago: √(36+64)=10.'),
Q('m13','circle','Bán kính đi qua tiếp điểm với tiếp tuyến:',['song song tiếp tuyến','vuông góc tiếp tuyến','tạo góc 45°','không cố định'],1,'Bán kính tại tiếp điểm vuông góc tiếp tuyến.'),
Q('m14','circle','Đường tròn bán kính 4 cm có đường kính:',['2 cm','4 cm','8 cm','16 cm'],2,'d=2R=8 cm.'),
Q('m15','circle','Điểm cách tâm O một khoảng nhỏ hơn bán kính R nằm:',['ngoài đường tròn','trên đường tròn','trong đường tròn','không xác định'],2,'Khoảng cách tới tâm nhỏ hơn R thì điểm nằm trong đường tròn.')
],
english:[
Q('e1','tenses','She ___ English every day.',['study','studies','studied','studying'],1,'Present simple with she: studies.'),
Q('e2','tenses','I have lived here ___ 2022.',['for','since','from','at'],1,'Use since with a starting point.'),
Q('e3','tenses','Yesterday, we ___ to the library.',['go','went','have gone','are going'],1,'Yesterday signals the past simple.'),
Q('e4','passive','People grow rice here. Rice ___ here.',['grows','is grown','was grow','has grow'],1,'Present simple passive: is/are + past participle.'),
Q('e5','passive','They built this bridge in 2020. This bridge ___ in 2020.',['is built','was built','has built','built'],1,'Past simple passive: was/were + past participle.'),
Q('e6','passive','The work must ___ today.',['finish','be finished','finished','be finish'],1,'Modal passive: modal + be + past participle.'),
Q('e7','relative','The boy ___ won the prize is my friend.',['which','where','who','when'],2,'Use who for a person.'),
Q('e8','relative','This is the book ___ I bought yesterday.',['who','which','where','when'],1,'Use which for a thing.'),
Q('e9','relative','That is the school ___ my mother works.',['who','which','where','whose'],2,'Use where for a place.'),
Q('e10','conditional','If it rains, we ___ at home.',['stay','stayed','will stay','would stay'],2,'First conditional: If + present, will + verb.'),
Q('e11','conditional','If I ___ enough time, I would learn another language.',['have','had','will have','am having'],1,'Second conditional uses past simple after if.'),
Q('e12','conditional','If you heat ice, it ___.',['melts','will melted','would melt','melted'],0,'A scientific fact uses the zero conditional.'),
Q('e13','vocab','He is a very ___ student.',['success','successful','successfully','succeed'],1,'An adjective is needed before student.'),
Q('e14','vocab','We should protect the ___.',['environment','environmental','environmentally','environ'],0,'A noun is needed after the.'),
Q('e15','vocab','She answered the question ___.',['correct','correction','correctly','correctness'],2,'An adverb modifies answered.')
],
physics:[
Q('p1','ohm','Định luật Ôm cho đoạn mạch được viết:',['I=U/R','I=UR','U=I/R','R=IU'],0,'I=U/R.'),
Q('p2','ohm','Điện trở 10 Ω đặt vào 20 V. Cường độ dòng điện là:',['0,5 A','2 A','10 A','200 A'],1,'I=U/R=20/10=2 A.'),
Q('p3','ohm','Đơn vị của điện trở là:',['Vôn','Ampe','Ôm','Oát'],2,'Điện trở đo bằng ôm (Ω).'),
Q('p4','circuit','Hai điện trở mắc nối tiếp có R tương đương:',['R=R₁+R₂','1/R=1/R₁+1/R₂','R=R₁R₂','R=R₁−R₂'],0,'Mạch nối tiếp: Rtd=R1+R2.'),
Q('p5','circuit','Trong mạch nối tiếp, cường độ dòng điện qua các điện trở:',['khác nhau','bằng nhau','luôn bằng 0','tỉ lệ nghịch R'],1,'Mạch nối tiếp chỉ có một đường đi.'),
Q('p6','circuit','Hai điện trở 6 Ω và 3 Ω mắc song song. R tương đương là:',['9 Ω','3 Ω','2 Ω','18 Ω'],2,'1/R=1/6+1/3=1/2 nên R=2 Ω.'),
Q('p7','power','Công suất điện được tính bằng:',['P=UI','P=U/I','P=I/R','P=Rt'],0,'P=UI.'),
Q('p8','power','Thiết bị dùng 220 V, I=0,5 A có công suất:',['44 W','110 W','220 W','440 W'],1,'P=UI=110 W.'),
Q('p9','power','Đơn vị công suất điện là:',['Jun','Oát','Vôn','Culông'],1,'Công suất đo bằng oát (W).'),
Q('p10','energy','Bóng đèn 100 W dùng 2 giờ tiêu thụ:',['0,02 kWh','0,2 kWh','2 kWh','200 kWh'],1,'0,1 kW × 2 h = 0,2 kWh.'),
Q('p11','energy','1 kWh bằng:',['3,6×10³ J','3,6×10⁴ J','3,6×10⁵ J','3,6×10⁶ J'],3,'1000 W × 3600 s = 3,6×10⁶ J.'),
Q('p12','energy','Công tơ điện gia đình đo:',['cường độ','hiệu điện thế','điện năng tiêu thụ','điện trở'],2,'Công tơ đo điện năng, thường tính bằng kWh.'),
Q('p13','joule','Định luật Jun–Len-xơ:',['Q=I²Rt','Q=U/R','Q=Pt²','Q=IR/t'],0,'Q=I²Rt.'),
Q('p14','joule','Giữ R,t không đổi, I tăng gấp đôi thì Q:',['gấp đôi','gấp 4','giảm nửa','không đổi'],1,'Q tỉ lệ I² nên tăng 4 lần.'),
Q('p15','joule','Dây đốt nóng bếp điện dựa chủ yếu vào:',['tác dụng nhiệt','tác dụng từ','tác dụng hóa','khúc xạ'],0,'Dòng điện làm dây dẫn tỏa nhiệt.')
],
chemistry:[
Q('c1','oxide','Oxit là hợp chất của:',['hai nguyên tố, một là oxi','hiđro và kim loại','kim loại và gốc axit','ba nguyên tố'],0,'Oxit gồm hai nguyên tố, trong đó có oxi.'),
Q('c2','oxide','Chất nào là oxit bazơ?',['CO₂','SO₂','CaO','P₂O₅'],2,'CaO là oxit bazơ.'),
Q('c3','oxide','CaO tác dụng với nước tạo:',['CaCO₃','Ca(OH)₂','CaCl₂','CaSO₄'],1,'CaO + H₂O → Ca(OH)₂.'),
Q('c4','acid','Dung dịch axit làm quỳ tím chuyển:',['xanh','đỏ','đen','không đổi'],1,'Axit làm quỳ tím hóa đỏ.'),
Q('c5','acid','Công thức axit clohiđric là:',['H₂SO₄','HCl','NaOH','NaCl'],1,'Axit clohiđric là HCl.'),
Q('c6','acid','HCl + NaOH tạo:',['NaCl + H₂O','Na + Cl₂','Na₂O + HCl','H₂ + NaClO'],0,'Phản ứng trung hòa tạo muối và nước.'),
Q('c7','base','Chất nào là bazơ?',['H₂SO₄','NaOH','SO₂','NaCl'],1,'NaOH là bazơ.'),
Q('c8','base','Dung dịch bazơ tan làm quỳ tím:',['đỏ','xanh','đen','không đổi'],1,'Bazơ tan làm quỳ tím hóa xanh.'),
Q('c9','base','Đun nóng Cu(OH)₂ tạo chất rắn:',['Cu','CuO','Cu₂O','CuCl₂'],1,'Cu(OH)₂ → CuO + H₂O.'),
Q('c10','salt','Chất nào là muối?',['HCl','KOH','Na₂SO₄','CO₂'],2,'Na₂SO₄ là muối.'),
Q('c11','salt','AgNO₃ + NaCl tạo kết tủa:',['AgCl','NaNO₃','Ag₂O','Cl₂'],0,'AgCl là kết tủa trắng.'),
Q('c12','salt','Muối cacbonat tác dụng axit mạnh thường giải phóng:',['H₂','O₂','CO₂','N₂'],2,'Cacbonat + axit tạo CO₂.'),
Q('c13','exchange','Phản ứng trao đổi trong dung dịch xảy ra khi tạo:',['kết tủa, khí hoặc nước','chỉ chất tan','chỉ kim loại','chỉ oxit'],0,'Một sản phẩm phải tách khỏi môi trường dung dịch hoặc là chất điện li yếu.'),
Q('c14','exchange','BaCl₂ + Na₂SO₄ tạo kết tủa:',['BaSO₄','NaCl','BaCl','SO₂'],0,'BaSO₄ không tan tạo kết tủa.'),
Q('c15','exchange','Na₂CO₃ + 2HCl tạo khí:',['H₂','CO₂','O₂','Cl₂'],1,'Phản ứng giải phóng CO₂.')
]
};








/* Ngân hàng mở rộng để bài kiểm tra đủ độ dài đánh giá. */
function addQuestions(subject, items){ BANK[subject].push(...items); }

addQuestions('math',[
Q('m16','sqrt','Điều kiện để √(x − 1) có nghĩa là:',['x > 1','x ≥ 1','x ≤ 1','x ≠ 1'],1,'Cần x − 1 ≥ 0 nên x ≥ 1.'),
Q('m17','sqrt','Điều kiện để √(x − 4) có nghĩa là:',['x ≥ 4','x > 4','x ≤ 4','x ≠ 4'],0,'Cần x − 4 ≥ 0 nên x ≥ 4.'),
Q('m18','sqrt','Giá trị của √64 là:',['±8','8','−8','32'],1,'Căn bậc hai số học của 64 là 8.'),
Q('m19','sqrt','Giá trị của √81 là:',['9','−9','±9','81'],0,'Căn bậc hai số học luôn không âm.'),
Q('m20','sqrt','Với a < 0, √(a²) bằng:',['a','−a','a²','0'],1,'√(a²)=|a|; nếu a<0 thì |a|=−a.'),
Q('m21','radical','Rút gọn √48 được:',['4√3','3√4','2√12','8√3'],0,'√48=√(16×3)=4√3.'),
Q('m22','radical','Rút gọn √108 được:',['3√12','6√3','9√3','18√3'],1,'√108=√(36×3)=6√3.'),
Q('m23','radical','Rút gọn √147 được:',['7√3','3√7','21√7','49√3'],0,'√147=√(49×3)=7√3.'),
Q('m24','radical','Rút gọn √32 được:',['2√8','4√2','8√2','16√2'],1,'√32=√(16×2)=4√2.'),
Q('m25','radical','Rút gọn √200 được:',['10√2','20√2','5√8','100√2'],0,'√200=√(100×2)=10√2.'),
Q('m26','system','Nghiệm của hệ x+y=7; x−y=3 là:',['(5;2)','(2;5)','(4;3)','(3;4)'],0,'Cộng hai phương trình: 2x=10, x=5, y=2.'),
Q('m27','system','Nghiệm của hệ x+y=9; x−y=1 là:',['(4;5)','(5;4)','(6;3)','(3;6)'],1,'Cộng hai phương trình: 2x=10, x=5, y=4.'),
Q('m28','system','Nghiệm của hệ x+y=10; x−y=4 là:',['(6;4)','(7;3)','(5;5)','(8;2)'],1,'Cộng hai phương trình: 2x=14, x=7, y=3.'),
Q('m29','system','Hệ x+y=3; 2x+2y=7 có:',['Một nghiệm','Vô số nghiệm','Vô nghiệm','Hai nghiệm'],2,'Hai phương trình mâu thuẫn nên hệ vô nghiệm.'),
Q('m30','system','Nếu 3x+y=11 và x−y=1 thì x bằng:',['2','3','4','5'],1,'Cộng hai phương trình: 4x=12 nên x=3.'),
Q('m31','triangle','Tam giác vuông có hai cạnh góc vuông 5 và 12. Cạnh huyền là:',['13','15','17','10'],0,'Theo Pitago: √(25+144)=13.'),
Q('m32','triangle','Tam giác vuông có hai cạnh góc vuông 8 và 15. Cạnh huyền là:',['16','17','18','20'],1,'Theo Pitago: √(64+225)=17.'),
Q('m33','triangle','Tam giác vuông có hai cạnh góc vuông 7 và 24. Cạnh huyền là:',['23','24','25','26'],2,'Theo Pitago: √(49+576)=25.'),
Q('m34','triangle','Tam giác vuông có cạnh huyền 10, cạnh đối góc A là 6. sin A bằng:',['3/5','4/5','5/3','2/5'],0,'sin A=6/10=3/5.'),
Q('m35','triangle','Tam giác vuông có cạnh huyền 13, cạnh kề góc A là 12. cos A bằng:',['5/13','12/13','13/12','12/5'],1,'cos A=12/13.'),
Q('m36','circle','Đường tròn có đường kính 14 cm thì bán kính bằng:',['28 cm','14 cm','7 cm','3,5 cm'],2,'R=d/2=7 cm.'),
Q('m37','circle','Điểm M cách tâm O đúng bằng R thì M nằm:',['trong đường tròn','ngoài đường tròn','trên đường tròn','không xác định'],2,'OM=R nên M thuộc đường tròn.'),
Q('m38','circle','Điểm N có ON>R thì N nằm:',['trong đường tròn','trên đường tròn','ngoài đường tròn','tại tâm'],2,'ON>R nên N nằm ngoài đường tròn.'),
Q('m39','circle','Tiếp tuyến của đường tròn tại A vuông góc với:',['dây bất kỳ','bán kính OA','đường kính bất kỳ','cung nhỏ'],1,'Tiếp tuyến tại A vuông góc với OA.'),
Q('m40','circle','Một đường tròn có R=6 cm thì đường kính bằng:',['3 cm','6 cm','12 cm','36 cm'],2,'d=2R=12 cm.')
]);

addQuestions('english',[
Q('e16','tenses','My brother ___ football every Sunday.',['play','plays','played','is play'],1,'Present simple with a singular subject: plays.'),
Q('e17','tenses','They ___ dinner when I called.',['have','had','were having','are having'],2,'Past continuous describes an action in progress in the past.'),
Q('e18','tenses','We ___ this film twice.',['see','saw','have seen','are seeing'],2,'Experience up to now uses present perfect.'),
Q('e19','tenses','Look! The children ___.',['run','ran','are running','have run'],2,'Look! signals present continuous.'),
Q('e20','tenses','I think it ___ tomorrow.',['rains','rained','will rain','is rain'],2,'Prediction: will + verb.'),
Q('e21','passive','They clean the room every day. The room ___ every day.',['cleans','is cleaned','was cleaned','has clean'],1,'Present simple passive: is/are + V3.'),
Q('e22','passive','Someone stole my bike yesterday. My bike ___ yesterday.',['is stolen','was stolen','stole','has stolen'],1,'Past simple passive: was/were + V3.'),
Q('e23','passive','They will finish the road soon. The road ___ soon.',['will finish','will be finished','is finishing','was finished'],1,'Future passive: will be + V3.'),
Q('e24','passive','You should protect the environment. The environment should ___.',['protect','be protected','protected','be protect'],1,'Modal passive: should be + V3.'),
Q('e25','passive','People speak English in many countries. English ___ in many countries.',['speaks','is spoken','was spoke','spoken'],1,'Present simple passive: is spoken.'),
Q('e26','relative','The woman ___ lives next door is a doctor.',['which','who','where','when'],1,'Who refers to a person.'),
Q('e27','relative','This is the house ___ I was born.',['who','which','where','whose'],2,'Where refers to a place.'),
Q('e28','relative','The computer ___ I bought is very fast.',['who','which','where','whose'],1,'Which refers to a thing.'),
Q('e29','relative','The student ___ father is a teacher won the prize.',['who','whose','which','where'],1,'Whose shows possession.'),
Q('e30','relative','Sunday is the day ___ we usually visit our grandparents.',['where','who','when','which'],2,'When refers to time.'),
Q('e31','conditional','If you study hard, you ___ the exam.',['pass','passed','will pass','would pass'],2,'First conditional.'),
Q('e32','conditional','If I were you, I ___ that job.',['take','will take','would take','took'],2,'Second conditional: would + verb.'),
Q('e33','conditional','If water reaches 100°C, it ___.',['boils','will boil','would boil','boiled'],0,'Zero conditional for scientific facts.'),
Q('e34','conditional','If she ___ earlier, she would catch the bus.',['leaves','left','will leave','is leaving'],1,'Second conditional uses past simple after if.'),
Q('e35','conditional','If it does not rain, we ___ a picnic.',['have','had','will have','would have'],2,'First conditional.'),
Q('e36','vocab','The test was quite ___.',['difficulty','difficult','difficultly','difficulties'],1,'An adjective follows was.'),
Q('e37','vocab','She sings very ___.',['beautiful','beauty','beautifully','beautify'],2,'An adverb modifies sings.'),
Q('e38','vocab','Air ___ is a serious problem.',['pollute','polluted','pollution','polluting'],2,'A noun is needed after Air.'),
Q('e39','vocab','He gave a very ___ answer.',['help','helpful','helpfully','helped'],1,'An adjective modifies answer.'),
Q('e40','vocab','We need to use energy more ___.',['efficient','efficiency','efficiently','efficiencies'],2,'An adverb modifies use.')
]);

addQuestions('physics',[
Q('p16','ohm','Điện trở 5 Ω đặt vào 10 V. Dòng điện là:',['0,5 A','2 A','5 A','50 A'],1,'I=U/R=2 A.'),
Q('p17','ohm','Dòng điện 2 A qua điện trở 6 Ω. Hiệu điện thế là:',['3 V','8 V','12 V','24 V'],2,'U=IR=12 V.'),
Q('p18','ohm','U=9 V, I=0,3 A. Điện trở là:',['3 Ω','27 Ω','30 Ω','90 Ω'],2,'R=U/I=30 Ω.'),
Q('p19','ohm','Giữ R không đổi, tăng U gấp đôi thì I:',['giảm nửa','tăng gấp đôi','không đổi','tăng gấp bốn'],1,'I tỉ lệ thuận U.'),
Q('p20','ohm','Đơn vị của cường độ dòng điện là:',['V','A','Ω','W'],1,'Cường độ dòng điện đo bằng ampe.'),
Q('p21','circuit','Hai điện trở 4 Ω và 6 Ω mắc nối tiếp. R tương đương là:',['2,4 Ω','10 Ω','24 Ω','5 Ω'],1,'Rtd=R1+R2=10 Ω.'),
Q('p22','circuit','Hai điện trở 4 Ω và 4 Ω mắc song song. R tương đương là:',['8 Ω','4 Ω','2 Ω','1 Ω'],2,'Rtd=R/2=2 Ω.'),
Q('p23','circuit','Trong mạch song song, hiệu điện thế hai đầu các nhánh:',['bằng nhau','khác nhau','bằng 0','tỉ lệ điện trở'],0,'Các nhánh song song có cùng hiệu điện thế.'),
Q('p24','circuit','Trong mạch nối tiếp, điện trở tương đương:',['nhỏ hơn từng điện trở','bằng tổng các điện trở','bằng tích','bằng điện trở nhỏ nhất'],1,'Rtd bằng tổng các điện trở.'),
Q('p25','circuit','Hai điện trở 12 Ω và 6 Ω mắc song song có R tương đương:',['18 Ω','6 Ω','4 Ω','2 Ω'],2,'1/R=1/12+1/6=1/4 nên R=4 Ω.'),
Q('p26','power','Thiết bị dùng 12 V, I=2 A có công suất:',['6 W','14 W','24 W','36 W'],2,'P=UI=24 W.'),
Q('p27','power','Bóng đèn ghi 60 W. Đại lượng 60 W là:',['điện năng','công suất','điện trở','hiệu điện thế'],1,'W là đơn vị công suất.'),
Q('p28','power','P=100 W, U=200 V. Cường độ dòng điện là:',['0,5 A','2 A','20 A','20000 A'],0,'I=P/U=0,5 A.'),
Q('p29','power','Công thức tính công suất điện là:',['P=I²R','P=Rt','P=Q/t²','P=U/R'],0,'Từ P=UI và U=IR suy ra P=I²R.'),
Q('p30','power','Giữ U không đổi, I tăng gấp đôi thì P:',['giảm nửa','không đổi','tăng gấp đôi','tăng gấp bốn'],2,'P=UI.'),
Q('p31','energy','Thiết bị 500 W dùng 2 giờ tiêu thụ:',['0,5 kWh','1 kWh','2 kWh','1000 kWh'],1,'0,5 kW×2 h=1 kWh.'),
Q('p32','energy','Bóng đèn 50 W dùng 10 giờ tiêu thụ:',['0,05 kWh','0,5 kWh','5 kWh','500 kWh'],1,'0,05×10=0,5 kWh.'),
Q('p33','energy','Điện năng tiêu thụ gia đình thường tính bằng:',['A','V','kWh','Ω'],2,'Công tơ điện dùng kWh.'),
Q('p34','energy','1 kWh tương ứng thiết bị 1 kW hoạt động trong:',['1 phút','1 giờ','10 giờ','1000 giờ'],1,'1 kWh=1 kW×1 h.'),
Q('p35','energy','Máy 2 kW chạy 30 phút tiêu thụ:',['0,5 kWh','1 kWh','2 kWh','4 kWh'],1,'30 phút=0,5 h; A=1 kWh.'),
Q('p36','joule','I=2 A, R=5 Ω, t=10 s. Nhiệt lượng tỏa ra là:',['50 J','100 J','200 J','400 J'],2,'Q=I²Rt=200 J.'),
Q('p37','joule','Giữ I,R không đổi, thời gian tăng gấp 3 thì Q:',['giảm 3 lần','tăng 3 lần','tăng 9 lần','không đổi'],1,'Q tỉ lệ thuận t.'),
Q('p38','joule','Giữ I,t không đổi, R tăng gấp đôi thì Q:',['giảm nửa','tăng gấp đôi','tăng gấp bốn','không đổi'],1,'Q tỉ lệ thuận R.'),
Q('p39','joule','Thiết bị khai thác chủ yếu tác dụng nhiệt của dòng điện là:',['quạt điện','bếp điện','chuông điện','nam châm điện'],1,'Bếp điện biến điện năng thành nhiệt năng.'),
Q('p40','joule','Cầu chì bảo vệ mạch chủ yếu nhờ tác dụng:',['từ','hóa học','nhiệt','quang'],2,'Dòng điện lớn làm dây chì nóng chảy.')
]);

addQuestions('chemistry',[
Q('c16','oxide','Chất nào là oxit axit?',['CaO','Na₂O','SO₃','MgO'],2,'SO₃ là oxit axit.'),
Q('c17','oxide','CO₂ tác dụng với Ca(OH)₂ tạo kết tủa:',['CaO','CaCO₃','CaCl₂','CaSO₄'],1,'Tạo CaCO₃ kết tủa.'),
Q('c18','oxide','MgO tác dụng với HCl tạo:',['MgCl₂ và H₂O','Mg và Cl₂','Mg(OH)₂','H₂ và MgCl₂'],0,'MgO + 2HCl → MgCl₂ + H₂O.'),
Q('c19','oxide','Oxit bazơ thường tác dụng với:',['bazơ','axit','muối bất kỳ','kim loại'],1,'Oxit bazơ phản ứng với axit.'),
Q('c20','oxide','Oxit axit thường tác dụng với dung dịch:',['axit','bazơ','NaCl','Cu'],1,'Oxit axit phản ứng với bazơ.'),
Q('c21','acid','H₂SO₄ là:',['bazơ','muối','axit','oxit'],2,'H₂SO₄ là axit sulfuric.'),
Q('c22','acid','Axit tác dụng với kim loại đứng trước H thường tạo:',['muối và H₂','bazơ và O₂','oxit và nước','chỉ muối'],0,'Kim loại + axit thường tạo muối và H₂.'),
Q('c23','acid','Dung dịch nào làm quỳ tím hóa đỏ?',['NaOH','HCl','NaCl','KNO₃'],1,'HCl là axit.'),
Q('c24','acid','2HCl + Mg tạo sản phẩm:',['MgCl₂ + H₂','MgO + H₂','Mg(OH)₂ + Cl₂','Mg + HCl'],0,'Mg + 2HCl → MgCl₂ + H₂.'),
Q('c25','acid','Phản ứng axit + bazơ gọi là:',['phân hủy','hóa hợp','trung hòa','thế'],2,'Axit + bazơ → muối + nước.'),
Q('c26','base','Bazơ tan còn gọi là:',['kiềm','axit','muối','oxit'],0,'Bazơ tan được gọi là kiềm.'),
Q('c27','base','Chất nào là bazơ không tan?',['NaOH','KOH','Cu(OH)₂','Ba(OH)₂'],2,'Cu(OH)₂ không tan.'),
Q('c28','base','NaOH tác dụng với HCl tạo:',['NaCl + H₂O','Na₂O + Cl₂','Na + H₂O','NaClO'],0,'Phản ứng trung hòa.'),
Q('c29','base','Dung dịch NaOH làm phenolphthalein:',['không màu','màu hồng','màu đỏ gạch','màu xanh'],1,'Phenolphthalein hóa hồng trong bazơ.'),
Q('c30','base','Cu(OH)₂ có màu:',['trắng','xanh lam','đen','vàng'],1,'Cu(OH)₂ là kết tủa xanh lam.'),
Q('c31','salt','NaCl thuộc loại:',['axit','bazơ','muối','oxit'],2,'NaCl là muối.'),
Q('c32','salt','BaCl₂ tác dụng Na₂SO₄ tạo kết tủa màu:',['trắng','xanh','đen','đỏ'],0,'BaSO₄ là kết tủa trắng.'),
Q('c33','salt','Muối cacbonat gặp axit giải phóng khí:',['H₂','O₂','CO₂','Cl₂'],2,'Khí CO₂ được giải phóng.'),
Q('c34','salt','AgNO₃ dùng nhận biết ion Cl⁻ vì tạo:',['AgCl kết tủa','Ag₂O khí','Cl₂ kết tủa','NaNO₃ kết tủa'],0,'AgCl là kết tủa.'),
Q('c35','salt','Na₂SO₄ tác dụng BaCl₂ thuộc loại phản ứng:',['thế','phân hủy','trao đổi','hóa hợp'],2,'Hai hợp chất trao đổi thành phần.'),
Q('c36','exchange','Phản ứng trao đổi trong dung dịch thường xảy ra khi tạo:',['kết tủa, khí hoặc nước','hai chất tan','kim loại mạnh','chỉ oxit'],0,'Sản phẩm phải tách khỏi dung dịch hoặc điện li yếu.'),
Q('c37','exchange','NaOH + HCl xảy ra vì tạo:',['H₂','H₂O','Cl₂','O₂'],1,'Tạo nước.'),
Q('c38','exchange','Na₂CO₃ + HCl xảy ra vì tạo khí:',['CO₂','H₂','O₂','N₂'],0,'Tạo CO₂.'),
Q('c39','exchange','AgNO₃ + NaCl xảy ra vì tạo:',['AgCl kết tủa','NaNO₃ kết tủa','Cl₂ khí','Ag kim loại'],0,'Tạo AgCl không tan.'),
Q('c40','exchange','BaCl₂ + Na₂SO₄ xảy ra vì tạo:',['BaSO₄ kết tủa','NaCl kết tủa','SO₂ khí','Ba kim loại'],0,'Tạo BaSO₄ không tan.')
]);


/* Bổ sung nhóm câu theo cấu trúc tuyển sinh Quảng Ninh. */
addQuestions('math',[
Q('m41','function','Điểm nào thuộc đồ thị y=2x+1?',['(0;0)','(1;3)','(2;2)','(-1;1)'],1,'Thay x=1 được y=3.'),
Q('m42','function','Hàm số y=-3x+2 có hệ số góc bằng:',['2','-3','3','-2'],1,'Hệ số của x là hệ số góc.'),
Q('m43','function','Đồ thị y=2x-4 cắt trục Ox tại điểm có hoành độ:',['-2','0','2','4'],2,'Cho y=0: 2x-4=0 nên x=2.'),
Q('m44','function','Với y=-x+5, khi x=2 thì y bằng:',['2','3','5','7'],1,'y=-2+5=3.'),
Q('m45','function','Hai đường thẳng y=2x+1 và y=2x-3:',['cắt nhau','song song','vuông góc','trùng nhau'],1,'Cùng hệ số góc 2, khác tung độ gốc.'),

Q('m46','inequality','Nghiệm của bất phương trình x+3>7 là:',['x>4','x<4','x≥4','x≤4'],0,'Trừ 3 hai vế được x>4.'),
Q('m47','inequality','Nghiệm của 2x≤10 là:',['x≤5','x≥5','x<5','x>5'],0,'Chia hai vế cho 2.'),
Q('m48','inequality','Nghiệm của -x<3 là:',['x<-3','x>-3','x<3','x>3'],1,'Nhân -1 phải đổi chiều: x>-3.'),
Q('m49','inequality','Bất phương trình 3x-6≥0 tương đương:',['x≥2','x≤2','x>2','x<2'],0,'3x≥6 nên x≥2.'),
Q('m50','inequality','Số nào là nghiệm của x-1<0?',['2','1','0','3'],2,'x<1 nên 0 là nghiệm.'),

Q('m51','probability','Gieo một đồng xu cân đối một lần. Xác suất xuất hiện mặt ngửa là:',['0','1/4','1/2','1'],2,'Có 2 kết quả đồng khả năng.'),
Q('m52','probability','Gieo một xúc xắc cân đối. Xác suất ra số 6 là:',['1/2','1/3','1/6','1/12'],2,'Có 6 kết quả đồng khả năng.'),
Q('m53','probability','Túi có 3 bi đỏ, 2 bi xanh. Lấy ngẫu nhiên 1 bi. Xác suất lấy bi đỏ là:',['2/5','3/5','1/2','3/2'],1,'Có 3 kết quả thuận lợi trên 5 bi.'),
Q('m54','probability','Gieo xúc xắc. Xác suất ra số chẵn là:',['1/6','1/3','1/2','2/3'],2,'Các số chẵn 2,4,6: 3/6=1/2.'),
Q('m55','probability','Chọn ngẫu nhiên một số trong {1,2,3,4}. Xác suất chọn số lớn hơn 2 là:',['1/4','1/2','3/4','1'],1,'Có 2 số thuận lợi là 3,4 trong 4 số.'),

Q('m56','statistics','Trung bình cộng của 2,4,6,8 là:',['4','5','6','20'],1,'Tổng 20 chia 4 bằng 5.'),
Q('m57','statistics','Trung vị của dãy 1,3,5,7,9 là:',['3','5','7','9'],1,'Giá trị giữa là 5.'),
Q('m58','statistics','Mốt của dãy 2,2,3,4,4,4,5 là:',['2','3','4','5'],2,'4 xuất hiện nhiều nhất.'),
Q('m59','statistics','Khoảng biến thiên của dãy 3,5,8,10 là:',['5','7','8','10'],1,'10-3=7.'),
Q('m60','statistics','Tổng của 5 giá trị có trung bình cộng 6 là:',['11','30','36','60'],1,'Tổng = trung bình × số giá trị =30.'),

Q('m61','polygon','Tổng số đo các góc trong một tam giác là:',['90°','180°','270°','360°'],1,'Tổng ba góc trong tam giác bằng 180°.'),
Q('m62','polygon','Một hình vuông là đa giác đều có:',['3 cạnh','4 cạnh','5 cạnh','6 cạnh'],1,'Hình vuông có 4 cạnh bằng nhau và 4 góc bằng nhau.'),
Q('m63','polygon','Mỗi góc trong của hình vuông bằng:',['45°','60°','90°','120°'],2,'Hình vuông có bốn góc vuông.'),
Q('m64','polygon','Lục giác đều có số cạnh bằng:',['4','5','6','8'],2,'Lục giác có 6 cạnh.'),
Q('m65','polygon','Đa giác đều là đa giác có:',['các cạnh bằng nhau','các góc bằng nhau','các cạnh và các góc bằng nhau','hai đường chéo bằng nhau'],2,'Đa giác đều có cả cạnh và góc tương ứng bằng nhau.'),

Q('m66','solid','Thể tích hình trụ bán kính r, chiều cao h là:',['πr²h','2πrh','πrh²','4πr³/3'],0,'V=πr²h.'),
Q('m67','solid','Thể tích hình nón bán kính r, chiều cao h là:',['πr²h','πr²h/3','2πrh','4πr³/3'],1,'V=1/3 πr²h.'),
Q('m68','solid','Thể tích khối cầu bán kính r là:',['πr²','4πr²','4πr³/3','2πr³'],2,'V=4/3 πr³.'),
Q('m69','solid','Diện tích xung quanh hình trụ bán kính r, chiều cao h là:',['πr²','2πrh','πrh','4πr²'],1,'Sxq=2πrh.'),
Q('m70','solid','Một hình trụ có r=2, h=3. Thể tích bằng:',['6π','12π','18π','24π'],1,'V=π·2²·3=12π.')
]);

addQuestions('english',[
Q('e41','phonetics','Which word has “-ed” pronounced /ɪd/?',['worked','wanted','played','washed'],1,'wanted ends with /t/ before -ed, so /ɪd/.'),
Q('e42','phonetics','Which word has “-s” pronounced /z/?',['books','cats','bags','maps'],2,'bags ends with a voiced sound, so -s is /z/.'),
Q('e43','phonetics','Which word has stress on the second syllable?',['teacher','hotel','mother','table'],1,'hotel is stressed on the second syllable.'),
Q('e44','phonetics','Which word has a different pronunciation of “th”?',['think','thank','this','three'],2,'this has voiced /ð/; the others have /θ/.'),
Q('e45','phonetics','Which word has stress on the first syllable?',['begin','answer','decide','invite'],1,'answer is stressed on the first syllable.'),

Q('e46','communication','“Would you like some tea?” – “___”',['Yes, please.','Yes, I do.','No, I am not.','I like tea yesterday.'],0,'Yes, please is a natural response to an offer.'),
Q('e47','communication','“Thank you very much.” – “___”',['Never mind.','You’re welcome.','Not at all?','I’m sorry.'],1,'You’re welcome is a standard response to thanks.'),
Q('e48','communication','“I’m sorry I’m late.” – “___”',['That’s all right.','Here you are.','Good idea.','Well done.'],0,'That’s all right accepts an apology.'),
Q('e49','communication','“How about going to the cinema?” – “___”',['Sounds great.','Yes, I am.','No, I didn’t.','Thank you.'],0,'Sounds great accepts a suggestion.'),
Q('e50','communication','“Could you help me with this bag?” – “___”',['Sure.','No, I couldn’t yesterday.','It is a bag.','I help you.'],0,'Sure is a natural response to a request.'),

Q('e51','reading','Mai walks to school because her house is near the school. Why does Mai walk to school?',['She likes buses.','Her house is near the school.','She has no school.','The school is closed.'],1,'The reason is stated directly.'),
Q('e52','reading','Nam studies every evening and always finishes his homework. What can we infer?',['He is lazy.','He has good study habits.','He never studies.','He dislikes homework.'],1,'Regular study and completed homework indicate good study habits.'),
Q('e53','reading','The library closes at 5 p.m. Lan arrives at 5:30 p.m. What is true?',['The library is still open.','Lan arrives before closing.','The library has closed.','Lan works there.'],2,'5:30 p.m. is after the closing time.'),
Q('e54','reading','A notice says “Keep off the grass.” What should people do?',['Walk on the grass.','Do not step on the grass.','Water the grass.','Cut the grass.'],1,'Keep off means do not enter or step on it.'),
Q('e55','reading','Minh brings an umbrella because the sky is very dark. What does he expect?',['Snow','Rain','Sunshine','Wind only'],1,'A dark sky and umbrella suggest rain.'),

Q('e56','writing','Choose the sentence closest in meaning: “I started learning English three years ago.”',['I learned English for three years.','I have learned English for three years.','I am learning English yesterday.','I will learn English three years ago.'],1,'Present perfect expresses an action started in the past and continuing now.'),
Q('e57','writing','“The box is too heavy for me to carry.” is closest to:',['The box is so light that I can carry it.','The box is not light enough for me to carry.','I carry the box easily.','The box has no weight.'],1,'too heavy to carry = not light enough to carry.'),
Q('e58','writing','“Although it rained, we went out.” is closest to:',['Because it rained, we stayed home.','In spite of the rain, we went out.','It rained so we did not go out.','We went out before it rained.'],1,'Although + clause can be changed to in spite of + noun phrase.'),
Q('e59','writing','“People speak English worldwide.” Passive form:',['English speaks worldwide.','English is spoken worldwide.','English was spoken worldwide.','Worldwide speaks English.'],1,'Present simple passive: is spoken.'),
Q('e60','writing','“I don’t have a bicycle.” Wish sentence:',['I wish I have a bicycle.','I wish I had a bicycle.','I wished I have a bicycle.','I wish I will have a bicycle yesterday.'],1,'Wish for the present uses past simple.')
]);

const TARGETS={month:15,midterm:25,final:35};

const KEY='kenSimple.history.v2';
const MODES={
  month:{name:'Tháng',full:'Ôn tháng'},
  midterm:{name:'Giữa kỳ',full:'Giữa kỳ'},
  final:{name:'Cuối kỳ',full:'Cuối kỳ'}
};
const MONTH_SCOPE={
  math:['sqrt','radical'], english:['tenses','vocab'], physics:['ohm','circuit'], chemistry:['oxide','acid']
};
const MID_SCOPE={
  math:['sqrt','radical','function','system','inequality','triangle'],
  english:['phonetics','tenses','passive','relative','vocab','communication'],
  physics:['ohm','circuit','power','energy'],
  chemistry:['oxide','acid','base','salt']
};

let mode='month',group='entrance',subject='math',state=null,timer=null;
const $=id=>document.getElementById(id);
function hist(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function topicName(s,t){const x=SUBJECTS[s].topics.find(v=>v[0]===t);return x?x[1]:t}
function isReady(s){return Array.isArray(BANK[s])&&BANK[s].length>0}
function scope(s,m){
  if(!isReady(s))return SUBJECTS[s].topics.map(x=>x[0]);
  if(m==='month')return MONTH_SCOPE[s]||SUBJECTS[s].topics.map(x=>x[0]);
  if(m==='midterm')return MID_SCOPE[s]||SUBJECTS[s].topics.map(x=>x[0]);
  return SUBJECTS[s].topics.map(x=>x[0])
}
function qs(){const sc=scope(subject,mode);return (BANK[subject]||[]).filter(q=>sc.includes(q.topic))}
function balancedQuestions(){
  const pool=qs(), topics=scope(subject,mode), target=Math.min(TARGETS[mode]||15,pool.length);
  const buckets=topics.map(t=>shuffle(pool.filter(q=>q.topic===t)));
  const picked=[]; let round=0;
  while(picked.length<target){
    let added=false;
    for(const b of buckets){
      if(picked.length>=target)break;
      if(b[round]){picked.push(b[round]);added=true;}
    }
    if(!added)break;
    round++;
  }
  return picked;
}
function latest(s){return hist().find(x=>x.subject===s)||null}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function grade(p){return p>=85?'Vững':p>=70?'Khá':p>=55?'Đạt':'Cần học lại'}

function renderMilestones(){
  $('milestones').innerHTML=Object.entries(MODES).map(([k,v])=>'<button class="'+(k===mode?'active':'')+'" data-mode="'+k+'">'+v.name+'</button>').join('');
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;renderMilestones();renderReady()});
}

function renderGroups(){
  $('subjectGroups').innerHTML=Object.entries(GROUPS).map(([k,v])=>'<button class="'+(k===group?'active':'')+'" data-group="'+k+'">'+v.name+'</button>').join('');
  document.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{
    group=b.dataset.group;
    if(!GROUPS[group].subjects.includes(subject))subject=GROUPS[group].subjects[0];
    renderGroups();renderSubjects();renderReady();renderRecent();
  });
}

function renderSubjects(){
  const list=GROUPS[group].subjects;
  $('subjects').innerHTML=list.map(k=>{
    const s=SUBJECTS[k],l=latest(k),ready=isReady(k),meta=SUBJECT_META[k]||{};
    const status=l?l.percent+'% gần nhất':(ready?'Sẵn sàng kiểm tra':(meta.badge||'Đang chuẩn hóa'));
    return '<button class="subject '+(k===subject?'active':'')+' '+(!ready?'pending':'')+'" data-sub="'+k+'"><div class="subject-card-top"><div class="subject-icon">'+s.icon+'</div><span class="subject-status '+(meta.status||'official')+'">'+esc(status)+'</span></div><strong>'+s.name+'</strong><small>'+esc(meta.source||'Quảng Ninh')+'</small></button>';
  }).join('');
  document.querySelectorAll('[data-sub]').forEach(b=>b.onclick=()=>{subject=b.dataset.sub;renderSubjects();renderReady()});
}

function renderReady(){
  const ready=isReady(subject),c=qs(),target=Math.min(TARGETS[mode]||15,c.length),names=scope(subject,mode).map(t=>topicName(subject,t)).join(' • ');
  $('ready').classList.remove('hidden');$('quiz').classList.add('hidden');$('result').classList.add('hidden');
  if(!ready){
    const meta=SUBJECT_META[subject]||{};
    const note=subject==='literature'?'Cấu trúc Quảng Ninh là bài tự luận: Đọc hiểu 4 điểm, Viết 6 điểm. Hệ thống đang xây chấm theo rubric, không thay bằng Quiz trắc nghiệm đơn giản.':'Nguồn chính thức đã được đưa vào kho; chỉ mở kiểm tra khi ngân hàng câu hỏi đạt đủ độ phủ.';
    $('ready').innerHTML='<div class="ready-top"><div><span class="section-kicker">'+esc(meta.source||'Quảng Ninh')+'</span><h2>'+SUBJECTS[subject].name+'</h2><p>'+esc(meta.badge||'Đang chuẩn hóa')+'</p></div><button class="btn secondary" disabled>Đang chuẩn hóa</button></div><div class="source-note">'+esc(note)+'</div>';
    return;
  }
  const meta=SUBJECT_META[subject]||{};
  $('ready').innerHTML='<div class="ready-top"><div><span class="section-kicker">'+esc(meta.source||'Quảng Ninh')+'</span><h2>'+MODES[mode].full+' • '+SUBJECTS[subject].name+'</h2><p>'+target+' câu • cân bằng theo chuyên đề</p></div><button id="start" class="btn primary">Bắt đầu kiểm tra</button></div><div class="topics">'+esc(names)+'</div>';
  $('start').onclick=startQuiz;
}

function startQuiz(){
  const questions=balancedQuestions();
  if(!questions.length)return;
  clearInterval(timer);
  state={questions,answers:Array(questions.length).fill(null),index:0,started:Date.now()};
  $('ready').classList.add('hidden');$('result').classList.add('hidden');$('quiz').classList.remove('hidden');
  timer=setInterval(()=>{if($('clock')&&state)$('clock').textContent=Math.floor((Date.now()-state.started)/1000)+'s'},1000);
  renderQuestion();
}

function renderQuestion(){
  const q=state.questions[state.index],sel=state.answers[state.index];
  const pct=Math.round((state.index+1)/state.questions.length*100);
  $('quiz').innerHTML='<div class="quiz-head"><span><strong>'+SUBJECTS[subject].name+'</strong> • '+MODES[mode].name+'</span><span>'+(state.index+1)+'/'+state.questions.length+' • <span id="clock">'+Math.floor((Date.now()-state.started)/1000)+'s</span></span></div><div class="quiz-progress"><div style="width:'+pct+'%"></div></div><div class="question">'+esc(q.text)+'</div><div class="answers">'+q.options.map((o,i)=>'<label class="answer '+(sel===i?'selected':'')+'"><input type="radio" name="a" value="'+i+'" '+(sel===i?'checked':'')+'><span><b>'+String.fromCharCode(65+i)+'.</b> '+esc(o)+'</span></label>').join('')+'</div><div class="quiz-nav"><button id="prev" class="btn secondary" '+(state.index===0?'disabled':'')+'>←</button><button id="next" class="btn primary">'+(state.index===state.questions.length-1?'Nộp bài':'Tiếp →')+'</button></div>';
  document.querySelectorAll('input[name=a]').forEach(r=>r.onchange=()=>{state.answers[state.index]=Number(r.value);renderQuestion()});
  $('prev').onclick=()=>{if(state.index>0){state.index--;renderQuestion()}};
  $('next').onclick=()=>{if(state.index<state.questions.length-1){state.index++;renderQuestion()}else submit()};
}

function submit(){
  clearInterval(timer);
  let correct=0;const stats={},wrong=[];
  state.questions.forEach((q,i)=>{const ok=state.answers[i]===q.answer;if(ok)correct++;else wrong.push({q,chosen:state.answers[i],num:i+1});if(!stats[q.topic])stats[q.topic]={correct:0,total:0};stats[q.topic].total++;if(ok)stats[q.topic].correct++});
  const percent=Math.round(correct/state.questions.length*100);
  const strong=Object.keys(stats).filter(t=>stats[t].total>=2&&stats[t].correct/stats[t].total>=.75);
  const weak=Object.keys(stats).filter(t=>stats[t].total>=2&&stats[t].correct/stats[t].total<.6);
  const r={date:new Date().toISOString(),mode,subject,score:correct,total:state.questions.length,percent,level:grade(percent),strongTopics:strong,weakTopics:weak};
  const h=hist();h.unshift(r);save(h.slice(0,100));
  $('quiz').classList.add('hidden');$('result').classList.remove('hidden');
  renderResult(r,wrong);renderSubjects();renderRecent();state=null;
}

function nextTask(r){
  if(r.weakTopics.length)return'Học lại '+r.weakTopics.map(t=>topicName(r.subject,t)).join(', ')+' rồi kiểm tra lại.';
  if(r.percent>=85)return'Có thể chuyển sang mốc khó hơn.';
  return'Chữa câu sai và làm lại sau 2–3 ngày.';
}

function renderResult(r,wrong){
  const strong=r.strongTopics.length?r.strongTopics.map(t=>'<span class="pill good">'+esc(topicName(r.subject,t))+'</span>').join(' '):'<span class="pill warn">Chưa đủ dữ liệu</span>';
  const weak=r.weakTopics.length?r.weakTopics.map(t=>'<span class="pill bad">'+esc(topicName(r.subject,t))+'</span>').join(' '):'<span class="pill good">Không có phần yếu rõ</span>';
  const detail=wrong.length?wrong.map(w=>'<div class="wrong"><b>Câu '+w.num+'. '+esc(w.q.text)+'</b><p>Đáp án đúng: '+esc(w.q.options[w.q.answer])+'</p><p>'+esc(w.q.explain)+'</p></div>').join(''):'<p>Không có câu sai.</p>';
  $('result').innerHTML='<div class="score"><div><div class="eyebrow">'+MODES[r.mode].full.toUpperCase()+' • '+SUBJECTS[r.subject].name.toUpperCase()+'</div><h2>'+r.level+'</h2><span>'+r.score+'/'+r.total+' câu đúng</span></div><div class="score-ring" style="--score:'+r.percent+'"><div><b>'+r.percent+'%</b><small>chính xác</small></div></div></div><div class="result-cards"><div class="result-card"><h3>Đã vững</h3>'+strong+'</div><div class="result-card"><h3>Cần học lại</h3>'+weak+'</div><div class="result-card"><h3>Việc tiếp theo</h3><div>'+esc(nextTask(r))+'</div></div></div><details><summary>Xem câu sai ('+wrong.length+')</summary>'+detail+'</details><div style="margin-top:12px"><button id="again" class="btn primary">Làm lại</button></div>';
  $('again').onclick=renderReady;
}

function renderRecent(){
  const list=GROUPS[group].subjects;
  $('recent').innerHTML='<h2>Kết quả gần nhất</h2><div class="recent-grid">'+list.map(k=>{const l=latest(k);return'<div class="recent-item"><span>'+SUBJECTS[k].name+'</span><b>'+(l?l.percent+'%':'—')+'</b><span>'+(l?l.level:(isReady(k)?'Chưa kiểm tra':'Đang chuẩn hóa'))+'</span></div>'}).join('')+'</div>';
}

document.addEventListener('DOMContentLoaded',()=>{renderMilestones();renderGroups();renderSubjects();renderReady();renderRecent()});
