"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[558],{8558:function(e,a,n){n.r(a),n.d(a,{default:function(){return y}});var r=n(4165),t=n(5861),s=n(2791),o=n(9434),l=n(3464),c=n(9037),i=n(9399),m=n(6167),u=n(2976),d=n(8118),p=n(9127),v=n(2506),f=n(8007),h=n(1639),E=n(8300),b=n(2571),w="styles_loginWrapper__kJs2m",_="styles_formContent__94Sh4",k=n(7689),Z=f.Ry().shape({username:f.Z_().required("Please enter your username"),password:f.Z_().required("Please enter your password")}),y=function(){var e=(0,o.I0)(),a=(0,k.s0)(),n=(0,v.TA)({initialValues:{username:"",password:""},validationSchema:Z,onSubmit:function(){var n=(0,t.Z)((0,r.Z)().mark((function n(t){var s,o;return(0,r.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,r=t,(0,E.WN)(b.py,r,e);case 3:s=n.sent,console.log("logined: ",s),a("/"),n.next=11;break;case 8:n.prev=8,n.t0=n.catch(0),h.Store.addNotification({title:"Error!",message:null!==(o=null===n.t0||void 0===n.t0?void 0:n.t0.error_message)&&void 0!==o?o:"System error. Please try again.",type:"danger",insert:"top",container:"top-right",animationIn:["animate__animated","animate__fadeIn"],animationOut:["animate__animated","animate__fadeOut"],dismiss:{duration:2e3}});case 11:case"end":return n.stop()}var r}),n,null,[[0,8]])})));return function(e){return n.apply(this,arguments)}}()});(0,s.useEffect)((function(){n.setErrors({})}),[n.values]);var f=function(e){console.log(e),13===e.keyCode&&(e.preventDefault(),n.handleSubmit())};return s.createElement("div",{id:"app-container"},s.createElement("div",{className:"container-fluid"},s.createElement("div",{className:"h-100"},s.createElement("div",{className:w},s.createElement(l.Z,{className:_},s.createElement(c.Z,null,s.createElement("h4",{className:"mb-4"},"Login to Zalo AILab Tools"),s.createElement(i.Z,{className:"av-tooltip tooltip-label-bottom"},s.createElement(m.Z,null,s.createElement(u.Z,{className:"d-block"},"User name"),s.createElement(d.Z,{className:"form-control",name:"username",placeholder:"Enter username ...",value:n.values.username,onChange:n.handleChange,onKeyDown:f}),n.errors.username&&n.touched.username&&s.createElement("div",{className:"invalid-feedback d-block"},n.errors.username)),s.createElement(m.Z,null,s.createElement(u.Z,{className:"d-block"},"Password"),s.createElement(d.Z,{className:"form-control",name:"password",type:"password",placeholder:"Enter password ...",value:n.values.password,onChange:n.handleChange,onKeyDown:f}),n.errors.password&&n.touched.password&&s.createElement("div",{className:"invalid-feedback d-block"},n.errors.password)),s.createElement(p.Z,{color:"secondary",block:!0,onClick:n.handleSubmit},"Submit"))))))))}}}]);
//# sourceMappingURL=558.c3f75c6b.chunk.js.map