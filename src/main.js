import './assets/main.css'
import Antd,{message} from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';


import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.use(Antd).mount('#app')
app.config.globalProperties.$message = message;
