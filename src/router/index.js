import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Main from '@/components/main'
import Usermanage from '@/components/userList/usermanage'
import CoinAfanka from '@/components/userList/coinAfanka'
import PlayRecharge from '@/components/userList/playRecharge'
import LevelDetail from '@/components/agency/levelDetail'
import AgentList from '@/components/agency/agentList'
import TeamShow from '@/components/agency/teamShow'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: '',
      hidden: true,
      component: Login
    },{
      path: '/main',
      component: Main,
      name: '用户管理',
      iconCls: 'person-stalker',
      children: [
      			{ path: '/usermanage', component: Usermanage, name: '用户列表'},
      			{ path: '/coinAfanka', component: CoinAfanka, name: '房卡金币操作记录'},
      			{ path: '/playRecharge', component: PlayRecharge, name: '玩家充卡记录'}
      ]
    },{
      path: '/main',
      component: Main,
      name: '代理',
      iconCls: 'ios-speedometer',
      children: [
      			{ path: '/agentList', component: AgentList, name: '代理列表'},
      			{ path: '/levelDetail', component: LevelDetail, name: '等级详情'},
      			{ path: '/teamShow', component: TeamShow, name: '团队展示', hidden: true }
      ]
    },{
      path: '/',
      hidden: true,
      redirect:"/login"
    }
  ]
})
