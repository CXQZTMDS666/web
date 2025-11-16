// axios 公共配置
// 基地址
axios.defaults.baseURL='https://geek.itheima.net'

//请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //统一携带token字符串在请求头上
    const token = localStorage.getItem("token");
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

//响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。 响应成功就触发这里的函数
  //直接返回数据对象
  const result = response.data
  return result;
}, function (error) {  
  // 超出 2xx 范围的状态码都会触发该函数。  响应失败触发这里的函数
  // 对响应错误做点什么，例如：判断响应状态为 401 代表身份验证失败
  console.dir(error)  //错误信息里有响应值
  if (error?.response?.status === 401) {
    alert('登录状态过期，请重新登录')
    window.location.href = '../login/index.html'
  }
  return Promise.reject(error);
});