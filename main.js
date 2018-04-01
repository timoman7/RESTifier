let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
Object.defineProperty(Array.prototype, 'remove', {
  value: function(fArray){
    return this.filter((a)=>{
      return !fArray.includes(a);
    });
  },
  writable: false,
  enumerable: false
});
Object.defineProperty(Array.prototype, 'kvify', {
  value: function(){
    let rv=[];
    this.forEach((e)=>{
      rv.push(e+':'+e);
    });
    return rv;
  },
  writable: false,
  enumerable: false
});
function RESTAPI(config){
  let self = this;
  this.defaultConfig = {
    restAPI: 'https://jsonplaceholder.typicode.com/',
    parameters: ['method','resource','data'],
    parameterTypes: [
      ['method', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      ['resource', 'posts', 'comments', 'albums', 'photos', 'todos', 'users'],
      ['data', 'Object']
    ],
    paramTransform: {
      'path': 'resource'
    },
    excludeFromData: [
      'data',
      'headers',
      'resource',
      'method'
    ],
    description: `defaultAPI(method, resource, data)
    Send a request to $$restAPI$$(config)
    method is one of the following: $$method$$(multi)
    resource is one of the following: $$resource$$(multi)
    data is of type $$data$$(single)`,
    example: function(){
      console.log('%c%s', 'color: blue;', 'Called example("GET", "posts", {userId: 1})');
      return self.internalCall('https://jsonplaceholder.typicode.com/posts',"GET",{userId: 1},{});
    }
  };
  this.config = config || this.defaultConfig;
  let CONSTRUCTEDAPI = new AsyncFunction(...this.config.parameters, `
    let self = RESTAPI;
    return await self.prototype.internalCall('${this.config.restAPI}${this.config.paramTransform?'\'+'+this.config.paramTransform.path+'+\'':''}',
    ${this.config.parameters.includes('method')?'method':'\"GET\"'},
    ${this.config.parameters.includes('data')?'data':'{\n'+this.config.parameters.remove(this.config.excludeFromData||['data', 'headers']).kvify().join(',\n')+'\n}'},
    ${this.config.parameters.includes('headers')?'headers':'{}'});
    `);
  Object.defineProperty(CONSTRUCTEDAPI, 'internalCall', {
    value: self.internalCall,
    writable: false,
    enumerable: true
  });
  if(this.config.description){
    CONSTRUCTEDAPI.toString = function(){
      let descriptorRegEx = new RegExp('\\$\\$([\\w]*)\\$\\$\\(([\\w]*)\\)', 'g')
      let parsedDescription = self.config.description;
      self.config.description.replace(descriptorRegEx, function(m, p1, p2, ind, original){
        const _config_ = JSON.parse(JSON.stringify(self.config));
        //console.log(...arguments)
        let str;
        if(p2 == "config"){
          str = _config_[p1];
          parsedDescription = (""+parsedDescription).replace(`$$${p1}$$(${p2})`, str);
        }else if(p2 == "single" || p2 =="multi"){
          let ttind = _config_.parameterTypes.filter((e)=>{
            return e[0]==p1;
          });
          let tind = _config_.parameterTypes.indexOf(ttind[0]);
          if(p2 == "single"){
            str = _config_.parameterTypes[tind][1];
            parsedDescription = (""+parsedDescription).replace(`$$${p1}$$(${p2})`, str);
          }else if(p2 == "multi"){
            str = _config_.parameterTypes[tind].splice(1).join(', ');
            parsedDescription = (""+parsedDescription).replace(`$$${p1}$$(${p2})`, str);
          }
        }
        return original;
      });
      return parsedDescription;
    };
  }
  CONSTRUCTEDAPI.example = this.config.example || function(){
    console.log('%c%s', "color: red;", 'No example present.');
  };
  return CONSTRUCTEDAPI;
}
(function(){
  async function __internalCall__(url, method, data, headers){
    //console.log(url, method, data, headers)
    return await $.ajax({
      url: url,
      method: method,
      // dataType: 'json'
      data: data,
      headers: headers,
      success: function(data){
        return {
          data: data,
          result: 'success'
        };
      },
      error: function(data){
        return {
          data: data,
          result: 'error'
        };
      }
    });
  }
  Object.defineProperty(RESTAPI.prototype, 'internalCall', {
    value: __internalCall__,
    writable: false,
    enumerable: true
  });
})();
(async function Test(){
  console.log("%c%s","background-color: black; color: white; text-align: center;", "Running tests");
  console.log("%c%s","background-color: black; color: white; text-align: center;", "YQLQuery test");
  let YQLQuery = new RESTAPI({
    restAPI: 'http://query.yahooapis.com/v1/public/yql',
    parameters: [
      'q',
      'format',
      'diagnostics',
      'env'
    ],
    parameterTypes: [
      ['q', 'String'],
      ['format', 'json'],
      ['diagnostics', 'true', 'false'],
      ['env', 'store://datatables.org/alltableswithkeys']
    ],
    excludeFromData: [
      'data',
      'headers',
      'method'
    ],
    description: `YQLQuery(q, format, diagnostics, env)
    Send a request to $$restAPI$$(config)
    q is a $$q$$(single) following the yql query syntax
    format is one of the following data types: $$format$$(single)
    diagnostics is one of the following: $$diagnostics$$(multi)
    env is a url of a yqltable database. The default ones are $$env$$(multi)
    `
  });
  console.log(YQLQuery);
  console.log("%c%s","background-color: black; color: white; text-align: center;", "YQLQuery select * from htmlstring where url='www.google.com'");
  console.log(await YQLQuery("select * from htmlstring where url='www.google.com'", 'json', true, 'store://datatables.org/alltableswithkeys'))
  console.log("%c%s","background-color: black; color: white; text-align: center;", "Placeholder/defaultAPI test");
  let placeholderAPI = new RESTAPI();
  console.log(placeholderAPI);
  console.log("%c%s","background-color: black; color: white; text-align: center;", "Placeholder example call");
  console.log(placeholderAPI.example());
  console.log("%c%s","background-color: black; color: white; text-align: center;", "Placeholder get post with userId: 1");
  console.log(await placeholderAPI("GET", 'posts', {userId: 1}));
})();
