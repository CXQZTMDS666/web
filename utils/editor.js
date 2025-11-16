// 富文本编辑器
// 创建编辑器函数，创建工具栏函数

//对象结构赋值给全局属性wangEditor
//创建编辑器函数，创建工具栏函数
const { createEditor, createToolbar } = window.wangEditor

//编辑器配置对象
const editorConfig = {
    placeholder: '文章内容...', //提示文字
    onChange(editor) {     //编辑器变化时的回调函数
    const html = editor.getHtml()   //获取副文本内容

    // 也可以同步到 <textarea>
    document.querySelector('.publish-content').innerHTML = html

    
    },
}

//创建编辑器
const editor = createEditor({ 
    //创建位置
    selector: '#editor-container',
    //默认内容
    html: '<p><br></p>',
    //配置对象
    config: editorConfig,
    //配置集成模式（default全部）
    mode: 'default', // or 'simple'
})

//工具栏配置对象
const toolbarConfig = {}

//创建工具栏
const toolbar = createToolbar({
    //被指定的编辑器创建工具栏
    editor,
    //工具栏创建的位置
    selector: '#toolbar-container',
    //工具栏配置对象
    config: toolbarConfig,
    //配置集成模式（default全部）
    mode: 'default', // or 'simple'
})