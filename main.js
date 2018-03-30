function RESTAPI(config){
  this.defaultConfig = {
    restAPI: 'https://jsonplaceholder.typicode.com/',
    parameters: ['method','resource','data'],
    parameterTypes: [
      ['method', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      ['resource', 'posts', 'comments', 'albums', 'photos', 'todos', 'users'],
      ['data', Object]
    ],
    description: `defaultAPI(method, resource, data)
    Send a request to $$restAPI$$(config)
    method is one of the following: $$method$$(multi)
    resource is one of the following: $$resource$$(multi)
    data is of type $$data$$(single)`
  };
  this.config = config || this.defaultConfig;
  let CONSTRUCTEDAPI = new Function(...this.config.parameters, );
  if(this.config.description){
    let self = this;
    CONSTRUCTEDAPI.toString = function(){
      let descriptorRegEx = new RegExp('\\$\\$([\\w]*)\\$\\$\\(([\\w]*)\\)', 'g')
      let parsedDescription = self.config.description;
      self.config.description.replace(descriptorRegEx, function(m, p1, p2, ind, original){
        console.log(arguments)
        switch(p2){
          case 'config':
            parsedDescription=parsedDescription.replace(`$$${p1}$$(${p2})`, self.config[p1]);
            break;
          case 'single':
            parsedDescription=parsedDescription.replace(`$$${p1}$$(${p2})`, self.config.parameterTypes[self.config.parameterTypes.indexOf(self.config.parameterTypes.filter((e)=>{return e[0]==p1;})[0])][1]);
            break;
          case 'multi':
            let ttind = self.config.parameterTypes.filter((e)=>{return e[0]==p1;});
            let tind = self.config.parameterTypes.indexOf(ttind[0]);
            console.log(self.config.parameterTypes[tind].splice(1))
            parsedDescription=parsedDescription.replace(`$$${p1}$$(${p2})`, self.config.parameterTypes[tind].splice(1).join(', '));
            break;
        }
        return original;
      });
      return parsedDescription;
    };
  }
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
  console.log(placeholderAPI)
  console.log(placeholderAPI.toString())
})();
