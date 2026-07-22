(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,5357,e=>{"use strict";var t=e.i(71645);e.i(36639);var l=e.i(89970),a=e.i(83495),r=e.i(75324),s=e.i(60142);let n={duration:1,ease:"power4.out"},i={mask:"lines",autoSplit:!0,linesClass:"line-split",wordDelimiter:"‍",prepareText:e=>0===e.length?"‍":e.replace(/-/g,"-‍").replace(/\s/g,"‍ ‍")};async function o(){document.fonts?.ready&&await document.fonts.ready}e.s(["useAnim",0,function(e,c={}){let d=(0,t.useRef)(null),u=(0,t.useRef)(c);return u.current=c,(0,t.useEffect)(()=>{let t=d.current,c=u.current;if(!t||c.disabled||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let p=null,m=null,g=null,f=!1,x=!1,h=!1,b=(0,s.onLoaderComplete)(()=>{f=!0,x&&p?.play()}),y={...n,delay:c.delay,...void 0!==c.duration&&{duration:c.duration}},j=()=>{if(c.target){let e=t.querySelectorAll(c.target);if(e.length)return Array.from(e)}return t};return(async()=>{switch(e){case"fadeIn":(p=l.gsap.timeline({paused:!0})).from(j(),{opacity:0,duration:y.duration,ease:y.ease,delay:y.delay,stagger:c.stagger??.1});break;case"fadeUp":(p=l.gsap.timeline({paused:!0})).from(j(),{opacity:0,y:30,duration:y.duration,ease:y.ease,delay:y.delay,stagger:c.stagger??.1});break;case"line":{let e=c.axis??"y";(p=l.gsap.timeline({paused:!0})).from(j(),{["x"===e?"scaleX":"scaleY"]:0,transformOrigin:"x"===e?"left center":"top center",duration:c.duration??.6,ease:y.ease,delay:y.delay,stagger:c.stagger??.1});break}case"lineUp":if(t.classList.add("split-text"),await o(),h)return;m=r.SplitText.create(t,{type:"lines",...i,onSplit:e=>((p=l.gsap.timeline({paused:!0})).fromTo(e.lines,{yPercent:100,opacity:0},{yPercent:0,opacity:1,stagger:c.stagger??.1,duration:c.duration??.8,ease:y.ease,delay:y.delay}),p)});break;case"title":if(t.classList.add("split-text"),await o(),h)return;m=r.SplitText.create(t,{type:"lines, words, chars",...i,onSplit:e=>((p=l.gsap.timeline({paused:!0})).fromTo(e.chars,{yPercent:100,opacity:0},{yPercent:0,opacity:1,...c.stagger?{stagger:c.stagger,duration:y.duration}:{duration:.8*y.duration,stagger:{amount:.2*y.duration}},ease:y.ease,delay:y.delay}),p)});break;case"typeChars":{let e=c.target?t.querySelector(c.target)??t:t,a=e.firstElementChild?.textContent||e.textContent||"";(p=l.gsap.timeline({paused:!0,onComplete:()=>{l.gsap.set(e,{clearProps:"all"})}})).fromTo(e,{scrambleText:{text:"_"}},{ease:y.ease,delay:y.delay,scrambleText:{text:a,speed:2,chars:"x&fcc"},duration:2},0)}}!h&&p&&(g=a.ScrollTrigger.create({trigger:t,start:`top ${c.triggerStart??"80%"}`,onEnter:()=>{x=!0,f&&p?.play()},once:!0}))})(),()=>{h=!0,b(),g?.kill(),p?.kill(),m?.revert()}},[e]),d}])},61611,e=>{"use strict";var t=e.i(43476),l=e.i(71645),a=e.i(5357);let r=`
.form-tab {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  font-size: 2.25rem;
  padding-bottom: 6px;
  border-bottom: 1px solid transparent;
  opacity: 25%;
  transition: opacity 0.3s, border-color 0.3s;
  cursor: pointer;
}
@media (min-width: 1024px) {
  .form-tab { font-size: 2.875rem; }
}
.form-tab.active {
  border-color: var(--color-blue);
  opacity: 100%;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}
.form-label {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.5;
  letter-spacing: 0;
}
.form-input {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  font-size: 1.375rem;
  line-height: 1;
  letter-spacing: 0;
  padding-bottom: 8px;
  outline: none;
  border: 0;
  border-bottom: 1px solid var(--color-blue);
  background: transparent;
  width: 100%;
}
.form-input::placeholder {
  color: var(--color-blue);
  opacity: 30%;
}
select.form-input {
  appearance: none;
  border-radius: 0;
  cursor: pointer;
}
select.form-input:invalid {
  opacity: 60%;
}
.contact-text {
  color: var(--color-blue);
  font-family: var(--font-pp-neue);
  font-weight: 400;
  font-size: 1.375rem;
  line-height: 1.5;
  letter-spacing: 0;
}
@media (min-width: 1024px) {
  .contact-text { font-size: 1rem; }
}
`;function s({id:e,label:l,placeholder:a,type:r="text",className:n=""}){return(0,t.jsxs)("label",{htmlFor:e,className:`form-field ${n}`,children:[(0,t.jsx)("span",{className:"form-label",children:l}),(0,t.jsx)("input",{id:e,name:e,type:r,placeholder:a,className:"form-input"})]})}let n=[{href:"https://www.fccccc.org/img/%E5%93%81%E7%89%8C%E6%89%8B%E5%86%8C.pdf",label:"品牌手册"}];e.s(["default",0,function(){let[e,i]=(0,l.useState)("question"),o=(0,a.useAnim)("title",{triggerStart:"100%"}),c=(0,a.useAnim)("lineUp"),d=(0,a.useAnim)("lineUp"),u=(0,a.useAnim)("lineUp",{delay:.1}),p=(0,a.useAnim)("fadeIn",{delay:.2});return(0,t.jsxs)("div",{className:"pb-100",children:[(0,t.jsx)("style",{children:r}),(0,t.jsx)("section",{className:"px-15 flex justify-center bg-blue pt-192 pb-20 lg:pt-312 lg:pb-50",children:(0,t.jsx)("h1",{ref:o,className:"page-title font-normal text-mercury mx-auto lg:font-medium",children:"Let’s Connect"})}),(0,t.jsxs)("section",{className:"px-15 my-grid relative lg:border-b-1px lg:b-blue",children:[(0,t.jsxs)("div",{className:"flex justify-between text-blue font-normal font-gta-mono fs-12 leading-none tracking-[0] uppercase col-span-full mt-20 lg:w-full lg:absolute lg:top-12","aria-hidden":"true",children:[(0,t.jsx)("div",{children:(0,t.jsx)("span",{children:"Contact us"})}),(0,t.jsx)("div",{children:"[FCC.1]"})]}),(0,t.jsx)("div",{ref:c,className:"col-span-full text-heading font-normal fs-30 mt-50 lg:hidden",children:"联系我们,一起规划你的下一段职业旅程。"}),(0,t.jsxs)("div",{ref:p,className:"col-span-full grid grid-cols-subgrid mt-86 lg:col-start-5 lg:col-end-[-1] lg:border-l-1px lg:b-blue lg:mt-0 lg:pt-160 lg:pb-140",children:[(0,t.jsxs)("div",{className:"col-span-full flex lg:col-start-2 lg:col-end-[-2] lg:gap-x-56",children:[(0,t.jsx)("div",{className:"flex-1 flex justify-center lg:flex-none",children:(0,t.jsx)("button",{type:"button",onClick:()=>i("question"),className:`form-tab${"question"===e?" active":""}`,children:"求职咨询"})}),(0,t.jsx)("div",{className:"flex-1 flex justify-center lg:flex-none",children:(0,t.jsx)("button",{type:"button",onClick:()=>i("proposal"),className:`form-tab${"proposal"===e?" active":""}`,children:"商务合作"})})]}),(0,t.jsxs)("form",{className:"col-span-full mt-72 space-y-50 lg:col-start-2 lg:col-end-[-2] lg:mt-110 lg:space-y-30",onSubmit:e=>e.preventDefault(),"aria-label":"question"===e?"求职咨询表单":"商务合作表单",children:[(0,t.jsxs)("div",{className:"w-full space-y-50 lg:flex lg:gap-x-15 lg:space-y-0",children:[(0,t.jsx)(s,{id:"name",label:"姓名 Name",placeholder:"张同学",className:"lg:flex-1"}),(0,t.jsx)(s,{id:"contact",label:"邮箱或微信 Email / WeChat",placeholder:"hello@example.com",className:"lg:flex-1"})]}),(0,t.jsxs)("label",{htmlFor:"industry",className:"form-field",children:[(0,t.jsx)("span",{className:"form-label",children:"目标行业 Target Industry"}),(0,t.jsxs)("select",{id:"industry",name:"industry",defaultValue:"",required:!0,className:"form-input",children:[(0,t.jsx)("option",{value:"",disabled:!0,children:"请选择目标行业…"}),(0,t.jsx)("option",{value:"consulting",children:"Consulting 咨询"}),(0,t.jsx)("option",{value:"internet",children:"Internet 互联网"}),(0,t.jsx)("option",{value:"banking",children:"Banking 金融投行"}),(0,t.jsx)("option",{value:"ai-product",children:"AI Product 人工智能产品"})]})]}),(0,t.jsx)(s,{id:"message",label:"留言 Message",placeholder:"想聊聊你的求职目标…",className:"mb-0"}),(0,t.jsxs)("button",{type:"submit",className:"mt-50 lg:mt-60 relative inline-block overflow-hidden text-center uppercase fs-14 leading-none tracking-[0.02em] font-normal font-gta-mono group cursor-pointer",children:[(0,t.jsx)("span",{className:"block px-46 py-25 bg-blue text-mercury transition-transform duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full",children:"Submit"}),(0,t.jsx)("span",{"aria-hidden":!0,className:"absolute inset-0 block px-46 py-25 bg-white text-blue origin-bottom translate-y-full scale-x-50 transition-transform duration-[0.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 group-hover:scale-x-100",children:"Submit"})]})]})]}),(0,t.jsxs)("div",{className:"col-span-full mt-80 lg:pt-160 lg:grid lg:grid-cols-subgrid lg:mt-0 lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:self-start",children:[(0,t.jsx)("div",{ref:d,className:"hidden lg:block lg:col-span-3 text-heading font-normal fs-30",children:"联系我们,一起规划你的下一段职业旅程。"}),(0,t.jsxs)("div",{ref:u,className:"col-span-full lg:col-span-2 lg:mt-100",children:[(0,t.jsx)("div",{className:"contact-text not-italic mb-30 lg:mb-24",children:(0,t.jsxs)("p",{children:["成都 · 高新区",(0,t.jsx)("br",{}),"Singapore · Raffles Place"]})}),(0,t.jsxs)("div",{className:"flex flex-col items-start",children:[(0,t.jsx)("a",{className:"contact-text underline",href:"tel:+864000155158","aria-label":"致电 400 015 5158",children:"400 015 5158"}),(0,t.jsx)("a",{className:"contact-text underline",href:"mailto:hello@fccccc.org","aria-label":"发邮件至 hello@fccccc.org",children:"hello@fccccc.org"})]}),(0,t.jsx)("div",{className:"flex flex-col items-start mt-30 lg:mt-24",children:n.map(e=>(0,t.jsx)("a",{className:"contact-text underline",href:e.href,target:"_blank",rel:"noopener noreferrer",children:e.label},e.label))})]})]})]})]})}])}]);