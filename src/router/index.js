import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';

const routes = [
    {
        path: '/',
        component: () => import('../components/Login/login.vue')
    },
    {
        // 👇 非严格匹配，/my-page/* 都指向 MyPage 页面
        path: '/my-page', // vue-router@4.x path的写法为：'/my-page/:page*'
        name: 'my-page',
        component: () => import('../components/Test/my-page/index.vue')
    },
    {
        path: '/Login',
        component: () => import('../components/Login/login.vue')
    },
    {
        path: '/Page',
        component: () => import('../components/Page/index.vue'),
    },
    {
        path: '/PageEdit',
        component: () => import('../components/PageEdit/index.vue'),
    },
    
    {
        path: '/Preview',
        component: () => import('../components/PageDebug/index.vue'),
    },{
        path: '/TestHello',
        component: () => import('../components/Test/TestHello/index.vue'),
    },{
        path: '/TestELTabs',
        component: () => import('../components/Test/TestELTabs/index.vue'),
    },{
        path: '/TestSortable',
        component: () => import('../components/Test/TestSortable/index.vue'),
    },{
        path: '/TestDiv',
        component: () => import('../components/Test/TestDiv/index.vue'),
    },
    {
        path: '/TestGridLayout',
        component: () => import('../components/Test/TestGridLayout/index.vue'),
    },

    {
        path: '/TestPosition',
        component: () => import('../components/Test/TestPosition/index.vue'),
    },







    {
        path: '/TestFlex',
        component: () => import('../components/Test/TestFlex/index.vue'),
    },{
        path: '/TestPagination',
        component: () => import('../components/Test/TestPagination/index.vue'),
    },{
        path: '/TestELTable',
        component: () => import('../components/Test/TestELTable/index.vue'),
    },{
        path: '/TestCP',
        component: () => import('../components/Test/TestCP/index.vue'),
    },{
        path: '/TestIframeChild',
        component: () => import('../components/Test/TestIframeChild/index.vue'),
    },{
        path: '/TestTheme',
        component: () => import('../components/Test/TestTheme/index.vue'),
    },

    {
        path: '/TestComponent',
        component: () => import('../components/Test/TestComponent/index.vue'),
    },
    {
        path: '/TestDraggable',
        component: () => import('../components/Test/TestDraggable/index.vue'),
    },
    {
        path: '/TestSketchRuler',
        component: () => import('../components/Test/TestSketchRuler/index.vue'),
    },
    {
        path: '/TestSketchRuler2',
        component: () => import('../components/Test/TestSketchRuler/index2.vue'),
    },

    {
        path: '/TestLife',
        component: () => import('../components/Test/TestLife/PageDebug.vue'),
    },
    {
        path: '/TestLayout',
        component: () => import('../components/Page/BlueScript/BlueScriptBlockTree/index.vue'),
    },
    {
        path: '/TestPackUmdComponent',
        component: () => import('../components/Test/TestPackUmdComponent/index.vue'),
    },
    {
        path: '/TestPackmjsComponent',
        component: () => import('../components/Test/TestPackmjsComponent/index.vue'),
    },
    
    {
        path: '/Main',
        component: () => import('../components/Main/main.vue'),
        children: [
            {
                path: 'Centre',
                component: () => import('../components/Main/Centre/index.vue'),
            },
            {
                path: 'Uphold',
                component: () => import('../components/Main/Component/index.vue'),
            },
            {
                path: 'BlueScript',
                component: () => import('../components/Main/BlueScript/index.vue'),
            },
            {
                path: 'PackComponent',
                component: () => import('../components/Main/PackComponent/index.vue'),
            },
            {
                path: 'DataModel',
                component: () => import('../components/Main/DataModel/index.vue'),
            },
            
            {
                path: 'Md',
                component: () => import('../components/Main/Md/index.vue'),
            },
            {
                name: 'BlueScriptName',
                path: 'BlueScriptUpload',
                component: () => import('../components/Main/BlueScript/BlueScriptUpload/index.vue')
            },
            {
                name: 'ComponentUploadName',
                path: 'ComponentUpload',
                component: () => import('../components/Main/Component/ComponentUpload/index.vue')
            },
            {
                path: 'DynamicsSetting',
                component: () => import('../components/Main/Component/DynamicsSetting/index.vue')
            },
        ]
    },
    {
        path: '/ComponentRegisterIframe',
        component: () => import('../components/Main/Component/ComponentRegister/iframe.vue')
    },

];
const router = createRouter({
    //history: createWebHashHistory(),  // hash路由模式
    history: createWebHistory(),  // history路由模式
    routes
});
export default router;