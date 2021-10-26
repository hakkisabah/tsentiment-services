import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../views/Index.vue';
import Callback from '../views/callback.vue';
import Policy from '../views/Policy.vue';
import Terms from '../views/Terms.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
  },
  {
    path: '/panel',
    name: 'Panel',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Panel.vue'),
  },
  {
    path: '/callback',
    name: 'callback',
    component: Callback,
  },
  {
    path: '/policy',
    name: 'Policy',
    component: Policy,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
