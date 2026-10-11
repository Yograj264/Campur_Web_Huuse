from pathlib import Path
from math import atan2,cos,sin
from html import escape
import json, zipfile
from reportlab.graphics.shapes import Drawing, Rect, Line, String, Polygon, Circle, Ellipse, PolyLine
from reportlab.graphics import renderSVG
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from pypdf import PdfReader
ROOT=Path('D:/College Project/Campus'); OUT=ROOT/'output/diagrams'; W=760;H=410
OUT.mkdir(parents=True,exist_ok=True)
P=colors.HexColor('#3525cd'); N=colors.HexColor('#172b4d'); T=colors.HexColor('#087e8b'); G=colors.HexColor('#617086'); L=colors.HexColor('#f1f3fb'); WHITE=colors.white
items=[]
class Graph:
 def __init__(self):self.d=Drawing(W,H);self.nodes={}
 def text(self,x,y,t,size=9,color=N,anchor='middle',bold=False):
  lines=t.split('\n')
  for i,line in enumerate(lines):self.d.add(String(x,H-y-i*(size+3),line,fontName='Helvetica-Bold' if bold else 'Helvetica',fontSize=size,fillColor=color,textAnchor=anchor))
 def box(self,k,x,y,w,h,label,kind='process',size=9):
  stroke=T if kind=='store' else G if kind in ['external','note'] else P
  fill=colors.HexColor('#eaf7f6') if kind=='store' else colors.HexColor('#f5f6f8') if kind in ['external','note'] else L
  self.d.add(Rect(x,H-y-h,w,h,rx=6,ry=6,fillColor=fill,strokeColor=stroke,strokeWidth=1))
  if kind=='store':self.d.add(Line(x+8,H-y,x+8,H-y-h,strokeColor=stroke))
  self.nodes[k]=(x,y,w,h)
  n=len(label.split('\n'));self.text(x+w/2,y+h/2-(n-1)*(size+3)/2+size/3,label,size)
 def ellipse(self,k,x,y,w,h,label,size=9):
  self.d.add(Ellipse(x+w/2,H-y-h/2,w/2,h/2,fillColor=L,strokeColor=P))
  self.nodes[k]=(x,y,w,h);n=len(label.split('\n'));self.text(x+w/2,y+h/2-(n-1)*(size+3)/2+size/3,label,size)
 def diamond(self,k,x,y,w,h,label,size=9):
  self.d.add(Polygon([x+w/2,H-y,x+w,H-y-h/2,x+w/2,H-y-h,x,H-y-h/2],fillColor=L,strokeColor=P))
  self.nodes[k]=(x,y,w,h);self.text(x+w/2,y+h/2,label,size)
 def point(self,k,side):
  x,y,w,h=self.nodes[k];return {'l':(x,y+h/2),'r':(x+w,y+h/2),'t':(x+w/2,y),'b':(x+w/2,y+h)}[side]
 def line(self,pts,label='',at=None,dash=False,arrow=True,color=G):
  for (x,y),(xx,yy) in zip(pts,pts[1:]):self.d.add(Line(x,H-y,xx,H-yy,strokeColor=color,strokeWidth=.9,strokeDashArray=[4,3] if dash else None))
  if arrow:
   (x,y),(xx,yy)=pts[-2:]; angle=atan2(yy-y,xx-x);a=6
   self.d.add(Polygon([xx,H-yy,xx-a*cos(angle-.45),H-(yy-a*sin(angle-.45)),xx-a*cos(angle+.45),H-(yy-a*sin(angle+.45))],fillColor=color,strokeColor=color))
  if label:
   x,y=at if at else ((pts[0][0]+pts[-1][0])/2,(pts[0][1]+pts[-1][1])/2-6)
   self.text(x,y,label,8,color)
 def edge(self,a,b,label='',sides=('r','l'),via=None,at=None,dash=False,arrow=True):self.line([self.point(a,sides[0])]+(via or [])+[self.point(b,sides[1])],label,at,dash,arrow)
 def actor(self,k,x,y,name):
  self.d.add(Circle(x,H-y-9,9,fillColor=WHITE,strokeColor=N));self.line([(x,y+18),(x,y+42)],arrow=False);self.line([(x-15,y+28),(x+15,y+28)],arrow=False);self.line([(x,y+42),(x-13,y+60)],arrow=False);self.line([(x,y+42),(x+13,y+60)],arrow=False);self.text(x,y+76,name,10,bold=True);self.nodes[k]=(x-18,y,36,62)
 def boundary(self,x,y,w,h,label):
  self.d.add(Rect(x,H-y-h,w,h,fillColor=None,strokeColor=G,strokeDashArray=[5,3]));self.text(x+10,y+17,label,9,G,'start',True)
 def end(self,x,y):self.d.add(Circle(x,H-y,7,fillColor=N,strokeColor=N));self.d.add(Circle(x,H-y,11,fillColor=None,strokeColor=N))
 def start(self,x,y):self.d.add(Circle(x,H-y,7,fillColor=N,strokeColor=N))
def add(no,title,priority,g,note):
 filename=f'{no}_{title.lower().replace(" ","_").replace("/","_").replace("(","").replace(")","")}.svg'
 renderSVG.drawToFile(g.d,str(OUT/filename))
 items.append({'no':no,'title':title,'priority':priority,'g':g,'note':note,'file':filename})
# 1 Use case
q=Graph();q.boundary(150,12,465,386,'Campus Web House');q.actor('student',65,135,'Student');q.actor('admin',690,135,'Admin')
for k,x,y,t in [('browse',175,50,'Browse / compare\ncolleges'),('save',175,124,'Save records / vote'),('post',175,198,'Post question / answer'),('mentor',175,272,'Submit mentor question'),('career',175,336,'Explore sample roadmap'),('login',422,73,'Admin sign-in'),('manage',422,174,'Manage catalogue\nand discussions'),('review',422,275,'Review mentor questions')]:q.ellipse(k,x,y,170,48,t)
for k in ['browse','save','post','mentor','career']:q.edge('student',k,sides=('r','l'),arrow=False)
for k in ['login','manage','review']:q.edge('admin',k,sides=('l','r'),arrow=False)
add('01','Use Case Diagram','Essential',q,'Student actions use browser sessions; no student signup exists. Admin management requires staff authentication and appropriate permissions. Career content and assessment remain demonstrations.')
# 2 Architecture
q=Graph();q.boundary(25,24,705,320,'Current local application');q.box('ui',50,75,180,100,'Browser\nReact + TypeScript\nScreens / modals','external');q.box('django',290,75,180,100,'Django 5.2\nURL routing + views\nORM + sessions + CSRF');q.box('db',540,75,165,100,'SQLite\ndb.sqlite3\n5 application models','store');q.edge('ui','django','HTTP + JSON');q.edge('django','db','ORM queries');q.box('build',60,245,220,66,'Vite build\nTailwind + React bundles');q.box('static',365,245,300,66,'templates/index.html\nstatic/frontend/assets/','store');q.edge('build','static','copy build output');q.edge('static','django',sides=('t','b'));q.text(380,377,'Node.js builds assets; Python serves the application.',10)
add('02','System Architecture Diagram','Essential',q,'The frontend and API share the Django origin in the built application. Vite is a development/build tool, not a required production API server.')
# 3 DFD level 0: context of complete information system
q=Graph();q.ellipse('system',270,125,240,140,'0. Campus Web House\nCampus guidance system',11);q.box('s',15,145,150,75,'Student','external');q.box('a',595,70,150,75,'Administrator','external');q.box('m',595,280,150,75,'Maintainer','external')
q.edge('s','system','queries / submissions',sides=('r','l'),at=(210,158));q.line([(270,227),(210,227),(210,215),(165,215)],'catalogue / state',at=(205,249))
q.edge('a','system','credentials / edits',sides=('l','t'),via=[(545,107),(390,107)],at=(508,93));q.line([(510,170),(565,170),(565,126),(595,126)],'admin results',at=(582,190))
q.edge('m','system','bundled seed data',sides=('l','b'),via=[(550,317),(390,317)],at=(490,341));q.line([(510,248),(570,248),(570,298),(595,298)],'import status',at=(621,250))
add('03a','DFD Level 0','Essential',q,'A single process shows system inputs and outputs. Student, administrator and maintainer are external actors. Internal tables and processes are intentionally hidden at this level.')
# 3 level 1
q=Graph()
rows=[('1.0 Catalogue','queries / catalogue','D1 College'),('2.0 Community','posts / answers / votes','D2 Discussion + Answer'),('3.0 Preferences','save / remind / progress','D3 VisitorState'),('4.0 Mentor intake','question / receipt','D4 MentorQuestion'),('5.0 Administration','credentials / edits / results','D1-D4 + auth + sessions'),('6.0 Seed import','seed data / import status','D1-D2')]
for i,(process,flow,store) in enumerate(rows):
 y=16+i*64;actor='Student' if i<4 else 'Administrator' if i==4 else 'Maintainer'
 q.box('a'+str(i),8,y+6,110,44,actor,'external');q.ellipse('p'+str(i),280,y,205,55,process);q.box('d'+str(i),605,y+6,150,44,store,'store',8)
 q.edge('a'+str(i),'p'+str(i),flow,at=(196,y+18));q.edge('p'+str(i),'d'+str(i),['catalogue query','thread / answer data','preference flags','mentor question','edits / credentials','sample records'][i],at=(546,y+18));q.line([(605,y+40),(485,y+40)],['college records','thread / answer records','saved state','receipt data','records / auth result','import results'][i],at=(546,y+55),arrow=True);q.line([(280,y+40),(118,y+40)],arrow=True)
add('03b','DFD Level 1','Essential',q,'D1-D4 are logical stores implemented in one SQLite database. Paired arrows represent request/write data and returned/read data. Community and catalogue results merge with D3 preferences; administration uses Django auth/session tables. Seed import reads bundled JSON.')
# level 2 decompose 2.0 create thread
q=Graph();q.box('s',8,26,150,55,'Student\nQuestion content','external');q.ellipse('v',240,26,205,55,'2.1 Validate request');q.box('err',565,26,185,55,'400 / 403 / 405\nError response','external');q.edge('s','v','POST JSON');q.edge('v','err','invalid')
q.ellipse('ses',240,132,205,55,'2.2 Resolve session');q.edge('v','ses','valid',sides=('b','t'));q.box('pref',565,132,185,55,'D3 VisitorState\nSession vote flag','store');q.edge('ses','pref','read state')
q.ellipse('create',240,240,205,55,'2.3 Create thread\nUUID + title + body');q.edge('ses','create',sides=('b','t'));q.box('dis',565,240,185,55,'D2 Discussion\nThread record','store');q.edge('create','dis','insert');q.edge('create','pref','save creator vote',sides=('r','b'),via=[(520,267),(520,209),(657,209)],at=(593,205))
q.ellipse('ret',240,345,205,55,'2.4 Return state\nUpdated community feed');q.edge('create','ret',sides=('b','t'));q.box('ui',8,345,150,55,'Student\nUpdated interface','external');q.edge('ret','ui','JSON',sides=('l','r'));q.edge('dis','ret','read records',sides=('b','r'),via=[(657,317),(505,317),(505,372)],at=(598,331))
add('03c','DFD Level 2','Essential',q,'Decomposition of the create-discussion part of process 2.0. CSRF/method checks precede the view; title/body/tags are validated. The atomic action writes the thread and visitor vote state, then returns refreshed state.')
# 4 conceptual ERD
q=Graph();q.box('d',45,35,230,100,'Discussion\nPK id (slug)\ntitle, body, data\ncreated_at','store');q.box('a',460,35,245,100,'Answer\nPK id (slug)\nFK discussion_id\ndata, created_at','store');q.edge('d','a','1                       0..*');q.text(380,150,'CASCADE when discussion is deleted',9)
q.box('c',45,210,230,100,'College\nPK id (slug)\nname, location\nannual_fee, data','store');q.box('v',350,205,175,110,'VisitorState\nPK id (auto)\nUQ session_key\ndata','store');q.box('m',570,205,175,110,'MentorQuestion\nPK id (auto)\nsession_key, mentor\nquestion, created_at','store')
q.text(455,364,'Session keys are logical text links, not foreign keys.',10)
add('04','Entity Relationship Diagram','Essential',q,'Only Discussion-to-Answer is an application-model foreign key. Saved college/thread identifiers inside VisitorState JSON are not enforced relational links. No College-to-Discussion or User-to-VisitorState foreign key exists.')
# 5 flowchart
q=Graph();q.box('load',35,20,175,50,'Open application');q.box('boot',35,110,175,55,'Load bootstrap JSON');q.edge('load','boot',sides=('b','t'));q.diamond('ok',40,210,165,70,'Load succeeded?');q.edge('boot','ok',sides=('b','t'));q.box('retry',300,220,185,50,'Show error / Retry');q.edge('ok','retry','No');q.line([(390,220),(390,135),(210,135)],'retry',at=(350,155))
q.box('render',35,330,175,55,'Render screens');q.edge('ok','render','Yes',sides=('b','t'));q.box('click',540,20,185,50,'Choose student action');q.line([(210,357),(515,357),(515,45),(540,45)],'interaction',at=(360,374));q.box('post',540,110,185,55,'POST /api/action/');q.edge('click','post',sides=('b','t'));q.diamond('valid',550,210,165,70,'Request valid?');q.edge('post','valid',sides=('b','t'));q.box('save',540,330,185,55,'Save DB + return JSON');q.edge('valid','save','Yes',sides=('b','t'));q.edge('valid','retry','No',sides=('l','r'));q.line([(540,373),(210,373)],'apply returned state',at=(370,349))
add('05','Flowchart','Essential',q,'High-level page load and persisted-action flow. Failed POST requests display an error without claiming a successful save. Browser-only tools such as comparison do not require a write request.')
# 6 activity
q=Graph();q.boundary(5,5,240,395,'Student / browser');q.boundary(255,5,240,395,'Django');q.boundary(505,5,250,395,'SQLite');q.start(125,45);q.box('form',35,70,180,50,'Enter title / details');q.line([(125,52),(125,70)]);q.box('sub',35,155,180,50,'Submit question');q.edge('form','sub',sides=('b','t'));q.box('val',285,155,180,50,'Validate JSON / CSRF');q.edge('sub','val');q.diamond('dec',300,238,150,65,'Valid?');q.edge('val','dec',sides=('b','t'));q.box('err',35,248,180,50,'Correct input / retry');q.edge('dec','err','No',sides=('l','r'));q.line([(35,273),(20,273),(20,95),(35,95)])
q.box('insert',535,247,185,50,'Insert thread + state','store');q.edge('dec','insert','Yes');q.box('json',285,336,180,44,'Return updated JSON');q.line([(628,297),(628,358),(465,358)]);q.box('display',35,336,180,44,'Display new thread');q.edge('json','display',sides=('l','r'));q.end(125,396);q.line([(125,380),(125,386)])
add('06','Activity Diagram','Essential',q,'Swimlanes assign responsibilities. The happy path validates and saves a new community discussion. The invalid path returns an error and allows correction; no signup is required in the current prototype.')
# 7 sequence
q=Graph();xs=[65,235,420,655];names=['Student','React / api.ts','Django action view','SQLite ORM']
for x,n in zip(xs,names):q.box(n,x-63,7,126,43,n,'external',8);q.line([(x,50),(x,400)],dash=True,arrow=False)
messages=[(0,1,82,'Click save college',False),(1,2,132,'POST action + ID + CSRF cookie/header',False),(2,3,182,'Read session state + verify college',False),(3,2,222,'Records / preferences',True),(2,3,262,'Save toggled bookmark',False),(3,2,297,'Write completed',True),(2,1,337,'200 JSON: refreshed state',True),(1,0,377,'Render saved status',True)]
for a1,b,y,label,dash in messages:q.line([(xs[a1],y),(xs[b],y)],label,at=((xs[a1]+xs[b])/2,y-8),dash=dash)
add('07','Sequence Diagram','Essential',q,'The save-college sequence represents successful interaction order. Responses use dashed arrows. Refresh persistence follows from another bootstrap GET reading the same browser session. Error sequences are summarized in the API/authentication diagrams.')
# 8 class diagram
q=Graph()
classes=[('c',15,30,230,150,'College : models.Model\n------------------------\nid: SlugField [PK]\nname, location: CharField\nannual_fee: DecimalField\ndata: JSONField\n------------------------\n__str__(): name'),('d',265,30,230,150,'Discussion : models.Model\n------------------------\nid: SlugField [PK]\ntitle: CharField; body: TextField\ndata: JSONField\ncreated_at: DateTimeField\n__str__(): title'),('a',515,30,230,150,'Answer : models.Model\n------------------------\nid: SlugField [PK]\ndiscussion: ForeignKey\ndata: JSONField\ncreated_at: DateTimeField\n------------------------\nInherited ORM methods'),('v',80,255,260,115,'VisitorState : models.Model\n--------------------------\nid: BigAutoField [implicit PK]\nsession_key: CharField [unique]\ndata: JSONField'),('m',420,255,260,115,'MentorQuestion : models.Model\n--------------------------\nid: BigAutoField [implicit PK]\nsession_key, mentor: CharField\nquestion: TextField; created_at')]
for k,x,y,w,h,t in classes:q.box(k,x,y,w,h,t,size=8)
q.edge('d','a','1 -> many',at=(505,20));q.text(380,220,'All classes inherit save(), delete() and the objects manager.',10)
add('08','Class Diagram','Recommended',q,'The diagram mirrors the actual Django model classes. Only College and Discussion define __str__. save/delete/query APIs are inherited, not custom methods. There are no fabricated student login or recommendation classes.')
# 9 components
q=Graph();q.boundary(10,10,250,382,'Browser components');q.box('screens',35,55,200,60,'Screens + modal components');q.box('app',35,164,200,60,'App.tsx\nNavigation + shared state');q.box('api',35,285,200,60,'api.ts\nFetch + CSRF headers');q.edge('screens','app',sides=('b','t'));q.edge('app','api',sides=('b','t'))
q.boundary(290,10,460,382,'Django components');q.box('urls',320,55,175,60,'Project + portal URLs');q.box('views',320,164,175,60,'portal.views\nBootstrap / actions / answers');q.box('models',320,285,175,60,'portal.models\nORM entities');q.edge('urls','views',sides=('b','t'));q.edge('views','models',sides=('b','t'));q.edge('api','urls','HTTP / JSON',sides=('r','l'),via=[(275,315),(275,85)])
q.box('admin',545,55,175,60,'Django admin + auth');q.box('mid',545,164,175,60,'Middleware\nSessions + CSRF');q.box('seed',545,285,175,60,'seed_demo command');q.edge('admin','models',sides=('b','r'),via=[(635,135),(520,135),(520,315)]);q.edge('mid','views',sides=('l','r'));q.edge('seed','models',sides=('l','r'))
add('09','Component Diagram','Recommended',q,'Component responsibilities are dependencies, not separate deployed services. React has no direct database access. The seed command and admin also use Django models. Framework middleware participates in the request lifecycle.')
# 10 deployment
q=Graph();q.boundary(20,20,720,360,'Current deployment: developer Windows computer');q.box('browser',45,90,185,90,'<<client>>\nBrowser\nReact interface','external');q.box('server',315,90,190,90,'<<execution environment>>\nPython virtual environment\nDjango development server');q.box('db',575,90,140,90,'<<artifact>>\ndb.sqlite3','store');q.edge('browser','server','loopback HTTP\n127.0.0.1:8000',at=(272,115));q.edge('server','db','local file');q.box('assets',315,260,255,75,'<<artifacts>>\ntemplates/index.html\nstatic/frontend/assets/','store');q.edge('assets','server',sides=('t','b'));q.box('node',45,260,185,75,'<<build environment>>\nNode.js + Vite');q.edge('node','assets','npm run build')
add('10','Deployment Diagram','Recommended',q,'Actual deployment is local, not cloud hosting. .venv is outside Campus. A production deployment would need an appropriate WSGI/ASGI server, HTTPS and separate static-file serving; these are future configuration, not currently implemented nodes.')
# 11 schema diagram
q=Graph()
schemas=[('c',5,12,240,175,'portal_college\nPK id: SlugField(50)\nname: CharField(200)\nlocation: CharField(100)\nannual_fee: Decimal(8,2)\ndata: JSONField'),('d',260,12,240,175,'portal_discussion\nPK id: SlugField(50)\ntitle: CharField(300)\nbody: TextField\ndata: JSONField\ncreated_at: DateTime(auto_now_add)'),('a',515,12,240,175,'portal_answer\nPK id: SlugField(50)\nFK discussion_id -> discussion.id\ndata: JSONField\ncreated_at: DateTime(auto_now_add)'),('v',80,247,260,145,'portal_visitorstate\nPK id: BigAutoField (implicit)\nUQ session_key: CharField(40)\ndata: JSONField'),('m',420,247,260,145,'portal_mentorquestion\nPK id: BigAutoField (implicit)\nsession_key: CharField(40)\nmentor: CharField(200), blank=True\nquestion: TextField\ncreated_at: DateTime(auto_now_add)')]
for k,x,y,w,h,t in schemas:q.box(k,x,y,w,h,t,'store',8)
q.edge('a','d','FK',sides=('l','r'),at=(507,25));q.text(380,220,'Fields shown as Django schema types; all 5 application tables.',9)
add('11','Database Schema Diagram','Essential',q,'All application fields are included. Session key fields are not database foreign keys. Django additionally manages auth, session, permission, content-type, migration and admin-log tables; those framework tables are listed in the accompanying README.')
# 12 wireframes
q=Graph()
for x,title in [(12,'Home / discover'),(265,'College catalogue'),(518,'Community')]:q.boundary(x,12,230,385,title);q.box('hdr'+str(x),x+10,44,210,35,'Header | notifications | profile','external',8);q.box('nav'+str(x),x+10,348,210,32,'Home | dashboard | careers | colleges | feed','external',6.6)
q.box('hero',22,96,210,65,'Hero introduction\nCareer-assessment button','note');q.box('homecards',22,183,210,65,'Featured college cards','note');q.box('road',22,269,210,55,'Career / learning content','note');q.box('search',275,96,210,38,'Search input + filters','note');q.box('chips',275,149,210,30,'Category chips / sort','note');q.box('colcards',275,195,210,76,'College cards\nDetails | save | compare','note');q.box('compare',275,290,210,38,'Compare selection / ROI','note');q.box('ask',528,96,210,38,'Ask question + categories','note');q.box('feed',528,155,210,95,'Thread list\nOpen | vote | bookmark','note');q.box('mentor',528,277,210,51,'Mentor spotlight\nQuestion drawer','note')
add('12','Wireframe Diagram','Essential',q,'Low-fidelity structural wireframes of three existing screens. This is not a pixel-exact screenshot. Shared header and mobile bottom navigation remain outside screen content; dialogs/drawers appear as overlays.')
# 13 sitemap
q=Graph();q.box('root',285,10,190,50,'Django GET /\nReact application shell');screens=[('home',15,'Home'),('dash',140,'Dashboard'),('career',265,'Careers'),('col',390,'Colleges'),('feed',515,'Community')]
for k,x,t in screens:q.box(k,x,128,110,45,t);q.edge('root',k,sides=('b','t'),via=[(380,90),(x+55,90)])
q.box('det',515,245,140,55,'Discussion detail\nselectedDiscussionId');q.edge('feed','det',sides=('b','t'));q.box('modal',30,263,400,75,'Overlay actions\nAssessment | profile | notifications\nCollege details | compare | ROI | filters\nAsk question | mentor connect');q.box('admin',630,128,120,55,'/admin/\nSeparate route','external');q.text(380,380,'Screen names are React states, not independent Django page URLs.',10)
add('13','Sitemap','Essential',q,'Logical screen hierarchy for the SPA. Dashboard, careers, colleges and community are React views under /. Admin is a distinct Django route. The overlays are application dialogs, not additional website pages.')
# 14 user flow
q=Graph();q.box('entry',15,150,125,55,'Open home');q.box('college',210,35,150,55,'Choose Colleges');q.box('community',210,150,150,55,'Choose Community');q.box('careers',210,280,150,55,'Choose Careers');q.edge('entry','college',via=[(175,177),(175,62)]);q.edge('entry','community');q.edge('entry','careers',via=[(175,177),(175,307)])
q.box('search',420,35,155,55,'Search / filter');q.box('post',420,150,155,55,'Ask / open thread');q.box('roadmap',420,280,155,55,'Explore roadmap');q.edge('college','search');q.edge('community','post');q.edge('careers','roadmap');q.box('save',620,35,125,65,'Details / compare\nBookmark');q.box('answer',620,150,125,65,'Read / answer\nVote / save');q.box('mentor',620,280,125,65,'Mentor question\nStored for review');q.edge('search','save');q.edge('post','answer');q.edge('roadmap','mentor');q.text(380,387,'No student login step is implemented in these journeys.',10)
add('14','User Flow Diagram','Essential',q,'Shows three real navigation journeys. Only actions wired to the API persist. Comparison selection and roadmap task state remain temporary UI state; mentor questions are stored without external delivery.')
# 15 state: bookmark preference
q=Graph();q.start(58,115);q.box('load',125,80,200,65,'Load saved flag\nfrom bootstrap');q.line([(65,115),(125,115)]);q.box('unsaved',450,35,225,65,'Unsaved\nisSaved = false');q.box('saved',450,270,225,65,'Saved\nisSaved = true');q.edge('load','unsaved','initial flag = false',via=[(375,112),(375,67)],at=(387,50));q.edge('load','saved','initial flag = true',via=[(375,112),(375,302)],at=(291,298))
q.line([(560,100),(560,270)],'click Save / POST success',at=(620,163));q.line([(675,302),(723,302),(723,67),(675,67)],'click again / success',at=(647,220));q.line([(450,60),(410,60),(410,110),(470,110),(470,100)],'failure: stay unsaved',at=(392,129));q.line([(450,303),(410,303),(410,356),(600,356),(600,335)],'failure: stay saved',at=(503,377));q.text(260,212,'Persisted bookmark state\nUI changes after server response.',10)
add('15','State Diagram','Optional',q,'State machine for one college bookmark, not a whole student profile. Initial state comes from session-aware bootstrap. A successful POST toggles the stored flag. An unsuccessful request leaves the last confirmed state unchanged.')
# 16 API flow
q=Graph();q.box('ui',20,35,190,65,'React App.tsx\napi.ts helper','external');q.box('get',280,35,205,65,'GET /api/bootstrap/');q.box('post',280,174,205,65,'POST /api/action/\nJSON + CSRF header');q.box('answer',280,313,205,65,'GET /api/discussions/\n<id>/answers/');q.edge('ui','get','initial / refresh');q.edge('ui','post','persistent action',via=[(245,68),(245,207)],at=(175,169));q.edge('ui','answer','open thread',via=[(225,68),(225,346)],at=(159,311));q.box('db',560,152,180,105,'ORM + SQLite\nRecords + visitor state','store');q.edge('get','db',via=[(520,68),(520,187)]);q.edge('post','db');q.edge('answer','db',via=[(540,346),(540,233)]);q.text(646,304,'200 JSON -> React state\n400 / 403 / 404 / 405 -> error',9);q.text(380,403,'Frontend and API use the same origin in the built Django application.',9)
add('16','API Flow Diagram','Recommended',q,'api.ts handles bootstrap and action calls; DiscussionDetailScreen fetches the thread-answer endpoint directly. Normal responses contain refreshed state or answer data. Error responses must not be interpreted as successful database saves.')
# 17 auth admin
q=Graph();q.box('visit',20,20,175,55,'Visit /admin/');q.diamond('session',235,10,180,75,'Active staff\nsession?');q.edge('visit','session');q.box('login',235,130,180,55,'Admin login form');q.edge('session','login','No',sides=('b','t'));q.box('post',235,225,180,55,'POST username/password\nCSRF token');q.edge('login','post',sides=('b','t'));q.diamond('check',505,213,210,80,'Valid credentials +\nactive staff user?');q.edge('post','check');q.box('err',505,335,210,55,'Show login error');q.edge('check','err','No',sides=('b','t'));q.line([(505,362),(455,362),(455,157),(415,157)],'retry',at=(474,303));q.box('allow',505,20,210,72,'Django session cookie\nAdmin index + permission\nchecks for model actions');q.edge('session','allow','Yes');q.edge('check','allow','Yes',sides=('t','b'));q.text(160,373,'Logout invalidates session.\nNo student signup or JWT.',10)
add('17','Authentication Flow Diagram','Recommended',q,'This is Django admin session authentication, not JWT or student authentication. Django checks active/staff status and model permissions; a superuser has broad permissions. Student API actions currently use visitor sessions, not registered student ownership.')
# 18 network
q=Graph();q.boundary(15,20,510,355,'Local Windows host / loopback boundary');q.box('b',40,90,180,85,'Browser\nSession cookie + CSRF','external');q.box('d',305,90,190,85,'127.0.0.1:8000\nDjango\nHost / CSRF / session checks');q.edge('b','d','Local HTTP');q.box('db',305,260,190,70,'SQLite local file\nNo network database port','store');q.edge('d','db','ORM',sides=('b','t'));q.box('cdn',575,60,170,120,'External HTTPS\nGoogle Fonts / symbols\nOriginal image providers','external');q.edge('b','cdn','asset requests',sides=('t','l'),via=[(130,42),(550,42),(550,120)],at=(370,34));q.box('vite',40,260,180,70,'Optional Vite dev server\nport 3000\n/api proxy -> port 8000');q.edge('vite','d','dev API proxy',sides=('r','l'),via=[(255,295),(255,132)],at=(239,232))
add('18','Network Architecture Diagram','Optional',q,'The implemented environment uses local HTTP on loopback. External font/image requests need internet. This is not a deployed internet service; HTTPS termination, firewall policy and production hosting are future infrastructure. No JWT or cloud database is present.')
# 19 Gantt
q=Graph();q.text(380,20,'PROPOSED 6-WEEK EXTENSION PLAN - NOT HISTORICAL DELIVERY DATES',11,bold=True)
tasks=[('Requirements + review fixes',1,1),('Auth + data normalization',1,2),('Backend validation + moderation',2,3),('UI integration + notifications',3,4),('Tests + concurrency checks',4,5),('Deployment + documentation',5,6)]
x0=305;cw=65;y0=70;rh=47
for week in range(1,7):q.text(x0+(week-.5)*cw,51,'Week '+str(week),9,bold=True)
for i,(t,start,end) in enumerate(tasks):
 y=y0+i*rh;q.text(12,y+19,t,9,anchor='start')
 for w in range(6):q.d.add(Rect(x0+w*cw,H-y-30,cw,30,fillColor=WHITE,strokeColor=colors.HexColor('#dde2ec'),strokeWidth=.5))
 q.d.add(Rect(x0+(start-1)*cw+4,H-y-26,(end-start+1)*cw-8,22,fillColor=P if i%2==0 else T,strokeColor=None,rx=4,ry=4))
q.text(380,388,'Sequence is a proposal; duration and resources must be agreed with the mentor.',10)
add('19','Gantt Chart','Academic / planning',q,'No development schedule was provided. This chart is an explicitly proposed six-week improvement plan, with relative weeks rather than invented completion dates. Scope and timing are subject to mentor review.')
# 20 context focused external boundary
q=Graph();q.boundary(235,75,290,235,'System boundary');q.box('sys',265,143,230,98,'Campus Web House\nCollege catalogue\nCommunity + preferences\nAdmin + seed import',size=10);q.actor('s',65,147,'Student');q.actor('a',680,63,'Administrator');q.actor('m',680,278,'Maintainer');q.edge('s','sys','queries / submissions',at=(177,169));q.line([(265,225),(177,225),(177,195),(83,195)],'catalogue / state',at=(159,247));q.edge('a','sys','credentials / edits',sides=('l','r'),via=[(568,94),(568,170)],at=(610,143));q.line([(495,201),(607,201),(607,113),(662,113)],'admin results',at=(620,220));q.edge('m','sys','bundled data',sides=('l','b'),via=[(569,309),(380,309)],at=(570,334));q.line([(495,222),(590,222),(590,329),(662,329)],'import status',at=(661,253))
add('20','Context Diagram','Recommended',q,'Context and DFD Level 0 intentionally cover the same system boundary. This view emphasizes external actors, while the DFD labels the single process as 0. No mentor-delivery platform, payment service or AI API is connected.')
# Package PDF and diagram sources
pdf=ROOT/'output/pdf/Campus_Project_Diagrams.pdf';pdf.parent.mkdir(parents=True,exist_ok=True)
styles={
 'title':ParagraphStyle('title',fontName='Helvetica-Bold',fontSize=25,leading=30,textColor=N,spaceAfter=14),
 'head':ParagraphStyle('head',fontName='Helvetica-Bold',fontSize=18,leading=22,textColor=N,spaceAfter=6),
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=15,textColor=N,spaceAfter=10),
 'note':ParagraphStyle('note',fontName='Helvetica',fontSize=9,leading=12,textColor=G,spaceBefore=8),
 'cell':ParagraphStyle('cell',fontName='Helvetica',fontSize=8.6,leading=11,textColor=N)}
story=[]
def para(t,k='body'):return Paragraph(t,styles[k])
story += [Spacer(1,35),para('Campus Web House<br/>Complete Project Diagram Set','title'),para('20 requested diagram categories | 22 diagrams including DFD Levels 0, 1 and 2'),para('<b>Review preparation:</b> 12 October 2026. Prepared 11 October 2026 from the implemented local project.'),para('<b>Stack:</b> Django 5.2 backend, React/TypeScript interface, SQLite persistence, Vite/Tailwind asset build.'),para('<b>How to read:</b> purple boxes are processes/components, teal boxes are data stores, grey boxes are external actors or supporting items. UML relationship meaning and cardinality are labeled directly where relevant.'),para('<b>Scope:</b> student preferences use browser sessions; only admin login is implemented. No student signup, JWT, live AI service or external mentor delivery is shown. The Gantt chart is a proposed extension plan, not a record of dates actually worked.'),para('<b>Deliverables:</b> a printable landscape PDF, 22 scalable SVG diagrams, editable generation source and a diagram manifest.'),PageBreak(),para('Diagram index','head')]
rows=[['No.','Diagram','Priority','PDF page']]
for i,item in enumerate(items,3):rows.append([item['no'],item['title'],item['priority'],str(i)])
table=Table([[para(escape(v),'cell') for v in row] for row in rows],colWidths=[55,365,200,70],repeatRows=1,hAlign='LEFT')
table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),L),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3),('LINEBELOW',(0,0),(-1,0),1,P),('LINEBELOW',(0,1),(-1,-1),.25,colors.HexColor('#dce2eb'))]))
story.append(table)
for item in items:
 story += [PageBreak(),para(item['no']+' | '+item['title'],'head'),para('Priority: '+item['priority'],'note'),Spacer(1,4),item['g'].d,para(item['note'],'note')]
def footer(c,doc):
 c.saveState();w,h=landscape(A4);c.setFillColor(G);c.setFont('Helvetica',8);c.drawString(40,h-26,'CAMPUS WEB HOUSE | PROJECT DIAGRAMS');c.drawRightString(w-40,h-26,'CURRENT IMPLEMENTATION / PROPOSED PLAN LABELED');c.setStrokeColor(colors.HexColor('#dce2eb'));c.line(40,33,w-40,33);c.drawString(40,20,'Prepared 11 Oct 2026 | Mentor review 12 Oct 2026');c.drawRightString(w-40,20,str(doc.page));c.restoreState()
doc=SimpleDocTemplate(str(pdf),pagesize=landscape(A4),leftMargin=40,rightMargin=40,topMargin=43,bottomMargin=42,title='Campus Web House - Complete Project Diagram Set',author='Campus Project')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
manifest=[{k:v for k,v in i.items() if k!='g'} for i in items];(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
readme='''# Campus Web House diagrams

20 requested categories, 22 SVG diagrams, and a landscape PDF. Prepared 11 October 2026 for review 12 October 2026.

SVG files are scalable and open in a browser or vector editor. The generation source uses ReportLab and pypdf and contains the diagram definitions. It is configured for D:/College Project/Campus; update ROOT if generating elsewhere.

Scope: actual Django + React + SQLite implementation. Student actions are session-based. Authentication is Django admin with cookies, not JWT or student signup. The Gantt chart is a proposed six-week plan, not historical work dates. Local deployment and network diagrams do not imply cloud hosting.

Framework tables additionally present in SQLite: auth_group, auth_group_permissions, auth_permission, auth_user, auth_user_groups, auth_user_user_permissions, django_admin_log, django_content_type, django_migrations, django_session. The schema diagram covers every field in the five application models; it does not expand framework-internal schemas.

Source basis: portal/models.py, portal/views.py, portal/urls.py, portal/admin.py, campus_project/urls.py and settings.py, src/App.tsx and api.ts, screen/components, vite.config.ts, scripts/build-django.mjs and local SQLite table introspection. No live external mentor, AI or payment integrations exist.

'''
for i in items:readme+=f"## {i['no']} - {i['title']}\nPriority: {i['priority']}\nFile: {i['file']}\n\n{i['note']}\n\n"
(OUT/'README.md').write_text(readme,encoding='utf-8')
source=Path(__file__);target=OUT/'generate_diagrams.py'
if source.resolve()!=target.resolve():target.write_text(source.read_text(encoding='utf-8'),encoding='utf-8')
bundle=ROOT/'output/Campus_Diagrams_Bundle.zip'
with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED) as z:
 z.write(pdf,pdf.name)
 for f in sorted(OUT.iterdir()):
  if f.is_file():z.write(f,'diagrams/'+f.name)
reader=PdfReader(pdf); print('PDF pages:',len(reader.pages));print('Diagrams:',len(items));print('PDF:',pdf);print('ZIP:',bundle)
for i,p in enumerate(reader.pages,1):
 text=p.extract_text() or '';print(i, len(text),' / '.join(text.splitlines()[2:4]))
