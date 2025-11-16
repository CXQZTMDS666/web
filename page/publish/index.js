/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */

async function setChannels(){
    const result = await axios({
        url: '/v1_0/channels'
    })

    const channelsList = result.data.channels
    const channelsStr = '<option value="" selected="">请选择文章频道</option>' + channelsList.map(item =>{
        return `<option value="${item.id}">${item.name}</option>`
    }).join('')
    document.querySelector('.form-select').innerHTML = channelsStr
}
setChannels()



/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */
document.querySelector('.img-file').addEventListener('change',async e=>{
    const file = e.target.files[0]
    //图片上传之类的操作要用formdata上传
    const fd = new FormData()
    fd.append('image',file)    
    //单独上传图片并得到url地址
    const res = await axios({
        method:'post',
        url: '/v1_0/upload',
        data: fd
    })

    const imgUrl = res.data.url
    document.querySelector('.rounded').src = imgUrl
    document.querySelector('.rounded').classList.add('show')
    document.querySelector('.place').classList.add('hide')
})

//点击img出现选择图片
document.querySelector('.rounded').addEventListener('click',()=>{
    document.querySelector('.img-file').click() //addEventListener是判断是否触发了事件，直接使事件触发就 .事件（）
})

/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */
document.querySelector('.send').addEventListener('click',async ()=>{

    
    
    
    
    const form = document.querySelector('.art-form')
    const data = serialize(form,{hash:true,empty:true})

    data.cover = {
        type:1,
        images:[document.querySelector('.rounded ').src]
    }
    try {
        if(document.querySelector('.send').innerText === '修改'){
            //修改文章提交
            const result = await axios({
                method:'put',
                url: `/v1_0/mp/articles/${data.id}`,
                data: data
            })

            myAlert(true,'修改成功')
        }else{
            //新建文章提交
            delete data.id
            const result = await axios({
                method:'post',
                url: '/v1_0/mp/articles',
                data: data
            })

            myAlert(true,'发布成功')
        }



        
        //重置表单 只能清空表单元素
        form.reset()
        //封面、副文本需要手动重置
        document.querySelector('.rounded').src = ''
        document.querySelector('.rounded').classList.remove('show')
        document.querySelector('.place').classList.remove('hide')
        //副文本编辑器重置
        editor.setHtml('')

        setTimeout(() => {
            //延迟跳转
            location.href = '../content/index.html'
        }, 1000);
    } catch (error) {
        console.dir(error)
        myAlert(false,error.response.data.message)
    }


})




/**
 * 目标4：编辑-回显文章
 *  4.1 页面跳转传参（URL 查询参数方式）
 *  4.2 发布文章页面接收参数判断（共用同一套表单）
 *  4.3 修改标题和按钮文字
 *  4.4 获取文章详情数据并回显表单
 */
;(function(){
    const paramsStr = location.search  //查找url里的参数
    const params = new URLSearchParams(paramsStr) //将查到的参数创建对象
    params.forEach(async (value,key) =>{  //遍历url对象

        //有id需要传入
        if(key === 'id'){
            document.querySelector('.title span').innerHTML = '修改文章'
            document.querySelector('.send').innerHTML = '修改'
            
            //获取文章内容
            const res = await axios({
                url: `/v1_0/mp/articles/${value}`,
            })
 

            const dataObj = {
                channel_id:res.data.channel_id,
                title:res.data.title,
                rounded:res.data.cover.images[0],
                content:res.data.content,
                id:res.data.id
            }

            //遍历对象
            Object.keys(dataObj).forEach(key =>{
                if(key === 'rounded'){
                    //封面
                    if(dataObj[key]){
                        //有封面
                        document.querySelector('.rounded').src = dataObj[key]
                        document.querySelector('.rounded').classList.add('show')
                        document.querySelector('.place').classList.add('hide')
                    }
                }else if(key === 'content'){
                    //富文本
                    editor.setHtml(dataObj[key])
                }else{
                    //用对象属性名，作为标签name属性值查找，将文字作为value写入，相当于设置可编辑的默认值
                    document.querySelector(`[name=${key}]`).value = dataObj[key]
                }
            })
            
        }
    })
    
})()




/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */


