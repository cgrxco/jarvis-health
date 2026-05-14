import { useState, useEffect, useRef } from "react";

const C={bg:"#03060f",card:"#080f1c",border:"#0e1f35",faint:"#0a1525",accent:"#00e5ff",green:"#39ff6e",orange:"#ff6b35",red:"#ff3333",purple:"#b06eff",text:"#c5dff0",muted:"#2a4a65",soft:"#5a7a95",arc:"#4dd0e1"};
const TODAY=new Date().toISOString().split("T")[0];
const DOW=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];

const DEFAULT_PLAN={
  Monday:{name:"Chest & Triceps",muscles:["Chest","Arms"]},
  Tuesday:{name:"Back & Biceps",muscles:["Back","Arms"]},
  Wednesday:{name:"Shoulders & Core",muscles:["Shoulders","Core"]},
  Thursday:{name:"Chest & Biceps",muscles:["Chest","Arms"]},
  Friday:{name:"Back & Triceps",muscles:["Back","Arms"]},
  Saturday:{name:"Core & Cardio",muscles:["Core","Cardio"]},
  Sunday:{name:"Rest Day",muscles:[]}
};

const DEFAULT_GOALS={calories:2200,protein:150,water:4,targetBF:11,targetWeight:76,deadline:"2026-11-11"};
const DEFAULT_SUPPS=[
  {id:"s1",name:"Creatine",dose:"5g",notes:"ON Micronized, breakfast",slot:"Meal 1",color:C.green,active:true},
  {id:"s2",name:"Vitamin C",dose:"500mg",notes:"Limcee, no zinc",slot:"Meal 1",color:C.green,active:true},
  {id:"s3",name:"Vitamin D3",dose:"2000 IU",notes:"Carbamide Forte, NO K2",slot:"Meal 2",color:C.green,active:true},
  {id:"s4",name:"ZMA",dose:"1 serving",notes:"Zn30mg+Mg450mg+B6, empty stomach",slot:"Pre-bed",color:C.purple,active:true},
];

const DEFAULT_FOODS=[
  {id:"f1",name:"Curd + Whey + Eggs",cal:680,pro:52,carb:45,fat:32,cat:"Meal 1",taps:0,notes:"Default breakfast"},
  {id:"f2",name:"Fish Power Dinner",cal:1520,pro:95,carb:185,fat:42,cat:"Meal 2",taps:0,notes:"200g Basa+rice+dal+greens"},
  {id:"f3",name:"Egg & Paneer Dinner",cal:1460,pro:88,carb:180,fat:40,cat:"Meal 2",taps:0,notes:"Non-fish days"},
  {id:"f4",name:"1 Whole Egg",cal:70,pro:6,carb:0,fat:5,cat:"Quick",taps:0},
  {id:"f5",name:"1 Scoop Whey",cal:120,pro:25,carb:3,fat:2,cat:"Quick",taps:0,notes:"The Whole Truth"},
  {id:"f6",name:"100g Paneer",cal:265,pro:18,carb:4,fat:20,cat:"Quick",taps:0},
  {id:"f7",name:"1 Cup Dal",cal:120,pro:9,carb:20,fat:1,cat:"Quick",taps:0},
  {id:"f8",name:"1 Cup Rice",cal:200,pro:4,carb:44,fat:0,cat:"Quick",taps:0},
  {id:"f9",name:"1 Roti",cal:100,pro:3,carb:20,fat:1,cat:"Quick",taps:0},
  {id:"f10",name:"100g Curd",cal:60,pro:3,carb:4,fat:3,cat:"Quick",taps:0},
  {id:"f11",name:"1 Banana",cal:90,pro:1,carb:23,fat:0,cat:"Quick",taps:0},
  {id:"f12",name:"10 Almonds",cal:70,pro:3,carb:2,fat:6,cat:"Quick",taps:0},
];

const DEFAULT_EX=[
  {id:"e1",name:"Chest Press",equip:"Chest Press Machine",notes:"",group:"Chest",type:"weights",dvt:false,history:[]},
  {id:"e2",name:"Incline Press",equip:"Incline Press Machine",notes:"",group:"Chest",type:"weights",dvt:false,history:[]},
  {id:"e3",name:"Pec Deck Fly",equip:"Pec Deck Machine",notes:"",group:"Chest",type:"weights",dvt:false,history:[]},
  {id:"e4",name:"Cable Fly",equip:"Cable Machine",notes:"",group:"Chest",type:"weights",dvt:false,history:[]},
  {id:"e5",name:"Dumbbell Bench",equip:"Flat Bench + Dumbbells",notes:"",group:"Chest",type:"weights",dvt:false,history:[]},
  {id:"e6",name:"Lat Pulldown",equip:"Lat Pulldown Machine",notes:"",group:"Back",type:"weights",dvt:false,history:[]},
  {id:"e7",name:"Seated Row",equip:"Row Machine",notes:"",group:"Back",type:"weights",dvt:false,history:[]},
  {id:"e8",name:"Shoulder Press",equip:"Shoulder Press Machine",notes:"",group:"Shoulders",type:"weights",dvt:false,history:[]},
  {id:"e9",name:"Lateral Raise",equip:"Dumbbells",notes:"",group:"Shoulders",type:"weights",dvt:false,history:[]},
  {id:"e10",name:"Bicep Curl",equip:"Dumbbells",notes:"",group:"Arms",type:"weights",dvt:false,history:[]},
  {id:"e11",name:"Tricep Pushdown",equip:"Cable Machine",notes:"",group:"Arms",type:"weights",dvt:false,history:[]},
  {id:"e12",name:"Overhead Extension",equip:"Cable",notes:"",group:"Arms",type:"weights",dvt:false,history:[]},
  {id:"e13",name:"Plank",equip:"Mat",notes:"",group:"Core",type:"time",dvt:false,history:[]},
  {id:"e14",name:"Cable Crunch",equip:"Cable Machine",notes:"",group:"Core",type:"weights",dvt:false,history:[]},
  {id:"e15",name:"Leg Press",equip:"Leg Press Machine",notes:"DVT Month 1",group:"Legs",type:"weights",dvt:true,history:[]},
  {id:"e16",name:"Leg Extension",equip:"Leg Extension Machine",notes:"DVT Month 1",group:"Legs",type:"weights",dvt:true,history:[]},
  {id:"e17",name:"Treadmill",equip:"Treadmill",notes:"",group:"Cardio",type:"cardio",dvt:false,history:[]},
  {id:"e18",name:"Elliptical",equip:"Elliptical Machine",notes:"",group:"Cardio",type:"cardio",dvt:false,history:[]},
  {id:"e19",name:"Cycling",equip:"Stationary Bike",notes:"",group:"Cardio",type:"cardio",dvt:false,history:[]},
];

const MEDICAL={condition:"Acenocoumarol",restrictions:["Take daily","Avoid Vitamin K","Consistent greens"]};

const load=async(k,d)=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):d;}catch{return d;}};
const save=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v));}catch{}};
const getDaysAgo=(d)=>{const diff=new Date()-new Date(d);return Math.floor(diff/86400000);};

async function resizeImg(file,maxW=800){
  return new Promise(res=>{
    const img=new Image(),url=URL.createObjectURL(file);
    img.onload=()=>{
      const s=Math.min(1,maxW/img.width),c=document.createElement("canvas");
      c.width=img.width*s;c.height=img.height*s;
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b=>{const r=new FileReader();r.onload=()=>res({b64:r.result.split(",")[1],type:"image/jpeg"});r.readAsDataURL(b);},"image/jpeg",0.75);
    };img.src=url;
  });
}

const callJARVIS=async(endpoint,data)=>{
  try{
    const res=await fetch(`/api/${endpoint}`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    
    const result=await res.json();
    
    switch(endpoint){
      case 'daily-brief':
        return result.brief;
      case 'analyze-patterns':
        return JSON.stringify(result.suggestions);
      case 'predict-timeline':
        return JSON.stringify(result.prediction);
      case 'chat':
        return result.answer;
      case 'analyze-food-photo':
        return JSON.stringify(result.analysis);
      default:
        return null;
    }
  }catch(error){
    console.error('JARVIS API error:', error);
    return null;
  }
};

const Btn=({children,onClick,active,color=C.accent,s={}})=>(
  <button onClick={onClick} style={{background:active?`${color}22`:C.card,border:`1.5px solid ${active?color:C.border}`,borderRadius:8,cursor:"pointer",fontFamily:"monospace",color:active?color:C.muted,boxShadow:active?`0 0 14px ${color}35`:"none",transition:"all 0.15s",...s}}>{children}</button>
);
const Toast=({msg})=>msg?<div style={{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",background:C.green,color:"#000",padding:"8px 22px",borderRadius:20,fontSize:10,fontWeight:800,zIndex:999,whiteSpace:"nowrap",boxShadow:`0 4px 20px ${C.green}50`}}>{msg}</div>:null;
const NumStep=({val,onChange,step=2.5,min=0,label,unit=""})=>(
  <div style={{flex:1}}>
    {label&&<div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:5}}>{label}</div>}
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <Btn onClick={()=>onChange(Math.max(min,parseFloat((val-step).toFixed(1))))} s={{flex:1,padding:"10px 0",fontSize:16,fontWeight:700}}>−</Btn>
      <div style={{flex:2,textAlign:"center",fontSize:22,fontWeight:800,color:C.text}}>{val}{unit&&<span style={{fontSize:10,color:C.muted,marginLeft:2}}>{unit}</span>}</div>
      <Btn onClick={()=>onChange(parseFloat((val+step).toFixed(1)))} s={{flex:1,padding:"10px 0",fontSize:16,fontWeight:700}}>+</Btn>
    </div>
  </div>
);
const Modal=({title,onClose,children})=>(
  <div style={{position:"fixed",inset:0,background:"#000d",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"16px 16px 0 0",padding:20,width:"100%",maxWidth:430,maxHeight:"80vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:C.text}}>{title}</div>
        <button onClick={onClose} style={{background:"transparent",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
      </div>
      {children}
    </div>
  </div>
);
const Fld=({label,value,onChange,placeholder,type="text",multiline})=>(
  <div style={{marginBottom:12}}>
    <div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:6}}>{label}</div>
    {multiline?(
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}
        style={{width:"100%",background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:11,outline:"none",boxSizing:"border-box",fontFamily:"monospace",resize:"vertical"}}/>
    ):(
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type}
        style={{width:"100%",background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:11,outline:"none",boxSizing:"border-box"}}/>
    )}
  </div>
);

const LineChart=({data,color,height=100,showDots=true})=>{
  if(!data||data.length===0)return <div style={{color:C.muted,fontSize:9,textAlign:"center",padding:20}}>No data yet</div>;
  const vals=data.map(d=>d.v).filter(v=>v!=null);
  if(vals.length===0)return <div style={{color:C.muted,fontSize:9,textAlign:"center",padding:20}}>No data yet</div>;
  const min=Math.min(...vals)*0.95;
  const max=Math.max(...vals)*1.05;
  const range=max-min||1;
  const w=300;
  const points=data.map((d,i)=>({x:i*(w/(data.length-1||1)),y:d.v!=null?height-((d.v-min)/range*height):null})).filter(p=>p.y!=null);
  const path=points.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  return(
    <svg width={w} height={height} style={{display:"block"}}>
      <path d={path} fill="none" stroke={color} strokeWidth={2}/>
      {showDots&&points.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={3} fill={color}/>)}
    </svg>
  );
};

const BarChart=({data,color,height=100})=>{
  if(!data||data.length===0)return <div style={{color:C.muted,fontSize:9,textAlign:"center",padding:20}}>No data</div>;
  const vals=data.map(d=>d.v).filter(v=>v!=null);
  if(vals.length===0)return <div style={{color:C.muted,fontSize:9,textAlign:"center",padding:20}}>No data</div>;
  const max=Math.max(...vals)*1.1||1;
  const w=300;
  const barW=(w/data.length)-4;
  return(
    <svg width={w} height={height} style={{display:"block"}}>
      {data.map((d,i)=>d.v!=null&&<rect key={i} x={i*(w/data.length)+2} y={height-(d.v/max*height)} width={barW} height={d.v/max*height} fill={color} rx={2}/>)}
    </svg>
  );
};

// Chart component wrappers that fetch data
const WeightChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const points=await Promise.all(
        Array.from({length:30},(_,i)=>{
          const d=new Date();d.setDate(d.getDate()-i);
          const dateStr=d.toISOString().split("T")[0];
          return load(`j:vitals:${dateStr}`,{}).then(v=>({d:dateStr,v:v.weight?parseFloat(v.weight):null}));
        })
      );
      setData(points.reverse());
    })();
  },[]);
  return <LineChart data={data} color={C.accent} height={100}/>;
};

const BodyFatChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const points=await Promise.all(
        Array.from({length:30},(_,i)=>{
          const d=new Date();d.setDate(d.getDate()-i);
          const dateStr=d.toISOString().split("T")[0];
          return load("j:bodycomp",null).then(bc=>bc&&bc.date===dateStr?{d:dateStr,v:bc.body_fat_pct}:{d:dateStr,v:null});
        })
      );
      setData(points.reverse());
    })();
  },[]);
  return <LineChart data={data} color={C.orange} height={100}/>;
};

const ProteinChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const points=await Promise.all(
        Array.from({length:7},(_,i)=>{
          const d=new Date();d.setDate(d.getDate()-i);
          const dateStr=d.toISOString().split("T")[0];
          return load(`j:food:${dateStr}`,[]).then(log=>({d:dateStr,v:log.reduce((a,item)=>a+(item.pro||0),0)}));
        })
      );
      setData(points.reverse());
    })();
  },[]);
  return <BarChart data={data} color={C.green} height={100}/>;
};

const CaloriesChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const points=await Promise.all(
        Array.from({length:7},(_,i)=>{
          const d=new Date();d.setDate(d.getDate()-i);
          const dateStr=d.toISOString().split("T")[0];
          return load(`j:food:${dateStr}`,[]).then(log=>({d:dateStr,v:log.reduce((a,item)=>a+(item.cal||0),0)}));
        })
      );
      setData(points.reverse());
    })();
  },[]);
  return <BarChart data={data} color={C.accent} height={100}/>;
};

const StepsChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const hd=await load("j:healthdata",null);
      const points=Array.from({length:7},(_,i)=>({d:`Day ${7-i}`,v:hd?hd.steps-i*500:0}));
      setData(points);
    })();
  },[]);
  return <BarChart data={data} color={C.purple} height={100}/>;
};

const SleepChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const points=await Promise.all(
        Array.from({length:7},(_,i)=>{
          const d=new Date();d.setDate(d.getDate()-i);
          const dateStr=d.toISOString().split("T")[0];
          return load(`j:vitals:${dateStr}`,{}).then(v=>({d:dateStr,v:v.sleep?parseFloat(v.sleep):null}));
        })
      );
      setData(points.reverse());
    })();
  },[]);
  return <BarChart data={data} color={C.accent} height={100}/>;
};

const HRChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const hd=await load("j:healthdata",null);
      const points=Array.from({length:7},(_,i)=>({d:`Day ${7-i}`,v:hd?hd.heartRate.resting+i:58}));
      setData(points);
    })();
  },[]);
  return <LineChart data={data} color={C.red} height={100} showDots={false}/>;
};

const VolumeChart=()=>{
  const [data,setData]=useState([]);
  useEffect(()=>{
    (async()=>{
      const weeks=await Promise.all(
        Array.from({length:4},(_,weekIdx)=>{
          const startDate=new Date();
          startDate.setDate(startDate.getDate()-(weekIdx*7));
          return Promise.all(
            Array.from({length:7},(_,dayIdx)=>{
              const d=new Date(startDate);
              d.setDate(d.getDate()-dayIdx);
              const dateStr=d.toISOString().split("T")[0];
              return load(`j:sess:${dateStr}`,null).then(sess=>sess?sess.sets.length:0);
            })
          ).then(sets=>sets.reduce((a,b)=>a+b,0));
        })
      );
      setData(weeks.reverse().map((v,i)=>({d:`W${i+1}`,v})));
    })();
  },[]);
  return <BarChart data={data} color={C.green} height={100}/>;
};

const ExerciseProgressCard=({exercise})=>{
  const histData=exercise.history.slice(-8).map((h,i)=>({d:`S${i+1}`,v:h.weight||h.minutes||0}));
  const trend=histData.length>1?(histData[histData.length-1].v>histData[0].v?"↑":histData[histData.length-1].v<histData[0].v?"↓":"→"):"—";
  const trendColor=trend==="↑"?C.green:trend==="↓"?C.orange:C.muted;
  return(
    <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:11,color:C.text,fontWeight:700}}>{exercise.name}</div>
        <div style={{fontSize:14,color:trendColor,fontWeight:900}}>{trend}</div>
      </div>
      <LineChart data={histData} color={C.accent} height={60} showDots={true}/>
      <div style={{fontSize:8,color:C.muted,marginTop:4,textAlign:"center"}}>Last 8 sessions</div>
    </div>
  );
};

const WeekComparison=()=>{
  const [thisWeek,setThisWeek]=useState({});
  const [lastWeek,setLastWeek]=useState({});
  useEffect(()=>{
    (async()=>{
      const getWeekData=async(offset)=>{
        const days=await Promise.all(
          Array.from({length:7},(_,i)=>{
            const d=new Date();
            d.setDate(d.getDate()-(offset*7)-i);
            const dateStr=d.toISOString().split("T")[0];
            return Promise.all([
              load(`j:food:${dateStr}`,[]),
              load(`j:sess:${dateStr}`,null),
              load(`j:vitals:${dateStr}`,{}),
            ]).then(([food,sess,vit])=>({food,sess,vit}));
          })
        );
        const protein=days.reduce((a,d)=>a+d.food.reduce((s,i)=>s+(i.pro||0),0),0)/7;
        const calories=days.reduce((a,d)=>a+d.food.reduce((s,i)=>s+(i.cal||0),0),0)/7;
        const sleep=days.filter(d=>d.vit.sleep).reduce((a,d)=>a+parseFloat(d.vit.sleep),0)/days.filter(d=>d.vit.sleep).length||0;
        const sessions=days.filter(d=>d.sess).length;
        return {protein:Math.round(protein),calories:Math.round(calories),sleep:sleep.toFixed(1),sessions};
      };
      setThisWeek(await getWeekData(0));
      setLastWeek(await getWeekData(1));
    })();
  },[]);
  
  const metrics=[
    {label:"Protein avg",thisV:thisWeek.protein,lastV:lastWeek.protein,unit:"g",good:"up"},
    {label:"Calories avg",thisV:thisWeek.calories,lastV:lastWeek.calories,unit:"",good:"neutral"},
    {label:"Sleep avg",thisV:thisWeek.sleep,lastV:lastWeek.sleep,unit:"hrs",good:"up"},
    {label:"Gym sessions",thisV:thisWeek.sessions,lastV:lastWeek.sessions,unit:"",good:"up"},
  ];
  
  return(
    <div style={{background:`${C.accent}08`,border:`1px solid ${C.accent}30`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
      <div style={{fontSize:7,color:C.accent,letterSpacing:2,marginBottom:10}}>THIS WEEK vs LAST WEEK</div>
      {metrics.map(m=>{
        const diff=m.thisV-m.lastV;
        const pct=m.lastV?((diff/m.lastV)*100).toFixed(0):0;
        const arrow=diff>0?"↑":diff<0?"↓":"→";
        const color=m.good==="up"?(diff>0?C.green:diff<0?C.orange:C.muted):m.good==="down"?(diff<0?C.green:diff>0?C.orange:C.muted):C.muted;
        return(
          <div key={m.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:10,color:C.text}}>{m.label}</div>
            <div style={{fontSize:11,fontWeight:700,color}}>
              {m.thisV}{m.unit} {arrow} {diff!==0&&`(${diff>0?"+":""}${diff}${m.unit})`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function JARVIS(){
  const [ready,setReady]=useState(false);
  const [tab,setTab]=useState(0);
  const [toast,setToast]=useState("");
  const showToast=m=>{setToast(m);setTimeout(()=>setToast(""),2200);};

  const [supps,setSupps]=useState(DEFAULT_SUPPS);
  const [suppTaken,setSuppTaken]=useState({});
  const [foods,setFoods]=useState(DEFAULT_FOODS);
  const [foodLog,setFoodLog]=useState([]);
  const [exercises,setExercises]=useState(DEFAULT_EX);
  const [session,setSession]=useState(null);
  const [expandedEx,setExpandedEx]=useState(null);
  const [setW,setSetW]=useState(10);
  const [setR,setSetR]=useState(10);
  const [setMin,setSetMin]=useState(15);
  const [vitals,setVitals]=useState({weight:"",sleep:"",water:0,notes:""});
  const [bodyComp,setBodyComp]=useState(null);
  const [weeklyPlan,setWeeklyPlan]=useState(DEFAULT_PLAN);
  const [externalTraining,setExternalTraining]=useState([]);
  const [healthData,setHealthData]=useState(null);
  const [syncStatus,setSyncStatus]=useState("idle");
  const [goals,setGoals]=useState(DEFAULT_GOALS);
  
  const [zeppBusy,setZeppBusy]=useState(false);
  const [dr360Busy,setDr360Busy]=useState(false);
  const zeppRef=useRef();
  const dr360Ref=useRef();
  const foodPhotoRef=useRef();

  const [dailyBrief,setDailyBrief]=useState(null);
  const [suggestions,setSuggestions]=useState([]);
  const [predictions,setPredictions]=useState(null);
  const [jarvisChat,setJarvisChat]=useState(false);
  const [chatInput,setChatInput]=useState("");
  const [chatHistory,setChatHistory]=useState([]);
  const [analyzing,setAnalyzing]=useState(false);
  const foodDebounceTimer=useRef(null);
  const syncInterval=useRef(null);

  const [showDashboard,setShowDashboard]=useState(false);
  const [showGoalsModal,setShowGoalsModal]=useState(false);
  const [addFoodModal,setAddFoodModal]=useState(false);
  const [addExModal,setAddExModal]=useState(false);
  const [addSuppModal,setAddSuppModal]=useState(false);
  const [newFood,setNewFood]=useState({name:"",cal:"",pro:"",carb:"",fat:"",cat:"Quick",notes:""});
  const [newEx,setNewEx]=useState({name:"",equip:"",notes:"",group:"Chest",type:"weights"});
  const [newSupp,setNewSupp]=useState({name:"",dose:"",notes:"",slot:"Meal 1"});

  useEffect(()=>{
    (async()=>{
      const [s,st,f,fl,ex,sess,v,bc,plan,ext,brief,sugg,pred,hd,g]=await Promise.all([
        load("j:supps",DEFAULT_SUPPS),
        load(`j:supp:${TODAY}`,{}),
        load("j:foods",DEFAULT_FOODS),
        load(`j:food:${TODAY}`,[]),
        load("j:ex",DEFAULT_EX),
        load(`j:sess:${TODAY}`,null),
        load(`j:vitals:${TODAY}`,{weight:"",sleep:"",water:0,notes:""}),
        load("j:bodycomp",null),
        load("j:plan",DEFAULT_PLAN),
        load("j:external",[]),
        load(`j:brief:${TODAY}`,null),
        load(`j:sugg:${TODAY}`,[]),
        load("j:predictions",null),
        load("j:healthdata",null),
        load("j:goals",DEFAULT_GOALS),
      ]);
      setSupps(s);setSuppTaken(st);setFoods(f);setFoodLog(fl);
      setExercises(ex);setSession(sess);setVitals(v);setBodyComp(bc);
      setWeeklyPlan(plan);setExternalTraining(ext);
      setDailyBrief(brief);setSuggestions(sugg);setPredictions(pred);
      setHealthData(hd);setGoals(g);
      setReady(true);
      
      await syncHealthConnect();
      syncInterval.current=setInterval(()=>syncHealthConnect(),3600000);
      
      if(!brief)await generateDailyBrief(fl,st,sess,v,bc,hd,ext);
      if(!sugg||sugg.length===0)await analyzePatterns();
    })();
    
    return()=>{if(syncInterval.current)clearInterval(syncInterval.current);};
  },[]);

  const totalCal=foodLog.reduce((a,i)=>a+(i.cal||0),0);
  const totalPro=foodLog.reduce((a,i)=>a+(i.pro||0),0);
  const suppDone=supps.filter(s=>s.active&&suppTaken[s.id]).length;
  const suppTotal=supps.filter(s=>s.active).length;
  const todayPlan=weeklyPlan[DOW]||{name:"Rest Day",muscles:[]};

  const syncHealthConnect=async()=>{
    setSyncStatus("syncing");
    try{
      const mockData={
        lastSync:new Date().toISOString(),
        sleep:{hours:7.2,quality:0.82,deep:1.8,rem:1.5},
        steps:8450,
        heartRate:{resting:58,avg:75,max:165},
        calories:2450,
        workouts:[{type:"calisthenics",start:"2026-05-13T10:00:00",duration:45,avgHR:155}],
        weight:85.2,
      };
      setHealthData(mockData);
      await save("j:healthdata",mockData);
      if(mockData.sleep)await saveVitals({sleep:mockData.sleep.hours});
      if(mockData.weight)await saveVitals({weight:mockData.weight});
      setSyncStatus("synced");
      setTimeout(()=>setSyncStatus("idle"),3000);
    }catch(err){
      console.error("Sync failed:",err);
      setSyncStatus("error");
      setTimeout(()=>setSyncStatus("idle"),5000);
    }
  };

  const generateDailyBrief=async(foodL,suppT,sess,vit,bc,hd,ext)=>{
    try{
      const context={
        user:{age:24,weight:vit.weight||86,height:174,goals,medical:MEDICAL,bodyComp:bc},
        yesterday:{calories:foodL.reduce((a,i)=>a+i.cal,0),protein:foodL.reduce((a,i)=>a+i.pro,0),suppsTaken:Object.keys(suppT).length,suppsDue:supps.filter(s=>s.active).length,gymSession:sess?true:false,water:vit.water||0,sleep:vit.sleep||0},
        today:{plan:todayPlan.name,external:ext.filter(e=>e.day===DOW)},
        healthData:hd,
      };
      
      const prompt=`JARVIS brief for CGR. SHORT ICON FORMAT.\n\nContext: ${JSON.stringify(context)}\n\nFormat:\n[icon] [metric] ([change])\n\nTODAY:\n• [action]\n\nIcons: 😴=sleep, ❤️=HR, 🔥=cals, 💪=workout, 🚶=steps, ⚠️=warning\nMax 6 lines. ONLY the formatted brief.`;
      
      const brief=await callJARVIS("daily-brief",{prompt})||"😴 Data loading\n\nTODAY:\n• Execute plan";
      setDailyBrief(brief);
      await save(`j:brief:${TODAY}`,brief);
    }catch{setDailyBrief("😴 Systems online\n\nTODAY:\n• Execute plan");}
  };

  const analyzePatterns=async()=>{
    try{
      const weekData=await Promise.all(
        Array.from({length:7},(_,i)=>{
          const d=new Date();d.setDate(d.getDate()-i);
          const dateStr=d.toISOString().split("T")[0];
          return Promise.all([
            load(`j:food:${dateStr}`,[]),
            load(`j:sess:${dateStr}`,null),
            load(`j:vitals:${dateStr}`,{}),
            load(`j:supp:${dateStr}`,{}),
          ]).then(([food,sess,vit,supp])=>({date:dateStr,food,sess,vit,supp}));
        })
      );

      const context={
        user:{age:24,weight:vitals.weight||86,height:174,bodyFat:bodyComp?.body_fat_pct||22.2,goals,medical:MEDICAL},
        weekData,
        exercises:exercises.map(e=>({id:e.id,name:e.name,group:e.group,history:e.history,dvt:e.dvt})),
        supplements:supps.map(s=>({id:s.id,name:s.name,active:s.active})),
        weeklyPlan,externalTraining,healthData,
      };

      const prompt=`JARVIS pattern analysis. Generate 2-5 suggestions.\n\nContext: ${JSON.stringify(context)}\n\nFocus: stalls, gaps, overlaps, recovery, volume, trends\n\nJSON:\n[{"type":"exercise|supplement|food|test|warning|plan","action":"add|remove|modify|request|alert","title":"[emoji] SHORT","message":"[emoji] line\\n• line\\n• line","priority":"high|medium|low","data":{}}]\n\nONLY JSON.`;

      const text=await callJARVIS("analyze-patterns",{prompt});
      if(!text)return;
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      const newSugg=parsed.map((s,i)=>({id:Date.now()+i,...s}));
      setSuggestions(newSugg);
      await save(`j:sugg:${TODAY}`,newSugg);
    }catch(err){console.error("Analysis failed:",err);}
  };

  const predictTimeline=async()=>{
    try{
      const weekData=await Promise.all(
        Array.from({length:14},(_,i)=>{
          const d=new Date();d.setDate(d.getDate()-i);
          const dateStr=d.toISOString().split("T")[0];
          return load(`j:vitals:${dateStr}`,{}).then(vit=>({date:dateStr,weight:vit.weight||86}));
        })
      );

      const context={
        start:{date:"2026-05-11",weight:86,bodyFat:22.2},
        current:{date:TODAY,weight:vitals.weight||86,bodyFat:bodyComp?.body_fat_pct||22.2},
        target:{bodyFat:goals.targetBF,weight:goals.targetWeight,deadline:goals.deadline},
        recentWeights:weekData.filter(d=>d.weight).slice(0,7),
      };

      const prompt=`Timeline prediction.\n\nData: ${JSON.stringify(context)}\n\nJSON: {"monthsToGoal":number,"onTrack":boolean,"weeklyBFLoss":number,"weeklyWeightLoss":number,"message":"1 sentence"}`;

      const text=await callJARVIS("predict-timeline",{prompt});
      if(!text)return;
      const pred=JSON.parse(text.replace(/```json|```/g,"").trim());
      setPredictions(pred);
      await save("j:predictions",pred);
    }catch{}
  };

  const analyzeFoodPhoto=async file=>{
    try{
      const img=await resizeImg(file);
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:500,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:img.type,data:img.b64}},
            {type:"text",text:`Analyze food. JSON:\n{"items":[{"name":"Food","quantity":"2 eggs","calories":140,"protein":12,"carbs":2,"fat":10}],"totalCalories":number,"totalProtein":number}`}
          ]}]
        })
      });
      const j=await res.json();
      const analysis=JSON.parse(j.content?.[0]?.text?.replace(/```json|```/g,"").trim()||"{}");
      if(analysis.items?.length>0){
        const foodName=analysis.items.map(i=>`${i.quantity||""} ${i.name}`.trim()).join(" + ");
        const entry={id:Date.now(),name:foodName,cal:analysis.totalCalories||0,pro:analysis.totalProtein||0,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),source:"photo"};
        const nextLog=[...foodLog,entry];
        setFoodLog(nextLog);await save(`j:food:${TODAY}`,nextLog);
        showToast(`✓ ${entry.cal} kcal, ${entry.pro}g protein`);
        triggerFoodAnalysis(nextLog);
      }
    }catch{showToast("Photo failed");}
  };

  const askJARVIS=async question=>{
    if(!question.trim())return;
    setChatHistory(h=>[...h,{role:"user",text:question}]);
    setChatInput("");setAnalyzing(true);
    try{
      const context={
        user:{age:24,weight:vitals.weight||86,height:174,bodyFat:bodyComp?.body_fat_pct||22.2,goals,medical:MEDICAL},
        today:{date:TODAY,calories:totalCal,protein:totalPro,water:vitals.water,suppsTaken:`${suppDone}/${suppTotal}`,session:session?session.name:"No session",plan:todayPlan.name},
        weeklyPlan,externalTraining,
        exercises:exercises.map(e=>({name:e.name,group:e.group,history:e.history.slice(-3)})),
      };

      const answerPrompt=`JARVIS answering CGR. 2-4 sentences, direct.\n\nContext: ${JSON.stringify(context)}\n\nQuestion: ${question}\n\nAnswer:`;
      const answer=await callJARVIS("chat",{prompt:answerPrompt})||"Error. Try again.";
      setChatHistory(h=>[...h,{role:"jarvis",text:answer}]);
      
      const actionPrompt=`Action detection.\n\nQ: "${question}"\nA: "${answer}"\nContext: ${JSON.stringify(context)}\n\nNeeds suggestion? Check: requests, recommendations, plan changes.\n\nIf YES:\n{"createSuggestion":true,"type":"...","action":"...","title":"[emoji] SHORT","message":"...","priority":"...","data":{}}\n\nIf NO:\n{"createSuggestion":false}\n\nONLY JSON.`;

      const actionText=await callJARVIS("detect-action",{prompt:actionPrompt});
      if(!actionText)return;
      const actionCheck=JSON.parse(actionText.replace(/```json|```/g,"").trim());
      if(actionCheck.createSuggestion){
        const newSugg={id:Date.now(),...actionCheck};
        delete newSugg.createSuggestion;
        setSuggestions(s=>[...s,newSugg]);
        await save(`j:sugg:${TODAY}`,[...suggestions,newSugg]);
        showToast("✓ Suggestion added");
      }
    }catch{setChatHistory(h=>[...h,{role:"jarvis",text:"Error."}]);}
    setAnalyzing(false);
  };

  const explainSuggestion=async(sugg)=>{setChatHistory([{role:"jarvis",text:`${sugg.message}\n\nMore details?`}]);setJarvisChat(true);};

  const approveSuggestion=async(sugg)=>{
    try{
      switch(sugg.type){
        case "supplement":
          if(sugg.action==="remove"){
            const next=supps.map(s=>s.id===sugg.data.suppId?{...s,active:false}:s);
            setSupps(next);await save("j:supps",next);showToast(`✓ ${sugg.data.suppName} off`);
          }else if(sugg.action==="add"){
            const newSupp={id:"s"+Date.now(),name:sugg.data.name,dose:sugg.data.dose,notes:sugg.data.notes||"",slot:sugg.data.slot,color:C.green,active:true};
            const next=[...supps,newSupp];setSupps(next);await save("j:supps",next);showToast(`✓ ${sugg.data.name} added`);
          }
          break;
        case "food":
          if(sugg.action==="add"){
            const newFood={id:"f"+Date.now(),name:sugg.data.name,cal:sugg.data.cal,pro:sugg.data.pro,carb:sugg.data.carb||0,fat:sugg.data.fat||0,cat:sugg.data.cat||"Quick",taps:0,notes:sugg.data.notes||""};
            const next=[...foods,newFood];setFoods(next);await save("j:foods",next);showToast(`✓ ${sugg.data.name} added`);
          }
          break;
        case "exercise":
          if(sugg.action==="add"){
            const newEx={id:"e"+Date.now(),name:sugg.data.name,equip:sugg.data.equip,notes:sugg.data.notes||"",group:sugg.data.group,type:sugg.data.type||"weights",dvt:false,history:[]};
            const next=[...exercises,newEx];setExercises(next);await save("j:ex",next);showToast(`✓ ${sugg.data.name} added`);
          }else if(sugg.action==="modify"){
            const next=exercises.map(e=>e.group==="Legs"?{...e,dvt:false}:e);
            setExercises(next);await save("j:ex",next);showToast("✓ Legs enabled");
          }
          break;
        case "plan":
          if(sugg.action==="modify"&&sugg.data.newPlan){
            setWeeklyPlan(sugg.data.newPlan);await save("j:plan",sugg.data.newPlan);showToast("✓ Plan updated");
          }
          if(sugg.action==="add"&&sugg.data.external){
            const next=[...externalTraining,sugg.data.external];
            setExternalTraining(next);await save("j:external",next);showToast("✓ Training added");
          }
          break;
        case "test":showToast(`✓ ${sugg.data.testName} reminder`);break;
      }
      const next=suggestions.filter(s=>s.id!==sugg.id);
      setSuggestions(next);await save(`j:sugg:${TODAY}`,next);
    }catch{showToast("Action failed");}
  };

  const declineSuggestion=async(sugg)=>{
    const next=suggestions.filter(s=>s.id!==sugg.id);
    setSuggestions(next);await save(`j:sugg:${TODAY}`,next);showToast("Dismissed");
  };

  const triggerFoodAnalysis=(foodL)=>{
    if(foodDebounceTimer.current)clearTimeout(foodDebounceTimer.current);
    foodDebounceTimer.current=setTimeout(async()=>{
      const totalC=foodL.reduce((a,i)=>a+i.cal,0);
      const totalP=foodL.reduce((a,i)=>a+i.pro,0);
      if(totalC>goals.calories){
        const newSugg={id:Date.now(),type:"warning",action:"alert",title:"⚠️ CALORIE LIMIT",message:"🔥 Over target\n\n• Stop eating",priority:"high",data:{}};
        setSuggestions(s=>[...s,newSugg]);await save(`j:sugg:${TODAY}`,[...suggestions,newSugg]);
      }
      if(totalP<100&&new Date().getHours()>=20){
        const newSugg={id:Date.now(),type:"food",action:"add",title:"💪 LOW PROTEIN",message:`📊 ${totalP}g/${goals.protein}g\n\nFix:\n• 2 eggs\n• 1 whey`,priority:"high",data:{}};
        setSuggestions(s=>[...s,newSugg]);await save(`j:sugg:${TODAY}`,[...suggestions,newSugg]);
      }
    },180000);
  };

  const checkGymStall=(ex,weight,reps)=>{
    const lastEntry=ex.history[ex.history.length-1];
    if(!lastEntry)return;
    if(lastEntry.weight===weight&&lastEntry.reps===reps){
      const newSugg={id:Date.now(),type:"exercise",action:"add",title:`💪 ${ex.name.toUpperCase()} STALL`,message:`⚠️ Same ${weight}kg×${reps}\n\nFix:\n• Deload ${weight-5}kg\n• OR add variation`,priority:"medium",data:{exerciseId:ex.id,currentWeight:weight,suggestedDeload:weight-5}};
      setSuggestions(s=>[...s,newSugg]);save(`j:sugg:${TODAY}`,[...suggestions,newSugg]);
    }
  };

  const toggleSupp=async id=>{const next={...suppTaken,[id]:!suppTaken[id]};setSuppTaken(next);await save(`j:supp:${TODAY}`,next);if(!suppTaken[id])showToast("✓ Taken");};
  const tapFood=async f=>{
    const entry={id:Date.now(),name:f.name,cal:f.cal,pro:f.pro,time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})};
    const nextLog=[...foodLog,entry];setFoodLog(nextLog);await save(`j:food:${TODAY}`,nextLog);
    const nextFoods=foods.map(x=>x.id===f.id?{...x,taps:(x.taps||0)+1}:x);
    setFoods(nextFoods);await save("j:foods",nextFoods);
    showToast(`+${f.cal} kcal +${f.pro}g P`);
    triggerFoodAnalysis(nextLog);
  };
  const rmFoodLog=async i=>{const next=foodLog.filter((_,j)=>j!==i);setFoodLog(next);await save(`j:food:${TODAY}`,next);triggerFoodAnalysis(next);};
  const startSession=async()=>{const s={started:new Date().toISOString(),name:`${DOW} — ${todayPlan.name}`,sets:[]};setSession(s);await save(`j:sess:${TODAY}`,s);showToast("Started!");};
  const tapEx=ex=>{if(ex.dvt)return;if(expandedEx===ex.id){setExpandedEx(null);return;}setExpandedEx(ex.id);const lastEntry=ex.history[ex.history.length-1];setSetW(lastEntry?.weight||10);setSetR(lastEntry?.reps||10);setSetMin(15);};
  const logSet=async ex=>{
    if(!session)return;
    const prev=session.sets.filter(s=>s.exId===ex.id).length;
    const entry={exId:ex.id,exName:ex.name,setN:prev+1,weight:ex.type!=="time"&&ex.type!=="cardio"?setW:null,reps:ex.type!=="time"&&ex.type!=="cardio"?setR:null,minutes:ex.type==="time"||ex.type==="cardio"?setMin:null};
    const nextSets=[...session.sets,entry];
    const next={...session,sets:nextSets};setSession(next);await save(`j:sess:${TODAY}`,next);
    const histEntry={date:TODAY,weight:setW,reps:setR,minutes:setMin};
    const nextEx=exercises.map(e=>e.id===ex.id?{...e,history:[...e.history,histEntry].slice(-20)}:e);
    setExercises(nextEx);await save("j:ex",nextEx);
    showToast(`Set ${prev+1} ✓`);
    checkGymStall(ex,setW,setR);
  };
  const saveVitals=async upd=>{const next={...vitals,...upd};setVitals(next);await save(`j:vitals:${TODAY}`,next);};
  const addWater=async amt=>{const next={...vitals,water:parseFloat(((parseFloat(vitals.water)||0)+amt).toFixed(2))};setVitals(next);await save(`j:vitals:${TODAY}`,next);showToast(`+${amt}L`);};

  const parseZepp=async file=>{
    setZeppBusy(true);
    try{
      const img=await resizeImg(file);
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,
          messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:img.type,data:img.b64}},{type:"text",text:`Zepp JSON:\n{"sleepHours":null,"heartRateAvg":null,"steps":null}`}]}]})});
      const j=await res.json();
      const parsed=JSON.parse(j.content?.[0]?.text?.replace(/```json|```/g,"").trim()||"{}");
      const upd={};if(parsed.sleepHours)upd.sleep=parsed.sleepHours;
      const next={...vitals,...upd};setVitals(next);await save(`j:vitals:${TODAY}`,next);
      showToast("Zepp ✓");
    }catch{showToast("Zepp failed");}
    setZeppBusy(false);
  };

  const parseDr360=async file=>{
    setDr360Busy(true);
    try{
      const img=await resizeImg(file);
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,
          messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:img.type,data:img.b64}},{type:"text",text:`Dr360 JSON:\n{"weight_kg":null,"body_fat_pct":null,"muscle_mass_kg":null,"visceral_fat_pct":null,"bmr_kcal":null}`}]}]})});
      const j=await res.json();
      const parsed=JSON.parse(j.content?.[0]?.text?.replace(/```json|```/g,"").trim()||"{}");
      const bc={date:TODAY,...parsed};setBodyComp(bc);await save("j:bodycomp",bc);
      if(parsed.weight_kg)await saveVitals({weight:parsed.weight_kg});
      showToast("Dr360 ✓");predictTimeline();
    }catch{showToast("Dr360 failed");}
    setDr360Busy(false);
  };

  const addFood=async()=>{
    if(!newFood.name||!newFood.cal||!newFood.pro){showToast("Name, cal, protein required");return;}
    const f={id:"f"+Date.now(),name:newFood.name,cal:parseInt(newFood.cal),pro:parseInt(newFood.pro),carb:parseInt(newFood.carb||0),fat:parseInt(newFood.fat||0),cat:newFood.cat,taps:0,notes:newFood.notes||""};
    const next=[...foods,f];setFoods(next);await save("j:foods",next);
    setAddFoodModal(false);setNewFood({name:"",cal:"",pro:"",carb:"",fat:"",cat:"Quick",notes:""});showToast("✓ Added");
  };
  const rmFood=async id=>{const next=foods.filter(f=>f.id!==id);setFoods(next);await save("j:foods",next);showToast("Removed");};
  const addEx=async()=>{
    if(!newEx.name||!newEx.equip){showToast("Name, equipment required");return;}
    const ex={id:"e"+Date.now(),name:newEx.name,equip:newEx.equip,notes:newEx.notes||"",group:newEx.group,type:newEx.type,dvt:false,history:[]};
    const next=[...exercises,ex];setExercises(next);await save("j:ex",next);
    setAddExModal(false);setNewEx({name:"",equip:"",notes:"",group:"Chest",type:"weights"});showToast("✓ Added");
  };
  const rmEx=async id=>{const next=exercises.filter(e=>e.id!==id);setExercises(next);await save("j:ex",next);showToast("Removed");};
  const addSupp=async()=>{
    if(!newSupp.name||!newSupp.dose){showToast("Name, dose required");return;}
    const s={id:"s"+Date.now(),name:newSupp.name,dose:newSupp.dose,notes:newSupp.notes||"",slot:newSupp.slot,color:C.green,active:true};
    const next=[...supps,s];setSupps(next);await save("j:supps",next);
    setAddSuppModal(false);setNewSupp({name:"",dose:"",notes:"",slot:"Meal 1"});showToast("✓ Added");
  };
  const rmSupp=async id=>{const next=supps.filter(s=>s.id!==id);setSupps(next);await save("j:supps",next);showToast("Removed");};
  const toggleSuppActive=async id=>{const next=supps.map(s=>s.id===id?{...s,active:!s.active}:s);setSupps(next);await save("j:supps",next);};

  const saveGoals=async()=>{await save("j:goals",goals);showToast("Goals saved");setShowGoalsModal(false);};

  const exportData=async()=>{
    const data={
      exported:new Date().toISOString(),
      goals,supps,foods,exercises,weeklyPlan,externalTraining,
      vitals:await Promise.all(Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return load(`j:vitals:${d.toISOString().split("T")[0]}`,null);})),
      foodLogs:await Promise.all(Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return load(`j:food:${d.toISOString().split("T")[0]}`,null);})),
      sessions:await Promise.all(Array.from({length:30},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return load(`j:sess:${d.toISOString().split("T")[0]}`,null);})),
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`jarvis-backup-${TODAY}.json`;a.click();
    URL.revokeObjectURL(url);showToast("✓ Exported");
  };

  const todayExercises=exercises.filter(ex=>!ex.dvt&&(todayPlan.muscles.includes(ex.group)||ex.group==="Cardio"));
  const grouped=todayExercises.reduce((a,e)=>({...a,[e.group]:[...(a[e.group]||[]),e]}),{});
  const sortedFoods=[...foods].sort((a,b)=>(b.taps||0)-(a.taps||0));
  const frequent=sortedFoods.filter(f=>f.taps>0).slice(0,6);
  const meals=sortedFoods.filter(f=>f.cat==="Meal 1"||f.cat==="Meal 2");
  const quick=sortedFoods.filter(f=>f.cat==="Quick");
  const TABS=[{i:"◉",l:"HOME"},{i:"📊",l:"DATA"},{i:"🍽",l:"EAT"},{i:"💪",l:"GYM"},{i:"📋",l:"LOG"},{i:"⚙",l:"SET"}];

  if(!ready)return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <div style={{fontSize:7,color:C.accent,letterSpacing:4,marginBottom:16}}>JARVIS INITIALIZING</div>
      <div style={{width:32,height:32,border:`2px solid ${C.border}`,borderTop:`2px solid ${C.accent}`,borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return(
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"monospace",color:C.text,paddingBottom:72}}>
      <Toast msg={toast}/>
      <input ref={zeppRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])parseZepp(e.target.files[0]);e.target.value="";}}/>
      <input ref={dr360Ref} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])parseDr360(e.target.files[0]);e.target.value="";}}/>
      <input ref={foodPhotoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])analyzeFoodPhoto(e.target.files[0]);e.target.value="";}}/>

      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:50,background:`${C.bg}f2`,backdropFilter:"blur(14px)",borderBottom:`1px solid ${C.border}`,padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:18,fontWeight:900,color:"#fff"}}>JARVIS</div>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            {syncStatus==="syncing"&&<span style={{fontSize:7,color:C.accent}}>⟳</span>}
            {syncStatus==="synced"&&<span style={{fontSize:7,color:C.green}}>✓</span>}
            {suggestions.length>0&&<span onClick={()=>setTab(0)} style={{fontSize:7,background:`${C.orange}18`,color:C.orange,border:`1px solid ${C.orange}40`,padding:"2px 8px",borderRadius:20,cursor:"pointer"}}>{suggestions.length}</span>}
            <span style={{fontSize:7,background:suppDone===suppTotal?`${C.green}18`:`${C.orange}18`,color:suppDone===suppTotal?C.green:C.orange,border:`1px solid ${suppDone===suppTotal?C.green:C.orange}40`,padding:"2px 8px",borderRadius:20}}>{suppDone}/{suppTotal}</span>
            <span style={{fontSize:7,background:`${C.orange}15`,color:C.orange,border:`1px solid ${C.orange}35`,padding:"2px 8px",borderRadius:20}}>⚠</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{l:"CALORIES",v:totalCal,t:goals.calories,c:totalCal>goals.calories?C.orange:C.accent},{l:"PROTEIN",v:`${totalPro}g`,t:goals.protein,vn:totalPro,c:totalPro>=goals.protein?C.green:C.text}].map(({l,v,t,vn,c})=>(
            <div key={l} style={{flex:1,background:C.faint,borderRadius:8,padding:"7px 10px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:7,color:C.muted,marginBottom:2}}>{l}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontSize:17,fontWeight:800,color:c}}>{v}</span>
                <span style={{fontSize:8,color:C.muted}}>/{t}{l==="PROTEIN"?"g":""}</span>
              </div>
              <div style={{height:2,background:C.border,borderRadius:1,marginTop:4}}>
                <div style={{width:`${Math.min((vn||totalCal)/t*100,100)}%`,height:2,background:c,borderRadius:1,transition:"width 0.4s"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"12px 14px 0"}}>

        {/* HOME TAB - continues with brief, suggestions, supplements, water, food log */}
        {tab===0&&(
          <>
            {dailyBrief&&(
              <div style={{background:`${C.accent}0c`,border:`1px solid ${C.accent}30`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:7,color:C.accent,letterSpacing:2}}>JARVIS BRIEF</div>
                  <button onClick={()=>generateDailyBrief(foodLog,suppTaken,session,vitals,bodyComp,healthData,externalTraining)} style={{background:"transparent",border:"none",color:C.accent,fontSize:10,cursor:"pointer"}}>↻</button>
                </div>
                <pre style={{fontSize:10,color:C.text,lineHeight:1.8,fontFamily:"monospace",margin:0,whiteSpace:"pre-wrap"}}>{dailyBrief}</pre>
              </div>
            )}

            {predictions&&(
              <div style={{background:predictions.onTrack?`${C.green}08`:`${C.orange}08`,border:`1px solid ${predictions.onTrack?C.green:C.orange}30`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
                <div style={{fontSize:7,color:predictions.onTrack?C.green:C.orange,letterSpacing:2,marginBottom:6}}>GOAL TIMELINE</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:20,fontWeight:800,color:C.text}}>{predictions.monthsToGoal} months</div>
                    <div style={{fontSize:9,color:C.muted}}>to 6-pack at current pace</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:700,color:predictions.onTrack?C.green:C.orange}}>{predictions.onTrack?"On Track":"Behind"}</div>
                    <div style={{fontSize:8,color:C.muted}}>{predictions.weeklyBFLoss}%/wk</div>
                  </div>
                </div>
              </div>
            )}

            {vitals.notes&&(
              <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginBottom:18}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:2,marginBottom:6}}>TODAY'S NOTE</div>
                <div style={{fontSize:10,color:C.text}}>{vitals.notes}</div>
              </div>
            )}

            {suggestions.length>0&&(
              <div style={{marginBottom:18}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>JARVIS SUGGESTIONS ({suggestions.length})</div>
                {suggestions.map(sugg=>(
                  <div key={sugg.id} style={{background:sugg.priority==="high"?`${C.orange}0a`:`${C.accent}08`,border:`1px solid ${sugg.priority==="high"?C.orange:C.accent}30`,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                    <div style={{fontSize:10,fontWeight:700,color:sugg.priority==="high"?C.orange:C.accent,marginBottom:6}}>{sugg.title}</div>
                    <pre style={{fontSize:9,color:C.text,lineHeight:1.6,marginBottom:8,fontFamily:"monospace",margin:"0 0 8px 0",whiteSpace:"pre-wrap"}}>{sugg.message}</pre>
                    <div style={{display:"flex",gap:6}}>
                      <Btn onClick={()=>approveSuggestion(sugg)} active color={C.green} s={{flex:1,padding:"6px 0",fontSize:8,fontWeight:700}}>APPROVE</Btn>
                      <Btn onClick={()=>explainSuggestion(sugg)} color={C.accent} s={{flex:1,padding:"6px 0",fontSize:8,fontWeight:700}}>WHY?</Btn>
                      <Btn onClick={()=>declineSuggestion(sugg)} color={C.muted} s={{flex:1,padding:"6px 0",fontSize:8,fontWeight:700}}>DECLINE</Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>SUPPLEMENTS — TAP CONFIRM</div>
              {["Meal 1","Meal 2","Pre-bed"].map(slot=>{
                const sl=supps.filter(s=>s.active&&s.slot===slot);
                if(!sl.length)return null;
                return(
                  <div key={slot} style={{marginBottom:10}}>
                    <div style={{fontSize:7,color:C.muted,letterSpacing:2,marginBottom:6}}>{slot.toUpperCase()}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {sl.map(s=>(
                        <Btn key={s.id} onClick={()=>toggleSupp(s.id)} active={suppTaken[s.id]} color={s.color}
                          s={{padding:"9px 13px",fontSize:10,lineHeight:1.5,textAlign:"left"}}>
                          {suppTaken[s.id]?"✓ ":""}{s.name}<br/>
                          <span style={{fontSize:8,opacity:0.6}}>{s.dose}</span>
                        </Btn>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>WATER — {vitals.water||0}L / {goals.water}L</div>
              <div style={{display:"flex",gap:6,marginBottom:6}}>
                {[0.25,0.5,1,1.5,2].map(amt=>(
                  <Btn key={amt} onClick={()=>addWater(amt)} color={C.accent} s={{flex:1,padding:"10px 0",fontSize:10,fontWeight:700}}>+{amt}</Btn>
                ))}
              </div>
              <div style={{height:4,background:C.border,borderRadius:2}}>
                <div style={{width:`${Math.min((parseFloat(vitals.water)||0)/goals.water*100,100)}%`,height:4,background:C.accent,borderRadius:2,transition:"width 0.4s",boxShadow:`0 0 8px ${C.accent}60`}}/>
              </div>
            </div>

            {foodLog.length>0&&(
              <div style={{marginBottom:18}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>TODAY'S FOOD · {totalCal} KCAL</div>
                {foodLog.map((item,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.faint,borderRadius:8,padding:"8px 12px",marginBottom:5}}>
                    <div>
                      <div style={{fontSize:11,color:C.text}}>{item.name}{item.source==="photo"&&<span style={{fontSize:8,color:C.accent,marginLeft:6}}>📷</span>}</div>
                      <div style={{fontSize:8,color:C.muted}}>{item.time} · {item.cal} kcal · {item.pro}g P</div>
                    </div>
                    <button onClick={()=>rmFoodLog(i)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:19,padding:"0 4px"}}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{background:`${C.orange}0c`,border:`1px solid ${C.orange}22`,borderRadius:8,padding:12}}>
              <div style={{fontSize:7,color:C.orange,letterSpacing:2,marginBottom:8}}>MEDICAL</div>
              {MEDICAL.restrictions.map((f,i)=>(
                <div key={i} style={{fontSize:10,color:"#cc7755",paddingLeft:12,position:"relative",marginBottom:5,lineHeight:1.6}}>
                  <span style={{position:"absolute",left:0,color:C.orange}}>›</span>{f}
                </div>
              ))}
            </div>
          </>
        )}

        {/* DATA TAB - Comprehensive Dashboard */}
        {tab===1&&(
          <>
            {/* Week-over-week comparison */}
            <WeekComparison />

            {/* Weight & Body Fat Trends */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>WEIGHT & BODY FAT (30 DAYS)</div>
              <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
                <div style={{fontSize:9,color:C.text,marginBottom:8}}>Weight (kg)</div>
                <WeightChart />
                {bodyComp&&(
                  <>
                    <div style={{fontSize:9,color:C.text,marginTop:16,marginBottom:8}}>Body Fat %</div>
                    <BodyFatChart />
                  </>
                )}
              </div>
            </div>

            {/* Nutrition Trends */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>NUTRITION (7 DAYS)</div>
              <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
                <div style={{fontSize:9,color:C.text,marginBottom:8}}>Protein (g)</div>
                <ProteinChart />
                <div style={{fontSize:9,color:C.text,marginTop:16,marginBottom:8}}>Calories</div>
                <CaloriesChart />
              </div>
            </div>

            {/* Activity & Recovery */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>ACTIVITY & RECOVERY (7 DAYS)</div>
              <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
                <div style={{fontSize:9,color:C.text,marginBottom:8}}>Steps</div>
                <StepsChart />
                <div style={{fontSize:9,color:C.text,marginTop:16,marginBottom:8}}>Sleep (hours)</div>
                <SleepChart />
                {healthData&&(
                  <>
                    <div style={{fontSize:9,color:C.text,marginTop:16,marginBottom:8}}>Resting HR (bpm)</div>
                    <HRChart />
                  </>
                )}
              </div>
            </div>

            {/* Weekly Volume */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>TRAINING VOLUME (4 WEEKS)</div>
              <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
                <div style={{fontSize:9,color:C.text,marginBottom:8}}>Total Sets Per Week</div>
                <VolumeChart />
              </div>
            </div>

            {/* Exercise Progression */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>EXERCISE PROGRESSION</div>
              {exercises.filter(ex=>ex.history.length>0&&!ex.dvt).slice(0,8).map(ex=>(
                <ExerciseProgressCard key={ex.id} exercise={ex} />
              ))}
              {exercises.filter(ex=>ex.history.length>0&&!ex.dvt).length===0&&(
                <div style={{color:C.muted,fontSize:9,textAlign:"center",padding:20}}>Start logging workouts to see progression</div>
              )}
            </div>
          </>
        )}

        {/* EAT TAB - continues from HOME with photo logging, frequent, meals, quick */}
        {tab===2&&(
          <>
            <div style={{marginBottom:18}}>
              <button onClick={()=>foodPhotoRef.current.click()} style={{width:"100%",padding:14,background:`${C.accent}0a`,border:`2px dashed ${C.accent}`,borderRadius:10,color:C.accent,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span style={{fontSize:20}}>📷</span><span>PHOTO FOOD LOGGER</span>
              </button>
            </div>

            {frequent.length>0&&(
              <div style={{marginBottom:18}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>FREQUENT</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {frequent.map(f=>(
                    <Btn key={f.id} onClick={()=>tapFood(f)} color={C.green} s={{padding:"11px 12px",textAlign:"left",display:"block"}}>
                      <div style={{fontSize:11,fontWeight:700,marginBottom:3,color:C.green}}>{f.name}</div>
                      <div style={{fontSize:8,color:C.muted}}>{f.cal} kcal · {f.pro}g P</div>
                    </Btn>
                  ))}
                </div>
              </div>
            )}

            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3}}>MEALS</div>
                <button onClick={()=>setAddFoodModal(true)} style={{background:C.green,border:"none",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:"#000",cursor:"pointer"}}>+ ADD</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {meals.map(f=>(
                  <Btn key={f.id} onClick={()=>tapFood(f)} color={C.accent} s={{padding:"13px 14px",textAlign:"left",display:"block"}}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:5,color:C.text}}>{f.name}</div>
                    <div style={{display:"flex",gap:12,fontSize:9}}>
                      <span style={{color:C.accent,fontWeight:700}}>{f.cal} kcal</span>
                      <span style={{color:C.muted}}>{f.pro}g P · {f.carb}g C · {f.fat}g F</span>
                    </div>
                  </Btn>
                ))}
              </div>
            </div>

            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>QUICK ADD</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {quick.map(f=>(
                  <Btn key={f.id} onClick={()=>tapFood(f)} color={C.accent} s={{padding:"10px 12px",textAlign:"left",display:"block"}}>
                    <div style={{fontSize:11,fontWeight:700,marginBottom:3,color:C.text}}>{f.name}</div>
                    <div style={{fontSize:8,color:C.muted}}>{f.cal} kcal · {f.pro}g P</div>
                  </Btn>
                ))}
              </div>
            </div>
          </>
        )}

        {/* GYM TAB - Smart filtered with last used info */}
        {tab===3&&(
          <>
            {!session?(
              <div style={{textAlign:"center",paddingTop:48}}>
                <div style={{fontSize:8,color:C.muted,letterSpacing:3,marginBottom:8}}>{DOW.toUpperCase()}</div>
                <div style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:6}}>{todayPlan.name}</div>
                {externalTraining.filter(e=>e.day===DOW).map(ext=>(
                  <div key={ext.type} style={{fontSize:10,color:C.orange,marginBottom:12}}>⚠️ {ext.type} scheduled</div>
                ))}
                <div style={{fontSize:10,color:C.muted,marginBottom:32}}>Month 1 · Upper Focus</div>
                <Btn onClick={startSession} active color={C.green} s={{padding:"14px 40px",fontSize:11,fontWeight:700,letterSpacing:2}}>
                  {DOW==="Sunday"?"LOG ANYWAY":"START"}
                </Btn>
              </div>
            ):(
              <>
                <div style={{background:`${C.green}0e`,border:`1px solid ${C.green}30`,borderRadius:8,padding:"10px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:7,color:C.green,letterSpacing:2,marginBottom:2}}>ACTIVE</div>
                    <div style={{fontSize:12,color:C.text}}>{session.name}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:800,color:C.green}}>{session.sets.length}</div>
                    <div style={{fontSize:7,color:C.muted}}>sets</div>
                  </div>
                </div>

                {Object.keys(grouped).length===0&&(
                  <div style={{textAlign:"center",padding:"40px 20px",color:C.muted}}>
                    <div style={{fontSize:14,marginBottom:8}}>⚠️</div>
                    <div style={{fontSize:11}}>No exercises for today</div>
                    <div style={{fontSize:9,marginTop:6}}>Filtered by {todayPlan.name}</div>
                  </div>
                )}

                {Object.entries(grouped).map(([group,exs])=>(
                  <div key={group} style={{marginBottom:18}}>
                    <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>{group.toUpperCase()}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {exs.map(ex=>{
                        const done=session.sets.filter(s=>s.exId===ex.id).length;
                        const isOpen=expandedEx===ex.id;
                        const lastEntry=ex.history[ex.history.length-1];
                        return(
                          <div key={ex.id} style={{borderRadius:10,overflow:"hidden",border:`1px solid ${isOpen?C.accent+"50":done>0?C.green+"30":C.border}`,transition:"border-color 0.2s"}}>
                            <button onClick={()=>tapEx(ex)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:isOpen?`${C.accent}0a`:C.faint,border:"none",padding:"11px 14px",cursor:"pointer",textAlign:"left"}}>
                              <div>
                                <div style={{fontSize:12,color:isOpen?C.accent:C.text,fontWeight:isOpen?700:400}}>{ex.name}</div>
                                <div style={{fontSize:8,color:C.muted,marginTop:2}}>{ex.equip}</div>
                                {lastEntry&&!isOpen&&(
                                  <div style={{fontSize:8,color:C.muted,marginTop:2}}>
                                    Last: {ex.type==="weights"?`${lastEntry.weight}kg × ${lastEntry.reps}`:ex.type==="time"?`${lastEntry.minutes}min`:`${lastEntry.minutes}min`}
                                    {lastEntry.date&&` · ${getDaysAgo(lastEntry.date)}d ago`}
                                  </div>
                                )}
                              </div>
                              <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                                {done>0&&<span style={{fontSize:8,background:`${C.green}18`,color:C.green,border:`1px solid ${C.green}40`,padding:"2px 7px",borderRadius:10}}>{done} ✓</span>}
                                <span style={{color:isOpen?C.accent:C.muted,fontSize:14,transition:"transform 0.2s",display:"inline-block",transform:isOpen?"rotate(90deg)":"rotate(0deg)"}}>›</span>
                              </div>
                            </button>

                            {isOpen&&(
                              <div style={{background:C.card,padding:"12px 14px",borderTop:`1px solid ${C.border}`}}>
                                {lastEntry&&(
                                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,padding:"6px 10px",background:C.faint,borderRadius:6}}>
                                    <span style={{fontSize:8,color:C.muted}}>LAST</span>
                                    <span style={{fontSize:12,fontWeight:700,color:C.text}}>
                                      {ex.type==="weights"?`${lastEntry.weight}kg × ${lastEntry.reps}`:ex.type==="time"?`${lastEntry.minutes}min`:`${lastEntry.minutes}min`}
                                    </span>
                                  </div>
                                )}

                                {done>0&&(
                                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                                    {session.sets.filter(s=>s.exId===ex.id).map((s,i)=>(
                                      <div key={i} style={{background:`${C.green}12`,border:`1px solid ${C.green}35`,borderRadius:6,padding:"3px 9px",fontSize:9,color:C.green}}>
                                        {s.weight?`${s.weight}kg`:""}{s.reps?` ×${s.reps}`:""}{s.minutes?` ${s.minutes}min`:""}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div style={{marginBottom:10}}>
                                  <div style={{fontSize:7,color:C.muted,letterSpacing:2,marginBottom:8}}>SET {done+1}</div>

                                  {ex.type==="weights"&&(
                                    <>
                                      <div style={{display:"flex",gap:12,marginBottom:10}}>
                                        <NumStep val={setW} onChange={setSetW} step={2.5} min={0} label="WEIGHT" unit="kg"/>
                                        <NumStep val={setR} onChange={setSetR} step={1} min={1} label="REPS"/>
                                      </div>
                                      <div style={{marginBottom:10}}>
                                        <div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:5}}>QUICK REPS</div>
                                        <div style={{display:"flex",gap:4}}>
                                          {[6,8,10,12,15,20].map(r=>(
                                            <Btn key={r} onClick={()=>setSetR(r)} active={setR===r} s={{flex:1,padding:"7px 0",fontSize:10,fontWeight:700}}>{r}</Btn>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  {(ex.type==="time"||ex.type==="cardio")&&(
                                    <>
                                      <NumStep val={setMin} onChange={setSetMin} step={1} min={1} label="DURATION" unit="min"/>
                                      <div style={{display:"flex",gap:5,marginTop:10,marginBottom:5}}>
                                        <div style={{fontSize:7,color:C.muted,letterSpacing:1,width:"100%"}}>QUICK ADD</div>
                                      </div>
                                      <div style={{display:"flex",gap:5}}>
                                        {[5,10,15,20,30,45].map(m=>(
                                          <Btn key={m} onClick={()=>setSetMin(prev=>prev+m)} color={C.accent} s={{flex:1,padding:"7px 0",fontSize:9,fontWeight:700}}>+{m}</Btn>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>

                                <Btn onClick={()=>logSet(ex)} active color={C.green} s={{width:"100%",padding:"12px 0",fontSize:10,fontWeight:800,letterSpacing:2}}>
                                  LOG SET {done+1}
                                </Btn>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {/* LOG TAB - continues with sleep, weight, health connect, Dr360 */}
        {tab===4&&(
          <>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>SLEEP & WEIGHT</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[{l:"Sleep (hrs)",k:"sleep",p:"7.0"},{l:"Weight (kg)",k:"weight",p:"86.0"}].map(({l,k,p})=>(
                  <div key={k} style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
                    <div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:6}}>{l}</div>
                    <input value={vitals[k]||""} onChange={e=>saveVitals({[k]:e.target.value})} placeholder={p} type="number" inputMode="decimal"
                      style={{width:"100%",background:"transparent",border:"none",color:C.text,fontSize:20,fontWeight:700,outline:"none",boxSizing:"border-box"}}/>
                  </div>
                ))}
              </div>
            </div>

            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>DAILY NOTE</div>
              <textarea value={vitals.notes||""} onChange={e=>saveVitals({notes:e.target.value})} placeholder="How I felt today..." rows={3}
                style={{width:"100%",background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:11,outline:"none",boxSizing:"border-box",fontFamily:"monospace",resize:"vertical"}}/>
            </div>

            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3}}>HEALTH CONNECT</div>
                <button onClick={syncHealthConnect} style={{background:"transparent",border:`1px solid ${C.accent}`,borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:C.accent,cursor:"pointer"}}>
                  {syncStatus==="syncing"?"SYNCING":"SYNC"}
                </button>
              </div>
              {healthData&&(
                <div style={{background:C.faint,borderRadius:8,padding:12}}>
                  <div style={{fontSize:9,color:C.text,marginBottom:6}}>Last: {new Date(healthData.lastSync).toLocaleTimeString()}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:9}}>
                    <div>😴 {healthData.sleep?.hours||0}hrs</div>
                    <div>❤️ {healthData.heartRate?.resting||0}bpm</div>
                    <div>🚶 {healthData.steps||0}</div>
                    <div>🔥 {healthData.calories||0} kcal</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>ZEPP (BACKUP)</div>
              <button onClick={()=>zeppRef.current.click()} style={{width:"100%",padding:14,background:zeppBusy?`${C.accent}0a`:C.faint,border:`1px dashed ${zeppBusy?C.accent:C.border}`,borderRadius:8,color:zeppBusy?C.accent:C.muted,fontSize:11,cursor:"pointer"}}>
                {zeppBusy?"📊 Reading...":"📊 Zepp Screenshot"}
              </button>
            </div>

            <div style={{marginBottom:18}}>
              <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>DR. 360</div>
              <button onClick={()=>dr360Ref.current.click()} style={{width:"100%",padding:14,background:dr360Busy?`${C.purple}0a`:C.faint,border:`1px dashed ${dr360Busy?C.purple:C.border}`,borderRadius:8,color:dr360Busy?C.purple:C.muted,fontSize:11,cursor:"pointer"}}>
                {dr360Busy?"📷 Reading...":"📷 Dr360 → Auto-updates"}
              </button>
            </div>

            {bodyComp&&(
              <div style={{marginBottom:18}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3,marginBottom:8}}>BODY COMP · {bodyComp.date}</div>
                <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[
                      {l:"Body Fat",v:bodyComp.body_fat_pct,u:"%",c:bodyComp.body_fat_pct>20?C.orange:C.green,note:"→ "+goals.targetBF+"%"},
                      {l:"Muscle",v:bodyComp.muscle_mass_kg,u:"kg",c:C.accent},
                      {l:"Visceral",v:bodyComp.visceral_fat_pct,u:"%",c:bodyComp.visceral_fat_pct>10?C.orange:C.green,note:"→ <10%"},
                      {l:"BMR",v:bodyComp.bmr_kcal,u:"kcal",c:C.text},
                    ].filter(x=>x.v).map(({l,v,u,c,note})=>(
                      <div key={l} style={{background:C.card,borderRadius:8,padding:"9px 10px"}}>
                        <div style={{fontSize:8,color:C.muted,marginBottom:3}}>{l}</div>
                        <div style={{fontSize:18,fontWeight:800,color:c}}>{v}<span style={{fontSize:9,color:C.muted,marginLeft:1}}>{u}</span>}</div>
                        {note&&<div style={{fontSize:7,color:C.muted,marginTop:3}}>{note}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* SETTINGS TAB - continues from MANAGE with goals editor, export */}
        {tab===5&&(
          <>
            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3}}>GOALS</div>
                <button onClick={()=>setShowGoalsModal(true)} style={{background:C.accent,border:"none",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:"#000",cursor:"pointer"}}>EDIT</button>
              </div>
              <div style={{background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:12}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:10}}>
                  <div>Calories: {goals.calories}</div>
                  <div>Protein: {goals.protein}g</div>
                  <div>Water: {goals.water}L</div>
                  <div>Target BF: {goals.targetBF}%</div>
                  <div style={{gridColumn:"1/-1"}}>Deadline: {goals.deadline}</div>
                </div>
              </div>
            </div>

            <div style={{marginBottom:18}}>
              <button onClick={exportData} style={{width:"100%",padding:14,background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                💾 EXPORT ALL DATA
              </button>
            </div>

            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3}}>SUPPLEMENTS</div>
                <button onClick={()=>setAddSuppModal(true)} style={{background:C.green,border:"none",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:"#000",cursor:"pointer"}}>+ ADD</button>
              </div>
              {["Meal 1","Meal 2","Pre-bed"].map(slot=>{
                const sl=supps.filter(s=>s.slot===slot);
                if(!sl.length)return null;
                return(
                  <div key={slot} style={{marginBottom:10}}>
                    <div style={{fontSize:7,color:C.muted,letterSpacing:2,marginBottom:5}}>{slot.toUpperCase()}</div>
                    {sl.map(s=>(
                      <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.faint,borderRadius:8,padding:"9px 12px",marginBottom:4}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:11,color:C.text}}>{s.name} · {s.dose}</div>
                          {s.notes&&<div style={{fontSize:8,color:C.muted,marginTop:2}}>{s.notes}</div>}
                        </div>
                        <button onClick={()=>toggleSuppActive(s.id)} style={{background:"transparent",border:`1px solid ${s.active?C.green:C.muted}`,borderRadius:4,padding:"2px 8px",fontSize:8,color:s.active?C.green:C.muted,cursor:"pointer",marginRight:8}}>
                          {s.active?"On":"Off"}
                        </button>
                        <button onClick={()=>rmSupp(s.id)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3}}>EXERCISES</div>
                <button onClick={()=>setAddExModal(true)} style={{background:C.green,border:"none",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:"#000",cursor:"pointer"}}>+ ADD</button>
              </div>
              {Object.entries(exercises.reduce((a,e)=>({...a,[e.group]:[...(a[e.group]||[]),e]}),{})).map(([group,exs])=>(
                <div key={group} style={{marginBottom:10}}>
                  <div style={{fontSize:7,color:C.muted,letterSpacing:2,marginBottom:5}}>{group.toUpperCase()}</div>
                  {exs.map(ex=>(
                    <div key={ex.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.faint,borderRadius:8,padding:"9px 12px",marginBottom:4}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,color:ex.dvt?C.orange:C.text}}>{ex.name}</div>
                        <div style={{fontSize:8,color:C.muted}}>{ex.equip}{ex.notes&&` · ${ex.notes}`}</div>
                      </div>
                      {ex.dvt&&<span style={{fontSize:8,color:C.orange,marginRight:8}}>DVT</span>}
                      <button onClick={()=>rmEx(ex.id)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:7,color:C.muted,letterSpacing:3}}>FOODS</div>
                <button onClick={()=>setAddFoodModal(true)} style={{background:C.green,border:"none",borderRadius:6,padding:"4px 10px",fontSize:9,fontWeight:700,color:"#000",cursor:"pointer"}}>+ ADD</button>
              </div>
              {["Meal 1","Meal 2","Quick"].map(cat=>{
                const fl=foods.filter(f=>f.cat===cat);
                if(!fl.length)return null;
                return(
                  <div key={cat} style={{marginBottom:10}}>
                    <div style={{fontSize:7,color:C.muted,letterSpacing:2,marginBottom:5}}>{cat.toUpperCase()}</div>
                    {fl.map(f=>(
                      <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.faint,borderRadius:8,padding:"9px 12px",marginBottom:4}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:11,color:C.text}}>{f.name}</div>
                          <div style={{fontSize:8,color:C.muted}}>{f.cal} kcal · {f.pro}g P{f.notes&&` · ${f.notes}`}</div>
                        </div>
                        <button onClick={()=>rmFood(f.id)} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* MODALS */}
      {addFoodModal&&<Modal title="Add Food" onClose={()=>setAddFoodModal(false)}>
        <Fld label="NAME" value={newFood.name} onChange={v=>setNewFood(p=>({...p,name:v}))} placeholder="2 Rotis + Dal"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Fld label="CALORIES" value={newFood.cal} onChange={v=>setNewFood(p=>({...p,cal:v}))} placeholder="500" type="number"/>
          <Fld label="PROTEIN (g)" value={newFood.pro} onChange={v=>setNewFood(p=>({...p,pro:v}))} placeholder="30" type="number"/>
          <Fld label="CARBS (g)" value={newFood.carb} onChange={v=>setNewFood(p=>({...p,carb:v}))} placeholder="60" type="number"/>
          <Fld label="FAT (g)" value={newFood.fat} onChange={v=>setNewFood(p=>({...p,fat:v}))} placeholder="10" type="number"/>
        </div>
        <Fld label="NOTES" value={newFood.notes} onChange={v=>setNewFood(p=>({...p,notes:v}))} placeholder="From Licious" multiline/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:6}}>CATEGORY</div>
          <div style={{display:"flex",gap:6}}>
            {["Meal 1","Meal 2","Quick"].map(cat=>(
              <Btn key={cat} onClick={()=>setNewFood(p=>({...p,cat}))} active={newFood.cat===cat} s={{flex:1,padding:"8px 0",fontSize:9}}>{cat}</Btn>
            ))}
          </div>
        </div>
        <Btn onClick={addFood} active color={C.green} s={{width:"100%",padding:"12px 0",fontSize:10,fontWeight:700}}>ADD</Btn>
      </Modal>}

      {addExModal&&<Modal title="Add Exercise" onClose={()=>setAddExModal(false)}>
        <Fld label="NAME" value={newEx.name} onChange={v=>setNewEx(p=>({...p,name:v}))} placeholder="Incline Cable Fly"/>
        <Fld label="EQUIPMENT" value={newEx.equip} onChange={v=>setNewEx(p=>({...p,equip:v}))} placeholder="Cable Machine"/>
        <Fld label="NOTES" value={newEx.notes} onChange={v=>setNewEx(p=>({...p,notes:v}))} placeholder="45° angle" multiline/>
        <div style={{marginBottom:11}}>
          <div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:6}}>GROUP</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {["Chest","Back","Shoulders","Arms","Core","Legs","Cardio"].map(g=>(
              <Btn key={g} onClick={()=>setNewEx(p=>({...p,group:g}))} active={newEx.group===g} s={{padding:"6px 10px",fontSize:9}}>{g}</Btn>
            ))}
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:6}}>TYPE</div>
          <div style={{display:"flex",gap:6}}>
            {["weights","time","cardio"].map(t=>(
              <Btn key={t} onClick={()=>setNewEx(p=>({...p,type:t}))} active={newEx.type===t} s={{flex:1,padding:"8px 0",fontSize:9}}>{t}</Btn>
            ))}
          </div>
        </div>
        <Btn onClick={addEx} active color={C.green} s={{width:"100%",padding:"12px 0",fontSize:10,fontWeight:700}}>ADD</Btn>
      </Modal>}

      {addSuppModal&&<Modal title="Add Supplement" onClose={()=>setAddSuppModal(false)}>
        <Fld label="NAME" value={newSupp.name} onChange={v=>setNewSupp(p=>({...p,name:v}))} placeholder="Creatine"/>
        <Fld label="DOSE" value={newSupp.dose} onChange={v=>setNewSupp(p=>({...p,dose:v}))} placeholder="5g"/>
        <Fld label="NOTES" value={newSupp.notes} onChange={v=>setNewSupp(p=>({...p,notes:v}))} placeholder="ON, breakfast" multiline/>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:7,color:C.muted,letterSpacing:1,marginBottom:6}}>TIMING</div>
          <div style={{display:"flex",gap:5}}>
            {["Meal 1","Meal 2","Pre-bed"].map(s=>(
              <Btn key={s} onClick={()=>setNewSupp(p=>({...p,slot:s}))} active={newSupp.slot===s} s={{flex:1,padding:"8px 0",fontSize:9}}>{s}</Btn>
            ))}
          </div>
        </div>
        <Btn onClick={addSupp} active color={C.green} s={{width:"100%",padding:"12px 0",fontSize:10,fontWeight:700}}>ADD</Btn>
      </Modal>}

      {showGoalsModal&&<Modal title="Edit Goals" onClose={()=>setShowGoalsModal(false)}>
        <Fld label="DAILY CALORIES" value={goals.calories} onChange={v=>setGoals(p=>({...p,calories:parseInt(v)||2200}))} type="number"/>
        <Fld label="DAILY PROTEIN (g)" value={goals.protein} onChange={v=>setGoals(p=>({...p,protein:parseInt(v)||150}))} type="number"/>
        <Fld label="DAILY WATER (L)" value={goals.water} onChange={v=>setGoals(p=>({...p,water:parseFloat(v)||4}))} type="number"/>
        <Fld label="TARGET BODY FAT (%)" value={goals.targetBF} onChange={v=>setGoals(p=>({...p,targetBF:parseFloat(v)||11}))} type="number"/>
        <Fld label="TARGET WEIGHT (kg)" value={goals.targetWeight} onChange={v=>setGoals(p=>({...p,targetWeight:parseFloat(v)||76}))} type="number"/>
        <Fld label="DEADLINE" value={goals.deadline} onChange={v=>setGoals(p=>({...p,deadline:v}))} type="date"/>
        <Btn onClick={saveGoals} active color={C.green} s={{width:"100%",padding:"12px 0",fontSize:10,fontWeight:700}}>SAVE</Btn>
      </Modal>}

      {jarvisChat&&<Modal title="Ask JARVIS" onClose={()=>setJarvisChat(false)}>
        <div style={{maxHeight:300,overflowY:"auto",marginBottom:12}}>
          {chatHistory.map((msg,i)=>(
            <div key={i} style={{marginBottom:10,textAlign:msg.role==="user"?"right":"left"}}>
              <div style={{display:"inline-block",background:msg.role==="user"?C.accent:C.card,border:`1px solid ${msg.role==="user"?C.accent:C.border}`,borderRadius:10,padding:"8px 12px",maxWidth:"85%",textAlign:"left"}}>
                <div style={{fontSize:7,color:C.muted,marginBottom:3}}>{msg.role==="user"?"YOU":"JARVIS"}</div>
                <div style={{fontSize:10,color:C.text,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{msg.text}</div>
              </div>
            </div>
          ))}
          {analyzing&&<div style={{fontSize:9,color:C.muted,fontStyle:"italic"}}>Thinking...</div>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyPress={e=>e.key==="Enter"&&askJARVIS(chatInput)} placeholder="Ask anything..." 
            style={{flex:1,background:C.faint,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:11,outline:"none"}}/>
          <Btn onClick={()=>askJARVIS(chatInput)} active color={C.accent} s={{padding:"10px 16px",fontSize:11,fontWeight:700}}>ASK</Btn>
        </div>
      </Modal>}

      {/* ARC REACTOR BUTTON */}
      <button onClick={()=>setJarvisChat(true)} style={{position:"fixed",bottom:88,right:20,width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg, ${C.arc} 0%, ${C.accent} 100%)`,border:"none",color:"#000",fontSize:20,fontWeight:900,cursor:"pointer",boxShadow:`0 0 20px ${C.arc}80, 0 0 40px ${C.arc}40`,zIndex:60,display:"flex",alignItems:"center",justifyContent:"center",animation:"pulse 2s ease-in-out infinite"}}>
        <div style={{width:36,height:36,borderRadius:"50%",border:`3px solid ${C.arc}`,animation:"rotate 4s linear infinite"}}/>
        <div style={{position:"absolute",fontSize:16,fontWeight:900,color:"#fff",textShadow:`0 0 10px ${C.arc}`}}>J</div>
      </button>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:`${C.bg}f5`,backdropFilter:"blur(14px)",borderTop:`1px solid ${C.border}`,display:"flex",padding:"8px 0 14px",zIndex:50}}>
        {TABS.map((t,i)=>(
          <button key={t.l} onClick={()=>setTab(i)} style={{flex:1,background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:tab===i?C.accent:C.muted,transition:"color 0.15s"}}>
            <span style={{fontSize:16,filter:tab===i?`drop-shadow(0 0 8px ${C.accent})`:"none"}}>{t.i}</span>
            <span style={{fontSize:7,letterSpacing:1,fontWeight:700}}>{t.l}</span>
          </button>
        ))}
      </div>

      <style>{`
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:${C.muted};border-radius:2px}
        input,textarea{outline:none;font-family:monospace}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 20px ${C.arc}80, 0 0 40px ${C.arc}40}50%{box-shadow:0 0 30px ${C.arc}cc, 0 0 60px ${C.arc}80}}
        @keyframes rotate{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
