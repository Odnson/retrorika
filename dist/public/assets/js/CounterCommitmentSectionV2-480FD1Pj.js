import{a as n,b as C,u as v,j as e,m}from"./vendor-motion-_Lo63EAC.js";import{S as A,O as U,W as V,P as H,a as O,V as Y,b as D,M as q}from"./vendor-three-Dd_K5e79.js";import{W as f}from"./index-B5gubxkY.js";import"./vendor-react-BY-wMBDI.js";import"./vendor-lenis-BgUGcyJW.js";import"./vendor-gsap-Bc0iluX2.js";function $(o,p,h){const[t,s]=n.useState(0),x=n.useRef(0);return n.useEffect(()=>{if(cancelAnimationFrame(x.current),!h){s(0);return}let g=null;const b=i=>{g||(g=i);const P=i-g,w=Math.min(P/(p*1e3),1),j=1-Math.pow(1-w,3);s(Math.floor(j*o)),w<1&&(x.current=requestAnimationFrame(b))};return x.current=requestAnimationFrame(b),()=>cancelAnimationFrame(x.current)},[h,o,p]),t}function G(o){return o.toLocaleString("id-ID")}function ee(){const o=n.useRef(null),p=n.useRef(null),h=n.useRef(null),t=n.useRef(null),{scrollYProgress:s}=C({target:o,offset:["start start","end end"]}),x=C({target:p,offset:["start center","end center"]}),[g,b]=n.useState(!1),[i,P]=n.useState(!1);n.useEffect(()=>{const r=()=>{P(window.innerWidth<768)};return r(),window.addEventListener("resize",r,{passive:!0}),()=>window.removeEventListener("resize",r)},[]),n.useEffect(()=>x.scrollYProgress.on("change",l=>{b(l>.1)}),[x.scrollYProgress]);const w=$(1456498,1.5,g),j=v(s,[.18,.26],[1,0]),T=v(s,[.18,.26],[1,.8]),S=v(s,[.24,.36],[0,1]),W=v(s,[.24,.5],[1.2,1]),L=v(s,[.5,1],["0%","-15%"]),F=S,I=v(s,r=>{const l=i?"20%":"15%",c=i?20:15;if(r<.24)return l;if(r<.42){const a=(r-.24)/.18;return`${c-a*c}%`}return r<.5?"0%":r<.7?`${-((r-.5)/.19999999999999996)*15}%`:`${-15-(r-.7)/(1-.7)*185}%`}),E=v(s,[.48,.6],[0,1]);n.useEffect(()=>{if(!h.current)return;const r=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,l=`
      uniform float uProgress;
      uniform vec2 uResolution;
      uniform vec3 uColor;
      uniform float uSpread;
      varying vec2 vUv;

      float Hash(vec2 p) {
        vec3 p2 = vec3(p.xy, 1.0);
        return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
      }

      float noise(in vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f *= f * (3.0 - 2.0 * f);
        return mix(
          mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
          mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        v += noise(p * 1.0) * 0.5;
        v += noise(p * 2.0) * 0.25;
        v += noise(p * 4.0) * 0.125;
        return v;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
        
        // Dissolve from bottom to top, covering entire screen
        float dissolveEdge = uv.y - uProgress * 1.8; // Increased to 1.8 for full top coverage
        float noiseValue = fbm(centeredUv * 15.0);
        float d = dissolveEdge + noiseValue * uSpread;
        
        // Sharp edge without blur using step function
        float alpha = step(0.0, d);
        alpha = 1.0 - alpha;
        
        // Use beige/cream color for dissolve to match LogoRetorikaSectionV2
        vec3 dissolveColor = vec3(0.976, 0.969, 0.957); // #f9f7f4
        gl_FragColor = vec4(dissolveColor, alpha);
      }
    `;t.current&&(cancelAnimationFrame(t.current.animationId),t.current.renderer.dispose(),t.current.material.dispose(),t.current=null);const c=new A,d=new U(-1,1,1,-1,0,1);let a;try{a=new V({canvas:h.current,alpha:!0,antialias:!1,powerPreference:"low-power",precision:"lowp",stencil:!1,depth:!1})}catch{return}const k=new H(2,2),u=new O({vertexShader:r,fragmentShader:l,uniforms:{uProgress:{value:0},uResolution:{value:new D(window.innerWidth,window.innerHeight)},uColor:{value:new Y(.976,.969,.957)},uSpread:{value:.3}},transparent:!0}),N=()=>{if(!o.current)return;const R=window.innerWidth,z=window.innerHeight;a.setSize(R,z),a.setPixelRatio(Math.min(window.devicePixelRatio,2)),u.uniforms.uResolution.value.set(R,z)},Z=new q(k,u);return c.add(Z),N(),window.addEventListener("resize",N,{passive:!0}),t.current={scene:c,camera:d,renderer:a,material:u,animationId:0},a.render(c,d),()=>{window.removeEventListener("resize",N),a.dispose(),u.dispose(),k.dispose(),t.current=null}},[]);const y=n.useRef(!1),M=n.useRef(0);return n.useEffect(()=>{const r=()=>{if(!t.current||y.current)return;y.current=!0;const d=()=>{t.current&&y.current&&(t.current.renderer.render(t.current.scene,t.current.camera),M.current=requestAnimationFrame(d))};d()},l=()=>{y.current=!1,cancelAnimationFrame(M.current),t.current&&t.current.renderer.render(t.current.scene,t.current.camera)},c=s.on("change",d=>{if(t.current){const u=Math.max(0,Math.min(1,(d-.6666)/.33340000000000003));t.current.material.uniforms.uProgress.value=u,u>0&&u<1?r():l()}});return()=>{c(),l()}},[s]),e.jsxs("div",{ref:o,style:{height:"800vh",marginTop:"-121vh"},className:"relative z-10",children:[e.jsx("div",{className:"fixed inset-0 pointer-events-none",style:{zIndex:100,display:i?"none":"block"},children:e.jsx(m.div,{className:"absolute overflow-visible",style:{top:i?"45%":"35%",bottom:i?"-10%":"-15%",left:"0",right:"0",opacity:F,y:I,WebkitTransform:"translateZ(0)"},children:e.jsx("img",{src:"/crop2.webp",alt:"Leaves",className:"w-full h-auto object-cover",style:{objectPosition:"center center",transform:"translateZ(0)",WebkitTransform:"translateZ(0)"}})})}),e.jsxs("div",{className:"sticky top-0 w-full overflow-hidden",style:{height:"100dvh",WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:[e.jsx("section",{ref:p,className:"absolute inset-0 flex flex-col items-center justify-center bg-white text-black",children:e.jsxs(m.div,{className:"text-center px-8",style:{marginTop:"1vh",opacity:j,scale:T},children:[e.jsx(m.p,{className:"text-sm md:text-base tracking-widest text-gray-400 mb-2 font-light uppercase mt-1",initial:{opacity:0,letterSpacing:"0.1em"},animate:g?{opacity:1,letterSpacing:"0.4em"}:{opacity:0,letterSpacing:"0.1em"},transition:{duration:.8,ease:"easeOut"},children:"Jumlah porsi yang disajikan"}),e.jsx("div",{className:"text-5xl sm:text-7xl md:text-[10rem] font-extralight tracking-tight text-black leading-none mb-10 tabular-nums",style:{fontFamily:"'Playfair Display', serif"},children:G(w)}),e.jsx(m.p,{className:"text-sm md:text-base tracking-widest text-gray-400 font-light",initial:{opacity:0},animate:g?{opacity:1}:{opacity:0},transition:{duration:.8,delay:1.8},children:"Tapi, ini bukan soal angka"})]})}),e.jsx(m.div,{className:"absolute inset-x-0 overflow-hidden z-[3]",style:{top:"-15%",bottom:"-15%",opacity:S,WebkitTransform:"translateZ(0)",transform:"translateZ(0)"},children:e.jsxs(m.div,{className:"w-full h-full",style:{scale:W,y:L},children:[e.jsx("img",{src:"/bgv2.webp",alt:"Retro Background",className:"w-full h-full object-cover",style:{objectPosition:"center center",transform:"translateZ(0)",WebkitTransform:"translateZ(0)"}}),e.jsx("div",{className:"absolute inset-0 bg-black/20"})]})}),e.jsx(m.div,{className:"absolute inset-0 flex items-center justify-center z-[15] pointer-events-none px-6 sm:hidden",style:{opacity:E,marginTop:"-50vh"},children:e.jsxs("div",{className:"text-center max-w-xs",children:[e.jsx(f,{className:"text-xl font-light leading-relaxed tracking-wide text-white mb-1",delay:0,scrollProgress:s,startProgress:.48,endProgress:.66,children:"Ini adalah"}),e.jsx(f,{className:"text-xl font-light leading-relaxed tracking-wide text-white mb-1",delay:.015,scrollProgress:s,startProgress:.48,endProgress:.66,children:"komitmen kami"}),e.jsx(f,{className:"text-xl font-light leading-relaxed tracking-wide text-white mb-1",delay:.03,scrollProgress:s,startProgress:.48,endProgress:.66,children:"menyajikan resep"}),e.jsx(f,{className:"text-xl font-light leading-relaxed tracking-wide text-white mb-1",delay:.08,scrollProgress:s,startProgress:.48,endProgress:.66,children:"terbaik sambil"}),e.jsx(f,{className:"text-xl font-light leading-relaxed tracking-wide text-white",delay:.1,scrollProgress:s,startProgress:.48,endProgress:.66,children:"merawat ibu bumi"})]})}),e.jsx(m.div,{className:"absolute inset-0 hidden sm:flex items-center justify-center z-[15] pointer-events-none px-6",style:{opacity:E,marginTop:"-45vh"},children:e.jsxs("div",{className:"text-center max-w-xl",children:[e.jsx(f,{className:"text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white mb-2",delay:0,scrollProgress:s,startProgress:.48,endProgress:.66,children:"Ini adalah komitmen kami"}),e.jsx(f,{className:"text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white mb-2",delay:.015,scrollProgress:s,startProgress:.48,endProgress:.66,children:"menyajikan resep terbaik"}),e.jsx(f,{className:"text-xl sm:text-2xl md:text-3xl font-light leading-relaxed tracking-wide text-white",delay:.03,scrollProgress:s,startProgress:.48,endProgress:.66,children:"sambil merawat ibu bumi"})]})}),e.jsx("canvas",{ref:h,className:"absolute inset-0 z-[25] pointer-events-none",style:{width:"100%",height:"100%"}})]})]})}export{ee as default};
