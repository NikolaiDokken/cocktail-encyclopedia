(this.webpackJsonpcocktail_encyclopedia=this.webpackJsonpcocktail_encyclopedia||[]).push([[0],{108:function(e,t,n){"use strict";n.r(t);var r=n(6),i=n(0),s=n.n(i),a=n(10),c=n.n(a),o=(n(80),n(64)),d=n(153),u=n(25),l=n.p+"static/media/logo.81424971.svg",g=(n(81),n(58)),j=n(59),h=n(82).default,p="https://www.thecocktaildb.com/api/json/v1/1",m=new(function(){function e(){Object(g.a)(this,e)}return Object(j.a)(e,[{key:"getCocktailByName",value:function(e){return h.get(p+"/search.php?s="+e)}},{key:"getCocktailByIngredient",value:function(e){return h.get(p+"/filter.php?i="+e)}},{key:"getRandomCocktail",value:function(){return h.get(p+"/random.php")}},{key:"getCocktailById",value:function(e){return h.get(p+"/lookup.php?i="+e)}}]),e}()),b=n(140),f=n(143),x=n(145),O=n(146),y=n(111),I=n(147),k=n(148),v=Object(b.a)({media:{height:180},content:{height:80,overflowY:"auto"}});function w(e){var t=e.drinkId,n=v(),s=Object(i.useState)(!1),a=Object(u.a)(s,2),c=a[0],o=a[1],d=Object(i.useState)({}),l=Object(u.a)(d,2),g=l[0],j=l[1];Object(i.useEffect)((function(){j(m.getCocktailById(t).then((function(e){j(e.data.drinks[0])})))}),[t]);return Object(r.jsxs)(f.a,{children:[Object(r.jsx)(x.a,{className:n.media,image:g.strDrinkThumb,component:"img",title:g.strDrink+" preview"}),Object(r.jsxs)(O.a,{children:[Object(r.jsx)(y.a,{gutterBottom:!0,variant:"h5",component:"h2",children:g.strDrink}),Object(r.jsx)("div",{className:n.content,children:c?Object(r.jsx)(y.a,{variant:"body2",color:"textSecondary",component:"p",children:g.strInstructions}):Object(r.jsx)("ul",{style:{margin:0,padding:4},children:function(e){var t=[];return e.strIngredient1&&t.push({measure:e.strMeasure1,ingredient:e.strIngredient1}),e.strIngredient2&&t.push({measure:e.strMeasure2,ingredient:e.strIngredient2}),e.strIngredient3&&t.push({measure:e.strMeasure3,ingredient:e.strIngredient3}),e.strIngredient4&&t.push({measure:e.strMeasure4,ingredient:e.strIngredient4}),e.strIngredient5&&t.push({measure:e.strMeasure5,ingredient:e.strIngredient5}),e.strIngredient6&&t.push({measure:e.strMeasure6,ingredient:e.strIngredient6}),e.strIngredient7&&t.push({measure:e.strMeasure7,ingredient:e.strIngredient7}),e.strIngredient8&&t.push({measure:e.strMeasure8,ingredient:e.strIngredient8}),e.strIngredient9&&t.push({measure:e.strMeasure9,ingredient:e.strIngredient9}),e.strIngredient10&&t.push({measure:e.strMeasure10,ingredient:e.strIngredient10}),e.strIngredient11&&t.push({measure:e.strMeasure11,ingredient:e.strIngredient11}),e.strIngredient12&&t.push({measure:e.strMeasure12,ingredient:e.strIngredient12}),e.strIngredient13&&t.push({measure:e.strMeasure13,ingredient:e.strIngredient13}),e.strIngredient14&&t.push({measure:e.strMeasure14,ingredient:e.strIngredient14}),e.strIngredient15&&t.push({measure:e.strMeasure15,ingredient:e.strIngredient15}),t}(g).map((function(e,t){return Object(r.jsx)("li",{style:{listStylePosition:"inside"},children:Object(r.jsx)(y.a,{variant:"body2",color:"textSecondary",children:e.measure?e.measure+" "+e.ingredient:e.ingredient})},t)}))})})]}),Object(r.jsx)(I.a,{children:Object(r.jsx)(k.a,{size:"small",color:"primary",onClick:function(){return o(!c)},children:c?"Ingredients":"Instructions"})})]})}var C=n(149),M=n(155),S=n(154),D=n(150),B=n(151),T=n(152),E=n(63),N=n.n(E);function R(){var e=Object(i.useState)([]),t=Object(u.a)(e,2),n=t[0],s=t[1],a=Object(i.useState)(""),c=Object(u.a)(a,2),o=c[0],d=c[1],g=Object(i.useState)(!1),j=Object(u.a)(g,2),h=j[0],p=j[1],b=function(){o.length>0?(m.getCocktailByName(o).then((function(e){e.data.drinks?s(e.data.drinks):s([])})),p(!0)):p(!1)};Object(i.useEffect)((function(){h||m.getRandomCocktail().then((function(e){s(e.data.drinks)}))}),[h]);return Object(r.jsxs)("div",{style:z.container,children:[Object(r.jsxs)(C.a,{container:!0,justify:"center",alignItems:"center",style:{marginTop:60},children:[Object(r.jsx)(M.a,{smDown:!0,children:Object(r.jsx)(C.a,{item:!0,children:Object(r.jsx)("img",{src:l,style:z.appLogo,className:"App-logo",alt:"logo"})})}),Object(r.jsx)(C.a,{item:!0,children:Object(r.jsx)(y.a,{variant:"h2",align:"center",children:"The Cocktail Encyclopedia"})})]}),Object(r.jsx)(S.a,{value:o,onChange:function(e){d(e.target.value)},onKeyDown:function(e){return"Enter"===e.key?b():null},placeholder:"Tequila sunrise, lime, tonic",color:"primary",variant:"outlined",InputProps:{endAdornment:Object(r.jsx)(D.a,{position:"end",children:Object(r.jsx)(B.a,{onClick:b,children:Object(r.jsx)(N.a,{})})})},style:{marginTop:h?20:50}}),h?"":Object(r.jsx)(y.a,{variant:"h5",align:"center",style:{marginTop:40},children:"Have you tried..."}),Object(r.jsx)(T.a,{style:{marginTop:h?40:0},children:Object(r.jsx)(C.a,{container:!0,spacing:2,justify:h?"flex-start":"center",children:n.map((function(e,t){return Object(r.jsx)(C.a,{item:!0,xs:12,sm:6,md:4,lg:3,children:Object(r.jsx)(w,{drinkId:e.idDrink},t)},e.idDrink)}))})}),0===n.length?Object(r.jsx)(y.a,{children:"No search results"}):""]})}var z={container:{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center"},appLogo:{height:"9vmin",pointerEvents:"none",marginRight:16},searcTypeSelector:{fontSize:14,display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"},searchContainer:{display:"flex",flexDirection:"row",alignItems:"center"},searchBar:{borderRadius:8,border:"1px solid white",height:32,width:300,backgroundColor:"inherit",marginTop:16,fontSize:20,color:"white",outline:"none",marginBottom:16},cardContainer:{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"space-evenly",padding:"0 16px 0 16px"}},A=Object(o.a)({palette:{primary:{main:"#fc0303"},secondary:{main:"#ffffff"},text:{primary:"#000000"}}});function H(){return Object(r.jsx)(d.a,{theme:A,children:Object(r.jsx)(R,{})})}c.a.render(Object(r.jsx)(s.a.StrictMode,{children:Object(r.jsx)(H,{})}),document.getElementById("root"))},80:function(e,t,n){},81:function(e,t,n){}},[[108,1,2]]]);
//# sourceMappingURL=main.7e6e87f1.chunk.js.map