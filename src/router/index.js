import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
import HomePage from "@/pages/HomePage.vue";
import CategoryPage from "@/pages/CategoryPage.vue";
import ForumPage from "@/pages/ForumPage.vue";
import ThreadShow from "@/pages/ThreadShow.vue";
import NotFound from "@/pages/NotFound.vue";
import sourceData from "@/data.json";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/category/:id",
      name: "Category",
      component: CategoryPage,
      props: true,
    },
    {
      path: "/forum/:id",
      name: "Forum",
      component: ForumPage,
      props: true,
    },
    {
      path: "/thread/:id",
      name: "ThreadShow",
      component: ThreadShow,
      props: true,
      beforeEnter(to, from, next) {
        const isThread = sourceData.threads.find(
          (thread) => thread.id === to.params.id
        );

        if (isThread) {
          return next();
        } else {
          next({
            name: "NotFound",
            params: { pathMatch: to.path.substring(1).split("/") },
            // preserve existing query and hash
            query: to.query,
            hash: to.hash,
          });
        }
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

export default router;
