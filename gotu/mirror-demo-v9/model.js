// Fixed, local source-based fixtures. No inference, storage, or network dependencies.
const FIXTURES=[{"id": "personal", "label": "Personal Best", "question": "#1 Personal Best (last 90 days)", "text": "Working Remote in Sedona w/ my family has been a dream of mine for almost 10 years. It was Slow and rejuvenating and helped me really focus on what matters deeply.", "group": "Looking back", "kind": "text"}, {"id": "professional", "label": "Professional Best", "question": "#1 Professional Best (last 90 days)", "text": "Alignment with G2M team around sale reorg play.", "group": "Looking back", "kind": "text"}, {"id": "rating", "label": "Quarter Rating", "question": "Rate last quarter on a scale of 1–10", "text": "6", "group": "Looking back", "kind": "rating"}, {"id": "reason", "label": "Rating Reason", "question": "What is the single biggest reason behind that rating?", "text": "Alignment around AI building governance/rules/charter. \nThe misalignment has made me hate coming to work many days. A feeling i have not had in 6 years. This pulled down the rating. - this pulled down to a 3.\n\nHenry Schien Partnership, M&A exploration process, G2M Org Planning, New Ai Projects (dental match, Deb, RAMMAN, etc), Our new product roadmap & roadmap process, Felling the Engineering team is ready to FLY and develop faster than anything we've seen, Hiring a Lawyer I believe will be awesome, felling really aligned with our model / budget, New board member, Enterprise cooking, Job board intercept and the talent graph in Marketing, Opps / CS team structure and optimization, our launch processes w/ Sarah, AI Mirror, States of the Unicorn, Development programs, Dialed in with Shauna, great handbook (upcoming changes) and the survey. Danny approved a shirt budget. this made it a 10\n\nSo the combined score is a 6.5 (it wouldn't let me do 6.5)", "group": "Looking back", "kind": "text"}, {"id": "Executive-component", "label": "EOS Component", "question": "Which EOS component most needs improvement?", "text": "Vision", "group": "Executive", "kind": "component"}, {"id": "Executive-example", "label": "EOS Example", "question": "Give one brief example.", "text": "We need to agree on our vision for new product development and prioritization. Ai product development / governance. Headcount. and where we are going over the next 2-3 years.", "group": "Executive", "kind": "text"}, {"id": "Executive-avoided", "label": "Avoided Conversation", "question": "What conversation does this team need to have that it may be avoiding?", "text": "We need to grow revenue, but we'll ultimately be valued on EBITDA. That means having an honest conversation about efficiency, headcount, and operating lean while still driving growth. \n\nThis calls for a \"how can we\" mindset. We can't have a scarcity mindset.\n\nSecond, our goal is to reach $100M, and I believe we need additional product(s) to get there. \n\nFinally, I think we're too quick to dismiss our competition and other companies as idiots. It feels like arrogance and it concerns me, because it causes us to write off potential real risks before we've genuinely considered them.", "group": "Executive", "kind": "text"}, {"id": "Executive-issue", "label": "Biggest Issue", "question": "What’s the single biggest issue limiting this team right now?", "text": "We need agreement on a clear ai / building philosophy.", "group": "Executive", "kind": "text"}, {"id": "GTM-component", "label": "EOS Component", "question": "Which EOS component most needs improvement?", "text": "Data", "group": "GTM", "kind": "component"}, {"id": "GTM-example", "label": "EOS Example", "question": "Give one brief example.", "text": "I feel like i have a lot of directionally correct data, but i struggle b/c much of it feels like correlation not exact causation. Maybe its a wish but it leaves me wanting more.", "group": "GTM", "kind": "text"}, {"id": "GTM-avoided", "label": "Avoided Conversation", "question": "What conversation does this team need to have that it may be avoiding?", "text": "Our company has huge growth goals 100M, but will be valued on EBIDTA.  Which means we MUST focus on hyper efficient growth. This team will be measured on LTV/CAC, Revenue Growth, and Margin.\n\nWe must have a HOW CAN WE, mentality...kill any scarcity thinking, get aligned with Each Person in the room - Kill politicking and GO!", "group": "GTM", "kind": "text"}, {"id": "GTM-issue", "label": "Biggest Issue", "question": "What’s the single biggest issue limiting this team right now?", "text": "I want to make sure we are all really on the same page. Same Team (this team first), and we are going to have to make some \"Strategic Bets\" without perfect clean data...and then GO.", "group": "GTM", "kind": "text"}, {"id": "vision", "label": "Success Vision (90 days)", "question": "If this quarter were wildly successful, what would be true 90 days from now?", "text": "1. We have an ai / new product development charter we have all agreed on, so we are no longer stuck in politics, but free to move forward and build with confidence & peace of mind.\n\n2. We have completed our Sales / G2M reorg, allowing us to Focus on DSO's, Henry Schein, and our highest value ICP, while reducing our expense profile significantly.\n\n3. Henry Schein Partnership is Smashing (3500 shifts worked from Schein offices)\n\n4. We have built a lean organization across all departments - so we can focus on efficiency.\n\n5. We have seen MAJOR increases in work rate (6%+) as a result of Hygienist Rates Increases, product releases. Our new releases are showing up direction on the P&L.\n\n6. Engineering is smashing through the product roadmap and delivery time expectations (they are flying and creating a not enough product ideas problem). \n\n7. We have integrated Deb idea and Perm product and its generating 10-30K of Rev per Month\n\n8. Dental Match is generating 10-30K of Rev per Month\n\n9. We run project Tombstone in Phoenix, Boston, and Midwest.\n\n10. We decide how to run our L10s with such a large group (ie...is this a Connect, Scorecard, Heavy Updates, Identify Issues (then identify who needs to be a part of the D & S) if its 75% of the room we do it in L10 if not, we address it as a to do to IDS with smaller team, and then they report back the IDS outcomes at the next sessions)", "group": "Looking forward", "kind": "text"}, {"id": "rock", "label": "Top Rock", "question": "What is the most important Rock we should complete to make that happen?", "text": "We have built a lean organization across all departments - so we can focus on efficiency.", "group": "Looking forward", "kind": "text"}, {"id": "issues", "label": "Issues List", "question": "List anything else you’d like on the Issues List.", "text": "We have a heavy meeting culture. I cannot put deep work time on my calendar without it getting booked over. Is there a solve to this?", "group": "Looking forward", "kind": "text"}];
const HEADERS=['Submitted At','Full Name','Email','Teams','Personal Best','Professional Best','Quarter Rating','Rating Reason','Team','EOS Component','EOS Example','Avoided Conversation','Biggest Issue','Success Vision (90 days)','Top Rock','Issues List'];
const EOS=['Vision','People','Data','Issues','Process','Traction'];
const fieldText=id=>FIXTURES.find(f=>f.id===id).text;
const CHAPTERS=[
 {id:'back',name:'Looking back',turns:[
  {q:'Before we talk about work, what’s one win outside work that meant a lot to you over the last 90 days?',a:'Working remotely in Sedona with my family. That had been a dream for almost ten years. It was slow and rejuvenating, and helped me focus on what matters deeply.',fields:['personal']},
  {q:'And at work—what’s the win you’re most proud of from those 90 days?',a:'Getting aligned with the GTM team around the sales reorganization. That felt like real progress.',fields:['professional']},
  {q:'Thinking about the whole quarter, what number would you give it from 1 to 10—where 1 is rough and 10 is exceptional?',a:'Six on that scale. Though my overall feeling was closer to six and a half.',fields:['rating']},
  {q:'What’s the biggest reason for that number?',a:'I almost have two completely different ratings.\n\nThe misalignment around AI building—governance, rules, a charter—made me hate coming to work many days. I haven’t felt that in six years. That part was a three.\n\nBut then there’s Henry Schein, M&A exploration, GTM planning, new AI projects, our product roadmap and its process. Engineering feels ready to fly. The lawyer we hired, our model and budget, the new board member, Enterprise, Marketing’s job-board intercept and talent graph, Operations, CS, and our launch processes with Sarah. AI Mirror, State of the Unicorn, development programs, alignment with Shauna, the handbook and survey. Even the shirt budget. There is a ridiculous amount to be excited about. That side was a ten.',fields:['reason']},
  {q:'What would someone miss if they saw only the combined rating?',a:'They’d think it was an average quarter. It wasn’t average. I don’t want the good things lost because of this problem. But the excitement can’t become an excuse for ignoring how miserable the misalignment has felt.',final:true,fields:['reason']},
  {q:'Before we leave looking back, what else would you like me to understand?',a:'Don’t turn this into “some opportunities for better alignment.” I’m excited and frustrated. Both are true.',closing:true,fields:['reason']}
 ]},
 {id:'Executive',name:'Executive',turns:[
  {q:'Let’s talk about Executive. Of the six EOS areas—Vision, People, Data, Issues, Process, and Traction—which most needs attention this quarter?',a:fieldText('Executive-component'),fields:['Executive-component']},
  {q:'What’s one example that brings that to mind?',a:fieldText('Executive-example'),fields:['Executive-example']},
  {q:'What does this team need to talk about that keeps getting left unsaid?',a:fieldText('Executive-avoided'),fields:['Executive-avoided']},
  {q:'If you had to name one thing holding Executive back right now, what would it be?',a:fieldText('Executive-issue'),fields:['Executive-issue']},
  {q:'Before we leave Executive, what else would you like me to understand?',a:'The growth and efficiency points belong together. We need a “how can we” mindset.',closing:true,fields:['Executive-avoided']}
 ]},
 {id:'GTM',name:'GTM',turns:[
  {q:'Now think about GTM on its own. Which EOS area needs the most attention—Vision, People, Data, Issues, Process, or Traction?',a:'Data.',fields:['GTM-component']},
  {q:'What’s one example you’ve seen?',a:'I feel like we have a lot of directionally correct data. But much of it feels like correlation, not exact causation. Maybe I’m wishing for something we can’t completely have. It still leaves me wanting more.',fields:['GTM-example']},
  {q:'What does GTM need to talk about that keeps getting left unsaid?',a:fieldText('GTM-avoided'),fields:['GTM-avoided']},
  {q:'And if you had to name one thing holding GTM back right now, what would it be?',a:'I want us really on the same page. Same team—this team first. We’re going to have to make some strategic bets without perfect, clean data, and then go.',fields:['GTM-issue']},
  {q:'You want better evidence, and you’re ready to make bets. What should the team understand about that distinction?',a:'I want to understand what’s actually driving results so we can make better decisions about where effort and money go. That doesn’t mean waiting for perfect data. I want us aligned on the bets we’re making and clear about what we know.',final:true,fields:['GTM-example','GTM-issue']},
  {q:'Before we leave GTM, what else would you like me to understand?',a:'I’m not saying the data is useless or that I’m unwilling to move. Keep the uncertainty without making it sound like hesitation.',closing:true,fields:['GTM-example']}
 ]},
 {id:'forward',name:'Looking forward',turns:[
  {q:'You’ve described progress alongside unresolved alignment. If this quarter were wildly successful, what would be true in 90 days?',a:fieldText('vision'),fields:['vision']},
  {q:'To make that future happen, what’s the one Rock you’d put first?',a:fieldText('rock'),fields:['rock']},
  {q:'Before we finish, what else should go on the Issues List? It’s fine if there’s nothing else.',a:fieldText('issues'),fields:['issues']},
  {q:'Before we leave looking forward, what else would you like me to understand?',a:'Nothing else. Let me see the answers together now.',closing:true,fields:[]}
 ]}
];
const DRAFT_REASON='This wasn’t an average quarter. It had two very different sides.\n\nMisalignment around AI building, governance, rules, and a charter made me hate coming to work many days. I haven’t felt that way in six years. That part felt like a three.\n\nAt the same time, there is a tremendous amount to be excited about: Henry Schein, M&A exploration, GTM planning, new AI projects, our product roadmap and process, Engineering’s readiness to move faster, our lawyer, model and budget, board member, Enterprise, Marketing, Operations, CS, launch processes, AI Mirror, State of the Unicorn, development programs, alignment with Shauna, the handbook, the survey, and even the shirt budget. That side felt like a ten.\n\nMy combined assessment was six and a half. That number shouldn’t hide either the progress or the seriousness of the misalignment. We need agreement on how we build with AI so we can move forward with confidence.';
const RATING_REVISION=DRAFT_REASON.replace('My combined assessment was six and a half.','I selected 6 on the whole-number scale; my overall feeling was six and a half.');
const DRAFT_DATA='We have a lot of directionally correct data, but much of it feels like correlation rather than clear causation. Maybe more certainty isn’t always possible, but it leaves me wanting more.\n\nI want to understand what is driving results so we can make better decisions about where we put effort and money. That doesn’t mean waiting for perfect data. We need to agree on our strategic bets, be clear about what the data tells us, and move.';
const DISCUSSION_DATA='We have a lot of directionally correct data, but much of it feels like correlation rather than clear causation. I want a better understanding of what is driving results. Maybe we can’t always know exactly, and I don’t want that uncertainty erased.\n\nI’m ready to move. We need to agree on our strategic bets without waiting for perfect data.';
const POLITICS_REVISION=fieldText('GTM-avoided').split('\n\n')[0]+'\n\nWe need a HOW CAN WE mentality, not scarcity thinking. Internal politicking gets in the way. Put this team first, align on our strategic bets, and GO.';
const REVIEW_NOTES={
 reason:{title:'Clarify the number',body:'Your rating is 6; your explanation says six and a half. You can keep that nuance or make the distinction explicit.',suggestion:RATING_REVISION,explanation:'Keeps both the whole-number rating and your more nuanced assessment.'},
 'GTM-avoided':{title:'Consider how you want to say this',body:'“Kill politicking” carries your frustration, but could dominate the point. You might make the request more explicit: put this team first and align on the bets. Keeping your original wording is valid.',suggestion:POLITICS_REVISION,explanation:'Keeps the concern about internal politics and the urgency. Makes the requested change explicit.'}
};
// Pure approval and publication functions: no DOM or browser APIs.
const Model=(()=>{
 const initial=()=>({identity:null,chapters:[],chapter:0,turn:0,transcript:[],answers:[],finished:false,editing:null,package:null,notice:''});
 const isApproved=a=>a.approval?.version===a.version&&a.approval?.text===a.text;
 const valid=a=>a.text.trim().length>0&&(a.kind!=='rating'||/^(10|[1-9])$/.test(a.text))&&(a.kind!=='component'||EOS.includes(a.text));
 const ready=s=>s.finished&&!s.editing&&s.answers.length>0&&s.answers.every(a=>valid(a)&&isApproved(a));
 const currentPackage=s=>s.package&&ready(s)&&s.package.signature===JSON.stringify(s.answers.map(a=>[a.id,a.version,a.text]))?s.package:null;
 function reduce(s,action){
  if(action.type==='reset')return initial();
  s=structuredClone(s);s.notice='';
  if(action.type==='start'){
   s=initial();s.identity=action.identity;s.chapters=CHAPTERS.filter(c=>!['Executive','GTM'].includes(c.id)||s.identity.teams.includes(c.id));
  }
  if(action.type==='answer'&&s.identity&&!s.finished){
   const c=s.chapters[s.chapter],t=c.turns[s.turn];
   if(!t)return s;
   s.transcript.push({chapter:c.name,...t,staged:!!action.staged});s.turn++;
  }
  if(action.type==='next'&&s.identity&&!s.finished){
   const c=s.chapters[s.chapter];if(s.turn<c.turns.length)return s;
   if(s.chapter<s.chapters.length-1){s.chapter++;s.turn=0;}
   else{
    s.finished=true;s.answers=FIXTURES.filter(f=>!['Executive','GTM'].includes(f.group)||s.identity.teams.includes(f.group)).map(f=>({...f,text:f.id==='reason'?DRAFT_REASON:f.id==='GTM-example'?DRAFT_DATA:f.text,original:f.id==='reason'?DRAFT_REASON:f.id==='GTM-example'?DRAFT_DATA:f.text,version:1,approval:null,review:'Scripted review',flag:REVIEW_NOTES[f.id]?.body||'',choice:'',discussion:[]}));
   }
  }
  if(action.type==='edit'||action.type==='discuss'){
   const a=s.answers.find(a=>a.id===action.id);if(!a)return s;
   a.approval=null;s.package=null;s.editing={id:a.id,mode:action.type};s.notice='This answer is open for changes. It will need fresh approval.';
  }
  if(action.type==='save'){
   const a=s.answers.find(a=>a.id===action.id);if(!a||s.editing?.id!==a.id)return s;
   const candidate={...a,text:action.text};if(!valid(candidate)){s.notice='Enter an answer. Ratings must be whole numbers 1–10.';return s;}
   a.text=action.text;a.version++;a.approval=null;a.flag='';a.choice='Edited';a.review='Participant-edited; no automated review';s.editing=null;s.package=null;s.notice='Changes saved here. You’ll approve the full set when you’re ready.';
  }
  if(action.type==='cancel'){s.editing=null;s.notice='Edit closed. Wording unchanged; final approval is still required.';}
  if(action.type==='keep'){
   const a=s.answers.find(a=>a.id===action.id);if(!a||s.editing)return s;
   a.flag='';a.choice='Kept as written';s.notice='Original wording kept. You will approve the full set at the end.';
  }
  if(action.type==='clarification'){
   const a=s.answers.find(a=>a.id===action.id);if(!a||s.editing?.mode!=='discuss')return s;
   a.discussion.push({question:action.question,response:action.response});
  }
  if(action.type==='original'){
   const a=s.answers.find(a=>a.id===action.id);if(!a)return s;
   if(a.text!==a.original){a.text=a.original;a.version++;}a.approval=null;a.flag='';a.choice='Restored original';s.editing=null;s.package=null;s.notice='Original wording restored. Approve it with the full set at the end.';
  }
  if(action.type==='approve'){
   const a=s.answers.find(a=>a.id===action.id);if(!a||s.editing||!valid(a))return s;
   a.approval={version:a.version,text:a.text};s.notice='Exact displayed answer approved.';
  }
  if(action.type==='approveAll'&&s.finished&&!s.editing&&s.answers.every(valid)){
   s.answers.forEach(a=>a.approval={version:a.version,text:a.text});s.notice='All displayed answers approved. Nothing has been sent.';
  }
  if(action.type==='package'&&ready(s)){
   const v=id=>s.answers.find(a=>a.id===id).approval.text;
   const i=s.identity,at=action.at;
   const rows=i.teams.map(team=>[at,i.name,i.email,i.teams.join('; '),v('personal'),v('professional'),v('rating'),v('reason'),team,v(team+'-component'),v(team+'-example'),v(team+'-avoided'),v(team+'-issue'),v('vision'),v('rock'),v('issues')]);
   s.package={at,identity:structuredClone(i),answers:s.answers.map(a=>({id:a.id,label:a.label,group:a.group,text:a.approval.text})),rows,signature:JSON.stringify(s.answers.map(a=>[a.id,a.version,a.text]))};
  }
  return s;
 }
 const csv=p=>[HEADERS,...p.rows].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
 return {initial,reduce,isApproved,valid,ready,currentPackage,csv};
})();
