function RESTAPI(config){
  let self = this;
  Object.defineProperty(this, 'internalCall', {
    value: function(url, method, data){
      function urlify(url, data){
        let params = '';
        let keyNames = Object.keys(data);
        keyNames.forEach((kn)=>{
          let kv = data[kn];
          params += (keyNames.indexOf(kn)==0?`?${kn}=${kv}`:`&${kn}=${kv}`);
        });
        return url+params;
      }
      let newUrl = urlify(url, data);
      console.log(newUrl)
    },
    writable: false,
    enumeralbe: false
  });
  this.defaultConfig = {
    restAPI: 'https://jsonplaceholder.typicode.com/',
    parameters: ['method','resource','data'],
    parameterTypes: [
      ['method', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      ['resource', 'posts', 'comments', 'albums', 'photos', 'todos', 'users'],
      ['data', 'Object']
    ],
    description: `defaultAPI(method, resource, data)
    Send a request to $$restAPI$$(config)
    method is one of the following: $$method$$(multi)
    resource is one of the following: $$resource$$(multi)
    data is of type $$data$$(single)`,
    example: function(){
      console.log('%c%s', 'color: blue;', 'Called example("GET", "posts", {userId: 1})');
      self.internalCall(`https://jsonplaceholder.typicode.com/posts`, 'GET', {
        userId: 1
      });
    }
  };
  this.config = config || this.defaultConfig;
  let CONSTRUCTEDAPI = new Function(...this.config.parameters, `
    
    `);
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
  CONSTRUCTEDAPI.example = this.config.example || function(){console.log('%c%s', "color: red;", 'No example present.')};
  return CONSTRUCTEDAPI;
}

(function Test(){
  console.log("%c%s","background-color: black; color: white; text-align: center;", "Running tests");
  let YQLQuery = new RESTAPI({
    restAPI: 'http://query.yahooapis.com/v1/public/yql',
    parameters: [
      'q',
      'format',
      'diagnostics',
      'env'
    ]
  });
  console.log(YQLQuery);
  let placeholderAPI = new RESTAPI();
  console.log(placeholderAPI);
  console.log(placeholderAPI.example());
  console.log(placeholderAPI.internalCall)
})();
