import {defineConfig} from 'vite'
import pluginVue from '@vitejs/plugin-vue'
import path  from 'path'

export default defineConfig({
    plugins: [pluginVue()],
    resolve: {
        alias: {
            '@':path.resolve(__dirname, './src/')
        }
    },
    server:{
        //host:"192.168.0.10",
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