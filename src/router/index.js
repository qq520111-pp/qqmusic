import Vue from "vue"
import Router from "vue-router"
import Rank from "../components/rank.vue"
import Search from "../components/search.vue"
import Singer from "../components/singer.vue"
import Recommend from "../components/recommend.vue"
import disc from "../components/disc.vue"
import rankC from "../components/rankC.vue"


//歌手详情列表
import SingerDetail from "../components/SingerDetail.vue"

//引入基本子组件
Vue.use(Router) //引用Router中间件
export default new Router({
	routes: [{
		path: '/',
		redirect: '/recommend' // 默认跳转到推荐页面
	}, {
		path: "/rank",
		component: Rank,
		children: [ // 增加一个二级路由
            {
                path: ":id",
                component: rankC
            }
        ]
	}, {
		path: "/search",
		component: Search
	}, {
		path: "/singer",
		component: Singer
	}, {
		path: "/recommend",
		component: Recommend,
		children: [ // 增加一个二级路由
            {
                path: ":id",
                component: disc
            }
        ]
	},
	{
		path: "/:id",
		name: "singerL",
		component: SingerDetail
	}
	]
})