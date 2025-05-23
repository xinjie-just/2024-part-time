<!-- 富文本编辑器实例，https://www.wangeditor.com/v5/for-frame.html#vue3 -->
<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    <Editor style="height: 300px; overflow-y: hidden" v-model="valueHtml" :defaultConfig="editorConfig" mode="simple"
      @onCreated="onCreated" @onBlur="onBlur" @onChange="onChange" />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { onBeforeUnmount, ref, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { uploadFilePath, defaultOrigin } from '@/services';
import { message } from 'ant-design-vue';

const emits = defineEmits(['blur']);
const props = defineProps<{ html: string }>();

const editorRef = shallowRef(); // 编辑器实例，必须用 shallowRef
const valueHtml = ref(''); // 内容 HTML
const fileName = ref('');
const token = localStorage.getItem('token');

const toolbarConfig = {};
const editorConfig = {
  placeholder: '请输入内容（3000 个字符以内）...',
  autoFocus: false,
  maxLength: 3000,
  MENU_CONF: {
    uploadImage: {
      server: uploadFilePath,
      fieldName: 'file',
      maxFileSize: 5 * 1024 * 1024, // 单个文件的最大体积限制，默认为 2M
      maxNumberOfFiles: 10, // 最多可上传几个文件，默认为 100
      allowedFileTypes: ['image/*'], // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
      withCredentials: false, // 跨域是否传递 cookie ，默认为 false
      timeout: 60 * 1000, // 超时时间，默认为 10 秒
      headers: {
        token
      },
      onBeforeUpload(file: File) {
        fileName.value = file.name || Object.values(file)[0].name;
        return file;
      },
      customInsert(res: any, insertFn: any) {
        // res 即服务端的返回结果，从 res 中找到 url alt href ，然后插入图片
        const result = res.data;
        const alt = fileName.value || 'result';
        let origin = location.origin;
        if (origin.includes('localhost')) {
          origin = defaultOrigin;
        }
        const url = `${origin}${result}`;
        insertFn(url, alt, url)
      },
      // 单个文件上传成功之后
      onSuccess(file: File) {
        message.success(`${file.name} 上传成功`, 4);
      },
      // 单个文件上传失败
      onFailed(file: File) {
        message.error(`${file.name} 上传失败`, 4);
      },
      // 上传错误，或者触发 timeout 超时
      onError(file: File, err: any) {
        message.error(`${file.name} 上传出错，${err}`, 4);
      }
    },
  },
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const onCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
  if (editor == null) return;

  toolbarConfig['excludeKeys'] = [
    "blockquote",
    "code",
    "codeBlock",
    "group-video",
    "todo",
    "insertTable",
    "insertLink",
  ];
  setTimeout(() => {
    valueHtml.value = props.html;
  }, 500);
};

const onBlur = () => {
  emits('blur', editorRef.value.getHtml());
}

const onChange = () => {
  emits('blur', editorRef.value.getHtml());
}
</script>
