import {defineConfig} from 'vite'
import pluginVue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins:[pluginVue()],
    server:{
        host:"10.11.0.87",
        port:"4000",
        hmr:true,
        usePolling:true,
        proxy: {
            "/bigscreen": {
                target: "http://10.254.10.17:37078",
                //target: "http://10.254.11.225:37078",
                changeOrigin: true,
            },
        },


    }

})