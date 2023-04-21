import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/HomePage.vue";
import CategoryPage from "@/pages/CategoryPage.vue";
import ForumPage from "@/pages/ForumPage.vue";
import ThreadShow from "@/pages/ThreadShow.vue";
import ThreadCreate from "@/pages/ThreadCreate.vue";
import ThreadEdit from "@/pages/ThreadEdit.vue";
import ProfilePage from "@/pages/ProfilePage.vue";
import NotFound from "@/pages/NotFound.vue";
import store from "@/store";
import { findById } from "@/helpers";

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
      meta: { toTop: true, smoothScroll: true, requiresAuth: true },
    },
    {
      path: "/me/edit",
      name: "ProfileEdit",
      component: ProfilePage,
      props: { edit: true },
      meta: { requiresAuth: true },
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
      async beforeEnter(to, from, next) {
        await store.dispatch("threads/fetchThread", { id: to.params.id });
        const isThread = findById(store.state.threads.items, to.params.id);

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
      path: "/forum/:forumId/thread/create",
      name: "ThreadCreate",
      component: ThreadCreate,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/thread/:id/edit",
      name: "ThreadEdit",
      component: ThreadEdit,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/pages/RegisterPage.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/LoginPage.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/logout",
      name: "Logout",
      async beforeEnter() {
        await store.dispatch("auth/signOut");
        return { name: "Home" };
      },
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

router.beforeEach(async (to) => {
  await store.dispatch("auth/initAuthentication");
  store.dispatch("unsubscribeAllSnapshots");

  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: "Login", query: { redirectTo: to.path } };
  }

  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: "Home" };
  }
});

export default router;
