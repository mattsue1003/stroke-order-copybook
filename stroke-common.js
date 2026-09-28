/* 筆順圖形共用：數字標籤自動避讓、筆畫分解 */
(function(){
"use strict";
const RED='#D9534A', N=64;
const gridCache={};
function strokeGrids(key,d){
  if(gridCache[key]) return gridCache[key];
  const c=document.createElement('canvas'); c.width=c.height=N; const x=c.getContext('2d');
  const g=d.s.map(p=>{
    x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,N,N);
    x.setTransform(N/1024,0,0,-N/1024,0,900*N/1024); x.fill(new Path2D(p));
    const a=x.getImageData(0,0,N,N).data, m=new Uint8Array(N*N);
    for(let i=0;i<N*N;i++) m[i]=a[i*4+3]>60?1:0;
    return m;
  });
  gridCache[key]=g; return g;
}
function pts(m){ return m.map(([x,y])=>[x,900-y]); }
/* 為每一筆找一個不壓到別的筆畫、也不和其他數字重疊的位置 */
function placeLabels(key,d,R,lo,hi){
  lo=lo==null?0:lo; hi=hi==null?1024:hi;
  const G=strokeGrids(key,d), n=d.s.length, S=1024/N;
  const starts=d.m.map(m=>pts(m)[0]);
  const placed=[];
  for(let i=0;i<n;i++){
    const P=pts(d.m[i]), s=P[0], q=P[Math.min(2,P.length-1)];
    let dx=q[0]-s[0], dy=q[1]-s[1]; const L=Math.hypot(dx,dy)||1; dx/=L; dy/=L;
    let best=null;
    for(const rad of [R+14,R+34,R+58,R+86,R+120,R+160,R+210,R+270]){
      for(let a=0;a<360;a+=15){
        const cx=s[0]+rad*Math.cos(a*Math.PI/180), cy=s[1]+rad*Math.sin(a*Math.PI/180);
        if(cx<lo+R+6||cx>hi-R-6||cy<lo+R+6||cy>hi-R-6) continue;
        let cost=rad*.45;
        // 壓到筆畫：別的筆畫扣很多分，自己的筆畫扣少一點
        const r2=(R+6)*(R+6);
        for(let gy=Math.max(0,Math.floor((cy-R)/S));gy<=Math.min(N-1,Math.floor((cy+R)/S));gy++)
          for(let gx=Math.max(0,Math.floor((cx-R)/S));gx<=Math.min(N-1,Math.floor((cx+R)/S));gx++){
            const px=(gx+.5)*S-cx, py=(gy+.5)*S-cy; if(px*px+py*py>r2) continue;
            for(let j=0;j<n;j++) if(G[j][gy*N+gx]) cost+=(j===i?22:70);
          }
        // 和已放好的數字重疊
        for(const p of placed){ const dd=Math.hypot(p.x-cx,p.y-cy); if(dd<2*R+8) cost+=4000; else if(dd<2*R+30) cost+=150; }
        // 太靠近別筆的起點，容易看錯
        for(let j=0;j<n;j++) if(j!==i){ const dd=Math.hypot(starts[j][0]-cx,starts[j][1]-cy); if(dd<R+30) cost+=260; }
        // 盡量放在筆畫起點的「後方」，不要擋在筆畫要去的方向
        const ux=(cx-s[0])/rad, uy=(cy-s[1])/rad; cost+=(ux*dx+uy*dy)*70;
        if(!best||cost<best.cost) best={x:cx,y:cy,cost,rad};
      }
    }
    if(!best) best={x:Math.min(hi-R-6,Math.max(lo+R+6,s[0])),y:Math.min(hi-R-6,Math.max(lo+R+6,s[1]-R-20)),rad:R+20};
    placed.push({x:best.x,y:best.y,sx:s[0],sy:s[1],rad:best.rad});
  }
  return placed;
}
function arrowHead(p,q,size){
  const dx=q[0]-p[0], dy=q[1]-p[1], L=Math.hypot(dx,dy)||1, ux=dx/L, uy=dy/L;
  const bx=q[0]-ux*size, by=q[1]-uy*size, w=size*.5;
  return q[0].toFixed(0)+','+q[1].toFixed(0)+' '+(bx-uy*w).toFixed(0)+','+(by+ux*w).toFixed(0)+' '+(bx+uy*w).toFixed(0)+','+(by-ux*w).toFixed(0);
}
/* 大字：外框筆畫＋虛線路徑＋方向箭頭＋數字（起點紅點，數字離得遠時拉一條引線） */
function bigSVG(key,d,opt){
  opt=opt||{}; const K=.76, T=(1024-1024*K)/2, R=46/K; // 字縮小置中，四周留給數字
  const paths=d.s.map((p,i)=>'<path d="'+p+'" data-i="'+i+'" fill="'+(opt.fill&&opt.fill[i]||'#fff')+'" stroke="#2b2b2b" stroke-width="14" stroke-linejoin="round"/>').join('');
  let meds='';
  d.m.forEach(m=>{
    const P=pts(m);
    if(P.length>1) meds+='<polyline points="'+P.map(p=>p[0]+','+p[1]).join(' ')+'" fill="none" stroke="#6b7075" stroke-width="9" stroke-dasharray="26 18" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>';
    if(opt.arrow!==false&&P.length>1){ const q=P[P.length-1]; let k=P.length-2; while(k>0&&Math.hypot(q[0]-P[k][0],q[1]-P[k][1])<40) k--; meds+='<polygon points="'+arrowHead(P[k],q,46)+'" fill="#6b7075" pointer-events="none"/>'; }
  });
  let labels='';
  if(opt.numbers!==false){
    const L=placeLabels(key,d,R,-T/K,(1024-T)/K);
    L.forEach((p,i)=>{
      const num=opt.labelText?opt.labelText(i):String(i+1); if(num==='') return;
      const dx=p.x-p.sx, dy=p.y-p.sy, dd=Math.hypot(dx,dy)||1;
      labels+='<circle cx="'+p.sx.toFixed(0)+'" cy="'+p.sy.toFixed(0)+'" r="15" fill="'+RED+'" pointer-events="none"/>';
      if(dd>R+26) labels+='<line x1="'+p.sx.toFixed(0)+'" y1="'+p.sy.toFixed(0)+'" x2="'+(p.x-dx/dd*R).toFixed(0)+'" y2="'+(p.y-dy/dd*R).toFixed(0)+'" stroke="'+RED+'" stroke-width="7" pointer-events="none"/>';
      labels+='<circle cx="'+p.x.toFixed(0)+'" cy="'+p.y.toFixed(0)+'" r="'+R+'" fill="#fff" stroke="'+RED+'" stroke-width="7" pointer-events="none"/><text x="'+p.x.toFixed(0)+'" y="'+(p.y+(num.length>1?24:28)).toFixed(0)+'" text-anchor="middle" font-size="'+(num.length>1?66:78)+'" font-weight="700" font-family="Arial,Helvetica,sans-serif" fill="'+RED+'" pointer-events="none">'+num+'</text>';
    });
  }
  return '<svg class="gl" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g transform="translate('+T+','+T+') scale('+K+')"><g transform="translate(0,900) scale(1,-1)">'+paths+'</g>'+meds+labels+'</g></svg>';
}
function stepSVG(d,k){
  const paths=d.s.map((p,j)=>'<path d="'+p+'" fill="'+(j<k?'#2b2b2b':j===k?RED:'#E6E8EA')+'"/>').join('');
  return '<svg class="gl" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0,900) scale(1,-1)">'+paths+'</g></svg>';
}
/* 依順序重排筆畫資料 */
function reorder(d,order){ return {s:order.map(i=>d.s[i]),m:order.map(i=>d.m[i])}; }
window.StrokeKit={bigSVG,stepSVG,reorder,placeLabels,RED};
})();
