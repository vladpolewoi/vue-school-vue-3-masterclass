import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
import HomePage from "@/pages/HomePage.vue";
import CategoryPage from "@/pages/CategoryPage.vue";
import ForumPage from "@/pages/ForumPage.vue";
import ThreadShow from "@/pages/ThreadShow.vue";
import ThreadCreate from "@/pages/ThreadCreate.vue";
import ThreadEdit from "@/pages/ThreadEdit.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import NotFound from "@/pages/NotFound.vue";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/me",
      name: "Profile",
      component: ProfilePage,
      meta: { toTop: true, smoothScroll: true },
    },
    {
      path: "/me/edit",
      name: "ProfileEdit",
      component: ProfilePage,
      props: { edit: true },
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
      // beforeEnter(to, from, next) {
      //   const isThread = sourceData.threads.find(
      //     (thread) => thread.id === to.params.id
      //   );

      //   if (isThread) {
      //     return next();
      //   } else {
      //     next({
      //       name: "NotFound",
      //       params: { pathMatch: to.path.substring(1).split("/") },
      //       // preserve existing query and hash
      //       query: to.query,
      //       hash: to.hash,
      //     });
      //   }
      // },
    },
    {
      path: "/forum/:forumId/thread/create",
      name: "ThreadCreate",
      component: ThreadCreate,
      props: true,
    },
    {
      path: "/thread/:id/edit",
      name: "ThreadEdit",
      component: ThreadEdit,
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
  scrollBehavior(to) {
    const scroll = {
      top: to.meta.toTop ? 0 : null,
      behavior: to.meta.smoothScroll ? "smooth" : "auto",
    };

    return scroll;
  },
});

router.beforeEach(() => {
  store.dispatch("unsubscribeAllSnapshots");
});

export default router;
